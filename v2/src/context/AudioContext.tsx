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

import {
  AudioEngine,
} from "../engines/audio/AudioEngine";

import type {
  AudioTrackId,
} from "../config/audio";

import {
  getStoredMuted,
  storeMuted,
} from "../utils/audioStorage";

import {
  useAppState,
} from "./AppStateContext";

interface AudioContextValue {
  unlocked: boolean;

  muted: boolean;

  currentTrack: AudioTrackId | null;

  unlock: () => Promise<boolean>;

  playTrack: (
    track: AudioTrackId,
  ) => Promise<void>;

  toggleMuted: () => void;
}

const AudioContext =
  createContext<AudioContextValue | null>(null);

interface AudioProviderProps {
  children: ReactNode;
}

export function AudioProvider({
  children,
}: AudioProviderProps) {
  const engineRef =
    useRef<AudioEngine | null>(null);

  // Lazy-init engine once, using stored mute preference.
  if (engineRef.current === null) {
    engineRef.current =
      new AudioEngine(getStoredMuted());
  }

  const [unlocked, setUnlocked] =
    useState(false);

  const [muted, setMuted] =
    useState(getStoredMuted);

  const [currentTrack, setCurrentTrack] =
    useState<AudioTrackId | null>(null);

  const { isVisible } = useAppState();

  // ─── Pause / resume on tab visibility ──────────────────────────────────────

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    if (!isVisible) {
      engine.pause();
      return;
    }

    if (unlocked) {
      void engine.resume();
    }
  }, [isVisible, unlocked]);

  // ─── Cleanup on unmount ─────────────────────────────────────────────────────

  useEffect(() => {
    const engine = engineRef.current;
    return () => {
      engine?.destroy();
    };
  }, []);

  // ─── Public API ─────────────────────────────────────────────────────────────

  const unlock = useCallback(async (): Promise<boolean> => {
    const engine = engineRef.current!;

    const success = await engine.unlock();

    if (!success) {
      return false;
    }

    setUnlocked(true);

    // Start the waiting track immediately after unlocking.
    await engine.playTrack("waiting");
    setCurrentTrack(engine.getCurrentTrack());

    return true;
  }, []);

  const playTrack = useCallback(
    async (track: AudioTrackId): Promise<void> => {
      const engine = engineRef.current!;

      await engine.playTrack(track);
      setCurrentTrack(engine.getCurrentTrack());
    },
    [],
  );

  const toggleMuted = useCallback(() => {
    const engine = engineRef.current!;

    const isMuted = engine.toggleMuted();

    setMuted(isMuted);
    storeMuted(isMuted);
  }, []);

  return (
    <AudioContext.Provider
      value={{
        unlocked,
        muted,
        currentTrack,
        unlock,
        playTrack,
        toggleMuted,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);

  if (!context) {
    throw new Error(
      "useAudio must be used inside AudioProvider",
    );
  }

  return context;
}
