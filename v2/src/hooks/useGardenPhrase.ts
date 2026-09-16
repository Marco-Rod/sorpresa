import { useEffect, useRef, useState } from 'react';
import type { GardenPhrase } from '../config/phrases';
import { useAppState } from '../context/AppStateContext';
import { nextGardenPhrase } from '../engines/phrases/phraseRotation';

export const DISPLAY_DURATION = 20_000;
const TRANSITION_DURATION = 600;

export function useGardenPhrase(paused = false) {
  const { isVisible } = useAppState();
  const current = useRef<GardenPhrase | null>(null);
  const [phrase, setPhrase] = useState<GardenPhrase | null>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!isVisible || paused) return;
    // The ref also prevents StrictMode's effect replay from consuming two phrases.
    if (!current.current) {
      current.current = nextGardenPhrase();
      setPhrase(current.current);
    }
    setVisible(true);
    let timer: number;
    const schedule = () => {
      timer = window.setTimeout(() => {
        setVisible(false);
        timer = window.setTimeout(() => {
          current.current = nextGardenPhrase();
          setPhrase(current.current);
          setVisible(true);
          schedule();
        }, TRANSITION_DURATION);
      }, DISPLAY_DURATION);
    };
    schedule();
    return () => window.clearTimeout(timer);
  }, [isVisible, paused]);

  return { phrase, visible };
}
