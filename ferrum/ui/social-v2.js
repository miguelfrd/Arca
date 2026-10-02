import { socialStore as store } from './social-store-v2.js';

let configPromise, identity, cachedState, localDb, helpers, syncing, started = false, debounce, retryTimer;
let connection = { configured: false, online: navigator.onLine !== false, syncing: false, error: '', lastSync: 0 };
const listeners = new Set();
const photoUrls = new Map();
const announce = () => { for (const listener of listeners) listener(snapshot()); };
export const snapshot = () => ({ ...connection, identity, state: cachedState });
export function subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); }
function normalizeBase(value) {
  if (!value) return '';
  const url = new URL(value);
  if (url.protocol !== 'https:' && !(url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname))) throw Error();
  if (url.username || url.password || url.search || url.hash) throw Error();
  return url.href.replace(/\/$/, '');
}
export async function configuration() {
  return configPromise ||= fetch(new URL('../social-config.json', import.meta.url), { cache: 'no-store' })
    .then(response => { if (!response.ok) throw Error(); return response.json(); })
    .then(async value => {
      let base; try { base = normalizeBase(value.apiBase); } catch { base = ''; }
      await store.set('apiBase', base).catch(() => {}); return base;
    }).catch(async () => {
      // Only the public URL is retained; this is not a cache of API responses.
      try { return normalizeBase(await store.get('apiBase')); } catch { return ''; }
    });
}
function makeIdentity() {
  const secret = [...crypto.getRandomValues(new Uint8Array(32))].map(x => x.toString(16).padStart(2, '0')).join('');
  return { deviceId: crypto.randomUUID(), deviceSecret: secret, registered: false };
}
async function ownIdentity() {
  if (!identity) identity = await store.get('identity') || makeIdentity();
  await store.set('identity', identity);
  return identity;
}
export class SocialError extends Error {
  constructor(message, status = 0, code = 'offline') { super(message); this.status = status; this.code = code; }
}
export async function api(path, options = {}) {
  const base = await configuration();
  if (!base) throw new SocialError('Amigos aún no está conectado.', 503, 'not_configured');
  const headers = new Headers(options.headers);
  if (!options.anonymous) {
    const owner = await ownIdentity();
    headers.set('Authorization', `Bearer ${owner.deviceId}.${owner.deviceSecret}`);
  }
  let payload = options.body;
  if (payload && !(payload instanceof Blob)) {
    headers.set('Content-Type', 'application/json'); payload = JSON.stringify(payload);
  }
  const controller = new AbortController();
  const abort = () => controller.abort();
  options.signal?.addEventListener('abort', abort, { once: true });
  if (options.signal?.aborted) controller.abort();
  const timeout = setTimeout(abort, 20000);
  try {
    const response = await fetch(base + '/v1' + path, { method: options.method || 'GET', headers, body: payload,
      signal: controller.signal, credentials: 'omit', cache: 'no-store' });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new SocialError(error.message || 'No se pudo completar. Vuelve a intentarlo.', response.status, error.code);
    }
    return options.photo ? response.blob() : response.json();
  } catch (error) {
    if (error instanceof SocialError) throw error;
    throw new SocialError('Sin conexión con Amigos. Los cambios se guardan para enviarlos después.');
  } finally { clearTimeout(timeout); options.signal?.removeEventListener('abort', abort); }
}
async function useState(state) {
  cachedState = state; connection.lastSync = Date.now(); connection.error = ''; connection.online = true;
  await store.set('state', state); await store.set('lastSync', connection.lastSync);
  const permitted = new Set(state.posts.filter(post => post.hasPhoto).map(post => post.id));
  for (const [key, value] of photoUrls) if (!permitted.has(key)) { URL.revokeObjectURL(value.url); photoUrls.delete(key); }
  announce();
}
export async function initialize(db, domain) {
  if (started) return;
  started = true; localDb = db; helpers = domain;
  identity = await store.get('identity'); cachedState = await store.get('state');
  connection.configured = Boolean(await configuration()); connection.lastSync = await store.get('lastSync') || 0;
  installDataHooks(db);
  window.addEventListener('online', async () => {
    configPromise = null; connection.configured = Boolean(await configuration()); announce(); synchronize();
  });
  window.addEventListener('offline', () => { connection.online = false; announce(); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) synchronize(); });
  window.addEventListener('pageshow', () => synchronize());
  setInterval(() => { if (!document.hidden) synchronize(); }, 15 * 60000);
  announce();
  if (identity?.registered) synchronize();
}
function installDataHooks(db) {
  if (db.ferrumSocialInstalled) return;
  Object.defineProperty(db, 'ferrumSocialInstalled', { value: true });
  for (const method of ['put', 'bulkPut', 'del', 'clear']) {
    const original = db[method].bind(db);
    db[method] = async (...args) => {
      const result = await original(...args);
      const [collection, value] = args;
      if (collection === 'workouts' || collection === 'workoutPhotos') {
        try {
          if (method === 'clear') {
            if (collection === 'workouts') {
              for (const item of await store.get('published') || []) await enqueue(item, 'delete');
            } else for (const item of await db.all('workouts')) if (item.endTime) await enqueue(item.id);
          } else if (method === 'bulkPut') {
            for (const item of value) if (collection === 'workoutPhotos' || item.endTime) await enqueue(item.workoutId || item.id);
          } else if (method === 'del') await enqueue(value, collection === 'workouts' ? 'delete' : 'upsert');
          else if (collection === 'workoutPhotos' || value.endTime) await enqueue(value.workoutId || value.id);
          window.dispatchEvent(new CustomEvent('ferrum:workouts-changed'));
        } catch (error) { connection.error = 'Guardado en este móvil. La sincronización se reintentará.'; announce(); }
      }
      return result;
    };
  }
}
export async function enqueue(localId, kind = 'upsert') {
  await store.putJob({ localId, kind, revision: crypto.randomUUID(), at: Date.now() });
  clearTimeout(debounce); debounce = setTimeout(() => synchronize(), 1400);
}
export function serializeWorkout(workout, exerciseMap, domain) {
  return { localId: workout.id, title: workout.title || 'Entrenamiento', startTime: workout.startTime, endTime: workout.endTime,
    description: workout.description || '', fatigue: workout.fatigue ?? null, satisfaction: workout.satisfaction ?? null,
    volumeKg: domain.workoutVolume(workout), setCount: domain.workoutSets(workout),
    exercises: (workout.exercises || []).map(exercise => {
      const item = exerciseMap.get(exercise.exerciseId);
      return { name: item?.nameEs || item?.name || 'Ejercicio', equipment: item?.equipment || '', muscle: item?.primaryMuscle || '',
        sets: (exercise.sets || []).map(set => ({ type: set.setType || 'normal', done: Boolean(set.done), weightKg: set.weightKg ?? null,
          reps: set.reps ?? null, distanceKm: set.distanceKm ?? null, durationSeconds: set.durationSeconds ?? null, rpe: set.rpe ?? null })) };
    }) };
}
async function fingerprint(value) {
  const result = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify(value)));
  return [...new Uint8Array(result)].map(x => x.toString(16).padStart(2, '0')).join('');
}
async function sendOutbox() {
  if (!localDb || !identity?.registered) return;
  const exerciseMap = new Map((await localDb.all('exercises')).map(item => [item.id, item]));
  const jobs = (await store.jobs()).filter(job => !job.retryAt || job.retryAt <= Date.now()).sort((a, b) => a.at - b.at).slice(0, 12);
  for (const job of jobs) {
    if (navigator.onLine === false) break;
    try {
    const workout = job.kind === 'delete' ? null : await localDb.get('workouts', job.localId);
    if (!workout?.endTime) {
      await api('/posts/local/' + encodeURIComponent(job.localId), { method: 'DELETE' });
      const published = new Set(await store.get('published') || []); published.delete(job.localId);
      await store.set('published', [...published]); await store.remove('post:' + job.localId);
    } else {
      if (cachedState?.profile?.sharing === false) continue;
      const value = serializeWorkout(workout, exerciseMap, helpers);
      const photo = await localDb.get('workoutPhotos', job.localId);
      const version = await fingerprint({ value, photo: photo ? [photo.createdAt, photo.blob?.size] : null });
      const previous = await store.get('post:' + job.localId);
      if (previous?.version !== version) {
        const result = await api('/posts', { method: 'POST', body: value });
        if (photo?.blob) await api('/posts/' + result.id + '/photo', { method: 'PUT', body: photo.blob });
        else if (previous?.hasPhoto) await api('/posts/' + result.id + '/photo', { method: 'DELETE' });
        await store.set('post:' + job.localId, { id: result.id, version, hasPhoto: Boolean(photo?.blob) });
        const published = new Set(await store.get('published') || []); published.add(job.localId);
        await store.set('published', [...published]);
      }
    }
    await store.removeJob(job.localId, job.revision);
    } catch (error) {
      // One old or oversized record must never block everybody's next upload.
      if (![400, 404, 413, 415, 422].includes(error.status)) throw error;
      await store.deferJob(job.localId, job.revision, error.message);
    }
  }
  const remaining = await store.jobs();
  if (remaining.length && cachedState?.profile?.sharing !== false) {
    const next = Math.min(...remaining.map(job => job.retryAt || Date.now()));
    clearTimeout(retryTimer); retryTimer = setTimeout(() => synchronize(), Math.max(3000, next - Date.now()));
  }
  return remaining.filter(job => job.error).length;
}
export function synchronize() {
  if (syncing) return syncing;
  syncing = (async () => {
    if (!(await configuration()) || !identity?.registered || navigator.onLine === false) return;
    connection.syncing = true; announce();
    try {
      // Permissions are refreshed before any upload or image reuse.
      await useState(await api('/state'));
      const failed = await sendOutbox();
      await useState(await api('/state'));
      if (failed) connection.error = `${failed} entrenamiento${failed === 1 ? '' : 's'} pendiente${failed === 1 ? '' : 's'} de compartir. Sigue guardado en este móvil.`;
    } catch (error) {
      connection.error = error.message; connection.online = error.status !== 0;
      if (error.status === 429) { clearTimeout(retryTimer); retryTimer = setTimeout(() => synchronize(), 65000); }
      if (error.status === 401) {
        identity.registered = false; await store.set('identity', identity); cachedState = null; await store.remove('state');
        for (const value of photoUrls.values()) URL.revokeObjectURL(value.url); photoUrls.clear();
      }
    } finally { connection.syncing = false; announce(); }
  })().finally(() => { syncing = null; });
  return syncing;
}
export async function join(values) {
  const owner = await ownIdentity();
  const data = await api('/join', { method: 'POST', anonymous: true,
    body: { ...values, deviceId: owner.deviceId, deviceSecret: owner.deviceSecret } });
  identity.registered = true; await store.set('identity', identity); await useState(data);
  if (data.profile.sharing) for (const workout of await localDb.all('workouts')) if (workout.endTime) await enqueue(workout.id);
  synchronize(); return data;
}
export async function action(path, body) {
  const result = await api(path, { method: path === '/profile' ? 'PATCH' : 'POST', body });
  if (result.profile) await useState(result);
  if (path === '/profile' && result.profile.sharing) {
    for (const workout of await localDb.all('workouts')) if (workout.endTime) await enqueue(workout.id);
    synchronize();
  }
  return result;
}
export async function loadMore(cursor) {
  const data = await api('/feed?before=' + encodeURIComponent(cursor));
  const posts = new Map(cachedState.posts.map(post => [post.id, post]));
  for (const post of data.posts) posts.set(post.id, post);
  await useState({ ...cachedState, posts: [...posts.values()], nextCursor: data.nextCursor });
}
export async function photoUrl(post, signal) {
  const old = photoUrls.get(post.id);
  if (old?.version === post.updatedAt) return old.url;
  const blob = await api('/photos/' + post.id, { photo: true, signal });
  if (!cachedState?.posts.some(item => item.id === post.id && item.hasPhoto && item.updatedAt === post.updatedAt))
    throw new SocialError('Esta foto ya no está disponible.', 404, 'not_found');
  if (old) URL.revokeObjectURL(old.url);
  const url = URL.createObjectURL(blob); photoUrls.set(post.id, { url, version: post.updatedAt }); return url;
}
export async function previewInvitation(invite) {
  return api('/invites/preview', { method: 'POST', anonymous: true, body: { invite } });
}
