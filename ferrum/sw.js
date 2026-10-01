// Service worker de Ferrum: offline total.
// Estrategia: cache-first para todo lo del mismo origen; la app se cachea
// en la primera visita y luego funciona sin conexión.

const CACHE = 'ferrum-v8';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(['./', './index.html', './manifest.webmanifest'])).then(() => self.skipWaiting()),
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
      }).catch(() => caches.match('./index.html'));
    }),
  );
});
