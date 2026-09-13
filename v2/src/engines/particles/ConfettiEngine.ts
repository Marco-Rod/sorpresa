import { ParticleEngine } from "./ParticleEngine";
import type { Particle } from "./types";

const COLORS = [
  "#f48fb1",
  "#ffd1df",
  "#f4c46f",
  "#d6b5ea",
  "#ffffff",
];

export class ConfettiEngine extends ParticleEngine {
  constructor(
    canvas: HTMLCanvasElement,
    capacity = 140,
  ) {
    super(canvas, capacity);
  }

  /**
   * Confetti uses manual burst emission, not continuous spawning.
   * This override is intentionally empty.
   */
  protected spawn(_deltaTime: number): void {
    // no-op
  }

  /**
   * Emit `count` confetti pieces from the horizontal center of the canvas.
   */
  burst(count: number): void {
    const centerX = this.size.width / 2;
    const originY = this.size.height * 0.48;

    for (let i = 0; i < count; i++) {
      const particle = this.pool.acquire();
      if (!particle) break;

      const angle = -Math.PI + Math.random() * Math.PI;
      const speed = 0.18 + Math.random() * 0.34;

      particle.x = centerX + (Math.random() - 0.5) * 90;
      particle.y = originY;

      particle.vx = Math.cos(angle) * speed;
      particle.baseVx = particle.vx;

      particle.vy = Math.sin(angle) * speed - 0.18;

      particle.rotation = Math.random() * Math.PI * 2;
      particle.rotationSpeed = -0.012 + Math.random() * 0.024;

      particle.size = 4 + Math.random() * 5;

      particle.alpha = 1;
      particle.baseAlpha = 1;

      particle.age = 0;
      particle.lifetime = 3500 + Math.random() * 1800;

      particle.variant = Math.floor(Math.random() * COLORS.length);

      particle.active = true;
    }
  }

  protected updateParticle(
    particle: Particle,
    deltaTime: number,
  ): void {
    const gravity = 0.00055;

    particle.vy += gravity * deltaTime;
    particle.x += particle.vx * deltaTime;
    particle.y += particle.vy * deltaTime;
    particle.rotation += particle.rotationSpeed * deltaTime;

    const progress = particle.age / particle.lifetime;

    if (progress > 0.72) {
      particle.alpha = Math.max(0, 1 - (progress - 0.72) / 0.28);
    }
  }

  protected renderParticle(particle: Particle): void {
    const ctx = this.ctx;

    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.rotation);
    ctx.globalAlpha = particle.alpha;

    ctx.fillStyle = COLORS[particle.variant % COLORS.length];

    // Render as a thin rectangle to look like a confetti piece.
    ctx.fillRect(
      -particle.size / 2,
      -particle.size,
      particle.size,
      particle.size * 2,
    );

    ctx.restore();
  }
}
