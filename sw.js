/* TEZOFY service worker — offline-friendly static cache */
const CACHE = "tezofy-v24";
const CORE = [
  "./",
  "./index.html",
  "./discover.html",
  "./category.html",
  "./template.html",
  "./blog.html",
  "./article.html",
  "./saved.html",
  "./admin.html",
  "./assets/css/style.css",
  "./assets/js/data.js",
  "./assets/js/app.js",
  "./assets/js/auth-cloud.js",
  "./assets/icons/logo.png",
  "./assets/icons/favicon.png",
  "./manifest.webmanifest",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(CORE))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* v22 — network-first for code & share pages (fresh shares!), SWR for images */
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  const path = url.pathname;
  const networkFirst = /\.(html|js|css)$/.test(path) || path.indexOf("/share/") !== -1;

  const cachePut = (res) => {
    if (res && res.ok) {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(req, copy));
    }
    return res;
  };

  if (networkFirst) {
    e.respondWith(
      fetch(req)
        .then(cachePut)
        .catch(() => caches.match(req).then((m) => m || caches.match("./index.html")))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then((cached) => {
      const fresh = fetch(req).then(cachePut).catch(() => cached || caches.match("./index.html"));
      return cached || fresh;
    })
  );
});
