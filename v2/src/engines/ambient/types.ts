import type { SceneName } from "../sceneEngine";

export type AmbientEventType =
  | "shooting-star"
  | "wind-gust"
  | "dandelion"
  | "pet-visit"
  | "sparkle";

export interface AmbientEvent {
  id: number;
  type: AmbientEventType;
  createdAt: number;
  scene: SceneName;
}

export interface AmbientEventRule {
  type: AmbientEventType;

  minDelay: number;
  maxDelay: number;

  /** 0–1 probability that the event actually fires when its timer expires. */
  probability: number;

  /** Scenes where this event is eligible to fire. */
  scenes: SceneName[];

  /** Minimum ms between two consecutive firings of this rule. */
  cooldown?: number;
}
