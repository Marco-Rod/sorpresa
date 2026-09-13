import type { PerformanceTier } from "../engines/performanceEngine";

/**
 * DEV-only: read `?quality=high|medium|low` from the URL.
 * Returns null in production builds.
 */
export function getQueryForcedQuality(): PerformanceTier | null {
  if (!import.meta.env.DEV) return null;

  const quality = new URLSearchParams(window.location.search).get("quality");

  return quality === "high" || quality === "medium" || quality === "low"
    ? quality
    : null;
}
