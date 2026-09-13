import type { SceneName } from "../../engines/sceneEngine";
import { useGardenPhrase } from "../../hooks/useGardenPhrase";

interface GardenMessageProps {
  scene: SceneName;

  /** Extra class name to allow per-scene colour overrides. */
  className?: string;
}

/**
 * Displays a rotating garden phrase that changes every ~12 seconds with a
 * gentle fade + upward slide transition. Pauses when the page is hidden.
 */
export function GardenMessage({ scene, className }: GardenMessageProps) {
  const { text, visible } = useGardenPhrase(scene);

  return (
    <p
      className={[
        "garden-message",
        visible ? "garden-message--visible" : "garden-message--hidden",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-live="polite"
      aria-atomic="true"
    >
      {text}
    </p>
  );
}
