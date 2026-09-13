// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { getForcedQuality } from "./forcedQuality";
afterEach(() => { vi.unstubAllEnvs(); window.history.replaceState(null, "", "/"); });
it.each(["high", "medium", "low"])("accepts %s only in development", quality => {
  window.history.replaceState(null, "", `/?quality=${quality}`);
  vi.stubEnv("DEV", true); expect(getForcedQuality()).toBe(quality);
  vi.stubEnv("DEV", false); expect(getForcedQuality()).toBeNull();
});
it("ignores unknown qualities", () => {
  vi.stubEnv("DEV", true); window.history.replaceState(null, "", "/?quality=ultra");
  expect(getForcedQuality()).toBeNull();
});
