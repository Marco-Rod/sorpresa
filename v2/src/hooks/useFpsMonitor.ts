import { useEffect, useState } from "react";

export function useFpsMonitor({ enabled, sampleDuration = 1000 }: { enabled: boolean; sampleDuration?: number }) {
  const [sample, setSample] = useState<{ fps: number } | null>(null);
  useEffect(() => {
    // Reset the external sampling session so background gaps and old readings are discarded.
    // oxlint-disable-next-line react/set-state-in-effect
    setSample(null);
    if (!enabled) return;
    let frameId: number;
    let cancelled = false;
    let start: number | null = null;
    let frames = 0;
    const duration = Number.isFinite(sampleDuration) && sampleDuration > 0 ? sampleDuration : 1000;
    const measure = (timestamp: number) => {
      if (cancelled) return;
      if (start === null) start = timestamp;
      else {
        frames++;
        const elapsed = timestamp - start;
        if (elapsed >= duration) {
          // Every sample is delivered, including identical consecutive FPS.
          setSample({ fps: Math.round(frames * 1000 / elapsed) });
          frames = 0;
          start = timestamp;
        }
      }
      frameId = window.requestAnimationFrame(measure);
    };
    frameId = window.requestAnimationFrame(measure);
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frameId);
    };
  }, [enabled, sampleDuration]);
  return enabled ? sample : null;
}
