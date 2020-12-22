const CACHE_NAME = "version-1.0.0";
// TODO: Add offline.html
const urlsToCache = [
  "index.html",
  "offline.html",
  "global.css",
  "./fonts/Montserrat-Light.ttf",
  "./build/bundle.css",
  "./build/bundle.js",
];

const self = this;

// Install service worker
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Open cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// Listen for requests
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then(() => {
      return fetch(e.request).catch(() => caches.match("offline.html"));
    })
  );
});

// Activate the service worker
self.addEventListener("activate", (e) => {
  const cacheWhitelist = [];
  cacheWhitelist.push(CACHE_NAME);

  e.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          console.log("cache name: ", cacheName);
          if (!cacheWhitelist.includes(cacheName)) {
            console.log("HUH");
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});
