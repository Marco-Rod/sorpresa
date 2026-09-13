export type PerformanceTier =
  | "high"
  | "medium"
  | "low";

export interface PerformanceProfile {
  tier: PerformanceTier;

  hardwareConcurrency: number;
  devicePixelRatio: number;

  reducedMotion: boolean;

  screenWidth: number;
  screenHeight: number;
  deviceMemory?: number;
}

export function detectInitialPerformanceProfile():
  PerformanceProfile {
  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

  const hardwareConcurrency =
    navigator.hardwareConcurrency || 4;

  const devicePixelRatio =
    window.devicePixelRatio || 1;

  const screenWidth =
    window.screen.width;

  const screenHeight =
    window.screen.height;

  const tier =
    calculateInitialTier({
      reducedMotion,
      hardwareConcurrency,
      devicePixelRatio,
      screenWidth,
      screenHeight,
      deviceMemory: (navigator as Navigator & { deviceMemory?: number }).deviceMemory,
    });

  return {
    tier,
    deviceMemory: (navigator as Navigator & { deviceMemory?: number }).deviceMemory,
    hardwareConcurrency,
    devicePixelRatio,
    reducedMotion,
    screenWidth,
    screenHeight,
  };
}

interface CalculateTierInput {
  deviceMemory?: number;
  reducedMotion: boolean;
  hardwareConcurrency: number;
  devicePixelRatio: number;
  screenWidth: number;
  screenHeight: number;
}

export function calculateInitialTier({
  deviceMemory,
  reducedMotion,
  hardwareConcurrency,
  devicePixelRatio,
  screenWidth,
  screenHeight,
}: CalculateTierInput): PerformanceTier {
  if (reducedMotion) {
    return "low";
  }

  let score = 0;
  if (deviceMemory !== undefined) {
    if (deviceMemory <= 2) score -= 2;
    else if (deviceMemory >= 8) score += 1;
  }

  if (hardwareConcurrency >= 8) {
    score += 2;
  } else if (
    hardwareConcurrency >= 4
  ) {
    score += 1;
  } else {
    score -= 2;
  }

  const totalPixels =
    screenWidth *
    screenHeight *
    devicePixelRatio *
    devicePixelRatio;

  if (totalPixels > 4_000_000) {
    score -= 1;
  }

  if (devicePixelRatio >= 3) {
    score -= 1;
  }

  if (score >= 2) {
    return "high";
  }

  if (score >= 0) {
    return "medium";
  }

  return "low";
}
