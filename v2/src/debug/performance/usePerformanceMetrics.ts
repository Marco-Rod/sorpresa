import { useEffect, useRef, useState } from "react";
import type { PerformanceMetrics } from "./performanceTypes";

const INITIAL_METRICS: PerformanceMetrics = {
  fps: 60,
  averageFps: 60,
  droppedFrameRatio: 0,

  longTasks: 0,
  longestTaskMs: 0,

  domNodes: 0,
  canvases: 0,

  viewportWidth: 0,
  viewportHeight: 0,

  devicePixelRatio: 1,

  heapUsedMb: null,
};

/**
 * DEV-only hook that measures real frame metrics via RAF and PerformanceObserver.
 * Returns INITIAL_METRICS in production builds (the effects bail out early).
 */
export function usePerformanceMetrics(): PerformanceMetrics {
  const [metrics, setMetrics] = useState(INITIAL_METRICS);

  const frameCountRef    = useRef(0);
  const droppedRef       = useRef(0);
  const lastFrameRef     = useRef(performance.now());
  const sampleStartRef   = useRef(performance.now());
  const fpsSamplesRef    = useRef<number[]>([]);
  const longTasksRef     = useRef({ count: 0, longest: 0 });

  // RAF loop — measures fps, dropped frames and DOM snapshot every second.
  useEffect(() => {
    if (!import.meta.env.DEV) return;

    let frameId: number | null = null;

    const frame = (timestamp: number) => {
      const delta = timestamp - lastFrameRef.current;
      lastFrameRef.current = timestamp;

      frameCountRef.current++;

      // A gap > 25 ms at 60 Hz = at least one dropped frame.
      if (delta > 25) droppedRef.current++;

      const elapsed = timestamp - sampleStartRef.current;

      if (elapsed >= 1000) {
        const fps = Math.round((frameCountRef.current * 1000) / elapsed);

        const samples = fpsSamplesRef.current;
        samples.push(fps);
        if (samples.length > 10) samples.shift();

        const averageFps = Math.round(
          samples.reduce((s, v) => s + v, 0) / samples.length,
        );

        const total = frameCountRef.current + droppedRef.current;
        const droppedFrameRatio = total > 0 ? droppedRef.current / total : 0;

        const mem = (
          performance as Performance & {
            memory?: { usedJSHeapSize: number };
          }
        ).memory;

        setMetrics({
          fps,
          averageFps,
          droppedFrameRatio,

          longTasks:   longTasksRef.current.count,
          longestTaskMs: longTasksRef.current.longest,

          domNodes: document.getElementsByTagName("*").length,
          canvases: document.querySelectorAll("canvas").length,

          viewportWidth:  window.innerWidth,
          viewportHeight: window.innerHeight,
          devicePixelRatio: window.devicePixelRatio,

          heapUsedMb: mem
            ? Math.round(mem.usedJSHeapSize / 1024 / 1024)
            : null,
        });

        frameCountRef.current = 0;
        droppedRef.current    = 0;
        sampleStartRef.current = timestamp;
      }

      frameId = requestAnimationFrame(frame);
    };

    frameId = requestAnimationFrame(frame);
    return () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, []);

  // PerformanceObserver for long tasks.
  useEffect(() => {
    if (!import.meta.env.DEV || !("PerformanceObserver" in window)) return;

    try {
      const observer = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          longTasksRef.current.count++;
          longTasksRef.current.longest = Math.max(
            longTasksRef.current.longest,
            entry.duration,
          );
        }
      });
      observer.observe({ entryTypes: ["longtask"] });
      return () => observer.disconnect();
    } catch {
      // longtask not supported in all browsers — safe to ignore.
    }
  }, []);

  return metrics;
}
