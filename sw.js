const staticCacheName = "static-site";
const assets = [
  "/",
  "/index.html",
  "/js/app.js",
  "/css/styles.css",
  "https://unpkg.com/@innovaccer/design-system@2.15.3/css/dist/index.css",
  "https://fonts.googleapis.com/css?family=Nunito+Sans:300,300i,400,400i,600,600i,700,700i,800,800i,900,900i&display=swap",
  "https://fonts.gstatic.com/s/nunitosans/v12/pe03MImSLYBIv1o4X1M8cc8GBs5tU1ECVZl_.woff2",
];

// Step 2: Install Service Worker
self.addEventListener("install", (event) => {
  // console.log("service worker has been installed!!");
  event.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log("caching shell assets");
      cache.addAll(assets);
    })
  );
});

const clearOldCaches = () =>
  caches.keys().then((keys) =>
    Promise.all(
      keys
        .filter((key) => key !== staticCacheName)
        .map((key) => {
          console.log("[sw] remove cache", key);
          caches.delete(key);
          return true;
        })
    )
  );

// Step 3: Activate Service Worker
self.addEventListener("activate", (event) => {
  console.log("service worker has been activated!!");
  event.waitUntil(clearOldCaches());
});

// Step 4: Fetch Event
self.addEventListener("fetch", (event) => {
  console.log("fetch event", event);
  event.respondWith(
    caches.match(event.request).then((cacheRes) => {
      return cacheRes || fetch(event.request);
    })
  );
});
