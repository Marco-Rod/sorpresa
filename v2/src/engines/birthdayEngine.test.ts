import { describe, expect, it } from "vitest";
import { BIRTHDAY_TIMESTAMP, getBirthdayPhase, getCountdown } from "./birthdayEngine";

describe("birthday clock", () => {
  it("targets midnight in Bogotá regardless of the host timezone", () => {
    expect(new Date(BIRTHDAY_TIMESTAMP).toISOString()).toBe("2027-09-10T05:00:00.000Z");
  });

  it("splits remaining time into days, hours, minutes and seconds", () => {
    const remaining = ((2 * 24 + 3) * 3600 + 4 * 60 + 5) * 1000 + 678;
    expect(getCountdown(BIRTHDAY_TIMESTAMP - remaining)).toEqual({
      totalMs: remaining, days: 2, hours: 3, minutes: 4, seconds: 5, isFinished: false,
    });
  });

  it.each([
    [10_001, "waiting"], [10_000, "final-countdown"],
    [1, "final-countdown"], [0, "birthday"], [-86_400_000, "birthday"],
  ] as const)("selects the phase with %i ms remaining", (remaining, phase) => {
    expect(getBirthdayPhase(BIRTHDAY_TIMESTAMP - remaining)).toBe(phase);
  });

  it("clamps the countdown at and after the target", () => {
    for (const now of [BIRTHDAY_TIMESTAMP, BIRTHDAY_TIMESTAMP + 100_000]) {
      expect(getCountdown(now)).toEqual({
        totalMs: 0, days: 0, hours: 0, minutes: 0, seconds: 0, isFinished: true,
      });
    }
  });
});
