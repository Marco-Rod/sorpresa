/* oxlint-disable react/only-export-components -- Provider and consumer share an API */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { useAppState } from "./AppStateContext";
import { TimelineEngine } from "../engines/timeline/TimelineEngine";

// ─── State ───────────────────────────────────────────────────────────────────

interface CelebrationState {
  started: boolean;
  complete: boolean;

  showFlash: boolean;
  showPhoto: boolean;
  showMessage: boolean;
  showPets: boolean;
  showLetterButton: boolean;

  /** Increments each time a confetti burst should fire. */
  confettiBurst: number;

  letterOpen: boolean;
}

const INITIAL_STATE: CelebrationState = {
  started: false,
  complete: false,

  showFlash: false,
  showPhoto: false,
  showMessage: false,
  showPets: false,
  showLetterButton: false,

  confettiBurst: 0,

  letterOpen: false,
};

// ─── Context ─────────────────────────────────────────────────────────────────

interface CelebrationContextValue extends CelebrationState {
  startCelebration: () => void;
  resetCelebration: () => void;
  replayCelebration: () => void;

  openLetter: () => void;
  closeLetter: () => void;
}

const CelebrationContext =
  createContext<CelebrationContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

interface CelebrationProviderProps {
  children: ReactNode;
}

export function CelebrationProvider({
  children,
}: CelebrationProviderProps) {
  const { isVisible } = useAppState();

  const [state, setState] = useState<CelebrationState>(INITIAL_STATE);

  const timelineRef = useRef<TimelineEngine | null>(null);

  // Build (or rebuild) the timeline, wiring all cues to setState.
  const buildTimeline = useCallback(() => {
    timelineRef.current?.destroy();

    timelineRef.current = new TimelineEngine({
      // Sequence: flash(0) → confetti(250) → flash-off(500) → photo(750)
      //           → message(1550) → pets(2100) → letter(2600) → [complete]
      duration: 3400,

      cues: [
        {
          id: "flash-on",
          at: 0,
          run: () =>
            setState(s => ({ ...s, started: true, showFlash: true })),
        },
        {
          id: "confetti",
          at: 250,
          run: () =>
            setState(s => ({ ...s, confettiBurst: s.confettiBurst + 1 })),
        },
        {
          id: "flash-off",
          at: 500,
          run: () => setState(s => ({ ...s, showFlash: false })),
        },
        {
          id: "photo",
          at: 750,
          run: () => setState(s => ({ ...s, showPhoto: true })),
        },
        {
          id: "message",
          at: 1550,
          run: () => setState(s => ({ ...s, showMessage: true })),
        },
        {
          id: "pets",
          at: 2100,
          run: () => setState(s => ({ ...s, showPets: true })),
        },
        {
          id: "letter",
          at: 2600,
          run: () => setState(s => ({ ...s, showLetterButton: true })),
        },
      ],

      onComplete: () => setState(s => ({ ...s, complete: true })),
    });
  }, []);

  // Build once on mount; destroy on unmount.
  useEffect(() => {
    buildTimeline();
    return () => {
      timelineRef.current?.destroy();
    };
  }, [buildTimeline]);

  // Pause / resume when the tab becomes hidden / visible.
  useEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline) return;

    if (!isVisible) {
      timeline.pause();
      return;
    }

    if (state.started && !state.complete) {
      timeline.resume();
    }
  }, [isVisible, state.started, state.complete]);

  // ─── API ─────────────────────────────────────────────────────────────────

  const startCelebration = useCallback(() => {
    const timeline = timelineRef.current;
    if (!timeline || state.started) return;
    timeline.start();
  }, [state.started]);

  const resetCelebration = useCallback(() => {
    timelineRef.current?.reset();
    setState(INITIAL_STATE);
  }, []);

  /**
   * Replay: reset + start in a single rAF so React state is flushed
   * before the timeline fires its first cue.
   */
  const replayCelebration = useCallback(() => {
    const timeline = timelineRef.current;
    if (!timeline) return;

    timeline.reset();
    setState(INITIAL_STATE);

    requestAnimationFrame(() => {
      timeline.start();
    });
  }, []);

  const openLetter = useCallback(() => {
    setState(s => ({ ...s, letterOpen: true }));
  }, []);

  const closeLetter = useCallback(() => {
    setState(s => ({ ...s, letterOpen: false }));
  }, []);

  return (
    <CelebrationContext.Provider
      value={{
        ...state,
        startCelebration,
        resetCelebration,
        replayCelebration,
        openLetter,
        closeLetter,
      }}
    >
      {children}
    </CelebrationContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useCelebration() {
  const context = useContext(CelebrationContext);

  if (!context) {
    throw new Error(
      "useCelebration must be used inside CelebrationProvider",
    );
  }

  return context;
}
