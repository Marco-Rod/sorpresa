import { CanvasEngine } from "../canvas/CanvasEngine";
import { ParticlePool } from "./ParticlePool";
import type { BaseParticle } from "./types";

export abstract class ParticleEngine<
  T extends BaseParticle,
> extends CanvasEngine {
  protected pool: ParticlePool<T>;

  protected elapsed = 0;

  constructor(
    canvas: HTMLCanvasElement,
    capacity: number,
    factory: () => T,
  ) {
    super(canvas);
    this.pool = new ParticlePool<T>(capacity, factory);
  }

  protected update(deltaTime: number) {
    this.elapsed += deltaTime;
    this.beforeUpdate(deltaTime);
    this.spawn(deltaTime);

    for (const particle of this.pool.getParticles()) {
      if (!particle.active) continue;

      particle.age += deltaTime;

      if (
        Number.isFinite(particle.lifetime) &&
        particle.age >= particle.lifetime
      ) {
        this.pool.release(particle);
        continue;
      }

      this.updateParticle(particle, deltaTime);

      if (this.shouldRelease(particle)) {
        this.pool.release(particle);
      }
    }

    this.afterUpdate(deltaTime);
  }

  protected render() {
    const ctx = this.ctx;

    // save/restore isolates globalAlpha, transforms and compositeOperation
    // so no particle can bleed state into the next one.
    ctx.save();

    for (const particle of this.pool.getParticles()) {
      if (!particle.active) continue;
      this.renderParticle(particle);
    }

    ctx.restore();
  }

  reset() {
    this.pool.clear();
    this.elapsed = 0;
    this.renderOnce();
  }

  destroy() {
    this.pool.clear();
    super.destroy();
  }

  // ─── Overrideable hooks ────────────────────────────────────────────────────

  protected beforeUpdate(_deltaTime: number): void {}
  protected afterUpdate(_deltaTime: number): void {}

  protected shouldRelease(_particle: T): boolean {
    return false;
  }

  protected abstract spawn(deltaTime: number): void;
  protected abstract updateParticle(particle: T, deltaTime: number): void;
  protected abstract renderParticle(particle: T): void;
}
