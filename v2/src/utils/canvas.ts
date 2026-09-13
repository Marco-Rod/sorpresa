import {
  PERFORMANCE_CONFIG,
} from "../config/performance";

import type {
  PerformanceTier,
} from "../engines/performanceEngine";

export function getCanvasPixelRatio(
  quality: PerformanceTier,
): number {
  const maxRatio =
    PERFORMANCE_CONFIG[
      quality
    ].maxDevicePixelRatio;

  return Math.min(
    window.devicePixelRatio || 1,
    maxRatio,
  );
}
