import { useEffect, useRef } from "react";
import { useAppState } from "../context/AppStateContext";
import { usePerformance } from "../context/PerformanceContext";
import { PERFORMANCE_CONFIG } from "../config/performance";
import { StarFieldEngine } from "../engines/canvas/StarFieldEngine";
import { getCanvasPixelRatio } from "../utils/canvas";

export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<StarFieldEngine | null>(null);
  const { isVisible } = useAppState();
  const { quality, reducedMotion } = usePerformance();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Quality is applied below, after construction. Never recreate on FPS updates.
    let engine: StarFieldEngine;
    try {
      engine = new StarFieldEngine(canvas, 0);
    } catch {
      // The decorative sky can remain a CSS gradient if 2D is unavailable.
      return;
    }
    engineRef.current = engine;
    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const engine = engineRef.current;
    const parent = canvas?.parentElement;
    if (!engine || !parent) return;
    engine.setStarCount(PERFORMANCE_CONFIG[quality].stars);
    const resize = () => {
      const { width, height } = parent.getBoundingClientRect();
      engine.resize(width, height, getCanvasPixelRatio(quality));
    };
    resize();
    // Rebind on tier changes so ResizeObserver never retains an old DPR cap.
    const observer = new ResizeObserver(resize);
    observer.observe(parent);
    window.addEventListener("resize", resize);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [quality]);

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;
    if (isVisible && !reducedMotion) engine.start();
    else {
      engine.stop();
      if (isVisible) engine.renderOnce();
    }
  }, [isVisible, reducedMotion]);

  return <canvas ref={canvasRef} className="star-field" aria-hidden="true" />;
}
