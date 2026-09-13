import type {
  PerformanceTier,
} from "../engines/performanceEngine";

export interface VisualQualityConfig {
  maxDevicePixelRatio: number;

  stars: number;
  petals: number;
  petalSpawnRate: number;
  fireflies: number;
  butterflies: number;

  enableBlur: boolean;
  enableShadows: boolean;

  particleMultiplier: number;
}

export const PERFORMANCE_CONFIG:
  Record<
    PerformanceTier,
    VisualQualityConfig
  > = {
  high: {
    maxDevicePixelRatio: 2,

    stars: 70,
    petals: 24,
    petalSpawnRate: 2.5,
    fireflies: 12,
    butterflies: 4,

    enableBlur: true,
    enableShadows: true,

    particleMultiplier: 1,
  },

  medium: {
    maxDevicePixelRatio: 1.5,

    stars: 42,
    petals: 14,
    petalSpawnRate: 1.4,
    fireflies: 7,
    butterflies: 2,

    enableBlur: false,
    enableShadows: true,

    particleMultiplier: 0.65,
  },

  low: {
    maxDevicePixelRatio: 1,

    stars: 22,
    petals: 7,
    petalSpawnRate: 0.6,
    fireflies: 3,
    butterflies: 0,

    enableBlur: false,
    enableShadows: false,

    particleMultiplier: 0.35,
  },
};
