import { Link } from "react-router-dom";

import { Moon } from "../../components/garden/Moon";
import { VirgoConstellation } from "../../components/garden/VirgoConstellation";
import { StarField } from "../../effects/StarField";
import { MEMORY_2026 } from "./memory2026.config";

export function Memory2026Hero() {
  return (
    <section className="memory-2026-hero">
      <StarField />

      <div className="memory-2026-hero__moon" aria-hidden="true">
        <Moon />
      </div>

      <div className="memory-2026-hero__virgo" aria-hidden="true">
        <VirgoConstellation />
      </div>

      <div className="memory-2026-hero__content">
        <span className="memory-2026-hero__year">{MEMORY_2026.year}</span>

        <h1>{MEMORY_2026.title}</h1>

        <p>{MEMORY_2026.subtitle}</p>

        <a
          href="#memory-2026-story"
          className="memory-2026-hero__enter"
        >
          Volver a ese día
        </a>
      </div>

      <Link to="/memories" className="memory-back">
        ← Recuerdos
      </Link>
    </section>
  );
}
