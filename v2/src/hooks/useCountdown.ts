import { useEffect, useState } from "react";
import {
  getBirthdayPhase,
  getForcedBirthdayPhase,
  getCountdown,
  type BirthdayPhase,
  type CountdownState,
} from "../engines/birthdayEngine";
import type { ExperienceClock } from "../time/ExperienceClock";
import { systemClock } from "../time/ExperienceClock";

interface UseCountdownResult {
  countdown: CountdownState;
  phase: BirthdayPhase;
}

const TICK_INTERVAL = 250;

function readClock(clock: ExperienceClock): UseCountdownResult {
  // Both values must describe the same instant, including at midnight.
  const now = clock.now();
  const phase = getForcedBirthdayPhase() ?? getBirthdayPhase(now);
  return { countdown: getCountdown(now), phase };
}

export function useCountdown(clock: ExperienceClock = systemClock): UseCountdownResult {
  const [state, setState] = useState(() => readClock(clock));

  // Re-read immediately when the clock instance changes (DEV preview swap).
  useEffect(() => {
    setState(readClock(clock));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clock]);

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

      const next = readClock(clock);
      setState(next);

      if (!next.countdown.isFinished) {
        const delay = TICK_INTERVAL - (clock.now() % TICK_INTERVAL);
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
  }, [clock]);

  return state;
}
