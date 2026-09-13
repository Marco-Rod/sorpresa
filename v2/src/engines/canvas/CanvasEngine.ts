export interface CanvasSize {
  width: number;
  height: number;
  pixelRatio: number;
}

export abstract class CanvasEngine {
  protected canvas: HTMLCanvasElement;

  protected ctx: CanvasRenderingContext2D;

  protected size: CanvasSize = {
    width: 0,
    height: 0,
    pixelRatio: 1,
  };

  private animationFrameId:
    number | null = null;

  private running = false;
  private destroyed = false;

  private lastTimestamp = 0;

  constructor(
    canvas: HTMLCanvasElement,
  ) {
    const ctx =
      canvas.getContext("2d");

    if (!ctx) {
      throw new Error(
        "Canvas 2D context is not available",
      );
    }

    this.canvas = canvas;
    this.ctx = ctx;
  }

  resize(
    width: number,
    height: number,
    pixelRatio = 1,
  ) {
    if (this.destroyed) return;
    width = Math.max(0, Number.isFinite(width) ? width : 0);
    height = Math.max(0, Number.isFinite(height) ? height : 0);
    pixelRatio = Number.isFinite(pixelRatio) && pixelRatio > 0 ? pixelRatio : 1;
    this.size = {
      width,
      height,
      pixelRatio,
    };

    this.canvas.width =
      Math.floor(
        width * pixelRatio,
      );

    this.canvas.height =
      Math.floor(
        height * pixelRatio,
      );

    this.canvas.style.width =
      `${width}px`;

    this.canvas.style.height =
      `${height}px`;

    this.ctx.setTransform(
      pixelRatio,
      0,
      0,
      pixelRatio,
      0,
      0,
    );

    this.onResize();
    this.renderOnce();
  }

  start() {
    if (this.running || this.destroyed) {
      return;
    }

    this.renderOnce();
    this.running = true;

    this.lastTimestamp =
      performance.now();

    this.animationFrameId =
      requestAnimationFrame(
        this.frame,
      );
  }

  stop() {
    this.running = false;

    if (
      this.animationFrameId !==
      null
    ) {
      cancelAnimationFrame(
        this.animationFrameId,
      );

      this.animationFrameId =
        null;
    }
  }

  private frame = (
    timestamp: number,
  ) => {
    if (!this.running) {
      return;
    }

    const deltaTime =
      Math.max(0, Math.min(
        timestamp -
          this.lastTimestamp,
        100,
      ));

    this.lastTimestamp =
      timestamp;

    this.update(deltaTime);

    this.clear();

    this.render();

    if (!this.running) return;
    this.animationFrameId =
      requestAnimationFrame(
        this.frame,
      );
  };

  protected clear() {
    this.ctx.clearRect(
      0,
      0,
      this.size.width,
      this.size.height,
    );
  }

  public renderOnce() {
    if (this.destroyed) return;
    this.clear();
    this.render();
  }

  pause() { this.stop(); }
  resume() { this.start(); }

  protected abstract update(
    deltaTime: number,
  ): void;

  protected abstract render():
    void;

  protected onResize() {
    // optional
  }

  destroy() {
    this.stop();
    this.destroyed = true;
  }
}
