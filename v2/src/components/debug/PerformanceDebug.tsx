import { usePerformance } from "../../context/PerformanceContext";
import { useScene } from "../../hooks/useScene";
import { DEBUG_ENABLED } from "../../utils/debugFlag";

export function PerformanceDebug() {
  if (!DEBUG_ENABLED) return null;
  return <PerformanceDebugInner />;
}

function PerformanceDebugInner() {
  const { quality, qualityMode, fps, reducedMotion } = usePerformance();
  const scene = useScene();

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  return (
    <aside className="performance-debug">
      <span>FPS: {fps ?? "—"}</span>
      <span>
        {quality.toUpperCase()} · {qualityMode}
      </span>
      <span>Scene: {scene}</span>
      <span>
        {vw}×{vh}
      </span>
      {reducedMotion && <span>reduced-motion</span>}
    </aside>
  );
}
