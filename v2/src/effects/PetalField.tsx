import { useCallback, useEffect, useRef } from "react";

import { PERFORMANCE_CONFIG } from "../config/performance";
import { useAppState } from "../context/AppStateContext";
import { usePerformance } from "../context/PerformanceContext";
import { PetalEngine } from "../engines/particles/PetalEngine";
import { getCanvasPixelRatio } from "../utils/canvas";

interface PetalFieldProps {
  intensity?: number;
}

export function PetalField({ intensity = 1 }: PetalFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<PetalEngine | null>(null);

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

    let engine: PetalEngine;
    try {
      engine = new PetalEngine(
        canvas,
        { maxParticles: 0, spawnRate: 0 },
        PERFORMANCE_CONFIG.high.petals,
      );
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

  // Apply new quality settings when tier or intensity changes.
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    const scale = Math.max(0, Number.isFinite(intensity) ? intensity : 0);
    engine.setOptions({
      maxParticles: Math.round(PERFORMANCE_CONFIG[quality].petals * scale),
      spawnRate: PERFORMANCE_CONFIG[quality].petalSpawnRate * scale,
    });
    resizeCanvas();
  }, [quality, intensity, resizeCanvas]);

  // Start / stop.
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    if (isVisible && !reducedMotion) {
      engine.start();
    } else {
      engine.stop();
      if (reducedMotion) engine.reset();
    }
  }, [isVisible, reducedMotion]);

  return <canvas ref={canvasRef} className="petal-field" aria-hidden="true" />;
}
