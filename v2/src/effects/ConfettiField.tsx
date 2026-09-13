import { useCallback, useEffect, useRef } from "react";

import { PERFORMANCE_CONFIG } from "../config/performance";
import { useAppState } from "../context/AppStateContext";
import { useCelebration } from "../context/CelebrationContext";
import { usePerformance } from "../context/PerformanceContext";
import { ConfettiEngine } from "../engines/particles/ConfettiEngine";
import { getCanvasPixelRatio } from "../utils/canvas";

export function ConfettiField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<ConfettiEngine | null>(null);

  const lastBurstRef = useRef(0);

  const { confettiBurst } = useCelebration();
  const { isVisible } = useAppState();
  const { quality, reducedMotion } = usePerformance();

  // Keep quality accessible inside the stable ResizeObserver callback
  // without re-binding the observer on every tier change.
  const qualityRef = useRef(quality);
  qualityRef.current = quality;

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const engine = engineRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !engine || !parent) return;

    const { width, height } = parent.getBoundingClientRect();
    engine.resize(width, height, getCanvasPixelRatio(qualityRef.current));
  }, []);

  // Create engine once; resize observer uses stable resizeCanvas.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new ConfettiEngine(canvas, 140);
    engineRef.current = engine;

    resizeCanvas();

    const observer = new ResizeObserver(resizeCanvas);
    if (canvas.parentElement) {
      observer.observe(canvas.parentElement);
    }

    return () => {
      observer.disconnect();
      engine.destroy();
      engineRef.current = null;
    };
  }, [resizeCanvas]);

  // Re-size when quality tier changes (updates DPR cap).
  useEffect(() => {
    resizeCanvas();
  }, [quality, resizeCanvas]);

  // Start / stop engine based on visibility and motion preference.
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    if (!isVisible || reducedMotion) {
      engine.stop();
      return;
    }

    engine.start();
  }, [isVisible, reducedMotion]);

  // Fire a burst each time confettiBurst increments.
  useEffect(() => {
    if (confettiBurst === lastBurstRef.current) return;

    lastBurstRef.current = confettiBurst;

    if (reducedMotion) return;

    engineRef.current?.burst(
      PERFORMANCE_CONFIG[quality].confettiBurst,
    );
  }, [confettiBurst, quality, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="confetti-field"
      aria-hidden="true"
    />
  );
}
