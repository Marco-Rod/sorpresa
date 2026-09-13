/**
 * Internal reference thresholds for this project.
 * These are not universal standards — they are tuned to the expected
 * device range and the 30/60 FPS targets defined in PERFORMANCE_CONFIG.
 *
 * Use the `performanceRatio` (fps / targetFps) for tier-aware evaluation:
 *   ≥ 0.95  GOOD
 *   0.75–0.94  WARNING
 *   < 0.75  BAD
 */
export const PERFORMANCE_THRESHOLDS = {
  good: {
    fps: 50,
    droppedFrameRatio: 0.08,
    longTaskMs: 80,
    domNodes: 450,
  },

  warning: {
    fps: 35,
    droppedFrameRatio: 0.2,
    longTaskMs: 150,
    domNodes: 700,
  },
} as const;
