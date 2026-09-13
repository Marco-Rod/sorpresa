// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GardenLayer } from "./GardenLayer";

const settings = vi.hoisted(() => ({ quality: "high" as "high" | "medium" | "low", reducedMotion: false }));
vi.mock("../../context/PerformanceContext", () => ({ usePerformance: () => settings }));

function byClass(root: HTMLElement, className: string) {
  return Array.from(root.querySelectorAll("use")).filter((node) => node.getAttribute("class")?.includes(className)).length;
}

function flowers(root: HTMLElement) {
  return byClass(root, "garden-flower");
}

function grass(root: HTMLElement) {
  return byClass(root, "garden-grass-clump");
}

function renderNight() {
  return render(<GardenLayer mood="night" />).container;
}

describe("GardenLayer", () => {
  beforeEach(() => {
    settings.quality = "high";
    settings.reducedMotion = false;
  });
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders a single svg with defs, viewBox and slice alignment", () => {
    const container = renderNight();
    const svg = container.querySelector("svg.garden-layer")!;
    expect(svg.getAttribute("viewBox")).toBe("0 0 100 110");
    expect(svg.getAttribute("preserveAspectRatio")).toBe("xMidYMax slice");
    expect(container.querySelectorAll("svg")).toHaveLength(1);
    expect(container.querySelectorAll("defs symbol")).toHaveLength(3);
  });

  it("shows all flowers at night and hides gerberas not visible in the morning", () => {
    expect(flowers(renderNight())).toBe(24);
    const morning = render(<GardenLayer mood="morning" />).container;
    expect(flowers(morning)).toBe(21);
  });

  it("reduces coverage by tier while keeping the essential flowers", () => {
    expect(flowers(renderNight())).toBe(24);
    settings.quality = "medium";
    expect(flowers(renderNight())).toBe(16);
    settings.quality = "low";
    expect(flowers(renderNight())).toBe(9);
  });

  it("scales grass down with the quality tier", () => {
    expect(grass(renderNight())).toBe(12);
    settings.quality = "medium";
    expect(grass(renderNight())).toBe(8);
    settings.quality = "low";
    expect(grass(renderNight())).toBe(6);
  });

  it("marks the layer as static with reduced motion", () => {
    settings.reducedMotion = true;
    const svg = renderNight().querySelector("svg.garden-layer")!;
    expect(svg.classList.contains("garden-layer--static")).toBe(true);
    expect(svg.classList.contains("garden-layer--high")).toBe(true);
    expect(svg.classList.contains("garden-layer--night")).toBe(true);
  });
});