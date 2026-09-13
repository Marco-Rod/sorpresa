import { useCallback, useEffect, useRef } from "react";

import { PERFORMANCE_CONFIG } from "../config/performance";
import { useAppState } from "../context/AppStateContext";
import { usePerformance } from "../context/PerformanceContext";
import { FireflyEngine } from "../engines/particles/FireflyEngine";
import { getCanvasPixelRatio } from "../utils/canvas";

export function FireflyField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<FireflyEngine | null>(null);

  const { isVisible } = useAppState();
  const { quality, reducedMotion } = usePerformance();

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

    let engine: FireflyEngine;
    try {
      engine = new FireflyEngine(canvas, { maxParticles: 0 });
    } catch {
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

  // Apply new quality settings when tier changes.
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    engine.setOptions({ maxParticles: PERFORMANCE_CONFIG[quality].fireflies });
    resizeCanvas();
  }, [quality, resizeCanvas]);

  // Start / stop.
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

  return (
    <canvas ref={canvasRef} className="firefly-field" aria-hidden="true" />
  );
}
