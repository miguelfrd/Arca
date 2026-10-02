// Service worker de Ferrum: offline total.
// Estrategia: cache-first para todo lo del mismo origen; la app se cachea
// en la primera visita y luego funciona sin conexión.

const CACHE = 'ferrum-v33';

self.addEventListener('install', (event) => {
  // 'reload' evita que la precarga coja una copia rancia del borde del CDN
  // a mitad de un deploy (fue la causa de la pantalla negra v6->v7).
  const fresh = (u) => new Request(new URL(u, self.registration.scope).href, { cache: 'reload' });
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(['./', './index.html', './manifest.webmanifest'].map(fresh))).then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // nunca cacheamos terceros
  // El propio sw.js siempre de red: si saliera de caché, la app nunca
  // detectaría que hay una versión nueva desplegada.
  if (url.pathname.endsWith('/sw.js')) return;
  // La página pregunta qué versión del SW la está sirviendo (para el aviso
  // de actualización dentro de la app).
  if (url.pathname.endsWith('/sw-version')) {
    event.respondWith(new Response(CACHE, { headers: { 'content-type': 'text/plain' } }));
    return;
  }
  // La comprobación de biblioteca (data/exercises.json) necesita red fresca:
  // si el SW la sirviera de caché, nunca se detectarían versiones nuevas.
  if (url.pathname.endsWith('/data/exercises.json')) return;
  event.respondWith(
    caches.match(req, { ignoreSearch: false }).then((hit) => {
      if (hit) return hit;
      return fetch(req).then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(req, copy));
        }
        return res;
      }).catch(() => req.mode === 'navigate' ? caches.match('./index.html') : Promise.reject(new Error('offline')));
    }),
  );
});
