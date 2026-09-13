import { useEffect } from "react";
import { useBirthdayPhase } from "../context/BirthdayContext";
import { useCelebration } from "../context/CelebrationContext";

/**
 * Starts the celebration exactly once when phase becomes "birthday".
 *
 * Idempotent — does not rely on previousPhase tracking, so it works correctly
 * whether the user arrives from final-countdown, reloads during birthday, or
 * opens the app after midnight.
 */
export function useBirthdayCelebration() {
  const phase = useBirthdayPhase();
  const { started, startCelebration } = useCelebration();

  useEffect(() => {
    if (phase === "birthday" && !started) {
      startCelebration();
    }
  }, [phase, started, startCelebration]);
}
