import { ParticleEngine } from "./ParticleEngine";
import type { Particle } from "./types";

export interface PetalEngineOptions {
  maxParticles: number;
  spawnRate: number;
}
const COLORS = ["#f6a6c1", "#f8bfd1", "#e98bae"] as const;

export class PetalEngine extends ParticleEngine {
  private options: PetalEngineOptions;
  private spawnAccumulator = 0;
  private wind = 0;

  constructor(canvas: HTMLCanvasElement, options: PetalEngineOptions, capacity = 24) {
    super(canvas, capacity);
    this.options = options;
    this.setOptions(options);
  }

  setOptions(options: PetalEngineOptions) {
    this.options = {
      maxParticles: Math.min(this.pool.getCapacity(), Math.max(0, Math.floor(Number.isFinite(options.maxParticles) ? options.maxParticles : 0))),
      spawnRate: Number.isFinite(options.spawnRate) ? Math.max(0, options.spawnRate) : 0,
    };
    this.spawnAccumulator = 0;
    let kept = 0;
    for (const particle of this.pool.getParticles()) {
      if (particle.active && ++kept > this.options.maxParticles) this.pool.release(particle);
    }
  }

  protected beforeUpdate(deltaTime: number) {
    const target = Math.sin(this.elapsed * 0.00017) * 0.018;
    this.wind += (target - this.wind) * (1 - Math.exp(-deltaTime * 0.002));
  }

  protected spawn(deltaTime: number) {
    if (this.size.width <= 0 || this.size.height <= 0 || this.options.spawnRate <= 0) return;
    this.spawnAccumulator += deltaTime * this.options.spawnRate / 1000;
    const due = Math.floor(this.spawnAccumulator);
    this.spawnAccumulator -= due;
    // Discard missed emissions when full; never accumulate a burst backlog.
    const count = Math.min(due, this.options.maxParticles - this.pool.getActiveCount());
    for (let i = 0; i < count; i++) this.spawnPetal();
  }

  private spawnPetal() {
    const p = this.pool.acquire();
    if (!p) return;
    p.x = Math.random() * this.size.width;
    p.y = -20 - Math.random() * 40;
    p.baseVx = -0.015 + Math.random() * 0.03;
    p.vx = p.baseVx;
    p.vy = 0.025 + Math.random() * 0.035;
    p.rotation = Math.random() * Math.PI * 2;
    p.rotationSpeed = -0.001 + Math.random() * 0.002;
    p.size = 5 + Math.random() * 5;
    p.baseAlpha = 0.45 + Math.random() * 0.45;
    p.alpha = p.baseAlpha;
    p.age = 0;
    p.lifetime = 9000 + Math.random() * 7000;
    p.variant = Math.floor(Math.random() * COLORS.length);
  }

  protected updateParticle(p: Particle, deltaTime: number) {
    const sway = Math.sin(p.age * 0.0025 + p.rotation) * 0.02;
    p.vx = p.baseVx + sway + this.wind;
    p.x += p.vx * deltaTime;
    p.y += p.vy * deltaTime;
    p.rotation += p.rotationSpeed * deltaTime;
    const progress = p.age / p.lifetime;
    p.alpha = p.baseAlpha * Math.min(1, Math.max(0, (1 - progress) / 0.2));
  }

  protected renderParticle(p: Particle) {
    const ctx = this.ctx;
    const width = p.size;
    const height = width * 0.65;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = p.alpha;
    ctx.beginPath();
    ctx.moveTo(0, -height);
    ctx.bezierCurveTo(width, -height * 0.4, width, height * 0.8, 0, height);
    ctx.bezierCurveTo(-width, height * 0.8, -width, -height * 0.4, 0, -height);
    ctx.fillStyle = COLORS[p.variant];
    ctx.fill();
    ctx.restore();
  }

  reset() {
    this.spawnAccumulator = 0;
    this.wind = 0;
    super.reset();
  }
}
