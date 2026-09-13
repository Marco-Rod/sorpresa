import { useRegisterSW } from "virtual:pwa-register/react";

/**
 * Wraps the vite-plugin-pwa service-worker registration.
 * Returns flags and callbacks the PwaUpdatePrompt uses to inform the user
 * about available updates or offline-readiness — without forcing a reload.
 */
export function usePwaUpdate() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, registration) {
      if (import.meta.env.DEV) {
        console.debug("[PWA] service worker registered", swUrl, registration);
      }
    },

    onRegisterError(error) {
      console.error("[PWA] registration error", error);
    },
  });

  return {
    needRefresh,
    offlineReady,

    update: async () => {
      await updateServiceWorker(true);
    },

    dismissRefresh: () => setNeedRefresh(false),

    dismissOfflineReady: () => setOfflineReady(false),
  };
}
