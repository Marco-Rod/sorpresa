/* oxlint-disable react/only-export-components -- Provider and consumer share an API; development edits may fully reload. */
import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { detectInitialPerformanceProfile, type PerformanceTier } from "../engines/performanceEngine";
import { useAppState } from "./AppStateContext";
import { useFpsMonitor } from "../hooks/useFpsMonitor";

interface PerformanceContextValue {
  quality: PerformanceTier;
  fps: number | null;
  reducedMotion: boolean;
  devicePixelRatio: number;
}
const PerformanceContext = createContext<PerformanceContextValue | null>(null);

export function PerformanceProvider({ children }: { children: ReactNode }) {
  const { isVisible } = useAppState();
  const [profile] = useState(detectInitialPerformanceProfile);
  const [quality, setQuality] = useState(profile.tier);
  const [reducedMotion, setReducedMotion] = useState(profile.reducedMotion);
  const sample = useFpsMonitor({ enabled: isVisible });
  const lowSamples = useRef(0);
  const criticalSamples = useRef(0);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setReducedMotion(media.matches);
      if (media.matches) setQuality("low");
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  useEffect(() => {
    if (!isVisible || !sample) {
      lowSamples.current = criticalSamples.current = 0;
      return;
    }
    lowSamples.current = sample.fps < 45 ? lowSamples.current + 1 : 0;
    criticalSamples.current = sample.fps < 28 ? criticalSamples.current + 1 : 0;
    if (criticalSamples.current >= 3) {
      setQuality("low");
      lowSamples.current = criticalSamples.current = 0;
    } else if (lowSamples.current >= 4) {
      setQuality(current => current === "high" ? "medium" : "low");
      lowSamples.current = criticalSamples.current = 0;
    }
  }, [sample, isVisible]);
  const value = useMemo(() => ({
    quality: reducedMotion ? "low" as const : quality,
    fps: sample?.fps ?? null,
    reducedMotion,
    devicePixelRatio: profile.devicePixelRatio,
  }), [quality, reducedMotion, sample, profile.devicePixelRatio]);
  return <PerformanceContext.Provider value={value}>{children}</PerformanceContext.Provider>;
}

export function usePerformance() {
  const context = useContext(PerformanceContext);
  if (!context) throw new Error("usePerformance must be used inside PerformanceProvider");
  return context;
}
