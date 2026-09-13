import { expect, it } from "vitest";
import { getScene } from "./sceneEngine";
import { getBogotaHour } from "./birthdayEngine";

it.each([
  [0, "night"], [4, "night"], [5, "morning"], [10, "morning"],
  [11, "day"], [16, "day"], [17, "sunset"], [19, "sunset"],
  [20, "night"], [23, "night"],
] as const)("selects %s hour as %s", (hour, scene) => {
  expect(getScene({ phase: "waiting", hour })).toBe(scene);
});

it.each(["birthday", "final-countdown"] as const)("prioritizes %s over time of day", (phase) => {
  for (let hour = 0; hour < 24; hour++) expect(getScene({ phase, hour })).toBe(phase);
});

it.each([
  ["2027-09-10T05:00:00Z", 0], ["2027-09-10T10:00:00Z", 5],
  ["2027-09-10T16:00:00Z", 11], ["2027-09-10T22:00:00Z", 17],
  ["2027-09-11T01:00:00Z", 20],
] as const)("converts %s to Bogotá hour %i", (date, hour) => {
  expect(getBogotaHour(new Date(date))).toBe(hour);
});
