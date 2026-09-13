import { useEffect, useRef } from "react";

import { PERFORMANCE_CONFIG } from "../config/performance";
import { useAppState } from "../context/AppStateContext";
import { usePerformance } from "../context/PerformanceContext";
import { StarFieldEngine } from "../engines/canvas/StarFieldEngine";
import { useCanvasResize } from "../hooks/useCanvasResize";

export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<StarFieldEngine | null>(null);

  const { isVisible } = useAppState();
  const { quality, reducedMotion } = usePerformance();

  const resizeCanvas = useCanvasResize(canvasRef, engineRef, quality);

  // Create engine once on mount.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let engine: StarFieldEngine;
    try {
      engine = new StarFieldEngine(canvas, 0);
    } catch {
      return; // Canvas 2D unavailable — CSS gradient sky remains.
    }

    engineRef.current = engine;
    resizeCanvas();

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, [resizeCanvas]);

  // Apply quality settings when tier changes.
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    const cfg = PERFORMANCE_CONFIG[quality];
    engine.setStarCount(cfg.stars);
    engine.setTargetFps(cfg.targetFps);
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
