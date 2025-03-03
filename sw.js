const CACHE_NAME = 'portfolio-v1';
const WEBSITE_URL = 'https://jmacaambac.github.io/myprofile/';


const urlsToCache = [
  WEBSITE_URL,
  'index.html',
  'manifest.json',

];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
       console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Cache failed:', error);
     })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
  caches.match(event.request)
      .then((response) => {
   
        if (response) {
          return response;
        }
        const fetchRequest = event.request.clone();
        return fetch(fetchRequest)

          .then((response) => {
           
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

             const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            return response;
            });
          })
           .catch(() => {
     
        if (event.request.url === WEBSITE_URL) {
          return caches.match(WEBSITE_URL);
        }
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
