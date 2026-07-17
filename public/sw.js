const CACHE_NAME = "ekspedisi-cache-v1";
const OFFLINE_URL = "/offline.html";
const PRECACHE_URLS = [OFFLINE_URL, "/favicon.ico"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(PRECACHE_URLS);
    })()
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
      await self.clients.claim();
    })()
  );
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    return cachedResponse || (await cache.match(OFFLINE_URL));
  }
}

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const requestURL = new URL(event.request.url);
  const isSameOrigin = requestURL.origin === self.location.origin;
  const acceptHeader = event.request.headers.get("accept") || "";
  const isNavigationRequest =
    event.request.mode === "navigate" || acceptHeader.includes("text/html");

  if (isSameOrigin && (isNavigationRequest || requestURL.pathname.startsWith("/_next/") || requestURL.pathname.endsWith(".js") || requestURL.pathname.endsWith(".css") || requestURL.pathname.endsWith(".svg") || requestURL.pathname.endsWith(".png") || requestURL.pathname.endsWith(".jpg") || requestURL.pathname.endsWith(".jpeg") || requestURL.pathname.endsWith(".webp") || requestURL.pathname.endsWith(".woff2") || requestURL.pathname.endsWith(".woff"))) {
    event.respondWith(networkFirst(event.request));
  }
});
