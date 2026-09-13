// @vitest-environment jsdom
import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { memoryState, MemoryFinalCountdownTimeline, useMemory2026Timeline } from './Memory2026Timeline';
beforeEach(() => { vi.useFakeTimers(); vi.stubGlobal('scrollTo', vi.fn()); history.replaceState({}, '', '/memories/2026'); });
afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals(); });
describe('historical memory', () => {
    it('starts the public home shortcut at ten seconds and plays immediately', () => {
        history.replaceState({}, '', '/memories/2026?replay=1');
        const { result } = renderHook(useMemory2026Timeline);
        expect(result.current.displayCountdown.totalSeconds).toBe(10);
        expect(result.current.playing).toBe(true);
        act(() => vi.advanceTimersByTime(1000));
        expect(result.current.displayCountdown.totalSeconds).toBe(9);
    });
    it('opens the saved celebration without a scroll journey or a running timer', () => {
        const { result } = renderHook(useMemory2026Timeline);
        expect(result.current.phase).toBe('birthday');
        expect(result.current.stages.photo).toBe(true);
        expect(result.current.stages.letter).toBe(true);
        expect(vi.getTimerCount()).toBe(0);
        act(() => { window.dispatchEvent(new Event('scroll')); vi.advanceTimersByTime(30000); });
        expect(result.current.phase).toBe('birthday');
        expect(result.current.finalMs).toBe(13000);
    });
    it('is independent of device date, clamps progress and never reverses the countdown', () => {
        vi.setSystemTime(new Date('2040-01-01'));
        let previous = Infinity;
        for (let i = 0; i <= 1000; i++) {
            const s = memoryState(i / 1000);
            expect(s.displayCountdown.totalSeconds).toBeLessThanOrEqual(previous);
            previous = s.displayCountdown.totalSeconds;
        }
        expect(memoryState(.96).displayCountdown.totalSeconds).toBe(10);
        expect(memoryState(.92).displayCountdown.totalSeconds).toBe(60);
        expect(memoryState(4).phase).toBe('birthday');
        expect(memoryState(NaN).phase).toBe('intro');
    });
    it('preserves the observed original sequence and finite confetti', () => {
        expect(MemoryFinalCountdownTimeline(0).zero).toBe(true);
        expect(MemoryFinalCountdownTimeline(900).moment).toBe(true);
        expect(MemoryFinalCountdownTimeline(2800).shootingStar).toBe(true);
        expect(MemoryFinalCountdownTimeline(4700).music).toBe(true);
        expect(MemoryFinalCountdownTimeline(6800).confetti).toBe(true);
        expect(MemoryFinalCountdownTimeline(10400).photo).toBe(true);
        expect(MemoryFinalCountdownTimeline(12000).confetti).toBe(false);
    });
    it('replays ten seconds, pauses while hidden and resets the whole celebration', () => {
        const { result } = renderHook(useMemory2026Timeline);
        act(() => result.current.replay());
        expect(result.current.displayCountdown.totalSeconds).toBe(10);
        act(() => vi.advanceTimersByTime(3000));
        expect(result.current.displayCountdown.totalSeconds).toBe(7);
        Object.defineProperty(document, 'hidden', { configurable: true, value: true });
        act(() => vi.advanceTimersByTime(60000));
        expect(result.current.displayCountdown.totalSeconds).toBe(7);
        Object.defineProperty(document, 'hidden', { configurable: true, value: false });
        act(() => vi.advanceTimersByTime(7000));
        expect(result.current.phase).toBe('birthday');
        expect(result.current.stages.zero).toBe(true);
        act(() => vi.advanceTimersByTime(13000));
        expect(result.current.stages.letter).toBe(true);
        act(() => result.current.replay());
        expect(result.current.stages.photo).toBe(false);
        expect(result.current.displayCountdown.totalSeconds).toBe(10);
    });
    it('supports a paused DEV seek without advancing time', () => {
        const { result } = renderHook(useMemory2026Timeline);
        act(() => result.current.seek(.96));
        act(() => vi.advanceTimersByTime(15000));
        expect(result.current.displayCountdown.totalSeconds).toBe(10);
        act(() => result.current.setPlaying(true));
        act(() => vi.advanceTimersByTime(1000));
        expect(result.current.displayCountdown.totalSeconds).toBe(9);
        act(() => result.current.seek(.98));
        expect(result.current.displayCountdown.totalSeconds).toBe(5);
    });
});
