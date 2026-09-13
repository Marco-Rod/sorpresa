/* oxlint-disable react/only-export-components -- Provider and consumer share an API */
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { SceneName } from "../engines/sceneEngine";
import type { PerformanceTier } from "../engines/performanceEngine";
import {
  type ExperienceClock,
  makeBirthdayClock,
  makeFinal10Clock,
  makeFinal60Clock,
  systemClock,
} from "../time/ExperienceClock";

export type TimePreset = "real" | "final-60" | "final-10" | "birthday";

interface DevToolsState {
  scene:       SceneName | null;
  quality:     PerformanceTier | null;
  timePreset:  TimePreset;
}

interface DevToolsContextValue extends DevToolsState {
  setScene:      (scene:   SceneName | null)      => void;
  setQuality:    (quality: PerformanceTier | null) => void;
  setTimePreset: (preset:  TimePreset)             => void;

  /** The ExperienceClock that corresponds to the current timePreset. */
  clock: ExperienceClock;
}

const DevToolsContext =
  createContext<DevToolsContextValue | null>(null);

interface DevToolsProviderProps {
  children: ReactNode;
}

export function DevToolsProvider({ children }: DevToolsProviderProps) {
  const [scene,      setScene]      = useState<SceneName | null>(null);
  const [quality,    setQuality]    = useState<PerformanceTier | null>(null);
  const [timePreset, setTimePreset] = useState<TimePreset>("real");

  // In production the provider is a transparent passthrough.
  if (!import.meta.env.DEV) {
    return <>{children}</>;
  }

  // Build a fresh clock every time the preset changes.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const clock = useMemo<ExperienceClock>(() => {
    switch (timePreset) {
      case "final-10":  return makeFinal10Clock();
      case "final-60":  return makeFinal60Clock();
      case "birthday":  return makeBirthdayClock();
      default:          return systemClock;
    }
  }, [timePreset]);

  return (
    <DevToolsContext.Provider
      value={{ scene, quality, timePreset, setScene, setQuality, setTimePreset, clock }}
    >
      {children}
    </DevToolsContext.Provider>
  );
}

/** Returns null outside DEV builds or when used outside the provider. */
export function useDevTools(): DevToolsContextValue | null {
  return useContext(DevToolsContext);
}
