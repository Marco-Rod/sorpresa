window.addEventListener("DOMContentLoaded", () => {
  if (location.protocol === "https:" || location.hostname === "localhost") {
    navigator.serviceWorker?.register("./sw.js").then(registration => {
      registration.update();
      const reportVersion = () => navigator.serviceWorker.controller?.postMessage({type: "GET_VERSION"});
      reportVersion();
      navigator.serviceWorker.addEventListener("controllerchange", reportVersion, {once: true});
    }).catch(error => console.warn("No se pudo registrar la app:", error));
  }
});

navigator.serviceWorker?.addEventListener("message", event => {
  if (event.data?.type !== "CACHE_VERSION") return;
  console.info("[garden]", event.data.value);
  if (typeof window.diag === "function") window.diag("service-worker-version", {version: event.data.value});
});
