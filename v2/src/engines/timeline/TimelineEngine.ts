export interface TimelineCue {
  id: string;

  /** Milliseconds from the start at which this cue fires. */
  at: number;

  run: () => void;
}

export interface TimelineProgress {
  elapsed: number;
  duration: number;
  progress: number;
}

interface TimelineEngineOptions {
  duration: number;

  cues?: TimelineCue[];

  onUpdate?: (state: TimelineProgress) => void;

  onComplete?: () => void;
}

export class TimelineEngine {
  private readonly duration: number;
  private readonly cues: TimelineCue[];
  private readonly onUpdate?: (state: TimelineProgress) => void;
  private readonly onComplete?: () => void;

  private frameId: number | null = null;
  private running = false;
  private completed = false;

  private startTimestamp = 0;
  private elapsedBeforePause = 0;

  private readonly firedCues = new Set<string>();

  constructor({
    duration,
    cues = [],
    onUpdate,
    onComplete,
  }: TimelineEngineOptions) {
    this.duration = Math.max(0, duration);
    // Sort ascending so firePendingCues can break early.
    this.cues = [...cues].sort((a, b) => a.at - b.at);
    this.onUpdate = onUpdate;
    this.onComplete = onComplete;
  }

  start() {
    if (this.running || this.completed) {
      return;
    }

    this.running = true;
    this.startTimestamp = performance.now();
    this.frameId = requestAnimationFrame(this.frame);
  }

  pause() {
    if (!this.running) {
      return;
    }

    this.elapsedBeforePause = this.getElapsed(performance.now());
    this.running = false;

    if (this.frameId !== null) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
  }

  resume() {
    if (this.running || this.completed) {
      return;
    }

    this.running = true;
    this.startTimestamp = performance.now();
    this.frameId = requestAnimationFrame(this.frame);
  }

  reset() {
    this.stop();
    this.completed = false;
    this.elapsedBeforePause = 0;
    this.firedCues.clear();
    this.emitUpdate(0);
  }

  stop() {
    this.running = false;

    if (this.frameId !== null) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
  }

  destroy() {
    this.stop();
    this.firedCues.clear();
  }

  getProgress(): TimelineProgress {
    const elapsed = this.running
      ? this.getElapsed(performance.now())
      : this.elapsedBeforePause;

    return {
      elapsed,
      duration: this.duration,
      progress:
        this.duration > 0
          ? Math.min(1, elapsed / this.duration)
          : 1,
    };
  }

  // ─── Private ────────────────────────────────────────────────────────────────

  private frame = (timestamp: number) => {
    if (!this.running) {
      return;
    }

    const elapsed = this.getElapsed(timestamp);

    this.firePendingCues(elapsed);
    this.emitUpdate(elapsed);

    if (elapsed >= this.duration) {
      this.complete();
      return;
    }

    this.frameId = requestAnimationFrame(this.frame);
  };

  private getElapsed(timestamp: number): number {
    return Math.min(
      this.duration,
      this.elapsedBeforePause + (timestamp - this.startTimestamp),
    );
  }

  private firePendingCues(elapsed: number) {
    for (const cue of this.cues) {
      if (cue.at > elapsed) {
        // Cues are sorted; nothing further will be due yet.
        break;
      }

      if (this.firedCues.has(cue.id)) {
        continue;
      }

      this.firedCues.add(cue.id);
      cue.run();
    }
  }

  private emitUpdate(elapsed: number) {
    this.onUpdate?.({
      elapsed,
      duration: this.duration,
      progress:
        this.duration > 0
          ? Math.min(1, elapsed / this.duration)
          : 1,
    });
  }

  private complete() {
    this.running = false;
    this.completed = true;
    this.elapsedBeforePause = this.duration;
    this.frameId = null;

    this.emitUpdate(this.duration);
    this.onComplete?.();
  }
}
