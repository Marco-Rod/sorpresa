import { AMBIENT_EVENT_RULES } from "../../config/ambientEvents";
import type { SceneName } from "../sceneEngine";
import type { AmbientEvent, AmbientEventRule, AmbientEventType } from "./types";

interface AmbientEventEngineOptions {
  onEvent: (event: AmbientEvent) => void;
  getScene: () => SceneName;
}

interface ScheduledRule {
  rule: AmbientEventRule;
  nextAt: number;
  lastTriggeredAt: number;
}

export class AmbientEventEngine {
  private readonly onEvent: AmbientEventEngineOptions["onEvent"];
  private readonly getScene: AmbientEventEngineOptions["getScene"];

  private timerId: number | null = null;
  private running = false;
  private pausedAt: number | null = null;

  private idCounter = 0;

  /**
   * Prevents two ambient events from overlapping.
   * A new event will not fire until this timestamp has passed.
   */
  private blockedUntil = 0;

  private scheduled: ScheduledRule[];

  constructor({ onEvent, getScene }: AmbientEventEngineOptions) {
    this.onEvent = onEvent;
    this.getScene = getScene;

    const now = performance.now();

    this.scheduled = AMBIENT_EVENT_RULES.map(rule => ({
      rule,
      nextAt: now + this.randomDelay(rule),
      lastTriggeredAt: Number.NEGATIVE_INFINITY,
    }));
  }

  start() {
    if (this.running) return;

    this.running = true;
    this.scheduleNext();
  }

  pause() {
    if (!this.running) return;

    this.running = false;
    this.pausedAt = performance.now();

    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  resume() {
    if (this.running) return;

    const now = performance.now();

    // Shift all scheduled times forward by the duration of the pause
    // so events don't fire immediately after a long background period.
    if (this.pausedAt !== null) {
      const delta = now - this.pausedAt;
      for (const item of this.scheduled) {
        item.nextAt += delta;
      }
      this.blockedUntil += delta;
    }

    this.pausedAt = null;
    this.start();
  }

  destroy() {
    this.pause();
    this.scheduled = [];
  }

  // ─── DEV helper ──────────────────────────────────────────────────────────

  emitDebugEvent(type: AmbientEventType) {
    if (!import.meta.env.DEV) return;

    this.onEvent({
      id: ++this.idCounter,
      type,
      createdAt: performance.now(),
      scene: this.getScene(),
    });
  }

  // ─── Private ─────────────────────────────────────────────────────────────

  private scheduleNext() {
    if (!this.running || this.scheduled.length === 0) return;

    const now = performance.now();
    const next = Math.min(...this.scheduled.map(item => item.nextAt));
    const delay = Math.max(0, next - now);

    this.timerId = window.setTimeout(() => {
      this.tick();
    }, delay);
  }

  private tick() {
    if (!this.running) return;

    const now = performance.now();
    const scene = this.getScene();

    for (const item of this.scheduled) {
      if (now < item.nextAt) continue;

      this.evaluateRule(item, scene, now);
    }

    this.scheduleNext();
  }

  private evaluateRule(
    scheduled: ScheduledRule,
    scene: SceneName,
    now: number,
  ) {
    const { rule } = scheduled;

    // Always reschedule regardless of whether the event fires.
    scheduled.nextAt = now + this.randomDelay(rule);

    // Scene filter.
    if (!rule.scenes.includes(scene)) return;

    // Per-rule cooldown.
    if (
      rule.cooldown !== undefined &&
      now - scheduled.lastTriggeredAt < rule.cooldown
    ) {
      return;
    }

    // Global overlap guard: only one ambient event at a time.
    if (now < this.blockedUntil) return;

    // Probability roll.
    if (Math.random() > rule.probability) return;

    scheduled.lastTriggeredAt = now;

    // Block new events for ~7 s (the max animation duration).
    this.blockedUntil = now + 7_000;

    this.onEvent({
      id: ++this.idCounter,
      type: rule.type,
      createdAt: now,
      scene,
    });
  }

  private randomDelay(rule: AmbientEventRule): number {
    return rule.minDelay + Math.random() * (rule.maxDelay - rule.minDelay);
  }
}
