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

import { AmbientEventEngine } from "../engines/ambient/AmbientEventEngine";
import type { AmbientEvent, AmbientEventType } from "../engines/ambient/types";
import type { PerformanceTier } from "../engines/performanceEngine";
import { useAppState } from "./AppStateContext";
import { usePerformance } from "./PerformanceContext";
import { useScene } from "../hooks/useScene";

// ─── Quality filter ───────────────────────────────────────────────────────────

/**
 * Determines which event types are allowed for a given performance tier.
 *
 *  high   → all events
 *  medium → no dandelion (particle-heavy)
 *  low    → only narrative events (shooting-star, pet-visit)
 */
function shouldAllowEvent(
  type: AmbientEventType,
  quality: PerformanceTier,
): boolean {
  if (quality === "high") return true;

  if (quality === "medium") return type !== "dandelion";

  // low: keep only content-relevant events
  return type === "shooting-star" || type === "pet-visit";
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface AmbientEventContextValue {
  event: AmbientEvent | null;
  emitDebugEvent: (type: AmbientEventType) => void;
}

const AmbientEventContext =
  createContext<AmbientEventContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

/** Duration after which the event state is automatically cleared (ms). */
const EVENT_TTL = 7_000;

interface AmbientEventProviderProps {
  children: ReactNode;
}

export function AmbientEventProvider({
  children,
}: AmbientEventProviderProps) {
  const { isVisible } = useAppState();
  const { quality, reducedMotion } = usePerformance();
  const scene = useScene();

  // Refs so closures always read the latest values without recreating the engine.
  const sceneRef = useRef(scene);
  sceneRef.current = scene;

  const qualityRef = useRef(quality);
  qualityRef.current = quality;

  const [event, setEvent] = useState<AmbientEvent | null>(null);

  const engineRef = useRef<AmbientEventEngine | null>(null);
  const eventTimeoutRef = useRef<number | null>(null);

  // Create the engine once on mount.
  useEffect(() => {
    const engine = new AmbientEventEngine({
      onEvent: nextEvent => {
        // Apply quality filter in-flight so the engine itself stays stateless.
        if (!shouldAllowEvent(nextEvent.type, qualityRef.current)) return;

        setEvent(nextEvent);

        // Auto-clear after the event animation has finished.
        if (eventTimeoutRef.current !== null) {
          window.clearTimeout(eventTimeoutRef.current);
        }
        eventTimeoutRef.current = window.setTimeout(() => {
          setEvent(null);
          eventTimeoutRef.current = null;
        }, EVENT_TTL);
      },

      getScene: () => sceneRef.current,
    });

    engineRef.current = engine;
    engine.start();

    return () => {
      engine.destroy();
      engineRef.current = null;

      if (eventTimeoutRef.current !== null) {
        window.clearTimeout(eventTimeoutRef.current);
        eventTimeoutRef.current = null;
      }
    };
  }, []);

  // Pause / resume based on visibility and reduced-motion preference.
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    if (!isVisible || reducedMotion) {
      engine.pause();
      return;
    }

    engine.resume();
  }, [isVisible, reducedMotion]);

  const emitDebugEvent = useCallback(
    (type: AmbientEventType) => {
      engineRef.current?.emitDebugEvent(type);
    },
    [],
  );

  return (
    <AmbientEventContext.Provider value={{ event, emitDebugEvent }}>
      {children}
    </AmbientEventContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAmbientEvent() {
  const context = useContext(AmbientEventContext);

  if (!context) {
    throw new Error(
      "useAmbientEvent must be used inside AmbientEventProvider",
    );
  }

  return context;
}
