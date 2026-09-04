const CACHE_NAME = "reloc8-app-v1";

const APP_SHELL = [
  "/",
  "/index.html",
];


// ========================================
// INSTALL
// ========================================

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL);
    })
  );

  self.skipWaiting();
});


// ========================================
// ACTIVATE
// ========================================

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );

  self.clients.claim();
});


// ========================================
// FETCH
// ========================================

self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Only handle GET requests
  if (request.method !== "GET") {
    return;
  }

  // Don't cache backend API requests
  if (
    request.url.includes("/api/") ||
    request.url.includes("/risk") ||
    request.url.includes("/evacuation-plan")
  ) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {

        // Save successful response
        if (response && response.status === 200) {
          const responseClone = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }

        return response;
      })
      .catch(() => {

        // Try cached file
        return caches.match(request).then((cached) => {

          if (cached) {
            return cached;
          }

          // For page navigation, return cached index
          if (request.mode === "navigate") {
            return caches.match("/index.html");
          }

          return new Response(
            "Offline - resource unavailable",
            {
              status: 503,
              statusText: "Offline",
            }
          );
        });
      })
  );
});