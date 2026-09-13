import type {
  BirthdayPhase,
} from "./birthdayEngine";

export type SceneName =
  | "morning"
  | "day"
  | "sunset"
  | "night"
  | "final-countdown"
  | "birthday";

interface SceneContext {
  phase: BirthdayPhase;
  hour: number;
}

export function getScene({
  phase,
  hour,
}: SceneContext): SceneName {
  if (phase === "birthday") {
    return "birthday";
  }

  if (
    phase === "final-countdown"
  ) {
    return "final-countdown";
  }

  if (hour >= 5 && hour < 11) {
    return "morning";
  }

  if (hour >= 11 && hour < 17) {
    return "day";
  }

  if (hour >= 17 && hour < 20) {
    return "sunset";
  }

  return "night";
}
