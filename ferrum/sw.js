// Service worker de Ferrum: offline total.
// Estrategia híbrida: red primero para el código de la app (navegación +
// ui/), caché primero para el resto. La app se cachea en la primera visita
// y luego funciona sin conexión.

const CACHE = 'ferrum-v73';

self.addEventListener('install', (event) => {
  // 'reload' evita que la precarga coja una copia rancia del borde del CDN
  // a mitad de un deploy (fue la causa de la pantalla negra v6->v7).
  const fresh = (u) => new Request(new URL(u, self.registration.scope).href, { cache: 'reload' });
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(['./', './index.html', './manifest.webmanifest', './social-config.json', './ui/app-v2.js', './ui/data-status-v2.js', './ui/account-security-v2.js', './ui/cloud-v2.js', './ui/account-recovery-v2.js', './ui/feed-v2.js', './ui/ferrum-ui-v1.css', './ui/ferrum-ui-v1.js', './ui/ferrum-v2.css', './ui/friends-v2.js', './ui/home-v2.js', './ui/invite-v2.js', './ui/motion-v2.js', './ui/platform-v2.js', './ui/social-store-v2.js', './ui/social-v2.js'].map(fresh))).then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('ferrum-') && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || req.headers.has('Authorization')) return; // nunca cacheamos terceros ni peticiones autenticadas
  // El propio sw.js siempre de red: si saliera de caché, la app nunca
  // detectaría que hay una versión nueva desplegada.
  if (url.pathname.endsWith('/sw.js') || url.pathname.endsWith('/social-config.json')) return;
  // La página pregunta qué versión del SW la está sirviendo (para el aviso
  // de actualización dentro de la app).
  if (url.pathname.endsWith('/sw-version')) {
    event.respondWith(new Response(CACHE, { headers: { 'content-type': 'text/plain' } }));
    return;
  }
  // La comprobación de biblioteca (data/exercises.json) necesita red fresca:
  // si el SW la sirviera de caché, nunca se detectarían versiones nuevas.
  if (url.pathname.endsWith('/data/exercises.json')) return;
  // Código de la app (navegación + ui/): RED PRIMERO, caché como respaldo.
  // Con cache-first, la webapp servía el index.html y los ui/*.js viejos de
  // caché hasta que el propio SW se actualizase, y en la webapp ese ciclo
  // es frágil (reanudación sin navegación, SW viejo sirviendo todo de caché).
  // Así las actualizaciones aparecen al abrir la app sin depender de que el
  // SW se actualice primero; sin conexión sigue sirviendo la copia cacheada.
  const isAppCode = req.mode === 'navigate'
    || url.pathname.endsWith('/index.html')
    || url.pathname.includes('/ui/');
  if (isAppCode) {
    const fromCache = () => caches.match(req, { ignoreSearch: false }).then((hit) => {
      if (hit) return hit;
      return caches.match('./index.html');
    });
    event.respondWith(
      fetch(req).then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(req, copy));
          return res;
        }
        // Red con error (404/500): servir la copia cacheada, no la página de error.
        return fromCache().then((hit) => hit || res);
      }).catch(() => fromCache()),
    );
    return;
  }
  // Resto (assets con hash, iconos, manifiesto): caché primero. El hash del
  // nombre garantiza frescura: un bundle nuevo es una URL nueva y, por tanto,
  // un fallo de caché que va a red.
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
