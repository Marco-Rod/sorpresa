import { useEffect } from "react";
import { useAudio } from "../context/AudioContext";

/**
 * Attaches one-time global listeners so the audio context is unlocked
 * on the very first user interaction — anywhere on the page.
 */
export function useAudioUnlock() {
  const { unlocked, unlock } = useAudio();

  useEffect(() => {
    if (unlocked) {
      return;
    }

    const handleInteraction = () => {
      void unlock();
    };

    window.addEventListener("pointerdown", handleInteraction, {
      once: true,
      passive: true,
    });

    window.addEventListener("keydown", handleInteraction, {
      once: true,
    });

    return () => {
      window.removeEventListener("pointerdown", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
    };
  }, [unlocked, unlock]);
}
