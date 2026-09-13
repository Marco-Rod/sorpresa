import { usePwaUpdate } from "../../hooks/usePwaUpdate";

/**
 * Non-intrusive toast that appears when:
 *  - A new version of the app is available (needRefresh)
 *  - The app is ready to work offline (offlineReady)
 *
 * The user always chooses when to apply the update — we never reload
 * automatically, especially not during a countdown or celebration.
 */
export function PwaUpdatePrompt() {
  const {
    needRefresh,
    offlineReady,
    update,
    dismissRefresh,
    dismissOfflineReady,
  } = usePwaUpdate();

  if (!needRefresh && !offlineReady) {
    return null;
  }

  if (offlineReady) {
    return (
      <div className="pwa-toast" role="status" aria-live="polite">
        <span>El jardín ya puede abrirse sin conexión.</span>

        <button type="button" onClick={dismissOfflineReady}>
          Entendido
        </button>
      </div>
    );
  }

  return (
    <div className="pwa-toast" role="status" aria-live="polite">
      <span>Hay una nueva versión del jardín disponible.</span>

      <div className="pwa-toast__actions">
        <button type="button" onClick={dismissRefresh}>
          Después
        </button>

        <button
          type="button"
          onClick={() => {
            void update();
          }}
        >
          Actualizar
        </button>
      </div>
    </div>
  );
}
