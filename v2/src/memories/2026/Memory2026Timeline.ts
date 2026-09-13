import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
export type Memory2026Phase = 'intro' | 'morning' | 'day' | 'sunset' | 'night' | 'final-countdown' | 'birthday';
export const MEMORY_PHASES: [
    Memory2026Phase,
    number
][] = [['intro', 0], ['morning', .1], ['day', .3], ['sunset', .5], ['night', .68], ['final-countdown', .92], ['birthday', 1]];
const ANCHORS = [[0, 320400], [.1, 259200], [.3, 129600], [.5, 43200], [.68, 14400], [.85, 3600], [.92, 60], [.96, 10], [1, 0]];
export function memoryState(progress: number, celebrationMs = 0) {
    const p = Math.max(0, Math.min(1, Number.isFinite(progress) ? progress : 0));
    const phase = [...MEMORY_PHASES].reverse().find(([, start]) => p >= start)![0];
    const index = Math.max(0, ANCHORS.findIndex(([x]) => x >= p) - 1);
    const [x, a] = ANCHORS[index];
    const [y, b] = ANCHORS[index + 1];
    const totalSeconds = p === 1 ? 0 : Math.ceil(a + (b - a) * (p - x) / (y - x));
    return { progress: p, phase, displayCountdown: { totalSeconds, days: Math.floor(totalSeconds / 86400), hours: Math.floor(totalSeconds / 3600) % 24, minutes: Math.floor(totalSeconds / 60) % 60, seconds: totalSeconds % 60 }, celebrationProgress: Math.min(1, Math.max(0, celebrationMs) / 13000) };
}
/** Historical sequence from beginBirthday(), not the live BirthdayProvider. */
export function MemoryFinalCountdownTimeline(ms: number) {
    return { zero: ms >= 0 && ms < 900, moment: ms >= 900 && ms < 2800, shootingStar: ms >= 2800 && ms < 4700, bloom: ms >= 2800, message: ms >= 4700 && ms < 10400, music: ms >= 4700, confetti: ms >= 6800 && ms < 12000, photo: ms >= 10400, pets: ms >= 11400, letter: ms >= 12000 };
}
export function useMemory2026Timeline(element?: RefObject<HTMLElement | null>) {
    const [progress, setProgress] = useState(() => {
        // Public shortcut from the home page; independent of the live birthday clock.
        if (new URLSearchParams(location.search).get('replay') === '1') return .96;
        if (!import.meta.env.DEV)
            return 1;
        const requested = new URLSearchParams(location.search).get('debugPhase');
        return requested === 't-10' ? .96 : 1;
    });
    const [elapsed, setElapsed] = useState(0);
    const [finalMs, setFinalMs] = useState<number | null>(() => progress === 1 ? 13000 : progress >= .96 ? -10000 : null);
    const [playing, setPlaying] = useState(() => progress < 1);
    const fallbackRoot = useRef<HTMLElement>(null);
    const root = element ?? fallbackRoot;


    const seek = useCallback((p: number, autoplay = false) => {
        const next = p === 1 ? (autoplay ? 0 : 13000) : p >= .96 ? -Math.round((1 - p) / .04 * 10000) : null;

        setProgress(p);
        setElapsed(0);
        setFinalMs(next);
        setPlaying(autoplay || p < .96);
        const el = root.current;
        if (el)
            window.scrollTo({ top: el.offsetTop, behavior: 'instant' });
    }, [root]);
    const complete = finalMs === 13000;
    useEffect(() => {
        if (complete || !playing)
            return;
        let timer: number | undefined;
        const sync = () => {
            clearInterval(timer);
            if (document.hidden)
                return;
            let previous = performance.now();
            timer = window.setInterval(() => {
                const now = performance.now();
                const delta = Math.min(300, now - previous);
                previous = now;
                if (document.hidden)
                    return;
                setElapsed(value => value + delta);
                setFinalMs(value => value === null ? null : Math.min(13000, value + delta));
            }, 100);
        };
        sync();
        document.addEventListener('visibilitychange', sync);
        return () => { clearInterval(timer); document.removeEventListener('visibilitychange', sync); };
    }, [playing, complete]);
    const p = finalMs === null ? progress : finalMs < 0 ? .96 + .04 * (1 + finalMs / 10000) : 1;
    return { ...memoryState(p, finalMs ?? 0), elapsed, finalMs, playing, setPlaying, seek, replay: () => seek(.96, true), stages: MemoryFinalCountdownTimeline(finalMs ?? -10000) };
}


