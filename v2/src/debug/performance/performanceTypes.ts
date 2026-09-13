export interface PerformanceMetrics {
  fps: number;
  averageFps: number;
  droppedFrameRatio: number;

  longTasks: number;
  longestTaskMs: number;

  domNodes: number;
  canvases: number;

  viewportWidth: number;
  viewportHeight: number;

  devicePixelRatio: number;

  /** null when the browser does not expose JS heap size */
  heapUsedMb: number | null;
}
