
// PWA registration; preserves the existing VSC application and its local records.
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(err => console.warn('Offline unavailable', err)));
}
