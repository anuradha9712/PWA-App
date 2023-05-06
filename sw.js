const staticCacheName = "site-static-v2";
const dynamicCacheName = "site-dynamic-v3";
const assets = [
  "/",
  "/index.html",
  "/js/app.js",
  "/css/styles.css",
  "https://unpkg.com/@innovaccer/design-system@2.15.3/css/dist/index.css",
  "https://fonts.googleapis.com/css?family=Nunito+Sans:300,300i,400,400i,600,600i,700,700i,800,800i,900,900i&display=swap",
  "https://fonts.gstatic.com/s/nunitosans/v12/pe03MImSLYBIv1o4X1M8cc8GBs5tU1ECVZl_.woff2",
  "/pages/404.html"
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
        .filter((key) => key !== staticCacheName && key !== dynamicCacheName)
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
// self.addEventListener("fetch", (event) => {
//   console.log("fetch event", event);
//   event.respondWith(
//     caches.match(event.request).then((cacheRes) => {
//       return (
//         cacheRes || fetch(event.request)
//         .then((fetchRes) => {
//           return caches.open(dynamicCacheName).then((cache) => {
//             cache.put(event.request.url, fetchRes.clone());
//             return fetchRes;
//           });
//         })
//       );
//     }).catch(() => caches.match('/pages/404.html'))
//   );
// });

self.addEventListener("fetch", (e) => {
  e.respondWith(
    (async () => {
      const r = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (r) {
        return r;
      }
      const response = await fetch(e.request);
      const cache = await caches.open(dynamicCacheName);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
    })()
  );
});

const addToCache = (request, response) => {
  caches
    .open(staticCacheName)
    .then((cache) => cache.put(request, response))
    .catch((err) => {
      console.log(err);
      return err;
    });
};

// Respond with cached resources
// self.addEventListener('fetch', function(event) {
//   console.log(event.request);

//   event.respondWith(
//     caches.match(event.request).then(function(response) {
//       return (
//         (response &&
//           new Promise(resolve => {
//             // Resolve the response
//             resolve(response);

//             // Fetch the request
//             fetch(event.request).then(res => {
//               // And cache it
//               addToCache(event.request, res);
//             });
//           })) ||
//         fetch(event.request).then(res => {
//           const clone = res.clone();
//           addToCache(event.request, clone);
//           return res;
//         })
//       );
//     })
//   );
// });