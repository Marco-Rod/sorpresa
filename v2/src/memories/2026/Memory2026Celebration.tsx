import { useState } from "react";

import { HeartFrame } from "../../components/celebration/HeartFrame";
import { PetCloud } from "../../components/pets/PetCloud";
import { MEMORY_2026 } from "./memory2026.config";

/**
 * Celebración histórica 2026.
 *
 * Usa estado local en lugar de CelebrationProvider (global 2027)
 * para que el recuerdo sea completamente independiente de la
 * experiencia actual.
 */
export function Memory2026Celebration() {
  const [active, setActive] = useState(false);

  return (
    <section className="memory-2026-celebration">
      {!active ? (
        <div className="memory-2026-celebration__intro">
          <span>10 de septiembre de {MEMORY_2026.year}</span>

          <h2>Y finalmente llegó el momento.</h2>

          <button
            type="button"
            className="memory-2026-celebration__trigger"
            onClick={() => setActive(true)}
          >
            Revivir la celebración ✨
          </button>
        </div>
      ) : (
        <div className="memory-2026-celebration__scene">
          <HeartFrame src={MEMORY_2026.photo} alt={MEMORY_2026.person.name} />

          <h2>
            Feliz cumpleaños,{" "}
            {MEMORY_2026.person.name} 🌸
          </h2>

          <PetCloud />

          <p className="memory-2026-celebration__closing">
            {MEMORY_2026.closing}
          </p>

          <button
            type="button"
            className="memory-2026-celebration__back"
            onClick={() => setActive(false)}
          >
            Volver
          </button>
        </div>
      )}
    </section>
  );
}
