// @vitest-environment jsdom
import { StrictMode, type ReactNode } from "react";
import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { AppStateProvider, useAppState } from "../context/AppStateContext";
import { BirthdayProvider, useBirthday, useBirthdayPhase } from "../context/BirthdayContext";
import { SceneRenderer } from "./SceneRenderer";

// Canvas lifecycle is tested independently; these tests focus on scene selection.
vi.mock("../effects/StarField", () => ({ StarField: () => <canvas aria-hidden="true" /> }));
vi.mock("../effects/PetalField", () => ({ PetalField: () => <canvas aria-hidden="true" /> }));
vi.mock("../effects/FireflyField", () => ({ FireflyField: () => <canvas aria-hidden="true" /> }));
vi.mock("../components/garden/GardenLayer", () => ({ GardenLayer: () => <svg aria-hidden="true" /> }));

function Providers({ children }: { children: ReactNode }) {
  return <StrictMode><AppStateProvider><BirthdayProvider>{children}</BirthdayProvider></AppStateProvider></StrictMode>;
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2027-09-09T15:59:50Z"));
  vi.spyOn(document, "visibilityState", "get").mockReturnValue("visible");
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

it("mounts only the active scene and checks time of day every 30 seconds", () => {
  const { container } = render(<Providers><SceneRenderer /></Providers>);
  expect(container.querySelector(".scene--morning")).toBeTruthy();
  act(() => { vi.advanceTimersByTime(30_000); });
  expect(container.querySelectorAll(".scene")).toHaveLength(1);
  expect(container.querySelector(".scene--morning")).toBeNull();
  expect(container.querySelector(".scene--day")).toBeTruthy();
});

it("pauses both timers while hidden and recalculates immediately on return", () => {
  function Visibility() {
    return <output>{String(useAppState().isVisible)}</output>;
  }
  const { container, unmount } = render(<Providers><Visibility /><SceneRenderer /></Providers>);
  expect(vi.getTimerCount()).toBe(2);
  act(() => {
    vi.spyOn(document, "visibilityState", "get").mockReturnValue("hidden");
    document.dispatchEvent(new Event("visibilitychange"));
  });
  expect(screen.getByText("false")).toBeTruthy();
  expect(vi.getTimerCount()).toBe(0);
  act(() => {
    vi.setSystemTime(new Date("2027-09-09T23:00:00Z"));
    vi.spyOn(document, "visibilityState", "get").mockReturnValue("visible");
    document.dispatchEvent(new Event("visibilitychange"));
  });
  expect(container.querySelector(".scene--sunset")).toBeTruthy();
  expect(screen.getByText("true")).toBeTruthy();
  expect(vi.getTimerCount()).toBe(2);
  unmount();
  act(() => {
    window.dispatchEvent(new Event("pageshow"));
    document.dispatchEvent(new Event("visibilitychange"));
  });
  expect(vi.getTimerCount()).toBe(0);
});

it("handles pagehide and pageshow for restored pages", () => {
  const { container } = render(<Providers><SceneRenderer /></Providers>);
  act(() => { window.dispatchEvent(new Event("pagehide")); });
  expect(vi.getTimerCount()).toBe(0);
  act(() => {
    vi.setSystemTime(new Date("2027-09-10T02:00:00Z"));
    window.dispatchEvent(new Event("pageshow"));
  });
  expect(container.querySelector(".scene--night")).toBeTruthy();
  expect(vi.getTimerCount()).toBe(2);
});

it("shares one birthday timer across consumers without rerendering phase-only consumers", () => {
  let phaseRenders = 0;
  function Reader() {
    return <output>{useBirthday().countdown.totalMs}</output>;
  }
  function PhaseReader() {
    phaseRenders++;
    return <p>{useBirthdayPhase()}</p>;
  }
  render(<Providers><Reader /><Reader /><PhaseReader /></Providers>);
  const initialRenders = phaseRenders;
  expect(vi.getTimerCount()).toBe(1);
  act(() => { vi.advanceTimersByTime(1000); });
  expect(vi.getTimerCount()).toBe(1);
  expect(phaseRenders).toBe(initialRenders);
  const readers = screen.getAllByRole("status");
  expect(readers[0].textContent).toBe(readers[1].textContent);
});
