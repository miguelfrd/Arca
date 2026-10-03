import { socialStore as store } from './social-store-v2.js';
import { api, snapshot, subscribe, recoverIdentity, reconnectIdentity } from './social-v2.js';

const COLLECTIONS = ['exercises','routines','folders','workouts','measurements','progressPhotos','workoutPhotos','programState','aliases','kv'];
const keyField = name => name === 'progressPhotos' ? 'date' : name === 'workoutPhotos' ? 'workoutId' : name === 'programState' ? 'programId' : name === 'kv' ? 'key' : 'id';
const localKey = key => key === 'mg-active-workout' || key.startsWith('mg-routine-draft:');
const hex = value => [...new Uint8Array(value)].map(x => x.toString(16).padStart(2, '0')).join('');
const unhex = value => Uint8Array.from(value.match(/../g) || [], x => parseInt(x, 16));
const encoder = new TextEncoder();
let installed, db, running, suppress = false, timer, capabilityAt = 0, capabilities, dirtyWrites = Promise.resolve();
let state = { status: 'unavailable', error: '', lastSync: 0, revision: 0, pending: false, recoverySaved: false };
const listeners = new Set();
export const cloudSnapshot = () => ({ ...state });
export function subscribeCloud(listener) { listeners.add(listener); return () => listeners.delete(listener); }
function announce() { for (const listener of listeners) listener(cloudSnapshot()); }
function patch(values) { Object.assign(state, values); announce(); }
const proof = async secret => hex(await crypto.subtle.digest('SHA-256', encoder.encode('ferrum:recovery:' + secret)));
async function encryptionKey(secret) { return crypto.subtle.importKey('raw', unhex(secret), 'AES-GCM', false, ['encrypt','decrypt']); }
async function encrypt(bytes, key) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  return { iv: hex(iv), bytes: new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, bytes)) };
}
async function decrypt(bytes, iv, key) { return new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unhex(iv) }, key, bytes)); }
async function decryptWithKeys(bytes,iv,keys) {
  for(const key of Array.isArray(keys)?keys:[keys]) { try { return await decrypt(bytes,iv,key); } catch {} }
  throw Error('No se ha podido descifrar la copia. No se ha cambiado nada en tu móvil.');
}
async function prepareKeys(saved) {
  const keys=await Promise.all([saved.secret,...saved.previousSecrets||[]].map(encryptionKey));
  return {...saved,key:keys[0],keys,blobNamespace:await proof(saved.secret)};
}

