import {
  CanvasEngine,
} from "../canvas/CanvasEngine";

import {
  ParticlePool,
} from "./ParticlePool";

import type {
  Particle,
} from "./types";

export abstract class ParticleEngine
  extends CanvasEngine {
  protected pool:
    ParticlePool;

  protected elapsed = 0;

  constructor(
    canvas: HTMLCanvasElement,
    maxParticles: number,
  ) {
    super(canvas);

    this.pool =
      new ParticlePool(
        maxParticles,
      );
  }

  protected update(
    deltaTime: number,
  ) {
    this.elapsed +=
      deltaTime;
    this.beforeUpdate(deltaTime);

    this.spawn(
      deltaTime,
    );

    for (
      const particle
      of this.pool
        .getParticles()
    ) {
      if (
        !particle.active
      ) {
        continue;
      }

      particle.age +=
        deltaTime;

      if (
        particle.age >=
        particle.lifetime
      ) {
        this.pool.release(
          particle,
        );

        continue;
      }

      this.updateParticle(
        particle,
        deltaTime,
      );

      if (
        this.shouldRelease(
          particle,
        )
      ) {
        this.pool.release(
          particle,
        );
      }
    }
    this.afterUpdate(deltaTime);
  }

  protected beforeUpdate(_deltaTime: number) {}
  protected afterUpdate(_deltaTime: number) {}

  reset() {
    this.pool.clear();
    this.elapsed = 0;
    this.renderOnce();
  }

  destroy() {
    this.pool.clear();
    super.destroy();
  }

  protected render() {
    for (
      const particle
      of this.pool
        .getParticles()
    ) {
      if (
        !particle.active
      ) {
        continue;
      }

      this.renderParticle(
        particle,
      );
    }

    this.ctx.globalAlpha = 1;
  }

  protected abstract spawn(
    deltaTime: number,
  ): void;

  protected abstract updateParticle(
    particle: Particle,
    deltaTime: number,
  ): void;

  protected abstract renderParticle(
    particle: Particle,
  ): void;

  protected shouldRelease(
    particle: Particle,
  ) {
    return (
      particle.x < -100 ||
      particle.x >
        this.size.width + 100 ||
      particle.y < -100 ||
      particle.y >
        this.size.height + 100
    );
  }
}
