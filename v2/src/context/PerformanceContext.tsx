/* oxlint-disable react/only-export-components -- Provider and consumer share an API; development edits may fully reload. */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  detectInitialPerformanceProfile,
  type PerformanceTier,
} from "../engines/performanceEngine";

import { useAppState } from "./AppStateContext";
import { useDevTools } from "./DevToolsContext";
import { useFpsMonitor } from "../hooks/useFpsMonitor";
import { getQueryForcedQuality } from "../utils/devOverrides";

/** "forced" means the quality tier is locked and won't auto-downgrade. */
export type QualityMode = "auto" | "forced";

interface PerformanceContextValue {
  quality: PerformanceTier;
  qualityMode: QualityMode;
  fps: number | null;
  reducedMotion: boolean;
  devicePixelRatio: number;
}

const PerformanceContext =
  createContext<PerformanceContextValue | null>(null);

export function PerformanceProvider({ children }: { children: ReactNode }) {
  const { isVisible }  = useAppState();
  const devTools       = useDevTools();
  const [profile]      = useState(detectInitialPerformanceProfile);

  // Priority: DevTools panel > URL query param > auto-detection
  const queryForced    = getQueryForcedQuality();
  const devForced      = devTools?.quality ?? null;
  const forcedQuality  = devForced ?? queryForced;

  const [quality, setQuality] = useState<PerformanceTier>(
    () => profile.reducedMotion ? "low" : (forcedQuality ?? profile.tier),
  );

  const [reducedMotion, setReducedMotion] = useState(profile.reducedMotion);

  const sample = useFpsMonitor({ enabled: isVisible });

  const lowSamples      = useRef(0);
  const criticalSamples = useRef(0);

  // Sync reducedMotion dynamically (user may toggle OS setting at runtime).
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync  = () => {
      setReducedMotion(media.matches);
      if (media.matches) setQuality("low");
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  // Apply DevTools / query panel override whenever it changes.
  useEffect(() => {
    if (forcedQuality) {
      setQuality(forcedQuality);
    }
  }, [forcedQuality]);

  // Adaptive downgrade — disabled when quality is forced.
  useEffect(() => {
    if (!isVisible || !sample || forcedQuality) {
      lowSamples.current = criticalSamples.current = 0;
      return;
    }

    lowSamples.current      = sample.fps < 45 ? lowSamples.current + 1      : 0;
    criticalSamples.current = sample.fps < 28 ? criticalSamples.current + 1 : 0;

    if (criticalSamples.current >= 3) {
      setQuality("low");
      lowSamples.current = criticalSamples.current = 0;
    } else if (lowSamples.current >= 4) {
      setQuality(current => current === "high" ? "medium" : "low");
      lowSamples.current = criticalSamples.current = 0;
    }
  }, [sample, isVisible, forcedQuality]);

  const value = useMemo<PerformanceContextValue>(
    () => ({
      quality:        reducedMotion ? "low" : quality,
      qualityMode:    forcedQuality ? "forced" : "auto",
      fps:            sample?.fps ?? null,
      reducedMotion,
      devicePixelRatio: profile.devicePixelRatio,
    }),
    [quality, forcedQuality, reducedMotion, sample, profile.devicePixelRatio],
  );

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  );
}

export function usePerformance() {
  const context = useContext(PerformanceContext);
  if (!context) throw new Error("usePerformance must be used inside PerformanceProvider");
  return context;
}
