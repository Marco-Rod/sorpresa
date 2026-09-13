import type { BaseParticle } from "./types";

export class ParticlePool<T extends BaseParticle> {
  private readonly particles: T[];

  constructor(
    capacity: number,
    factory?: () => T,
  ) {
    if (!Number.isInteger(capacity) || capacity < 0) {
      throw new RangeError("Particle capacity must be a nonnegative integer");
    }

    // If no factory is provided, fall back to a minimal BaseParticle.
    const create =
      factory ??
      (() => ({ active: false, age: 0, lifetime: 1000 }) as unknown as T);

    this.particles = Array.from({ length: capacity }, create);
  }

  acquire(): T | null {
    for (const particle of this.particles) {
      if (!particle.active) {
        particle.active = true;
        particle.age = 0;
        return particle;
      }
    }
    return null;
  }

  release(particle: T) {
    particle.active = false;
    particle.age = 0;
  }

  getParticles(): readonly T[] {
    return this.particles;
  }

  getActiveCount(): number {
    let count = 0;
    for (const p of this.particles) {
      if (p.active) count++;
    }
    return count;
  }

  trimActive(maxActive: number) {
    const limit =
      Number.isFinite(maxActive)
        ? Math.max(0, Math.floor(maxActive))
        : 0;
    let count = 0;
    for (const p of this.particles) {
      if (p.active && ++count > limit) {
        p.active = false;
      }
    }
  }

  clear() {
    for (const p of this.particles) {
      p.active = false;
      p.age = 0;
    }
  }

  getCapacity(): number {
    return this.particles.length;
  }
}
