// SAFA Schedule Dashboard Service Worker (v3)
// Optimized for GitHub Pages sub-directories, responsive layouts, and immediate cache invalidation

const CACHE_NAME = 'safa-dashboard-v3';
const PRECACHE_ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './icon.svg'
];

// Install event: Pre-cache core shell and activate immediately
self.addEventListener('install', (event) => {
    self.skipWaiting(); // Force active immediately
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(PRECACHE_ASSETS).catch((err) => {
                console.warn('Pre-cache asset warning:', err);
            });
        })
    );
});

// Activate event: Delete old cache versions and claim clients
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((name) => {
                    if (name !== CACHE_NAME) {
                        console.log('[SW] Purging old cache:', name);
                        return caches.delete(name);
                    }
                })
            );
        }).then(() => {
            return self.clients.claim(); // Take control of all clients immediately
        })
    );
});

// Fetch event: Network-first for HTML pages (so GitHub Pages updates are instantly seen)
// and Cache-first fallback for offline assets
self.addEventListener('fetch', (event) => {
    const url = event.request.url;

    // Do not intercept or cache external APIs (Supabase, CDNs, etc.)
    if (url.includes('supabase.co') || url.includes('cdn.tailwindcss.com') || url.includes('jsdelivr.net')) {
        return;
    }

    // Network-first strategy for navigation / HTML requests
    if (event.request.mode === 'navigate' || url.endsWith('.html') || url.endsWith('/')) {
        event.respondWith(
            fetch(event.request)
                .then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const responseClone = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
                    }
                    return networkResponse;
                })
                .catch(() => {
                    return caches.match(event.request).then((cachedResponse) => {
                        return cachedResponse || caches.match('./index.html') || caches.match('/index.html');
                    });
                })
        );
        return;
    }

    // Cache-first with network fallback for other static assets
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request).then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
                }
                return networkResponse;
            });
        })
    );
});
