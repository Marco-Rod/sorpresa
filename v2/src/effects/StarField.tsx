import { useCallback, useEffect, useRef } from "react";

import { PERFORMANCE_CONFIG } from "../config/performance";
import { useAppState } from "../context/AppStateContext";
import { usePerformance } from "../context/PerformanceContext";
import { StarFieldEngine } from "../engines/canvas/StarFieldEngine";
import { getCanvasPixelRatio } from "../utils/canvas";

export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<StarFieldEngine | null>(null);

  const { isVisible } = useAppState();
  const { quality, reducedMotion } = usePerformance();

  // Stable ref so ResizeObserver always reads the current tier
  // without being re-bound on every quality change.
  const qualityRef = useRef(quality);
  qualityRef.current = quality;

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const engine = engineRef.current;
    const parent = canvas?.parentElement;
    if (!engine || !parent) return;

    const { width, height } = parent.getBoundingClientRect();
    engine.resize(width, height, getCanvasPixelRatio(qualityRef.current));
  }, []);

  // Create engine once.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let engine: StarFieldEngine;
    try {
      engine = new StarFieldEngine(canvas, 0);
    } catch {
      // Canvas 2D unavailable — the CSS gradient sky remains.
      return;
    }

    engineRef.current = engine;
    resizeCanvas();

    const observer = new ResizeObserver(resizeCanvas);
    if (canvas.parentElement) observer.observe(canvas.parentElement);
    window.addEventListener("resize", resizeCanvas);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resizeCanvas);
      engine.destroy();
      engineRef.current = null;
    };
  }, [resizeCanvas]);

  // Apply new quality settings and re-size DPR cap when tier changes.
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    engine.setStarCount(PERFORMANCE_CONFIG[quality].stars);
    resizeCanvas();
  }, [quality, resizeCanvas]);

  // Start / stop based on visibility and motion preference.
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    if (isVisible && !reducedMotion) {
      engine.start();
    } else {
      engine.stop();
      if (isVisible) engine.renderOnce();
    }
  }, [isVisible, reducedMotion]);

  return <canvas ref={canvasRef} className="star-field" aria-hidden="true" />;
}
