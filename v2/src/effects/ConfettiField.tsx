import { useEffect, useRef } from "react";

import { PERFORMANCE_CONFIG } from "../config/performance";
import { useAppState } from "../context/AppStateContext";
import { useCelebration } from "../context/CelebrationContext";
import { usePerformance } from "../context/PerformanceContext";
import { ConfettiEngine } from "../engines/particles/ConfettiEngine";
import { useCanvasResize } from "../hooks/useCanvasResize";

export function ConfettiField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<ConfettiEngine | null>(null);

  const lastBurstRef = useRef(0);

  const { confettiBurst } = useCelebration();
  const { isVisible }     = useAppState();
  const { quality, reducedMotion } = usePerformance();

  const resizeCanvas = useCanvasResize(canvasRef, engineRef, quality);

  // Create engine once.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const cfg = PERFORMANCE_CONFIG[quality];
    const engine = new ConfettiEngine(canvas, 140);

    engine.setTargetFps(cfg.targetFps);
    engineRef.current = engine;

    resizeCanvas();

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resizeCanvas]);

  // Apply quality settings when tier changes.
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    engine.setTargetFps(PERFORMANCE_CONFIG[quality].targetFps);
    resizeCanvas();
  }, [quality, resizeCanvas]);

  // Start / stop.
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    if (!isVisible || reducedMotion) {
      engine.stop();
      return;
    }
    engine.start();
  }, [isVisible, reducedMotion]);

  // Burst on each new confettiBurst counter value.
  useEffect(() => {
    if (confettiBurst === lastBurstRef.current) return;
    lastBurstRef.current = confettiBurst;
    if (reducedMotion) return;
    engineRef.current?.burst(PERFORMANCE_CONFIG[quality].confettiBurst);
  }, [confettiBurst, quality, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="confetti-field"
      aria-hidden="true"
    />
  );
}
