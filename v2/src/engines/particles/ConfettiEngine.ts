import { ParticleEngine } from "./ParticleEngine";
import { createConfettiParticle, type ConfettiParticle } from "./confettiTypes";

const COLORS = [
  "#f48fb1",
  "#ffd1df",
  "#f4c46f",
  "#d6b5ea",
  "#ffffff",
];

export class ConfettiEngine extends ParticleEngine<ConfettiParticle> {
  constructor(canvas: HTMLCanvasElement, capacity = 140) {
    super(canvas, capacity, createConfettiParticle);
  }

  /** Confetti uses manual burst emission — no continuous spawning. */
  protected spawn(_deltaTime: number): void {
    // intentionally empty
  }

  /** Emit `count` confetti pieces from the horizontal centre of the canvas. */
  burst(count: number): void {
    const cx = this.size.width / 2;
    const oy = this.size.height * 0.48;

    for (let i = 0; i < count; i++) {
      const p = this.pool.acquire();
      if (!p) break;

      const angle = -Math.PI + Math.random() * Math.PI;
      const speed = 0.18 + Math.random() * 0.34;

      p.x = cx + (Math.random() - 0.5) * 90;
      p.y = oy;

      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed - 0.18;

      p.rotation      = Math.random() * Math.PI * 2;
      p.rotationSpeed = -0.012 + Math.random() * 0.024;

      p.size = 4 + Math.random() * 5;

      p.alpha = 1;

      p.age      = 0;
      p.lifetime = 3500 + Math.random() * 1800;

      p.colorIndex = Math.floor(Math.random() * COLORS.length);

      p.active = true;
    }
  }

  protected updateParticle(p: ConfettiParticle, deltaTime: number): void {
    const gravity = 0.00055;

    p.vy += gravity * deltaTime;
    p.x  += p.vx * deltaTime;
    p.y  += p.vy * deltaTime;
    p.rotation += p.rotationSpeed * deltaTime;

    const progress = p.age / p.lifetime;
    if (progress > 0.72) {
      p.alpha = Math.max(0, 1 - (progress - 0.72) / 0.28);
    }
  }

  protected renderParticle(p: ConfettiParticle): void {
    const ctx = this.ctx;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle   = COLORS[p.colorIndex % COLORS.length];

    ctx.fillRect(
      -p.size / 2,
      -p.size,
      p.size,
      p.size * 2,
    );

    ctx.restore();
  }
}
