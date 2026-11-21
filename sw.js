// BaadhRaksha PWA Service Worker (Kharghar Edition v7.0.0)
const CACHE_NAME = 'baadhraksha-kharghar-v7.0.0';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/app.css',
  './icons/icon.svg',
  './vendor/leaflet.css',
  './vendor/leaflet.js',
  './vendor/images/marker-icon.png',
  './vendor/images/marker-icon-2x.png',
  './vendor/images/marker-shadow.png',
  './src/main.js',
  './src/state.js',
  './src/db.js',
  './src/risk/engine.js',
  './src/services/network.js',
  './src/services/alerts.js',
  './src/simulation/timeline.js',
  './src/simulation/demo.js',
  './src/ui/map.js',
  './src/ui/alerts.js',
  './src/ui/help.js',
  './src/ui/reports.js',
  './data/districts.json',
  './data/grid_risk.json',
  './data/kharghar_grid.geojson',
  './data/kharghar_boundary.geojson',
  './data/shelters.json',
  './data/reports.json',
  './data/timeline.json',
  './data/rivers.json'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('BaadhRaksha: Caching Kharghar emergency assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Special offline tile handling for OpenStreetMap:
  // If online, fetch and cache tile. If offline and tile not in cache, fallback gracefully.
  if (url.hostname.includes('tile.openstreetmap.org')) {
    event.respondWith(
      caches.open('osm-tiles-cache').then((tileCache) => {
        return tileCache.match(event.request).then((cached) => {
          if (cached) return cached;
          return fetch(event.request).then((networkRes) => {
            if (networkRes.status === 200) {
              tileCache.put(event.request, networkRes.clone());
            }
            return networkRes;
          }).catch(() => {
            // Return cached or empty response if tile unreachable
            return cached || new Response('', { status: 408 });
          });
        });
      })
    );
    return;
  }

  // App core shell & data: Cache-first, background revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Asynchronously update cache in background if online
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }
      return fetch(event.request);
    }).catch(() => {
      if (event.request.headers.get('accept')?.includes('text/html')) {
        return caches.match('./index.html');
      }
    })
  );
});
