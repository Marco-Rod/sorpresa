import {
  CanvasEngine,
} from "./CanvasEngine";

interface Star {
  type: "tiny" | "normal" | "bright";
  x: number;
  y: number;

  radius: number;

  alpha: number;

  twinkleSpeed: number;
  twinkleOffset: number;

  drift: number;
}

export class StarFieldEngine
  extends CanvasEngine {
  private stars: Star[] = [];

  private elapsed = 0;
  private starCount: number;

  constructor(
    canvas: HTMLCanvasElement,
    starCount: number,
  ) {
    super(canvas);
    this.starCount = starCount;

    this.stars = this.stars.slice(0, starCount);
    while (this.stars.length < starCount) this.stars.push(this.createStar());
  }

  setStarCount(
    starCount: number,
  ) {
    if (
      starCount ===
      this.starCount
    ) {
      return;
    }

    this.starCount =
      starCount;

    this.createStars();
  }

  private createStars() {
    this.stars = this.stars.slice(0, this.starCount);
    while (this.stars.length < this.starCount) this.stars.push(this.createStar());
  }

  private createStar():
    Star {
    const random = Math.random();
    const type: Star["type"] = random > 0.92 ? "bright" : random > 0.55 ? "normal" : "tiny";
    return {
      type,
      x: Math.random(),
      y: Math.random(),

      radius:
        type === "bright" ? 1.8 + Math.random() * 0.8 : type === "normal" ? 0.8 + Math.random() * 0.7 : 0.35 + Math.random() * 0.5,

      alpha:
        0.35 +
        Math.random() * 0.65,

      twinkleSpeed:
        0.0008 +
        Math.random() *
          0.0014,

      twinkleOffset:
        Math.random() *
        Math.PI *
        2,

      drift:
        0.000001 +
        Math.random() *
          0.000003,
    };
  }

  protected update(
    deltaTime: number,
  ) {
    this.elapsed +=
      deltaTime;

    for (
      const star
      of this.stars
    ) {
      star.x +=
        star.drift *
        deltaTime;

      if (star.x > 1.02) {
        star.x = -0.02;
      }
    }
  }

  protected render() {
    const {
      width,
      height,
    } = this.size;

    const ctx =
      this.ctx;

    for (
      const star
      of this.stars
    ) {
      const x =
        star.x * width;

      const y =
        star.y * height;

      const twinkle =
        0.55 +
        Math.sin(
          this.elapsed *
            star.twinkleSpeed +
            star.twinkleOffset,
        ) *
          0.45;

      if (star.type === "bright") {
        ctx.globalAlpha = star.alpha * twinkle * 0.14;
        ctx.beginPath();
        ctx.arc(x, y, star.radius * 4, 0, Math.PI * 2);
        ctx.fillStyle = "#dbe6ff";
        ctx.fill();
        const length = star.radius * 3.2;
        ctx.globalAlpha = star.alpha * twinkle * 0.45;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(x - length, y);
        ctx.lineTo(x + length, y);
        ctx.moveTo(x, y - length);
        ctx.lineTo(x, y + length);
        ctx.stroke();
      }

      ctx.globalAlpha =
        star.alpha *
        twinkle;

      ctx.beginPath();

      ctx.arc(
        x,
        y,
        star.radius,
        0,
        Math.PI * 2,
      );

      ctx.fillStyle =
        star.type === "bright" ? "#edf3ff" : "#ffffff";

      ctx.fill();
    }

    ctx.globalAlpha = 1;
  }
}
