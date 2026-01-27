/**
 * Service Worker
 * SEC-20: Offline support with cache-first strategy for static assets
 *
 * This service worker provides:
 * - Caching of static assets (HTML, CSS, JS, images)
 * - Offline fallback page
 * - Cache versioning for updates
 */

const CACHE_NAME = 'pathfinder-v1';
const OFFLINE_URL = '/offline.html';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/vite.svg',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Precaching assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        // Activate immediately
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        // Take control immediately
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached response if available
        if (cachedResponse) {
          // Fetch in background to update cache (stale-while-revalidate)
          event.waitUntil(
            fetch(event.request)
              .then((response) => {
                if (response.ok) {
                  return caches.open(CACHE_NAME)
                    .then((cache) => cache.put(event.request, response));
                }
              })
              .catch(() => {
                // Network failed, cached version still served
              })
          );
          return cachedResponse;
        }

        // No cache, try network
        return fetch(event.request)
          .then((response) => {
            // Cache successful responses
            if (response.ok && event.request.method === 'GET') {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => cache.put(event.request, responseToCache));
            }
            return response;
          })
          .catch(() => {
            // Network failed, show offline page for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_URL);
            }
            // Return empty response for other requests
            return new Response('Offline', {
              status: 503,
              statusText: 'Service Unavailable',
            });
          });
      })
  );
});

// Message event - handle commands from main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAME)
      .then(() => {
        console.log('[SW] Cache cleared');
      });
  }
});
