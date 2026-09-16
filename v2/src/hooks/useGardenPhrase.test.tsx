// @vitest-environment jsdom
import { StrictMode } from 'react';
import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { useGardenPhrase, DISPLAY_DURATION } from './useGardenPhrase';
import { PHRASE_STORAGE_KEY } from '../engines/phrases/phraseRotation';
let isVisible = true;
vi.mock('../context/AppStateContext', () => ({ useAppState: () => ({ isVisible }) }));
afterEach(() => { cleanup(); vi.useRealTimers(); localStorage.clear(); isVisible = true; });
it('draws once in StrictMode and pauses without consuming phrases in a hidden tab', () => {
  vi.useFakeTimers();
  const { result, rerender, unmount } = renderHook(() => useGardenPhrase(), { wrapper: StrictMode });
  expect(JSON.parse(localStorage.getItem(PHRASE_STORAGE_KEY)!).seen).toHaveLength(1);
  const first = result.current.phrase!.id;
  act(() => { vi.advanceTimersByTime(DISPLAY_DURATION); });
  expect(result.current.visible).toBe(false);
  isVisible = false; rerender();
  act(() => { vi.advanceTimersByTime(120_000); });
  expect(result.current.phrase!.id).toBe(first);
  isVisible = true; rerender();
  expect(result.current.visible).toBe(true);
  act(() => { vi.advanceTimersByTime(DISPLAY_DURATION + 600); });
  expect(result.current.phrase!.id).not.toBe(first);
  unmount();
  const saved = localStorage.getItem(PHRASE_STORAGE_KEY);
  act(() => { vi.advanceTimersByTime(120_000); });
  expect(localStorage.getItem(PHRASE_STORAGE_KEY)).toBe(saved);
});
it('holds the source still while focused or hovered', () => {
  vi.useFakeTimers();
  const { result, rerender } = renderHook(({ paused }) => useGardenPhrase(paused), { initialProps: { paused: false } });
  const id = result.current.phrase!.id;
  rerender({ paused: true });
  act(() => { vi.advanceTimersByTime(120_000); });
  expect(result.current.phrase!.id).toBe(id);
  rerender({ paused: false });
  act(() => { vi.advanceTimersByTime(DISPLAY_DURATION + 600); });
  expect(result.current.phrase!.id).not.toBe(id);
});
