// @vitest-environment jsdom
import { StrictMode } from "react";
import { act, cleanup, render, screen } from "@testing-library/react";
import { beforeEach, afterEach, expect, it, vi } from "vitest";
import { AppStateProvider } from "./AppStateContext";
import { PerformanceProvider, usePerformance } from "./PerformanceContext";
import { calculateInitialTier } from "../engines/performanceEngine";
import { getCanvasPixelRatio } from "../utils/canvas";

let frames: Map<number, FrameRequestCallback>;
let nextId: number;
let now: number;
let motion: boolean;
let listeners: Set<() => void>;
function frame(delta: number) {
  now += delta;
  act(() => {
    const pending = [...frames.values()];
    frames.clear();
    pending.forEach(callback => callback(now));
  });
}
function samples(count: number, fps: number) {
  for (let sample = 0; sample < count; sample++) {
    for (let i = 0; i < fps; i++) frame(1000 / fps);
  }
}
function Reader() {
  const state = usePerformance();
  return <output>{JSON.stringify(state)}</output>;
}
function state() { return JSON.parse(screen.getByRole("status").textContent!); }
function mount() {
  return render(<StrictMode><AppStateProvider><PerformanceProvider><Reader /></PerformanceProvider></AppStateProvider></StrictMode>);
}
beforeEach(() => {
  frames = new Map(); nextId = 0; now = 0; motion = false; listeners = new Set();
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => { frames.set(++nextId, callback); return nextId; });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => frames.delete(id));
  vi.stubGlobal("matchMedia", () => ({
    get matches() { return motion; },
    addEventListener: (_: string, callback: () => void) => listeners.add(callback),
    removeEventListener: (_: string, callback: () => void) => listeners.delete(callback),
  }));
  vi.spyOn(document, "visibilityState", "get").mockReturnValue("visible");
  vi.spyOn(navigator, "hardwareConcurrency", "get").mockReturnValue(8);
  vi.stubGlobal("devicePixelRatio", 1);
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

it("downgrades after identical low samples and never upgrades", () => {
  mount(); frame(0);
  expect(state().fps).toBeNull();
  samples(3, 40); expect(state().quality).toBe("high");
  samples(1, 40); expect(state().quality).toBe("medium");
  samples(4, 40); expect(state().quality).toBe("low");
  samples(4, 50); expect(state().quality).toBe("low");
});
it("goes directly to low after three critical samples", () => {
  mount(); frame(0); samples(2, 20);
  expect(state().quality).toBe("high");
  samples(1, 20); expect(state().quality).toBe("low");
});
it("healthy samples reset consecutive degradation counters", () => {
  mount(); frame(0); samples(3, 40); samples(1, 50); samples(3, 40);
  expect(state().quality).toBe("high");
});
it("pauses in background and starts a fresh sample after resume", () => {
  const { unmount } = mount(); frame(0); samples(3, 40);
  act(() => {
    vi.spyOn(document, "visibilityState", "get").mockReturnValue("hidden");
    document.dispatchEvent(new Event("visibilitychange"));
  });
  expect(frames.size).toBe(0); expect(state().fps).toBeNull();
  now += 60_000;
  act(() => {
    vi.spyOn(document, "visibilityState", "get").mockReturnValue("visible");
    document.dispatchEvent(new Event("visibilitychange"));
  });
  expect(frames.size).toBe(1);
  frame(0); samples(1, 40); expect(state().quality).toBe("high");
  unmount(); expect(frames.size).toBe(0); expect(listeners.size).toBe(0);
});
it("applies live reduced-motion changes without restoring quality", () => {
  mount();
  act(() => { motion = true; listeners.forEach(callback => callback()); });
  expect(state().quality).toBe("low"); expect(state().reducedMotion).toBe(true);
  act(() => { motion = false; listeners.forEach(callback => callback()); });
  expect(state().quality).toBe("low"); expect(state().reducedMotion).toBe(false);
});
it("starts low when reduced motion is enabled", () => {
  motion = true; mount(); expect(state().quality).toBe("low");
});
it("scores optional memory, cores, resolution and motion", () => {
  const base = { reducedMotion: false, hardwareConcurrency: 8, devicePixelRatio: 1, screenWidth: 1000, screenHeight: 800 };
  expect(calculateInitialTier(base)).toBe("high");
  expect(calculateInitialTier({ ...base, hardwareConcurrency: 4 })).toBe("medium");
  expect(calculateInitialTier({ ...base, hardwareConcurrency: 2 })).toBe("low");
  expect(calculateInitialTier({ ...base, deviceMemory: 2 })).toBe("medium");
  expect(calculateInitialTier({ ...base, hardwareConcurrency: 4, deviceMemory: 8 })).toBe("high");
  expect(calculateInitialTier({ ...base, devicePixelRatio: 3 })).toBe("medium");
  expect(calculateInitialTier({ ...base, reducedMotion: true })).toBe("low");
});
it("caps canvas DPR by tier without increasing the device ratio", () => {
  vi.stubGlobal("devicePixelRatio", 3);
  expect(getCanvasPixelRatio("high")).toBe(2);
  expect(getCanvasPixelRatio("medium")).toBe(1.5);
  expect(getCanvasPixelRatio("low")).toBe(1);
  vi.stubGlobal("devicePixelRatio", 1);
  expect(getCanvasPixelRatio("high")).toBe(1);
});
