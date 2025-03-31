const CACHE_NAME = 'agent-cache-v1';

const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/images/MPLIK.PL sprzedaż Stripe Climate-1.png',
    '/images/MPLIK.PL_sprzedaż_Stripe_Climate.png',
    '/images/domek_81kb_500_500.png',
];

// Instalacja service workera
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Aktywacja service workera
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Obsługa żądań sieciowych
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});