export function markCloudDirty() {
  if (suppress) return Promise.resolve();
  dirtyWrites = dirtyWrites.catch(() => {}).then(async () => {
    await store.set('cloud-dirty', { revision: crypto.randomUUID(), at: Date.now() });
    state.pending = true;
    if (state.status === 'ready') state.status = 'pending';
    announce();
    clearTimeout(timer); timer = setTimeout(() => synchronizeCloud(), 3500);
  });
  dirtyWrites.catch(() => patch({ error: 'Tus datos están en este móvil. No se pudo preparar la copia; reintenta desde Yo.' }));
  return dirtyWrites;
}
export async function initializeCloud(database) {
  if (installed) return; installed = true; db = database;
  state.revision = await store.get('cloud-version') || 0;
  state.lastSync = await store.get('cloud-last-sync') || 0;
  state.recoverySaved = Boolean(await store.get('cloud-recovery-saved'));
  state.pending = Boolean(await store.get('cloud-dirty'));
  for (const method of ['put','bulkPut','del','clear']) {
    const original = db[method].bind(db);
    db[method] = async (...args) => {
      if (!suppress) await markCloudDirty().catch(() => {});
      const result = await original(...args);
      if (!suppress) {
        await markCloudDirty().catch(() => {});
        window.dispatchEvent(new CustomEvent('ferrum:data-changed'));
      }
      return result;
    };
  }
  // Drafts and the active session are part of the private copy, never account/PIN secrets.
  for (const method of ['setItem','removeItem']) {
    const original = Storage.prototype[method];
    Storage.prototype[method] = function(key, ...args) {
      const result = original.call(this, key, ...args);
      if (this === localStorage && localKey(String(key)) && !suppress) markCloudDirty();
      return result;
    };
  }
  subscribe(info => { if (info.identity?.registered) synchronizeCloud(); });
  window.addEventListener('online', () => { capabilityAt = 0; synchronizeCloud(); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) synchronizeCloud(); });
  setInterval(() => { if (!document.hidden) synchronizeCloud(); }, 30000);
  synchronizeCloud();
}
async function supported() {
  if (!capabilities || Date.now() - capabilityAt > 60000) {
    capabilityAt = Date.now();
    try { capabilities = await api('/capabilities', { anonymous: true }); }
    catch (error) { capabilities = null; throw error; }
  }
  return capabilities.privateBackup === 1;
}
async function accountKey(info) {
  const accountId = info.state.profile.id;
  let saved = await store.get('cloud-key');
  if (saved && saved.accountId !== accountId) throw Error('La copia pertenece a otra cuenta. No se ha enviado ningún dato.');
  if (!saved) {
    if (info.state.profile.recoveryReady) { patch({ status: 'needs-code' }); throw Error('Introduce tu código de recuperación para conectar la copia privada de esta cuenta.'); }
    saved = { accountId, secret: hex(crypto.getRandomValues(new Uint8Array(32))) };
    await store.set('cloud-key', saved);
  }
  try { await api('/account/recovery', { method: 'PUT', body: { secret: await proof(saved.secret) } }); }
  catch (error) { if (error.code === 'recovery_exists') patch({ status: 'needs-code' }); throw error; }
  return prepareKeys(saved);
}
async function readDatabase() {
  return new Promise((resolve, reject) => {
    const opening = indexedDB.open('ferrum-db');
    opening.onerror = () => reject(opening.error);
    opening.onsuccess = () => {
      const connection = opening.result;
      const tx = connection.transaction(COLLECTIONS, 'readonly'), result = {};
      for (const name of COLLECTIONS) {
        const read = tx.objectStore(name).getAll(); read.onsuccess = () => { result[name] = read.result; };
      }
      tx.oncomplete = () => { connection.close(); resolve(result); };
      tx.onerror = tx.onabort = () => { connection.close(); reject(tx.error); };
    };
  });
}
async function encodeValue(value, account) {
  if (value instanceof Blob) {
    if (value.size + 28 > 16777216) throw Error('Hay una foto demasiado grande para la copia privada. Sigue guardada en este móvil.');
    const bytes = new Uint8Array(await value.arrayBuffer());
    const digest = hex(await crypto.subtle.digest('SHA-256', bytes));
    const cacheKey = 'cloud-blob:' + account.accountId + ':' + (account.blobNamespace || await proof(account.secret)) + ':' + digest;
    let id = await store.get(cacheKey);
    if (!id) {
      id = crypto.randomUUID(); const encrypted = await encrypt(bytes, account.key);
      const packed = new Uint8Array(12 + encrypted.bytes.length); packed.set(unhex(encrypted.iv)); packed.set(encrypted.bytes, 12);
      await api('/backup/blobs/' + id, { method: 'PUT', body: new Blob([packed], { type: 'application/octet-stream' }), timeout: 120000 });
      await store.set(cacheKey, id);
    }
    return { $ferrumBlob: { id, type: value.type, size: value.size } };
  }
  if (Array.isArray(value)) { const result = []; for (const item of value) result.push(await encodeValue(item, account)); return result; }
  if (value && typeof value === 'object') { const result = {}; for (const [key,item] of Object.entries(value)) result[key] = await encodeValue(item, account); return result; }
  return value;
}
async function decodeValue(value, key) {
  if (value && typeof value === 'object' && Object.keys(value).length === 1 && value.$ferrumBlob) {
    const meta = value.$ferrumBlob;
    if (!/^[a-f0-9-]{36}$/.test(meta.id || '') || !Number.isSafeInteger(meta.size) || meta.size < 0 || meta.size > 16777216) throw Error('La copia contiene una foto no válida.');
    const blob = await api('/backup/blobs/' + meta.id, { photo: true, timeout: 120000 });
    const packed = new Uint8Array(await blob.arrayBuffer());
    const bytes = await decryptWithKeys(packed.slice(12), hex(packed.slice(0,12)), key);
    if (bytes.length !== meta.size) throw Error('La foto no se ha podido verificar. No se ha cambiado nada.');
    return new Blob([bytes], { type: meta.type || 'application/octet-stream' });
  }
  if (Array.isArray(value)) { const result = []; for (const item of value) result.push(await decodeValue(item, key)); return result; }
  if (value && typeof value === 'object') { const result = {}; for (const [name,item] of Object.entries(value)) result[name] = await decodeValue(item, key); return result; }
  return value;
}
async function makePacket(account, dirty, version) {
  const collections = await readDatabase(), locals = {};
  for (let i = 0; i < localStorage.length; i++) { const key = localStorage.key(i); if (localKey(key)) locals[key] = localStorage.getItem(key); }
  const content = await encodeValue({ format: 'ferrum-private-v1', accountId: account.accountId, collections, locals, at: Date.now() }, account);
  const encrypted = await encrypt(encoder.encode(JSON.stringify(content)), account.key);
  if (encrypted.bytes.length > 8388608) throw Error('Tu historial supera el tamaño admitido para esta copia. Tus datos siguen en el móvil.');
  return { ...encrypted, revision: dirty.revision, baseVersion: version, mutation: crypto.randomUUID() };
}
async function downloadSnapshot(account, head) {
  const blob = await api('/backup/snapshot?revision=' + head.revision, { photo: true, timeout: 120000 });
  const bytes = await decryptWithKeys(await blob.arrayBuffer(), head.iv, account.keys || [account.key]);
  const content = JSON.parse(new TextDecoder().decode(bytes));
  if (content.format !== 'ferrum-private-v1' || content.accountId !== account.accountId || !content.collections || !content.locals) throw Error('Esta copia no pertenece a tu cuenta.');
  for (const name of COLLECTIONS) {
    const rows = content.collections[name];
    if (!Array.isArray(rows) || rows.some(row => !row || typeof row[keyField(name)] !== 'string')) throw Error('La estructura de la copia no es válida.');
  }
  return decodeValue(content, account.keys || [account.key]);
}
async function applySnapshot(content) {
  // Download and validate all photos before this atomic transaction replaces any local record.
  suppress = true;
  try {
    await new Promise((resolve, reject) => {
      const opening = indexedDB.open('ferrum-db', 3);
      opening.onupgradeneeded = () => {
        for (const name of COLLECTIONS) if (!opening.result.objectStoreNames.contains(name)) {
          const object = opening.result.createObjectStore(name, { keyPath: keyField(name) });
          if (name === 'workouts') object.createIndex('startTime','startTime');
          if (name === 'measurements') object.createIndex('date','date');
        }
      };
      opening.onerror = () => reject(opening.error);
      opening.onsuccess = () => {
        const connection = opening.result;
        let tx;
        try {
          tx = connection.transaction(COLLECTIONS, 'readwrite');
          tx.oncomplete = () => { connection.close(); resolve(); };
          tx.onerror = tx.onabort = () => { connection.close(); reject(tx.error || Error('No se pudo restaurar la copia.')); };
          for (const name of COLLECTIONS) { const object = tx.objectStore(name); object.clear(); for (const row of content.collections[name]) object.put(row); }
        } catch (error) { tx?.abort(); connection.close(); reject(error); }
      };
    });
    const oldKeys = Object.keys(localStorage).filter(localKey);
    for (const key of oldKeys) localStorage.removeItem(key);
    for (const [key,value] of Object.entries(content.locals)) if (localKey(key) && typeof value === 'string') localStorage.setItem(key, value);
  } finally { suppress = false; }
  window.dispatchEvent(new CustomEvent('ferrum:data-changed'));
}
export function synchronizeCloud() {
  if (running) return running;
  running = (async () => {
    await dirtyWrites.catch(() => {});
    const info = snapshot();
    if (!info.identity?.registered || !info.state || info.onboarding) return;
    if (navigator.onLine === false) { patch({ status: 'offline', pending: Boolean(await store.get('cloud-dirty')) }); return; }
    patch({ status: 'syncing', error: '' });
    try {
      if (!await supported()) { patch({ status: 'unavailable', error: '' }); return; }
      const rotation=await store.get('cloud-pending-rotation');
      if(rotation) await finishRotation(rotation);
      const account = await accountKey(info);
      let version = await store.get('cloud-version') || 0;
      // A lost acknowledgement is retried with exactly the same ciphertext and mutation.
      const previous = await store.get('cloud-pending-snapshot');
      if (previous) {
        const result = await api('/backup/snapshot', { method: 'PUT', timeout: 120000,
          headers: { 'X-Ferrum-Base-Version': String(previous.baseVersion), 'X-Ferrum-Mutation': previous.mutation, 'X-Ferrum-IV': previous.iv },
          body: new Blob([previous.bytes], { type: 'application/octet-stream' }) });
        await store.set('cloud-version', result.revision); version = result.revision;
        await store.remove('cloud-pending-snapshot'); await store.removeMatchingRevision('cloud-dirty', previous.revision);
      }
      const head = await api('/backup/head');
      let dirty = await store.get('cloud-dirty');
      const restorePending = await store.get('cloud-restore-pending');
      if (restorePending) {
        if (head.revision > 0) {
          const content = await downloadSnapshot(account, head);
          await applySnapshot(content);
        }
        version = head.revision; await store.set('cloud-version', version);
        await store.remove('cloud-restore-pending'); await store.remove('cloud-dirty'); dirty = null;
        window.dispatchEvent(new Event('hashchange'));
      } else if (head.revision !== version) throw Object.assign(Error('Hay una copia de otro móvil. Tus cambios locales se conservan.'), { code: 'backup_conflict' });
      if (!head.revision && !dirty) { await markCloudDirty(); dirty = await store.get('cloud-dirty'); }
      if (dirty) {
        let packet = await store.get('cloud-pending-snapshot');
        if (!packet) {
          packet = await makePacket(account, dirty, version);
          if ((await store.get('cloud-dirty'))?.revision !== dirty.revision) { patch({ status: 'pending', pending: true }); return; }
          await store.set('cloud-pending-snapshot', packet);
        }
        const result = await api('/backup/snapshot', { method: 'PUT', timeout: 120000,
          headers: { 'X-Ferrum-Base-Version': String(packet.baseVersion), 'X-Ferrum-Mutation': packet.mutation, 'X-Ferrum-IV': packet.iv },
          body: new Blob([packet.bytes], { type: 'application/octet-stream' }) });
        await store.set('cloud-version', result.revision); version = result.revision;
        await store.remove('cloud-pending-snapshot'); await store.removeMatchingRevision('cloud-dirty', packet.revision);
      }
      const at = Date.now(); await store.set('cloud-last-sync', at);
      const pending = Boolean(await store.get('cloud-dirty'));
      patch({ status: pending ? 'pending' : 'ready', pending, revision: version, lastSync: at, error: '' });
      if (pending) { clearTimeout(timer); timer = setTimeout(() => synchronizeCloud(), 3500); }
    } catch (error) {
      patch({ status: error.code === 'backup_conflict' ? 'conflict' : state.status === 'needs-code' ? 'needs-code' : error.status === 0 ? 'offline' : 'error', error: error.message,
        pending: Boolean(await store.get('cloud-dirty')) });
    }
  })().finally(() => { running = null; });
  return running;
}
export async function recoveryCode() {
  const saved = await store.get('cloud-key');
  return saved ? saved.code || saved.accountId + '.' + saved.secret : null;
}
export async function markRecoverySaved() { await store.set('cloud-recovery-saved', true); patch({ recoverySaved: true }); }
export async function reconnectKey(code) {
  const saved = await parseCode(code), info = snapshot();
  if (saved.accountId !== info.state?.profile.id) throw Error('Ese código pertenece a otra cuenta.');
  try { await api('/account/recovery', { method: 'PUT', body: { secret: await proof(saved.secret) } }); }
  catch(error) { if(error.status!==401) throw error; await reconnectIdentity({accountId:saved.accountId,secret:await proof(saved.secret)},saved); }
  await store.set('cloud-key', saved); await synchronizeCloud();
}
async function parseCode(code) {
  code=String(code).trim(); const parts=code.split('.');
  const [accountId,secret,wrapped] = parts;
  if (!/^[a-f0-9-]{36}$/.test(accountId || '') || !/^[a-f0-9]{64}$/.test(secret || '')) throw Error('El código de recuperación no tiene el formato correcto.');
  if(parts.length<2 || parts.length>3) throw Error('El código de recuperación no tiene el formato correcto.');
  let previousSecrets=[];
  if(wrapped) {
    if(!/^[a-f0-9]+$/.test(wrapped) || wrapped.length<56 || wrapped.length>131072 || wrapped.length%2) throw Error('El código de recuperación está incompleto.');
    const packed=unhex(wrapped);
    previousSecrets=JSON.parse(new TextDecoder().decode(await decrypt(packed.slice(12),hex(packed.slice(0,12)),await encryptionKey(secret))));
    if(!Array.isArray(previousSecrets) || previousSecrets.length>512 || previousSecrets.some(x=>!/^[a-f0-9]{64}$/.test(x))) throw Error('El código de recuperación no es válido.');
  }
  return { accountId, secret, previousSecrets, code };
}
export async function recoverAccount(code) {
  const { hasPersonalData } = await import('./invite-v2.js');
  const saved = await parseCode(code), current = await store.get('cloud-key');
  const resume = Boolean(await store.get('cloud-restore-pending')) && current?.accountId === saved.accountId && current?.secret === saved.secret;
  if (!resume && (await hasPersonalData() || (await store.get('identity'))?.registered)) throw Error('Este móvil ya tiene datos o una cuenta. Recupera tu cuenta en un dispositivo vacío para conservarlos.');
  if (!await supported()) throw Error('El servidor todavía no ofrece recuperación de cuentas.');
  const info = resume ? await store.get('state') : await recoverIdentity({ accountId: saved.accountId, secret: await proof(saved.secret) }, saved);
  await store.set('cloud-recovery-saved', true);
  const account = await prepareKeys(saved);
  const head = await api('/backup/head');
  if (head.revision) await applySnapshot(await downloadSnapshot(account, head));
  await store.set('cloud-version', head.revision); await store.remove('cloud-restore-pending'); await store.remove('cloud-dirty');
  await store.set('cloud-last-sync', Date.now());
  return info;
}
async function finishRotation(rotation) {
  const packet=rotation.packet;
  const result=await api('/account/recovery/rotate',{method:'PUT',timeout:120000,headers:{
    'X-Ferrum-Base-Version':String(packet.baseVersion),'X-Ferrum-Mutation':packet.mutation,'X-Ferrum-IV':packet.iv,
    'X-Ferrum-Current-Recovery':rotation.currentProof,'X-Ferrum-New-Recovery':rotation.nextProof
  },body:new Blob([packet.bytes],{type:'application/octet-stream'})});
  await store.setAll({'cloud-key':rotation.next,'cloud-version':result.revision,'cloud-recovery-saved':false});
  await store.removeMatchingRevision('cloud-dirty',packet.revision);
  await store.remove('cloud-pending-rotation');
  patch({recoverySaved:false,revision:result.revision});
  return rotation.next.code;
}
export async function rotateRecovery() {
  await synchronizeCloud();
  if(running) await running;
  if(!await supported() || capabilities.accountSecurity!==1) throw Error('El servidor todavía no admite esta operación.');
  if(state.status!=='ready') throw Error('Espera a que tu copia esté guardada en la nube antes de renovar el código.');
  running=(async()=>{
    const account=await accountKey(snapshot());
    if((account.previousSecrets||[]).length>=512) throw Error('Este historial de claves necesita una migración antes de renovarse.');
    const next={accountId:account.accountId,secret:hex(crypto.getRandomValues(new Uint8Array(32))),previousSecrets:[account.secret,...account.previousSecrets||[]]};
    const wrapped=await encrypt(encoder.encode(JSON.stringify(next.previousSecrets)),await encryptionKey(next.secret));
    next.code=next.accountId+'.'+next.secret+'.'+wrapped.iv+hex(wrapped.bytes);
    await markCloudDirty();
    const dirty=await store.get('cloud-dirty'),head=await api('/backup/head');
    if(head.revision!==(await store.get('cloud-version')||0)) throw Object.assign(Error('Revisa el conflicto entre tus móviles antes de renovar.'),{code:'backup_conflict'});
    const packet=await makePacket(await prepareKeys(next),dirty,head.revision);
    if((await store.get('cloud-dirty'))?.revision!==dirty.revision) throw Error('Se han guardado cambios mientras renovabas. Vuelve a intentarlo.');
    const rotation={next,packet,currentProof:await proof(account.secret),nextProof:await proof(next.secret)};
    await store.set('cloud-pending-rotation',rotation);
    patch({status:'syncing',error:''});
    return finishRotation(rotation);
  })().finally(()=>{running=null;});
  try { const code=await running; await synchronizeCloud(); return code; }
  catch(error) { patch({status:'error',error:'Renovación pendiente: '+error.message}); throw error; }
}
export async function resolveCloudConflict(keepLocal) {
  await running;
  const account = await accountKey(snapshot()), head = await api('/backup/head');
  if (keepLocal) {
    await store.remove('cloud-pending-snapshot'); await store.set('cloud-version', head.revision); await markCloudDirty();
  } else {
    // Preserve the unsent local copy before explicitly restoring a remote version.
    const local = await readDatabase(), locals = {};
    for (const key of Object.keys(localStorage).filter(localKey)) locals[key] = localStorage.getItem(key);
    await store.set('cloud-before-restore', { collections: local, locals, at: Date.now() });
    const content = await downloadSnapshot(account, head);
    await applySnapshot(content); await store.set('cloud-version', head.revision);
    await store.remove('cloud-pending-snapshot'); await store.remove('cloud-dirty');
    window.dispatchEvent(new Event('hashchange'));
  }
  await synchronizeCloud();
}
export async function restorePreviousLocal() {
  await running;
  const saved = await store.get('cloud-before-restore');
  if (!saved) throw Error('No hay una copia local anterior.');
  const current = { collections: await readDatabase(), locals: {}, at: Date.now() };
  for (const key of Object.keys(localStorage).filter(localKey)) current.locals[key] = localStorage.getItem(key);
  await store.set('cloud-before-restore', current);
  await applySnapshot(saved); await store.remove('cloud-pending-snapshot'); await markCloudDirty();
  window.dispatchEvent(new Event('hashchange'));
}
export async function cloudHistory() { return (await api('/backup/history')).versions; }
export async function restoreCloudVersion(revision) {
  await running;
  const account = await accountKey(snapshot()), history = await cloudHistory();
  const selected = history.find(item => item.revision === revision);
  if (!selected) throw Error('Esta versión ya no está disponible.');
  const content = await downloadSnapshot(account, selected), head = await api('/backup/head');
  const previous = { collections: await readDatabase(), locals: {}, at: Date.now() };
  for (const key of Object.keys(localStorage).filter(localKey)) previous.locals[key] = localStorage.getItem(key);
  await store.set('cloud-before-restore', previous);
  await applySnapshot(content); await store.set('cloud-version', head.revision);
  await store.remove('cloud-pending-snapshot'); await markCloudDirty();
  window.dispatchEvent(new Event('hashchange'));
}
