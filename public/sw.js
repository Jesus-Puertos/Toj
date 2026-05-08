// TOJ Service Worker — Estrategia Network-first con fallback a caché
const CACHE_NAME = 'toj-pwa-v1';

const PRECACHE_URLS = [
  '/',
  '/login',
  '/dashboard',
  '/manifest.json',
];

// Instalar: precachear rutas clave
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(PRECACHE_URLS).catch(() => {})
    )
  );
});

// Activar: limpiar cachés viejos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch: network-first, fallback a caché para offline
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const pathname = new URL(event.request.url).pathname;
  if (pathname.startsWith('/api/')) return;
  if (pathname.startsWith('/_next/')) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clone);
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
