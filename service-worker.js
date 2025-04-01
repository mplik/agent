const CACHE_NAME = 'agent-cache-v1';

const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/manifest.json',
    '/script.js',
    '/images/flaga_7kb_500-500.png',
    '/images/flaga_7kb_250_250.png',
    '/fallback.html' // plik istniejacy w razie braku internetu        
];

// Instalowanie service worker
self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => {
          console.log('Opened cache');
          return cache.addAll(urlsToCache);
        })
    );
  });
  
  // Obsługa fetch
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(event.request).catch(() => {
            return caches.match('/fallback.html'); // plik istniejacy w razie braku internetu
          });
        })
    );
  });
  
  // Aktualizacja service worker
  self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  });