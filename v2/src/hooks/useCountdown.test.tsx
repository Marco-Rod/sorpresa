// @vitest-environment jsdom
import { StrictMode } from "react";
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BIRTHDAY_TIMESTAMP } from "../engines/birthdayEngine";
import { useCountdown } from "./useCountdown";

describe("useCountdown lifecycle", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(BIRTHDAY_TIMESTAMP - 60_000);
    vi.spyOn(document, "visibilityState", "get").mockReturnValue("visible");
  });
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("reads the current clock after a delayed callback without replaying seconds", () => {
    const { result } = renderHook(useCountdown);
    act(() => {
      vi.setSystemTime(BIRTHDAY_TIMESTAMP - 40_000);
      vi.advanceTimersByTime(250);
    });
    expect(result.current.countdown.totalMs).toBe(39_750);
  });

  it("pauses while hidden and immediately catches up after 20 seconds", () => {
    const { result } = renderHook(useCountdown);
    act(() => {
      vi.spyOn(document, "visibilityState", "get").mockReturnValue("hidden");
      document.dispatchEvent(new Event("visibilitychange"));
    });
    expect(vi.getTimerCount()).toBe(0);
    act(() => {
      vi.setSystemTime(BIRTHDAY_TIMESTAMP - 40_000);
      vi.spyOn(document, "visibilityState", "get").mockReturnValue("visible");
      document.dispatchEvent(new Event("visibilitychange"));
    });
    expect(result.current.countdown.totalMs).toBe(40_000);
    expect(vi.getTimerCount()).toBe(1);
  });

  it.each(["focus", "pageshow"])("resynchronizes on %s without duplicate timers", (event) => {
    const { result } = renderHook(useCountdown);
    act(() => {
      vi.setSystemTime(BIRTHDAY_TIMESTAMP - 8_000);
      window.dispatchEvent(new Event(event));
      window.dispatchEvent(new Event(event));
    });
    expect(result.current.phase).toBe("final-countdown");
    expect(result.current.countdown.totalMs).toBe(8_000);
    expect(vi.getTimerCount()).toBe(1);
  });

  it("recovers directly into birthday after suspension across the target", () => {
    const { result } = renderHook(useCountdown);
    act(() => {
      window.dispatchEvent(new Event("pagehide"));
    });
    expect(vi.getTimerCount()).toBe(0);
    act(() => {
      vi.setSystemTime(BIRTHDAY_TIMESTAMP + 5_000);
      window.dispatchEvent(new Event("pageshow"));
    });
    expect(result.current.phase).toBe("birthday");
    expect(result.current.countdown.isFinished).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("survives StrictMode and removes timers and listeners when unmounted", () => {
    const { unmount } = renderHook(useCountdown, {
      wrapper: ({ children }) => <StrictMode>{children}</StrictMode>,
    });
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    act(() => {
      window.dispatchEvent(new Event("focus"));
      window.dispatchEvent(new Event("pageshow"));
      document.dispatchEvent(new Event("visibilitychange"));
    });
    expect(vi.getTimerCount()).toBe(0);
  });
});
