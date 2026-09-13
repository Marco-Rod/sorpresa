import type { BaseParticle } from "./types";

export interface PetalParticle extends BaseParticle {
  x: number;
  y: number;

  vx: number;
  vy: number;

  baseVx: number;

  rotation: number;
  rotationSpeed: number;

  size: number;

  alpha: number;
  baseAlpha: number;

  variant: number;
}

export function createPetalParticle(): PetalParticle {
  return {
    active: false,
    age: 0,
    lifetime: 0,

    x: 0,
    y: 0,

    vx: 0,
    vy: 0,
    baseVx: 0,

    rotation: 0,
    rotationSpeed: 0,

    size: 0,

    alpha: 1,
    baseAlpha: 1,

    variant: 0,
  };
}
