import { useEffect, useRef } from "react";
import { useBirthdayPhase } from "../context/BirthdayContext";
import { useCelebration } from "../context/CelebrationContext";

/**
 * Coordinates the transition from `final-countdown` (or `waiting`) → `birthday`
 * by calling `startCelebration()` exactly once when the phase changes.
 *
 * Lives in AppLayout so it stays alive across all routes.
 */
export function useBirthdayCelebration() {
  const phase = useBirthdayPhase();
  const { started, startCelebration } = useCelebration();

  const previousPhaseRef = useRef(phase);

  useEffect(() => {
    const previousPhase = previousPhaseRef.current;
    previousPhaseRef.current = phase;

    if (phase !== "birthday") {
      return;
    }

    // Already running — nothing to do.
    if (started) {
      return;
    }

    // Only trigger when arriving from a meaningful prior phase.
    if (
      previousPhase === "final-countdown" ||
      previousPhase === "waiting"
    ) {
      startCelebration();
    }
  }, [phase, started, startCelebration]);
}
