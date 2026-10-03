// node --experimental-vm-modules ferrum/tests/cloud-v55.cjs
// Dos móviles aislados, DOM/IndexedDB y servidor de contrato simulados; módulos UI reales.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createPhone } = require('./browser-model-v55.cjs');
const root = path.resolve(__dirname, '..');
const accountId = '12345678-1234-1234-1234-123456789abc';
const server = { revision: 0, versions: new Map(), blobs: new Map(), mutations: new Map(), proof: null,
  reads: 0, lostAck: false, blockDownload: null, beforeUpload: null };
const profile = () => ({ profile: { id: accountId, nickname: 'Prueba', sharing: false, recoveryReady: !!server.proof }, posts: [], relationships: [], members: [] });
const handler = async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const reply = (value, status = 200) => { res.writeHead(status, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(value)); };
  if (url.pathname === '/') { res.end('<!doctype html><body>Prueba Ferrum</body>'); return; }
  if (url.pathname === '/social-config.json') { reply({ apiBase: `http://127.0.0.1:${80}` }); return; }
  if (url.pathname.startsWith('/ui/')) {
    const file = path.join(root, url.pathname);
    if (!file.startsWith(root + path.sep) || !fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': 'text/javascript' }); res.end(fs.readFileSync(file)); return;
  }
  const chunks = []; for await (const chunk of req) chunks.push(chunk);
  const bytes = Buffer.concat(chunks), endpoint = url.pathname.replace(/^\/v1/, '');
  const json = () => JSON.parse(bytes.toString());
  if (endpoint === '/capabilities') return reply({ privateBackup: 1, accountSecurity: 1 });
  if (endpoint === '/join' || endpoint === '/state') return reply(profile());
  if (endpoint === '/account/recovery') {
    if (server.proof && server.proof !== json().secret) return reply({ code: 'recovery_exists' }, 409);
    server.proof = json().secret; return reply({});
  }
  if (endpoint === '/account/recover') {
    if (json().secret !== server.proof) return reply({ message: 'Código revocado' }, 401);
    return reply(profile());
  }
  if (endpoint === '/backup/head') return reply(server.revision ? { revision: server.revision, iv: server.versions.get(server.revision).iv } : { revision: 0 });
  if (endpoint === '/backup/history') return reply({ versions: [...server.versions].map(([revision, v]) => ({ revision, iv: v.iv, updatedAt: Date.now() })) });
  if (endpoint.startsWith('/backup/blobs/')) {
    const id = endpoint.split('/').pop();
    if (req.method === 'PUT') { assert(bytes.length <= 16777216); server.blobs.set(id, bytes); return reply({}); }
    res.end(server.blobs.get(id)); return;
  }
  if (endpoint === '/backup/snapshot' || endpoint === '/account/recovery/rotate') {
    if (req.method === 'GET') {
      server.reads++;
      if (server.blockDownload) await server.blockDownload;
      res.end(server.versions.get(Number(url.searchParams.get('revision'))).bytes); return;
    }
    const mutation = req.headers['x-ferrum-mutation'];
    if (server.mutations.has(mutation)) return reply({ revision: server.mutations.get(mutation) });
    if (+req.headers['x-ferrum-base-version'] !== server.revision) return reply({ code: 'backup_conflict', message: 'Conflicto' }, 409);
    assert(bytes.length <= 8388608);
    if (server.beforeUpload) await server.beforeUpload();
    if (endpoint.endsWith('/rotate')) { assert.equal(req.headers['x-ferrum-current-recovery'], server.proof); server.proof = req.headers['x-ferrum-new-recovery']; }
    server.revision++; server.versions.set(server.revision, { bytes, iv: req.headers['x-ferrum-iv'] }); server.mutations.set(mutation, server.revision);
    if (server.lostAck) { server.lostAck = false; req.socket.destroy(); return; }
    return reply({ revision: server.revision });
  }
  return reply({});
};
const fetch = async (url, options = {}) => {
  const bytes = options.body instanceof Blob ? Buffer.from(await options.body.arrayBuffer()) : Buffer.from(options.body || '');
  return new Promise((resolve, reject) => {
    let status = 200, headers = {};
    const req = { url: String(url), method: options.method || 'GET', headers: Object.fromEntries(new Headers(options.headers)), socket: { destroy: () => reject(Error('Respuesta perdida')) }, async *[Symbol.asyncIterator]() { yield bytes; } };
    const res = { writeHead(s,h) { status=s; headers=h || {}; }, end(body) { resolve(new Response(body, { status, headers })); } };
    handler(req,res).catch(reject);
  });
};
const boot = async page => page.evaluate(async () => {
  const names = ['exercises','routines','folders','workouts','measurements','progressPhotos','workoutPhotos','programState','aliases','kv'];
  const key = n => ({ progressPhotos: 'date', workoutPhotos: 'workoutId', programState: 'programId', kv: 'key' }[n] || 'id');
  const connection = await new Promise((resolve, reject) => {
    const req = indexedDB.open('ferrum-db', 3);
    req.onupgradeneeded = () => { for (const n of names) req.result.createObjectStore(n, { keyPath: key(n) }); };
    req.onsuccess = () => resolve(req.result); req.onerror = () => reject(req.error);
  });
  const transact = (name, mode, fn) => new Promise((resolve, reject) => {
    const tx = connection.transaction(name, mode), req = fn(tx.objectStore(name));
    tx.oncomplete = () => resolve(req?.result); tx.onerror = tx.onabort = () => reject(tx.error);
  });
  const db = { all: n => transact(n, 'readonly', s => s.getAll()), get: (n,k) => transact(n,'readonly',s=>s.get(k)),
    put: (n,v) => transact(n,'readwrite',s=>s.put(v)), del:(n,k)=>transact(n,'readwrite',s=>s.delete(k)),
    clear:n=>transact(n,'readwrite',s=>s.clear()), bulkPut:(n,rows)=>transact(n,'readwrite',s=>{for(const row of rows)s.put(row);}) };
  window.db = db; window.__ferrum = { db, toast() {} };
  window.social = await import('/ui/social-v2.js');
  window.store = (await import('/ui/social-store-v2.js')).socialStore;
  window.nativeSet = Storage.prototype.setItem;
  // Inyección reversible de fallo para simular cuota/aborto tras reemplazar IndexedDB.
  Storage.prototype.setItem = function(k,v) { if(window.failStorage && k==='mg-active-workout') throw Error('Cuota simulada'); return nativeSet.call(this,k,v); };
  window.cloud = await import('/ui/cloud-v2.js');
  window.offeredBeforeSnapshot = false;
  window.addEventListener('ferrum:recovery-available', () => { if(!cloud.cloudSnapshot().revision) window.offeredBeforeSnapshot = true; });
  await social.initialize(db, { workoutVolume:()=>0, workoutSets:()=>0 });
  await cloud.initializeCloud(db); await cloud.synchronizeCloud();
});
(async () => {
  const phone = async () => { const page = createPhone(root,fetch); await boot(page); return page; };
    const a = await phone();
    await a.evaluate(async () => {
      await db.put('workouts', { id: 'sesion', title:'Primera sesión', exercises:[], startTime:1 });
      await db.put('workoutPhotos', { workoutId:'sesion', blob:new Blob(['foto móvil A'], {type:'image/png'}) });
      localStorage.setItem('mg-active-workout', '{"id":"sesion"}'); localStorage.setItem('mg-routine-draft:r', 'borrador');
      await social.join({nickname:'Prueba', invite:'a'.repeat(64)}); await cloud.synchronizeCloud();
    });
    assert(server.revision > 0);
    assert.equal(await a.evaluate(()=>!!social.snapshot().onboarding),true);
    assert.equal(await a.evaluate(()=>offeredBeforeSnapshot),true);
    assert.equal(await a.evaluate(()=>cloud.cloudSnapshot().recoverySaved),false);
    const code = await a.evaluate(()=>cloud.recoveryCode());
    console.log('OK alta con onboarding pendiente -> copia; código ofrecido antes del snapshot');
    const b = await phone(), reads = server.reads;
    let release; server.blockDownload = new Promise(resolve=>{release=resolve;});
    const recovering = b.evaluate(code=>cloud.recoverAccount(code), code);
    while (server.reads === reads) await new Promise(resolve=>setTimeout(resolve,10));
    assert.equal(await b.evaluate(async()=>{try{await db.put('workouts',{id:'durante-restauracion'});return false;}catch{return true;}}),true);
    assert.equal(await b.evaluate(()=>{try{localStorage.setItem('mg-active-workout','otro');return false;}catch{return true;}}),true);
    release(); server.blockDownload = null; await recovering;
    assert.equal(server.reads - reads, 1);
    assert.equal(await b.evaluate(async()=>(await db.get('workouts','sesion')).title),'Primera sesión');
    assert.equal(await b.evaluate(async()=>(await db.get('workoutPhotos','sesion')).blob.text()),'foto móvil A');
    assert.equal(await b.evaluate(()=>localStorage.getItem('mg-active-workout')),'{"id":"sesion"}');
    assert.equal(await b.evaluate(()=>localStorage.getItem('mg-routine-draft:r')),'borrador');
    console.log('OK otro móvil: una restauración, fotos/sesión/borradores completos y escrituras bloqueadas');
    const c = await phone(); await c.evaluate(()=>window.failStorage=true);
    await assert.rejects(c.evaluate(code=>cloud.recoverAccount(code),code), /Cuota simulada/);
    assert.equal(await c.evaluate(async()=>!!await store.get('cloud-restore-journal')),true);
    assert.equal(await c.evaluate(async()=>{try{await db.put('routines',{id:'bloqueado'});return false;}catch{return true;}}),true);
    // Reinicio real de la página conserva IDB y el journal.
    await c.reload(); await boot(c); await c.evaluate(()=>cloud.synchronizeCloud());
    assert.equal(await c.evaluate(()=>localStorage.getItem('mg-routine-draft:r')),'borrador');
    assert.equal(await c.evaluate(async()=>!!await store.get('cloud-restore-journal')),false);
    console.log('OK interrupción entre BD/localStorage -> journal completado al reiniciar');
    await b.evaluate(async()=>{await db.put('workouts',{id:'remoto',title:'Desde B'});await cloud.synchronizeCloud();});
    await a.evaluate(async()=>{await db.put('workouts',{id:'local',title:'Desde A'});await cloud.synchronizeCloud();});
    assert.equal(await a.evaluate(()=>cloud.cloudSnapshot().status),'conflict');
    await a.evaluate(()=>cloud.resolveCloudConflict(true));
    const preventive = await a.evaluate(async()=>{
      const conn = await new Promise(resolve=>{const r=indexedDB.open('ferrum-social');r.onsuccess=()=>resolve(r.result);});
      return new Promise(resolve=>{const tx=conn.transaction('meta');const r=tx.objectStore('meta').getAll();tx.oncomplete=()=>{conn.close();const row=r.result.find(x=>x.key.startsWith('cloud-conflict:'));resolve(row.value);};});
    });
    assert(preventive.local.collections.workouts.some(x=>x.id==='local'));
    assert(preventive.remote.collections.workouts.some(x=>x.id==='remoto'));
    console.log('OK conflicto: ambas copias conservadas antes de adoptar la revisión remota');
    server.lostAck = true;
    await a.evaluate(async()=>{await db.put('workouts',{id:'ack'});await cloud.synchronizeCloud();});
    const acknowledgedRevision = server.revision;
    await a.evaluate(()=>cloud.synchronizeCloud());
    assert.equal(server.revision, acknowledgedRevision);
    assert.equal(await a.evaluate(async()=>!!await store.get('cloud-pending-snapshot')),false);
    console.log('OK respuesta perdida -> reintento idempotente');
    server.beforeUpload = async()=>{server.beforeUpload=null;await a.evaluate(()=>db.put('routines',{id:'escritura-concurrente'}));};
    await a.evaluate(async()=>{await db.put('workouts',{id:'dirty'});await cloud.synchronizeCloud();});
    assert.equal(await a.evaluate(async()=>!!await store.get('cloud-dirty')),true);
    await a.evaluate(()=>cloud.synchronizeCloud());
    console.log('OK confirmación de snapshot conserva dirty posterior');
    await a.evaluate(async()=>{
      await db.put('workoutPhotos',{workoutId:'grande',blob:new Blob([new Uint8Array(17*1024*1024)],{type:'image/jpeg'})});
      await db.put('workouts',{id:'historial-grande',description:'x'.repeat(9*1024*1024)});
      await cloud.synchronizeCloud();
    });
    assert.equal(await a.evaluate(()=>cloud.cloudSnapshot().status),'ready');
    const d=await phone(); await d.evaluate(code=>cloud.recoverAccount(code),code);
    assert.equal(await d.evaluate(async()=>(await db.get('workoutPhotos','grande')).blob.size),17*1024*1024);
    assert.equal(await d.evaluate(async()=>(await db.get('workouts','historial-grande')).description.length),9*1024*1024);
    console.log('OK foto >16 MiB e historial >8 MiB fragmentados y restaurados sin perder datos');
    const newCode=await a.evaluate(()=>cloud.rotateRecovery());
    assert.notEqual(newCode,code); assert.equal(await a.evaluate(()=>cloud.cloudSnapshot().recoverySaved),false);
    await a.evaluate(async()=>{
      const security=await import('/ui/account-security-v2.js'); await security.offerRecoveryCode();
      const dialog=document.body.children.at(-1),body=dialog.querySelector('[data-content]');
      await body.querySelector('[data-copy]').onclick();
      if(cloud.cloudSnapshot().recoverySaved)throw Error('Copiar no acredita conservación externa');
      if(!body.querySelector('[data-confirm]').disabled)throw Error('Falta confirmación explícita');
      body.querySelector('[data-saved]').onchange({currentTarget:{checked:true}});
      await body.querySelector('[data-confirm]').onclick();
      if(!cloud.cloudSnapshot().recoverySaved)throw Error('No se confirmó conservación externa');
    });
    assert.equal(await a.evaluate(async()=>(await store.get('cloud-recovery-saved')).external),true);
    console.log('OK interfaz: copiar no acredita conservación; checkbox y confirmación sí');
    const e=await phone(); await assert.rejects(e.evaluate(code=>cloud.recoverAccount(code),code),/Código revocado/);
    await e.evaluate(code=>cloud.recoverAccount(code),newCode);
    assert.equal(await e.evaluate(async()=>(await db.get('workoutPhotos','sesion')).blob.text()),'foto móvil A');
    await e.evaluate(()=>cloud.restoreCloudVersion(1));
    assert.equal(await e.evaluate(async()=>(await db.get('workoutPhotos','sesion')).blob.text()),'foto móvil A');
    console.log('OK rotación: exige nueva confirmación, rechaza código anterior y recupera fotos/versiones anteriores');
    // Cuenta con prueba registrada pero sin primer snapshot.
    const versions=server.versions; server.revision=0; server.versions=new Map();
    const f=await phone(); const result=await f.evaluate(code=>cloud.recoverAccount(code),newCode);
    assert.match(result.warning,/sin snapshot/); assert.equal(result.backupRevision,0);
    server.versions=versions;
    console.log('OK recuperación informa que no había snapshot');
})().catch(error=>{console.error(error);process.exitCode=1;});
