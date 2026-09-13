import { BIRTHDAY_TIMESTAMP } from "../engines/birthdayEngine";

/**
 * Abstraction over the time source used by useCountdown.
 * Production always uses SystemClock (Date.now()).
 * DEV can inject PreviewClock to simulate a specific moment in time.
 */
export interface ExperienceClock {
  now(): number;
}

/** Default production clock — delegates to Date.now(). */
export class SystemClock implements ExperienceClock {
  now(): number {
    return Date.now();
  }
}

/**
 * Shifts wall-clock time by a fixed offset.
 * Useful for testing "5 hours before the birthday" scenarios.
 */
export class OffsetClock implements ExperienceClock {
  private readonly offsetMs: number;

  constructor(offsetMs: number) {
    this.offsetMs = offsetMs;
  }

  now(): number {
    return Date.now() + this.offsetMs;
  }
}

/**
 * Advances in real time from a chosen virtual start timestamp.
 * Uses performance.now() for monotonic progression so the simulated
 * clock advances correctly even when the system clock drifts.
 */
export class PreviewClock implements ExperienceClock {
  private readonly startedAt: number;
  private readonly virtualStart: number;

  constructor(virtualStart: number) {
    this.virtualStart = virtualStart;
    this.startedAt    = performance.now();
  }

  now(): number {
    return this.virtualStart + (performance.now() - this.startedAt);
  }
}

// ─── Convenience factories ────────────────────────────────────────────────────

/** A clock that starts 10 seconds before the birthday timestamp. */
export function makeFinal10Clock(): PreviewClock {
  return new PreviewClock(BIRTHDAY_TIMESTAMP - 10_000);
}

/** A clock that starts 60 seconds before the birthday timestamp. */
export function makeFinal60Clock(): PreviewClock {
  return new PreviewClock(BIRTHDAY_TIMESTAMP - 60_000);
}

/** A clock that is already past the birthday timestamp. */
export function makeBirthdayClock(): PreviewClock {
  return new PreviewClock(BIRTHDAY_TIMESTAMP + 1_000);
}

export const systemClock = new SystemClock();
