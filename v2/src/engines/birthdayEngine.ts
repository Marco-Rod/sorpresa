import { BIRTHDAY_CONFIG } from "../config/birthday";

export type BirthdayPhase =
  | "waiting"
  | "final-countdown"
  | "birthday"
  | "memory";

export interface CountdownState {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isFinished: boolean;
}

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

function getBirthdayTimestamp(): number {
  const {
    year,
    month,
    day,
    hour,
    minute,
    second,
  } = BIRTHDAY_CONFIG.nextBirthday;

  /*
   * Bogotá usa UTC-5 y no tiene horario de verano.
   * Más adelante podemos sustituir esto por Temporal API
   * o una utilidad genérica para timezones.
   */
  return Date.UTC(
    year,
    month - 1,
    day,
    hour + 5,
    minute,
    second,
  );
}

export const BIRTHDAY_TIMESTAMP = getBirthdayTimestamp();

export function getCountdown(
  now = Date.now(),
): CountdownState {
  const difference = Math.max(
    0,
    BIRTHDAY_TIMESTAMP - now,
  );

  return {
    totalMs: difference,

    days: Math.floor(
      difference / DAY,
    ),

    hours: Math.floor(
      (difference % DAY) / HOUR,
    ),

    minutes: Math.floor(
      (difference % HOUR) / MINUTE,
    ),

    seconds: Math.floor(
      (difference % MINUTE) / SECOND,
    ),

    isFinished: difference <= 0,
  };
}

export function getBirthdayPhase(
  now = Date.now(),
): BirthdayPhase {
  const remaining =
    BIRTHDAY_TIMESTAMP - now;

  if (remaining <= 0) {
    return "birthday";
  }

  if (remaining <= 10_000) {
    return "final-countdown";
  }

  return "waiting";
}
