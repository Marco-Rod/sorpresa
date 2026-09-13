import { useEffect } from "react";

import { PETS } from "../config/pets";
import { useBirthdayPhase } from "../context/BirthdayContext";
import { preloadImage } from "../utils/preloadImage";

/**
 * Preloads birthday photo and pet images during the final countdown
 * so they are ready in the browser cache when the celebration starts.
 * Assets are never downloaded before the last 10 seconds.
 */
export function useCelebrationPreload() {
  const phase = useBirthdayPhase();

  useEffect(() => {
    if (phase !== "final-countdown") return;

    void preloadImage("/images/birthday-photo.webp");

    for (const pet of PETS) {
      void preloadImage(pet.src);
    }
  }, [phase]);
}
