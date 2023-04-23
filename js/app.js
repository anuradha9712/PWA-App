// Step 1: register a service worker
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('/sw.js')
  .then((reg) => console.log('Service Worker Registered', reg))
  .catch((err) => console.log('Error in Registering Service Worker', err))
}