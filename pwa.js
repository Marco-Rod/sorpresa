let installPrompt = null;

window.addEventListener("beforeinstallprompt", event => {
  event.preventDefault();
  installPrompt = event;
});

window.addEventListener("DOMContentLoaded", () => {
  if (location.protocol === "https:" || location.hostname === "localhost") {
    navigator.serviceWorker?.register("./sw.js").catch(error => console.warn("No se pudo registrar la app:", error));
  }
  if (matchMedia("(display-mode: standalone)").matches || window.navigator.standalone) return;
  const card = document.querySelector("#countdownView .intro-card");
  if (!card) return;
  const button = document.createElement("button");
  button.type = "button";
  button.className = "install-app-button";
  button.textContent = "⇩ Instalar app";
  button.addEventListener("click", async () => {
    if (installPrompt) {
      await installPrompt.prompt();
      installPrompt = null;
      return;
    }
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    alert(isIOS ? "Para instalarla en tu iPhone: abre esta página en Safari, toca Compartir y elige ‘Añadir a pantalla de inicio’." : "Abre el menú de tu navegador y elige ‘Instalar aplicación’ o ‘Añadir a pantalla de inicio’.");
  });
  card.appendChild(button);
});
