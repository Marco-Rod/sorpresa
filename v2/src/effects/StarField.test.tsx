// @vitest-environment jsdom
import { StrictMode } from "react";
import { act, cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { StarField } from "./StarField";
import { CanvasEngine } from "../engines/canvas/CanvasEngine";
import { StarFieldEngine } from "../engines/canvas/StarFieldEngine";

const settings = vi.hoisted(() => ({ quality: "high" as "high" | "medium" | "low", reducedMotion: false, isVisible: true }));
vi.mock("../context/PerformanceContext", () => ({ usePerformance: () => settings }));
vi.mock("../context/AppStateContext", () => ({ useAppState: () => settings }));
let frames: Map<number, FrameRequestCallback>;
let observers: Set<() => void>;
let ctx: { clearRect: ReturnType<typeof vi.fn>; setTransform: ReturnType<typeof vi.fn>; beginPath: ReturnType<typeof vi.fn>; arc: ReturnType<typeof vi.fn>; fill: ReturnType<typeof vi.fn>; globalAlpha: number };
beforeEach(() => {
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

it("keeps one canvas/loop under StrictMode and adapts count and DPR without remount", () => {
  const tree = () => <StrictMode><div><StarField /></div></StrictMode>;
  const { container, rerender, unmount } = render(tree());
  const canvas = container.querySelector("canvas")!;
  expect(container.querySelectorAll("canvas")).toHaveLength(1);
  expect(canvas.width).toBe(600); expect(frames.size).toBe(1); expect(observers.size).toBe(1);
  ctx.arc.mockClear(); settings.quality = "medium"; rerender(tree());
  expect(container.querySelector("canvas")).toBe(canvas);
  expect(canvas.width).toBe(450); expect(ctx.arc).toHaveBeenCalledTimes(42);
  ctx.arc.mockClear(); settings.quality = "low"; rerender(tree());
  expect(canvas.width).toBe(300); expect(ctx.arc).toHaveBeenCalledTimes(22);
  act(() => observers.forEach(callback => callback()));
  expect(canvas.width).toBe(300);
  unmount(); expect(frames.size).toBe(0); expect(observers.size).toBe(0);
});

it("draws static stars on initial render and resize with reduced motion", () => {
  settings.reducedMotion = true; settings.quality = "low";
  render(<div><StarField /></div>);
  expect(frames.size).toBe(0); expect(ctx.arc.mock.calls.length).toBeGreaterThanOrEqual(22);
  ctx.arc.mockClear(); act(() => observers.forEach(callback => callback()));
  expect(ctx.arc).toHaveBeenCalledTimes(22); expect(frames.size).toBe(0);
});

it("stops and resumes the animation on visibility and motion changes", () => {
  const { rerender } = render(<div><StarField /></div>);
  settings.isVisible = false; rerender(<div><StarField /></div>);
  expect(frames.size).toBe(0);
  settings.isVisible = true; rerender(<div><StarField /></div>);
  expect(frames.size).toBe(1);
  settings.reducedMotion = true; rerender(<div><StarField /></div>);
  expect(frames.size).toBe(0);
});

it("limits delta time, renders immediately and cannot restart after destruction", () => {
  class Probe extends CanvasEngine {
    deltas: number[] = [];
    draws = 0;
    protected update(delta: number) { this.deltas.push(delta); }
    protected render() { this.draws++; }
  }
  vi.spyOn(performance, "now").mockReturnValue(0);
  const engine = new Probe(document.createElement("canvas"));
  engine.resize(100, 200, 2); engine.start(); engine.start();
  expect(engine.draws).toBe(2); expect(frames.size).toBe(1);
  const callback = [...frames.values()][0]; frames.clear(); callback(7200);
  expect(engine.deltas).toEqual([100]);
  engine.pause(); expect(frames.size).toBe(0);
  engine.resume(); expect(frames.size).toBe(1);
  engine.destroy(); engine.start(); expect(frames.size).toBe(0);
});

it("preserves normalized star positions when resizing and reducing the count", () => {
  vi.spyOn(Math, "random").mockReturnValue(0.5);
  const engine = new StarFieldEngine(document.createElement("canvas"), 70);
  engine.resize(100, 100, 1);
  expect(ctx.arc).toHaveBeenCalledTimes(70);
  expect(ctx.arc.mock.calls[0].slice(0, 2)).toEqual([50, 50]);
  ctx.arc.mockClear(); engine.setStarCount(22); engine.resize(200, 300, 1);
  expect(ctx.arc).toHaveBeenCalledTimes(22);
  expect(ctx.arc.mock.calls[0].slice(0, 2)).toEqual([100, 150]);
});

it("keeps the decorative canvas harmless if 2D is unavailable", () => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
  render(<div><StarField /></div>);
  expect(frames.size).toBe(0); expect(observers.size).toBe(0);
});
