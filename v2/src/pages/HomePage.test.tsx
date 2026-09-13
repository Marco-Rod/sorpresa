// @vitest-environment jsdom
import { act, cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import { BIRTHDAY_TIMESTAMP } from "../engines/birthdayEngine";
import { HomePage } from "./HomePage";
import { BirthdayProvider } from "../context/BirthdayContext";
import { AppStateProvider } from "../context/AppStateContext";
import { useBirthdayPhase } from "../context/BirthdayContext";
import { FinalCountdownScene } from "../scenes/FinalCountdownScene";

vi.mock("../components/audio/MusicControl", () => ({ MusicControl: () => <button>Música</button> }));
vi.mock("../scenes/SceneRenderer", () => ({ SceneRenderer: () => {
  const phase = useBirthdayPhase();
  return phase === "final-countdown" ? <FinalCountdownScene /> : <div className="scene">{phase === "birthday" ? "El jardín está floreciendo." : "Jardín"}</div>;
} }));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

it("shows 10 through 1 then birthday, never a premature zero", () => {
  vi.useFakeTimers();
  vi.setSystemTime(BIRTHDAY_TIMESTAMP - 10_000);
  vi.spyOn(document, "visibilityState", "get").mockReturnValue("visible");
  render(<AppStateProvider><BirthdayProvider><MemoryRouter><HomePage /></MemoryRouter></BirthdayProvider></AppStateProvider>);
  expect(screen.getByRole("timer").textContent).toContain("10");
  act(() => { vi.advanceTimersByTime(250); });
  expect(screen.getByRole("timer").textContent).toContain("10");
  act(() => { vi.advanceTimersByTime(9500); });
  expect(screen.getByRole("timer").querySelector(".final-countdown-number")?.textContent).toBe("1");
  act(() => { vi.advanceTimersByTime(250); });
  expect(screen.queryByRole("timer")).toBeNull();
  expect(screen.getByText("El jardín está floreciendo.")).toBeTruthy();
  expect(document.querySelectorAll(".scene")).toHaveLength(1);
});

it("shows all four units while waiting and updates seconds", () => {
  vi.useFakeTimers();
  vi.setSystemTime(BIRTHDAY_TIMESTAMP - 2 * 86400000 - 3665000);
  render(<AppStateProvider><BirthdayProvider><MemoryRouter><HomePage /></MemoryRouter></BirthdayProvider></AppStateProvider>);
  const values = () => Array.from(screen.getByRole("timer").querySelectorAll("strong"), node => node.textContent);
  expect(values()).toEqual(["02", "01", "01", "05"]);
  expect(screen.getByRole("heading", { level: 1 }).textContent).toContain("Hay algo bonito");
  act(() => { vi.advanceTimersByTime(1000); });
  expect(values()).toEqual(["02", "01", "01", "04"]);
});
