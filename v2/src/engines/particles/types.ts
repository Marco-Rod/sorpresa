export interface Particle {
  baseVx: number;
  baseAlpha: number;
  variant: number;
  active: boolean;

  x: number;
  y: number;

  vx: number;
  vy: number;

  rotation: number;
  rotationSpeed: number;

  size: number;
  alpha: number;

  age: number;
  lifetime: number;
}

export interface ParticleBounds {
  width: number;
  height: number;
}
