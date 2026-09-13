import { ParticleEngine } from "./ParticleEngine";
import type { Particle } from "./types";

export interface FireflyEngineOptions { maxParticles: number }

export class FireflyEngine extends ParticleEngine {
  private maxParticles = 0;
  private previousWidth = 0;
  private previousHeight = 0;

  constructor(canvas: HTMLCanvasElement, options: FireflyEngineOptions) {
    super(canvas, 12);
    this.setOptions(options);
  }

  setOptions({ maxParticles }: FireflyEngineOptions) {
    this.maxParticles = Math.min(this.pool.getCapacity(), Math.max(0, Math.floor(Number.isFinite(maxParticles) ? maxParticles : 0)));
    this.pool.trimActive(this.maxParticles);
    this.initialize();
  }

  initialize() {
    // Wait for real bounds, including when rendering a static first frame.
    if (this.size.width <= 0 || this.size.height <= 0) return;
    for (let missing = this.maxParticles - this.pool.getActiveCount(); missing > 0; missing--) {
      const p = this.pool.acquire();
      if (!p) break;
      p.x = Math.random() * this.size.width;
      p.y = this.size.height * (0.45 + Math.random() * 0.5);
      p.baseVx = -0.004 + Math.random() * 0.008;
      p.vx = p.baseVx;
      p.vy = -0.003 + Math.random() * 0.006;
      p.size = 1.2 + Math.random() * 1.5;
      p.baseAlpha = 0.4 + Math.random() * 0.4;
      p.alpha = p.baseAlpha;
      p.rotation = Math.random() * Math.PI * 2;
      p.rotationSpeed = 0;
      p.age = Math.random() * 3000;
      p.lifetime = 3_600_000;
      p.variant = Math.floor(Math.random() * 3);
    }
  }

  protected onResize() {
    if (this.size.width <= 0 || this.size.height <= 0) return;
    for (const p of this.pool.getParticles()) {
      if (!p.active) continue;
      if (this.previousWidth > 0) p.x *= this.size.width / this.previousWidth;
      if (this.previousHeight > 0) p.y *= this.size.height / this.previousHeight;
      this.wrap(p);
    }
    this.previousWidth = this.size.width;
    this.previousHeight = this.size.height;
    this.initialize();
  }

  protected spawn() { this.initialize(); }
  protected afterUpdate() { this.initialize(); }

  protected updateParticle(p: Particle, deltaTime: number) {
    const driftX = Math.sin(p.age * 0.0008 + p.rotation) * 0.009;
    const driftY = Math.cos(p.age * 0.00065 + p.rotation) * 0.006;
    p.x += (p.baseVx + driftX) * deltaTime;
    p.y += (p.vy + driftY) * deltaTime;
    this.wrap(p);
  }

  private wrap(p: Particle) {
    if (p.x < -10) p.x = this.size.width + 10;
    else if (p.x > this.size.width + 10) p.x = -10;
    if (p.y < this.size.height * 0.35) p.y = this.size.height * 0.9;
    else if (p.y > this.size.height + 10) p.y = this.size.height * 0.45;
  }

  protected shouldRelease() { return false; }

  protected renderParticle(p: Particle) {
    const ctx = this.ctx;
    const pulse = 0.45 + Math.sin(p.age * 0.003 + p.rotation) * 0.4;
    const alpha = Math.max(0.08, p.alpha * pulse);
    ctx.globalAlpha = alpha * 0.18;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * 3.5, 0, Math.PI * 2);
    ctx.fillStyle = "#f9ef9f";
    ctx.fill();
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = "#fff4a8";
    ctx.fill();
  }
}
