/* oxlint-disable react/only-export-components -- Provider and consumer share an API */
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import type { SceneName } from "../engines/sceneEngine";
import type { PerformanceTier } from "../engines/performanceEngine";

interface DevToolsState {
  scene: SceneName | null;
  quality: PerformanceTier | null;
}

interface DevToolsContextValue extends DevToolsState {
  setScene: (scene: SceneName | null) => void;
  setQuality: (quality: PerformanceTier | null) => void;
}

const DevToolsContext =
  createContext<DevToolsContextValue | null>(null);

interface DevToolsProviderProps {
  children: ReactNode;
}

export function DevToolsProvider({ children }: DevToolsProviderProps) {
  const [scene,   setScene]   = useState<SceneName | null>(null);
  const [quality, setQuality] = useState<PerformanceTier | null>(null);

  // In production the provider is a transparent passthrough.
  if (!import.meta.env.DEV) {
    return <>{children}</>;
  }

  return (
    <DevToolsContext.Provider
      value={{ scene, quality, setScene, setQuality }}
    >
      {children}
    </DevToolsContext.Provider>
  );
}

/** Returns null outside DEV builds or when used outside the provider. */
export function useDevTools(): DevToolsContextValue | null {
  return useContext(DevToolsContext);
}
