import { Link } from "react-router-dom";

export function Memory2026Page() {
  return (
    <section className="memory-2026">
      <p>10 de septiembre</p>

      <h1>2026 🌷</h1>

      <p>
        Este fue el primer jardín.
      </p>

      <p>
        Muy pronto podrás volver a vivir aquí
        la experiencia completa de aquel día.
      </p>

      <Link to="/memories">
        ← Volver a recuerdos
      </Link>
    </section>
  );
}
