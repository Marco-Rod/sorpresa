import "./memory2026.css";

import { Memory2026Celebration } from "./Memory2026Celebration";
import { Memory2026Hero } from "./Memory2026Hero";
import { Memory2026Journey } from "./Memory2026Journey";
import { Memory2026Pets } from "./Memory2026Pets";
import { Memory2026Phrases } from "./Memory2026Phrases";

/**
 * Cápsula histórica del 10 de septiembre de 2026.
 *
 * Este componente es el punto de entrada para /memories/2026.
 * Su contenido (config, frases, carta, audio) debe permanecer
 * estable — no cambia con cada año nuevo.
 */
export function Memory2026() {
  return (
    <article className="memory-2026-page">
      <Memory2026Hero />

      <Memory2026Journey />

      <Memory2026Phrases />

      <Memory2026Pets />

      <Memory2026Celebration />
    </article>
  );
}
