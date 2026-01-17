/// <reference lib="webworker" />

export { };
declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = 'gdsc-fsc-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
];

// Install event - cache static assets
self.addEventListener('install', (event: ExtendableEvent) => {
  console.info('Service Worker: Installing...');

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.info('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.info('Service Worker: All assets cached');
        return (globalThis as unknown as ServiceWorkerGlobalScope).skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Cache failed', error);
      })
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event: ExtendableEvent) => {
  console.info('Service Worker: Activating...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.info(`Service Worker: Deleting old cache: ${name}`);
            return caches.delete(name);
          })
      );
    }).then(() => {
      return (globalThis as unknown as ServiceWorkerGlobalScope).clients.claim();
    })
  );
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event: FetchEvent) => {
  const request = event.request;

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip API requests - don't cache them
  if (request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Clone the response before caching
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache).catch((err) => {
            console.warn(`Service Worker: Failed to cache ${request.url}:`, err.message);
          });
        });

        return response;
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Return offline fallback for navigation requests
          if (request.mode === 'navigate') {
            return caches.match('/index.html') as Promise<Response>;
          }
          return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
        });
      })
  );
});
