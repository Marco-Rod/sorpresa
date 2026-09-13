import { useEffect, useRef } from "react";
import { useAppState } from "../context/AppStateContext";
import { usePerformance } from "../context/PerformanceContext";
import { PERFORMANCE_CONFIG } from "../config/performance";
import { PetalEngine } from "../engines/particles/PetalEngine";
import { getCanvasPixelRatio } from "../utils/canvas";

interface PetalFieldProps {
  intensity?: number;
}

export function PetalField({
  intensity = 1,
}: PetalFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<PetalEngine | null>(null);
  const { isVisible } = useAppState();
  const { quality, reducedMotion } = usePerformance();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Quality is applied below, after construction. Never recreate on FPS updates.
    let engine: PetalEngine;
    try {
      engine = new PetalEngine(canvas, { maxParticles: 0, spawnRate: 0 }, PERFORMANCE_CONFIG.high.petals);
    } catch {
      // The decorative scene can remain a CSS gradient if 2D is unavailable.
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
    const scale = Math.max(0, Number.isFinite(intensity) ? intensity : 0);
    engine.setOptions({
      maxParticles: Math.round(PERFORMANCE_CONFIG[quality].petals * scale),
      spawnRate: PERFORMANCE_CONFIG[quality].petalSpawnRate * scale,
    });
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
  }, [quality, intensity]);

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;
    if (isVisible && !reducedMotion) engine.start();
    else {
      engine.stop();
      if (reducedMotion) engine.reset();
    }
  }, [isVisible, reducedMotion]);

  return <canvas ref={canvasRef} className="petal-field" aria-hidden="true" />;
}
