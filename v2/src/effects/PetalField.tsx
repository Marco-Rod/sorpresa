import { useEffect, useRef } from "react";

import { PERFORMANCE_CONFIG } from "../config/performance";
import { useAppState } from "../context/AppStateContext";
import { usePerformance } from "../context/PerformanceContext";
import { PetalEngine } from "../engines/particles/PetalEngine";
import { useCanvasResize } from "../hooks/useCanvasResize";

interface PetalFieldProps {
  intensity?: number;
}

export function PetalField({ intensity = 1 }: PetalFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<PetalEngine | null>(null);

  const { isVisible } = useAppState();
  const { quality, reducedMotion } = usePerformance();

  const resizeCanvas = useCanvasResize(canvasRef, engineRef, quality);

  // Create engine once on mount.
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

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, [resizeCanvas]);

  // Apply quality / intensity settings.
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    const cfg   = PERFORMANCE_CONFIG[quality];
    const scale = Math.max(0, Number.isFinite(intensity) ? intensity : 0);

    engine.setOptions({
      maxParticles: Math.round(cfg.petals * scale),
      spawnRate:    cfg.petalSpawnRate * scale,
    });
    engine.setTargetFps(cfg.targetFps);
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
