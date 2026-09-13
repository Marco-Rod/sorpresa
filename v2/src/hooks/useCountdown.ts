import { useEffect, useState } from "react";
import {
  getBirthdayPhase,
  getCountdown,
  type BirthdayPhase,
  type CountdownState,
} from "../engines/birthdayEngine";

interface UseCountdownResult {
  countdown: CountdownState;
  phase: BirthdayPhase;
}

const TICK_INTERVAL = 250;

function readClock(): UseCountdownResult {
  // Both values must describe the same instant, including at midnight.
  const now = Date.now();
  return { countdown: getCountdown(now), phase: getBirthdayPhase(now) };
}

export function useCountdown(): UseCountdownResult {
  const [state, setState] = useState(readClock);

  useEffect(() => {
    let timeoutId: number | undefined;
    let cancelled = false;

    const clearTick = () => {
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
        timeoutId = undefined;
      }
    };

    const sync = () => {
      clearTick();
      if (cancelled || document.visibilityState === "hidden") return;

      const next = readClock();
      setState(next);

      // A delayed callback reads the current timestamp; it never replays ticks.
      // Birthday is terminal for this phase; memory will be defined later.
      if (!next.countdown.isFinished) {
        const delay = TICK_INTERVAL - (Date.now() % TICK_INTERVAL);
        timeoutId = window.setTimeout(sync, delay);
      }
    };

    sync();
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("pageshow", sync);
    window.addEventListener("focus", sync);
    window.addEventListener("pagehide", clearTick);

    return () => {
      cancelled = true;
      clearTick();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("pageshow", sync);
      window.removeEventListener("focus", sync);
      window.removeEventListener("pagehide", clearTick);
    };
  }, []);

  return state;
}
