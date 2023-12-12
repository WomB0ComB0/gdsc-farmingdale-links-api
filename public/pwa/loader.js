if ('serviceWorker' in navigator) {
  try {
    navigator.serviceWorker.register("../../sw.js");
    console.log('Service worker registered');
  } catch (err) {
    throw new Error('Service registration failed');
  }
}