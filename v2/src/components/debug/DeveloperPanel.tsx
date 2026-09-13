import { useState } from "react";

import { useAmbientEvent } from "../../context/AmbientEventContext";
import { useCelebration } from "../../context/CelebrationContext";
import { useDevTools, type TimePreset } from "../../context/DevToolsContext";
import { usePerformance } from "../../context/PerformanceContext";
import { PerformanceLab } from "../../debug/performance/PerformanceLab";
import type { AmbientEventType } from "../../engines/ambient/types";
import type { PerformanceTier } from "../../engines/performanceEngine";
import type { SceneName } from "../../engines/sceneEngine";
import { DEBUG_ENABLED } from "../../utils/debugFlag";

const SCENES: SceneName[] = [
  "morning",
  "day",
  "sunset",
  "night",
  "final-countdown",
  "birthday",
];

const QUALITIES: PerformanceTier[] = ["high", "medium", "low"];

const AMBIENT_TYPES: AmbientEventType[] = [
  "shooting-star",
  "wind-gust",
  "dandelion",
  "pet-visit",
  "sparkle",
];

const TIME_PRESETS: { label: string; value: TimePreset }[] = [
  { label: "Real",      value: "real"      },
  { label: "T−60s",     value: "final-60"  },
  { label: "T−10s",     value: "final-10"  },
  { label: "Birthday",  value: "birthday"  },
];

export function DeveloperPanel() {
  if (!DEBUG_ENABLED) return null;
  return <DeveloperPanelInner />;
}

function DeveloperPanelInner() {
  const [open, setOpen] = useState(false);

  const devTools = useDevTools();
  const { quality, qualityMode } = usePerformance();
  const { emitDebugEvent }       = useAmbientEvent();
  const {
    startCelebration,
    replayCelebration,
    openLetter,
    closeLetter,
  } = useCelebration();

  return (
    <aside
      className={[
        "developer-panel",
        open ? "developer-panel--open" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <button
        type="button"
        className="developer-panel__toggle"
        onClick={() => setOpen(v => !v)}
      >
        DEV
      </button>

      {open && (
        <div className="developer-panel__body">
          {/* Live performance metrics */}
          <section>
            <strong>Metrics</strong>
            <PerformanceLab />
          </section>

          {/* Quick summary */}
          <section>
            <strong>Quick</strong>
            <div style={{ marginTop: 4, lineHeight: 1.6, fontSize: 11 }}>
              <div>{quality.toUpperCase()} · {qualityMode}</div>
            </div>
          </section>

          {/* Scene */}
          {devTools && (
            <section>
              <strong>Scene</strong>
              <div className="dev-buttons">
                <button type="button" onClick={() => devTools.setScene(null)}>
                  Auto
                </button>
                {SCENES.map(s => (
                  <button key={s} type="button" onClick={() => devTools.setScene(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Quality */}
          {devTools && (
            <section>
              <strong>Quality</strong>
              <div className="dev-buttons">
                <button type="button" onClick={() => devTools.setQuality(null)}>
                  Auto
                </button>
                {QUALITIES.map(q => (
                  <button key={q} type="button" onClick={() => devTools.setQuality(q)}>
                    {q}
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Time preview */}
          {devTools && (
            <section>
              <strong>Time</strong>
              <div className="dev-buttons">
                {TIME_PRESETS.map(({ label, value }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => devTools.setTimePreset(value)}
                    style={
                      devTools.timePreset === value
                        ? { outline: "1px solid rgba(255,255,255,0.7)" }
                        : undefined
                    }
                  >
                    {label}
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Ambient events */}
          <section>
            <strong>Ambient</strong>
            <div className="dev-buttons">
              {AMBIENT_TYPES.map(t => (
                <button key={t} type="button" onClick={() => emitDebugEvent(t)}>
                  {t}
                </button>
              ))}
            </div>
          </section>

          {/* Celebration */}
          <section>
            <strong>Celebration</strong>
            <div className="dev-buttons">
              <button type="button" onClick={startCelebration}>Start</button>
              <button type="button" onClick={replayCelebration}>Replay</button>
              <button type="button" onClick={openLetter}>Letter</button>
              <button type="button" onClick={closeLetter}>Close</button>
            </div>
          </section>
        </div>
      )}
    </aside>
  );
}
