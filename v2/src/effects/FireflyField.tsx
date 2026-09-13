import { useEffect, useRef } from "react";

import { PERFORMANCE_CONFIG } from "../config/performance";
import { useAppState } from "../context/AppStateContext";
import { usePerformance } from "../context/PerformanceContext";
import { FireflyEngine } from "../engines/particles/FireflyEngine";
import { useCanvasResize } from "../hooks/useCanvasResize";

export function FireflyField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<FireflyEngine | null>(null);

  const { isVisible } = useAppState();
  const { quality, reducedMotion } = usePerformance();

  const resizeCanvas = useCanvasResize(canvasRef, engineRef, quality);

  // Create engine once.
  // IMPORTANT: resizeCanvas is called immediately after so that
  // onResize() fires while the engine is still freshly created,
  // initializing fireflies at correct dimensions.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const cfg = PERFORMANCE_CONFIG[quality];
    let engine: FireflyEngine;
    try {
      engine = new FireflyEngine(canvas, { maxParticles: cfg.fireflies });
    } catch {
      return;
    }

    engine.setTargetFps(cfg.targetFps);
    engineRef.current = engine;

    // resize first — this triggers onResize() → initialized = true → spawn
    resizeCanvas();

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resizeCanvas]); // quality intentionally omitted from mount effect

  // Apply updated quality settings.
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    const cfg = PERFORMANCE_CONFIG[quality];
    engine.setOptions({ maxParticles: cfg.fireflies });
    engine.setTargetFps(cfg.targetFps);
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
