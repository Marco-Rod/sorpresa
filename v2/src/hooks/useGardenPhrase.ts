import { useEffect, useRef, useState } from "react";
import type { SceneName } from "../engines/sceneEngine";
import { GARDEN_PHRASES } from "../config/phrases";
import { useAppState } from "../context/AppStateContext";

/** How long each phrase is visible before the next one is chosen (ms). */
const DISPLAY_DURATION = 12_000;

/** Time for the fade-out + fade-in transition (ms). Must match CSS. */
const TRANSITION_DURATION = 600;

function pickPhrase(scene: SceneName, excludeId?: string): string {
  const candidates = GARDEN_PHRASES.filter(p =>
    !p.scenes || p.scenes.includes(scene),
  );

  if (candidates.length === 0) return "";

  // Build a weighted pool — a phrase with weight 2 appears twice.
  const pool: string[] = [];
  for (const phrase of candidates) {
    if (phrase.id === excludeId) continue; // avoid immediate repetition
    const w = phrase.weight ?? 1;
    for (let i = 0; i < w; i++) pool.push(phrase.id);
  }

  // Fallback: if we excluded the only phrase, allow it back.
  if (pool.length === 0) return candidates[0].text;

  const id = pool[Math.floor(Math.random() * pool.length)];
  return GARDEN_PHRASES.find(p => p.id === id)?.text ?? "";
}

interface GardenPhraseState {
  text: string;
  visible: boolean;
}

/**
 * Returns the current phrase and its visibility flag.
 *
 * `visible` toggles false briefly during the cross-fade so the CSS
 * transition has a moment to fade out before the text changes.
 *
 * Rotation pauses automatically when the page is hidden (tab background,
 * screen lock) and resumes when it becomes visible again.
 */
export function useGardenPhrase(scene: SceneName): GardenPhraseState {
  const { isVisible } = useAppState();

  const [text, setText] = useState(() => pickPhrase(scene));
  const [visible, setVisible] = useState(true);

  const currentIdRef = useRef<string>("");
  const timerRef     = useRef<number | null>(null);

  // Re-pick immediately when the scene changes.
  useEffect(() => {
    setText(pickPhrase(scene));
    setVisible(true);
    currentIdRef.current = "";
  }, [scene]);

  // Rotation loop — pauses when the tab is hidden.
  useEffect(() => {
    if (!isVisible) {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    const scheduleNext = () => {
      timerRef.current = window.setTimeout(() => {
        // Step 1: fade out.
        setVisible(false);

        // Step 2: after transition, swap text and fade in.
        timerRef.current = window.setTimeout(() => {
          const next = pickPhrase(scene, currentIdRef.current);
          currentIdRef.current = GARDEN_PHRASES.find(p => p.text === next)?.id ?? "";
          setText(next);
          setVisible(true);

          scheduleNext();
        }, TRANSITION_DURATION);
      }, DISPLAY_DURATION);
    };

    scheduleNext();

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [scene, isVisible]);

  return { text, visible };
}
