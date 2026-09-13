export interface CanvasSize {
  width: number;
  height: number;
  pixelRatio: number;
}

export abstract class CanvasEngine {
  protected canvas: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D;

  protected size: CanvasSize = { width: 0, height: 0, pixelRatio: 1 };

  private animationFrameId: number | null = null;
  private running = false;
  private destroyed = false;

  private lastRenderTime = 0;
  /** Minimum ms between rendered frames (1000 / targetFps). Default: 60 fps. */
  private targetFrameDuration = 1000 / 60;

  constructor(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context is not available");

    this.canvas = canvas;
    this.ctx    = ctx;
  }

  // ─── FPS cap ──────────────────────────────────────────────────────────────

  setTargetFps(fps: number) {
    this.targetFrameDuration = 1000 / Math.max(1, fps);
  }

  // ─── Size ─────────────────────────────────────────────────────────────────

  resize(width: number, height: number, pixelRatio = 1) {
    if (this.destroyed) return;

    width      = Number.isFinite(width)      && width > 0      ? width      : 0;
    height     = Number.isFinite(height)     && height > 0     ? height     : 0;
    pixelRatio = Number.isFinite(pixelRatio) && pixelRatio > 0 ? pixelRatio : 1;

    this.size = { width, height, pixelRatio };

    this.canvas.width  = Math.floor(width  * pixelRatio);
    this.canvas.height = Math.floor(height * pixelRatio);

    this.canvas.style.width  = `${width}px`;
    this.canvas.style.height = `${height}px`;

    this.ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    this.onResize();
    this.renderOnce();
  }

  // ─── Lifecycle ────────────────────────────────────────────────────────────

  start() {
    if (this.running || this.destroyed) return;

    this.renderOnce();
    this.running = true;
    this.lastRenderTime = performance.now();
    this.animationFrameId = requestAnimationFrame(this.frame);
  }

  stop() {
    this.running = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  pause() { this.stop(); }
  resume() { this.start(); }

  destroy() {
    this.stop();
    this.destroyed = true;
  }

  renderOnce() {
    if (this.destroyed) return;
    this.clear();
    this.render();
  }

  // ─── Frame loop ───────────────────────────────────────────────────────────

  private frame = (timestamp: number) => {
    if (!this.running) return;

    const elapsed = timestamp - this.lastRenderTime;

    if (elapsed >= this.targetFrameDuration) {
      const deltaTime = Math.min(elapsed, 100); // cap at 100 ms to absorb tab wake-ups

      // Preserve sub-frame remainder to avoid cumulative drift.
      this.lastRenderTime =
        timestamp - (elapsed % this.targetFrameDuration);

      this.update(deltaTime);
      this.clear();
      this.render();
    }

    if (!this.running) return;
    this.animationFrameId = requestAnimationFrame(this.frame);
  };

  // ─── Helpers ──────────────────────────────────────────────────────────────

  protected clear() {
    this.ctx.clearRect(0, 0, this.size.width, this.size.height);
  }

  // ─── Abstract / overrideable ──────────────────────────────────────────────

  protected abstract update(deltaTime: number): void;
  protected abstract render(): void;

  /** Called after every successful resize with non-zero dimensions. */
  protected onResize(): void {}
}
