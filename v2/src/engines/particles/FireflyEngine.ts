import { ParticleEngine } from "./ParticleEngine";
import { createFireflyParticle, type FireflyParticle } from "./fireflyTypes";

export interface FireflyEngineOptions {
  maxParticles: number;
}

export class FireflyEngine extends ParticleEngine<FireflyParticle> {
  private maxParticles = 0;

  /** Prevents spawning before we have real canvas dimensions. */
  private initialized = false;

  private previousWidth = 0;
  private previousHeight = 0;

  constructor(canvas: HTMLCanvasElement, options: FireflyEngineOptions) {
    super(canvas, 16, createFireflyParticle);
    this.setOptions(options);
  }

  setOptions({ maxParticles }: FireflyEngineOptions) {
    this.maxParticles = Math.min(
      this.pool.getCapacity(),
      Math.max(0, Math.floor(Number.isFinite(maxParticles) ? maxParticles : 0)),
    );
    this.pool.trimActive(this.maxParticles);
    // Populate if we already have valid dimensions.
    if (this.initialized) this.syncPopulation();
  }

  // Called by CanvasEngine after every resize.
  protected override onResize() {
    if (this.size.width <= 0 || this.size.height <= 0) return;

    // Proportionally reposition existing particles on resize.
    for (const p of this.pool.getParticles()) {
      if (!p.active) continue;
      if (this.previousWidth > 0)  p.x *= this.size.width  / this.previousWidth;
      if (this.previousHeight > 0) p.y *= this.size.height / this.previousHeight;
      this.wrapParticle(p);
    }

    this.previousWidth  = this.size.width;
    this.previousHeight = this.size.height;

    this.initialized = true;
    this.syncPopulation();
  }

  /** Public alias kept for test compatibility. */
  initialize() {
    if (this.initialized) this.syncPopulation();
  }

  protected spawn() {
    if (this.initialized) this.syncPopulation();
  }

  private syncPopulation() {
    const missing = Math.max(
      0,
      this.maxParticles - this.pool.getActiveCount(),
    );
    for (let i = 0; i < missing; i++) this.spawnFirefly();
  }

  private spawnFirefly() {
    const p = this.pool.acquire();
    if (!p) return;

    p.x = Math.random() * this.size.width;
    p.y = this.size.height * (0.48 + Math.random() * 0.46);

    p.baseVx = -0.004 + Math.random() * 0.008;
    p.vx = p.baseVx;
    p.vy = -0.003 + Math.random() * 0.006;

    p.size  = 1.2 + Math.random() * 1.5;
    p.alpha = 0.42 + Math.random() * 0.42;
    p.phase = Math.random() * Math.PI * 2;

    p.age      = Math.random() * 3000; // stagger pulses
    p.lifetime = Number.POSITIVE_INFINITY;
    p.active   = true;
  }

  protected override shouldRelease(_p: FireflyParticle): boolean {
    return false; // fireflies wrap, they never retire
  }

  protected updateParticle(p: FireflyParticle, deltaTime: number) {
    const driftX = Math.sin(p.age * 0.0008 + p.phase) * 0.009;
    const driftY = Math.cos(p.age * 0.00065 + p.phase) * 0.006;

    p.x += (p.baseVx + driftX) * deltaTime;
    p.y += (p.vy     + driftY) * deltaTime;

    this.wrapParticle(p);
  }

  private wrapParticle(p: FireflyParticle) {
    if (p.x < -10)                    p.x = this.size.width + 10;
    else if (p.x > this.size.width + 10) p.x = -10;

    const minY = this.size.height * 0.38;
    const maxY = this.size.height + 10;

    if (p.y < minY) p.y = this.size.height * 0.9;
    else if (p.y > maxY) p.y = this.size.height * 0.48;
  }

  protected renderParticle(p: FireflyParticle) {
    const pulse = 0.5 + Math.sin(p.age * 0.003 + p.phase) * 0.4;
    const alpha = Math.max(0.08, p.alpha * pulse);
    const ctx   = this.ctx;

    // Soft glow
    ctx.globalAlpha = alpha * 0.18;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * 3.5, 0, Math.PI * 2);
    ctx.fillStyle = "#f9ef9f";
    ctx.fill();

    // Core
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = "#fff4a8";
    ctx.fill();
  }
}
