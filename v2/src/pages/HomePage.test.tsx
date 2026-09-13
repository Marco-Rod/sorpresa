// @vitest-environment jsdom
import { act, cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import { BIRTHDAY_TIMESTAMP } from "../engines/birthdayEngine";
import { HomePage } from "./HomePage";
import { BirthdayProvider } from "../context/BirthdayContext";
import { AppStateProvider } from "../context/AppStateContext";

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
  expect(screen.getByRole("timer").querySelector("strong")?.textContent).toBe("1");
  act(() => { vi.advanceTimersByTime(250); });
  expect(screen.queryByRole("timer")).toBeNull();
  expect(screen.getByText("El jardín está floreciendo.")).toBeTruthy();
  expect(document.querySelectorAll(".scene")).toHaveLength(1);
});
