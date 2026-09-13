import type { BaseParticle } from "./types";

export interface ConfettiParticle extends BaseParticle {
  x: number;
  y: number;

  vx: number;
  vy: number;

  rotation: number;
  rotationSpeed: number;

  size: number;

  alpha: number;

  /** Index into the COLORS palette. */
  colorIndex: number;
}

export function createConfettiParticle(): ConfettiParticle {
  return {
    active: false,
    age: 0,
    lifetime: 0,

    x: 0,
    y: 0,

    vx: 0,
    vy: 0,

    rotation: 0,
    rotationSpeed: 0,

    size: 0,

    alpha: 1,

    colorIndex: 0,
  };
}
