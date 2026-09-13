import type { AmbientEventRule } from "../engines/ambient/types";

export const AMBIENT_EVENT_RULES: AmbientEventRule[] = [
  {
    type: "shooting-star",
    minDelay: 12_000,
    maxDelay: 32_000,
    probability: 0.7,
    scenes: ["night"],
    cooldown: 10_000,
  },

  {
    type: "wind-gust",
    minDelay: 18_000,
    maxDelay: 42_000,
    probability: 0.55,
    scenes: ["morning", "day", "sunset"],
    cooldown: 14_000,
  },

  {
    type: "dandelion",
    minDelay: 20_000,
    maxDelay: 48_000,
    probability: 0.45,
    scenes: ["morning", "day"],
    cooldown: 18_000,
  },

  {
    type: "pet-visit",
    minDelay: 35_000,
    maxDelay: 75_000,
    probability: 0.5,
    scenes: ["morning", "day", "sunset", "night"],
    cooldown: 30_000,
  },

  {
    type: "sparkle",
    minDelay: 14_000,
    maxDelay: 30_000,
    probability: 0.65,
    scenes: ["sunset", "night"],
    cooldown: 10_000,
  },
];
