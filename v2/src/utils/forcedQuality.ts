import type { PerformanceTier } from "../engines/performanceEngine";

export function getForcedQuality(): PerformanceTier | null {
  if (!import.meta.env.DEV) return null;
  const quality = new URLSearchParams(window.location.search).get("quality");
  return quality === "high" || quality === "medium" || quality === "low" ? quality : null;
}
