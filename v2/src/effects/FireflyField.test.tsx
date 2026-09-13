// @vitest-environment jsdom
import { StrictMode } from "react";
import { act, cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { FireflyField } from "./FireflyField";

const settings = vi.hoisted(() => ({ quality: "high" as "high" | "medium" | "low", reducedMotion: false, isVisible: true }));
vi.mock("../context/PerformanceContext", () => ({ usePerformance: () => settings }));
vi.mock("../context/AppStateContext", () => ({ useAppState: () => settings }));
let frames: Map<number, FrameRequestCallback>;
let observers: Set<() => void>;
let ctx: { clearRect: ReturnType<typeof vi.fn>; setTransform: ReturnType<typeof vi.fn>; beginPath: ReturnType<typeof vi.fn>; arc: ReturnType<typeof vi.fn>; fill: ReturnType<typeof vi.fn>; globalAlpha: number };
beforeEach(() => {
  vi.spyOn(Math, "random").mockReturnValue(0.5);
  settings.quality = "high"; settings.reducedMotion = false; settings.isVisible = true;
  frames = new Map(); observers = new Set(); let id = 0;
  ctx = { clearRect: vi.fn(), setTransform: vi.fn(), beginPath: vi.fn(), arc: vi.fn(), fill: vi.fn(), globalAlpha: 1 };
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

it("renders static fireflies immediately and adapts count and DPR without remount", () => {
  settings.reducedMotion = true;
  const tree = () => <StrictMode><div><FireflyField /></div></StrictMode>;
  const { container, rerender, unmount } = render(tree());
  const canvas = container.querySelector("canvas")!;
  expect(canvas.width).toBe(600); expect(frames.size).toBe(0); expect(observers.size).toBe(1);
  ctx.arc.mockClear(); act(() => observers.forEach(callback => callback()));
  expect(ctx.arc).toHaveBeenCalledTimes(24);
  expect(ctx.arc.mock.calls[0][1]).toBeGreaterThan(420 * 0.35);
  ctx.arc.mockClear(); settings.quality = "medium"; rerender(tree());
  expect(ctx.arc).toHaveBeenCalledTimes(14); expect(canvas.width).toBe(450);
  ctx.arc.mockClear(); settings.quality = "low"; rerender(tree());
  expect(ctx.arc).toHaveBeenCalledTimes(6); expect(canvas.width).toBe(300);
  expect(container.querySelector("canvas")).toBe(canvas);
  unmount(); expect(frames.size).toBe(0); expect(observers.size).toBe(0);
});

it("pauses and resumes one loop across visibility changes", () => {
  const { rerender, unmount } = render(<div><FireflyField /></div>);
  expect(frames.size).toBe(1);
  settings.isVisible = false; rerender(<div><FireflyField /></div>); expect(frames.size).toBe(0);
  settings.isVisible = true; rerender(<div><FireflyField /></div>); expect(frames.size).toBe(1);
  settings.reducedMotion = true; rerender(<div><FireflyField /></div>); expect(frames.size).toBe(0);
  unmount(); expect(observers.size).toBe(0);
});
