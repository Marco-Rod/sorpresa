import { useScene } from "../hooks/useScene";
import { useSceneAudio } from "../hooks/useSceneAudio";

import { BirthdayScene } from "./BirthdayScene";
import { DayScene } from "./DayScene";
import { FinalCountdownScene } from "./FinalCountdownScene";
import { MorningScene } from "./MorningScene";
import { NightScene } from "./NightScene";
import { SunsetScene } from "./SunsetScene";

export function SceneRenderer() {
  const scene = useScene();

  useSceneAudio(scene);

  switch (scene) {
    case "morning":
      return <MorningScene />;

    case "day":
      return <DayScene />;

    case "sunset":
      return <SunsetScene />;

    case "night":
      return <NightScene />;

    case "final-countdown":
      return <FinalCountdownScene />;

    case "birthday":
      return <BirthdayScene />;

    default:
      return null;
  }
}
