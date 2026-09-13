import { useAppState } from "../../context/AppStateContext";
import { usePerformance } from "../../context/PerformanceContext";
import { PERFORMANCE_CONFIG } from "../../config/performance";
import { useScene } from "../../hooks/useScene";
import { DEBUG_ENABLED } from "../../utils/debugFlag";
import { usePerformanceMetrics } from "./usePerformanceMetrics";

/**
 * Detailed live metrics panel — visible when DEBUG_ENABLED (DEV or staging).
 * Renders null in production builds.
 */
export function PerformanceLab() {
  if (!DEBUG_ENABLED) return null;

  return <PerformanceLabInner />;
}

function PerformanceLabInner() {
  const metrics           = usePerformanceMetrics();
  const { quality, qualityMode } = usePerformance();
  const { isVisible }     = useAppState();
  const scene             = useScene();

  const targetFps = PERFORMANCE_CONFIG[quality].targetFps;
  const ratio     = targetFps > 0 ? metrics.fps / targetFps : 1;
  const ratioLabel =
    ratio >= 0.95 ? "✓" : ratio >= 0.75 ? "⚠" : "✗";

  return (
    <div className="performance-lab">
      <Row label="FPS"      value={`${metrics.fps} / ${targetFps} ${ratioLabel}`} />
      <Row label="Avg FPS"  value={metrics.averageFps} />
      <Row label="Dropped"  value={`${Math.round(metrics.droppedFrameRatio * 100)}%`} />
      <Row label="Quality"  value={`${quality} · ${qualityMode}`} />
      <Row label="Scene"    value={scene} />
      <Row label="Visible"  value={isVisible ? "yes" : "hidden"} />
      <Row label="Viewport" value={`${metrics.viewportWidth}×${metrics.viewportHeight}`} />
      <Row label="DPR"      value={metrics.devicePixelRatio} />
      <Row label="DOM"      value={metrics.domNodes} />
      <Row label="Canvas"   value={metrics.canvases} />
      <Row label="LongTask" value={`${metrics.longTasks} (${Math.round(metrics.longestTaskMs)}ms)`} />
      {metrics.heapUsedMb !== null && (
        <Row label="Heap" value={`${metrics.heapUsedMb} MB`} />
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="performance-lab__row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
