import {
  usePerformance,
} from "../../context/PerformanceContext";

export function PerformanceDebug() {
  const {
    quality,
    fps,
    reducedMotion,
  } = usePerformance();

  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <aside
      className="
        performance-debug
      "
    >
      <span>
        FPS: {fps ?? "—"}
      </span>

      <span>
        QUALITY:
        {" "}
        {quality.toUpperCase()}
      </span>

      {reducedMotion && (
        <span>
          Reduced Motion
        </span>
      )}
    </aside>
  );
}
