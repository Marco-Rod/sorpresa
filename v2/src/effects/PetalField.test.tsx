// @vitest-environment jsdom
import { StrictMode } from "react";
import { act, cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { PetalField } from "./PetalField";

const settings = vi.hoisted(() => ({ quality: "high" as "high" | "medium" | "low", reducedMotion: false, isVisible: true }));
vi.mock("../context/PerformanceContext", () => ({ usePerformance: () => settings }));
vi.mock("../context/AppStateContext", () => ({ useAppState: () => settings }));
let frames: Map<number, FrameRequestCallback>;
let observers: Set<() => void>;
let ctx: { clearRect: ReturnType<typeof vi.fn>; setTransform: ReturnType<typeof vi.fn>; beginPath: ReturnType<typeof vi.fn>; arc: ReturnType<typeof vi.fn>; fill: ReturnType<typeof vi.fn>; globalAlpha: number; save: ReturnType<typeof vi.fn>; restore: ReturnType<typeof vi.fn>; translate: ReturnType<typeof vi.fn>; rotate: ReturnType<typeof vi.fn>; moveTo: ReturnType<typeof vi.fn>; bezierCurveTo: ReturnType<typeof vi.fn> };
beforeEach(() => {
  settings.quality = "high"; settings.reducedMotion = false; settings.isVisible = true;
  frames = new Map(); observers = new Set(); let id = 0;
  ctx = { clearRect: vi.fn(), setTransform: vi.fn(), beginPath: vi.fn(), arc: vi.fn(), fill: vi.fn(), globalAlpha: 1, save: vi.fn(), restore: vi.fn(), translate: vi.fn(), rotate: vi.fn(), moveTo: vi.fn(), bezierCurveTo: vi.fn() };
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(ctx as unknown as CanvasRenderingContext2D);
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ width: 300, height: 420 } as DOMRect);
  vi.stubGlobal("devicePixelRatio", 3);
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => { frames.set(++id, callback); return id; });
  vi.stubGlobal("cancelAnimationFrame", (key: number) => frames.delete(key));
  vi.stubGlobal("ResizeObserver", class {
    callback: () => void;
    constructor(callback: () => void) { this.callback = callback; }
    observe() { observers.add(this.callback); }
    disconnect() { observers.delete(this.callback); }
  });
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

it("keeps one loop and updates DPR without remounting, then cleans up", () => {
  const tree = () => <StrictMode><div><PetalField /></div></StrictMode>;
  const { container, rerender, unmount } = render(tree());
  const canvas = container.querySelector("canvas")!;
  expect(canvas.width).toBe(600); expect(frames.size).toBe(1); expect(observers.size).toBe(1);
  settings.quality = "medium"; rerender(tree()); expect(canvas.width).toBe(450);
  settings.quality = "low"; rerender(tree()); expect(canvas.width).toBe(300);
  act(() => observers.forEach(callback => callback()));
  expect(canvas.width).toBe(300); expect(container.querySelector("canvas")).toBe(canvas);
  settings.isVisible = false; rerender(tree()); expect(frames.size).toBe(0);
  settings.isVisible = true; rerender(tree()); expect(frames.size).toBe(1);
  unmount(); expect(frames.size).toBe(0); expect(observers.size).toBe(0);
});

it("clears existing petals with reduced motion and stays empty after resize", () => {
  vi.spyOn(performance, "now").mockReturnValue(0);
  const { rerender } = render(<div><PetalField /></div>);
  for (let time = 100; time <= 1000; time += 100) {
    act(() => {
      const pending = [...frames.values()]; frames.clear(); pending.forEach(callback => callback(time));
    });
  }
  expect(ctx.fill.mock.calls.length).toBeGreaterThan(0);
  settings.reducedMotion = true; rerender(<div><PetalField /></div>);
  expect(frames.size).toBe(0);
  ctx.fill.mockClear(); act(() => observers.forEach(callback => callback()));
  expect(ctx.fill).not.toHaveBeenCalled();
});

it("starts without a loop when reduced motion is already active", () => {
  settings.reducedMotion = true; render(<div><PetalField /></div>);
  expect(frames.size).toBe(0); expect(ctx.fill).not.toHaveBeenCalled();
});
