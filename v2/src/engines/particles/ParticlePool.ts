import type { Particle } from "./types";

export class ParticlePool {
  private readonly particles: Particle[];

  constructor(maxParticles: number) {
    if (!Number.isInteger(maxParticles) || maxParticles < 0) {
      throw new RangeError("Particle capacity must be a nonnegative integer");
    }
    this.particles = Array.from({ length: maxParticles }, () => ({
      active: false, x: 0, y: 0, vx: 0, vy: 0, baseVx: 0,
      rotation: 0, rotationSpeed: 0, size: 1, alpha: 1, baseAlpha: 1,
      age: 0, lifetime: 1000, variant: 0,
    }));
  }

  acquire(): Particle | null {
    for (const particle of this.particles) {
      if (!particle.active) {
        particle.active = true;
        particle.age = 0;
        return particle;
      }
    }
    return null;
  }

  release(particle: Particle) { particle.active = false; }
  getParticles(): readonly Particle[] { return this.particles; }
  getActiveCount() {
    let count = 0;
    for (const particle of this.particles) if (particle.active) count++;
    return count;
  }
  clear() { for (const particle of this.particles) particle.active = false; }
  trimActive(maxActive: number) {
    const limit = Number.isFinite(maxActive) ? Math.max(0, Math.floor(maxActive)) : 0;
    let count = 0;
    for (const particle of this.particles) {
      if (particle.active && ++count > limit) particle.active = false;
    }
  }
  getCapacity() { return this.particles.length; }
}
