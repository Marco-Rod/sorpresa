const CACHE_NAME = "jardin-ale-2027-v6";
const APP_SHELL = ["./", "./index.html", "./styles.css", "./script.js", "./pwa.js", "./manifest.webmanifest", "./2026.html", "./2026.css", "./2026.js", "./assets/ale-800.jpg", "./assets/icons/tulip-180.png", "./assets/icons/tulip-192.png", "./assets/icons/tulip-512.png"];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))));
  self.clients.claim();
});

self.addEventListener("message", event => {
  if (event.data?.type === "GET_VERSION") event.source?.postMessage({type: "CACHE_VERSION", value: CACHE_NAME});
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const requestUrl = new URL(event.request.url);
  if (event.request.destination === "audio" || requestUrl.pathname.endsWith(".mp3")) return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    if (response.status === 200 && requestUrl.origin === self.location.origin) {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)).catch(() => {});
    }
    return response;
  }).catch(() => event.request.mode === "navigate" ? caches.match("./index.html") : Response.error())));
});
