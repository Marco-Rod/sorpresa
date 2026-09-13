// ─── Base contract ────────────────────────────────────────────────────────────

export interface BaseParticle {
  active: boolean;
  age: number;
  lifetime: number;
}

// ─── Legacy flat model (kept for backwards compatibility) ─────────────────────
//
// PetalEngine, FireflyEngine and ConfettiEngine were written against this shape.
// New engines should extend BaseParticle with only the fields they need.

export interface Particle extends BaseParticle {
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
