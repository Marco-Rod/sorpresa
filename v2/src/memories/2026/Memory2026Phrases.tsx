import { MEMORY_2026 } from "./memory2026.config";

export function Memory2026Phrases() {
  return (
    <section className="memory-2026-phrases">
      <div className="memory-2026-phrases__inner">
        <span>Algunas cosas que quedaron</span>

        {MEMORY_2026.phrases.map(phrase => (
          <blockquote key={phrase.id}>{phrase.text}</blockquote>
        ))}
      </div>
    </section>
  );
}
