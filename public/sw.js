// OYNAVA service worker — PWA "güvenilir/app-ready" + TWA için.
// Tutucu (conservative): sadece navigasyonlarda çevrimdışı yedek; içeriği agresif cache'lemez
// (oyunlar dinamik, bayat içerik riski yok).
const CACHE = "oynava-v1";
const OFFLINE_URL = "/offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.add(OFFLINE_URL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  // Yalnız sayfa (HTML) gezinmelerinde: ağ önce, internet yoksa çevrimdışı yedek sayfa.
  if (req.mode === "navigate") {
    event.respondWith(fetch(req).catch(() => caches.match(OFFLINE_URL)));
  }
});
