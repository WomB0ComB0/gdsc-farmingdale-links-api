self.addEventListener('install', (event) => {
  console.info('Event: Install');

  event.waitUntil(
    caches.open("static-cache")
      .then((cache) => {
        return cache.addAll([
          "./"
        ])
          .then(() => {
            console.info('All files are cached');
            return self.skipWaiting();
          })
          .catch((error) => {
            console.error('Failed to cache', error);
          })
      })
  );
});


self.addEventListener('fetch', (event) => {
  console.info('Event: Fetch');

  const request = event.request;

  event.respondWith(
    caches.match(request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(request).then((response) => {
        const responseToCache = response.clone();
        caches.open("static-cache").then((cache) => {
          cache.put(request, responseToCache).catch((err) => {
            console.warn(`${request.url} : ${err.message}`);
          });
        });
        return response;
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  console.info('Event: Activate');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== "static-cache") {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});