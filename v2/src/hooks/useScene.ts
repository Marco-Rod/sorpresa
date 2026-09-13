import { useEffect, useState } from "react";
import { getBogotaHour } from "../engines/birthdayEngine";
import { getScene, type SceneName } from "../engines/sceneEngine";
import { useBirthdayPhase } from "../context/BirthdayContext";
import { useAppState } from "../context/AppStateContext";

const SCENE_CHECK_INTERVAL = 30_000;

export function useScene(): SceneName {
  const phase = useBirthdayPhase();
  const { isVisible } = useAppState();
  const [hour, setHour] = useState(getBogotaHour);

  useEffect(() => {
    if (!isVisible || phase === "birthday" || phase === "final-countdown") return;
    const update = () => setHour(getBogotaHour());
    update();
    const interval = window.setInterval(update, SCENE_CHECK_INTERVAL);
    return () => window.clearInterval(interval);
  }, [phase, isVisible]);

  // Phase overrides apply in the same render, without an effect-delayed scene.
  return getScene({ phase, hour });
}
