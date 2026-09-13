import type { BaseParticle } from "./types";

export interface FireflyParticle extends BaseParticle {
  x: number;
  y: number;

  vx: number;
  vy: number;

  baseVx: number;

  size: number;

  alpha: number;

  /** Phase offset for sine-wave drift and pulse animation. */
  phase: number;
}

export function createFireflyParticle(): FireflyParticle {
  return {
    active: false,
    age: 0,
    lifetime: Number.POSITIVE_INFINITY,

    x: 0,
    y: 0,

    vx: 0,
    vy: 0,
    baseVx: 0,

    size: 0,

    alpha: 1,

    phase: 0,
  };
}
