import { useCallback, useEffect, useRef, type RefObject } from "react";
import type { CanvasEngine } from "../engines/canvas/CanvasEngine";
import type { PerformanceTier } from "../engines/performanceEngine";
import { getCanvasPixelRatio } from "../utils/canvas";

/**
 * Attaches a ResizeObserver to the canvas's parent element and calls
 * `engine.resize()` whenever the parent's bounding-box changes.
 *
 * The `qualityRef` pattern prevents the observer closure from holding a
 * stale `quality` value: the ref is written on every render so the stable
 * callback always reads the current tier when it fires.
 *
 * @returns A stable `resizeCanvas` function you can call imperatively
 *          (e.g. right after creating the engine, or on quality change).
 */
export function useCanvasResize<T extends CanvasEngine>(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  engineRef: RefObject<T | null>,
  quality: PerformanceTier,
): () => void {
  const qualityRef = useRef(quality);
  qualityRef.current = quality;

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const engine = engineRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !engine || !parent) return;

    const { width, height } = parent.getBoundingClientRect();
    if (width <= 0 || height <= 0) return;

    engine.resize(width, height, getCanvasPixelRatio(qualityRef.current));
  }, [canvasRef, engineRef]);

  // Observe parent for size changes; never re-bind the observer on quality changes.
  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!parent) return;

    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(parent);
    window.addEventListener("resize", resizeCanvas);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [canvasRef, resizeCanvas]);

  return resizeCanvas;
}
