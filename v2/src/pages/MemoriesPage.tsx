import { Link } from "react-router-dom";

export function MemoriesPage() {
  return (
    <section className="memories-page">
      <header>
        <p>Un jardín en septiembre</p>
        <h1>Recuerdos 🌸</h1>
      </header>

      <article className="memory-card">
        <span className="memory-card__year">
          2026
        </span>

        <h2>Donde comenzó el jardín</h2>

        <p>
          Un cumpleaños, un jardín y una noche
          llena de pequeñas sorpresas.
        </p>

        <Link to="/memories/2026">
          Volver a ese día
        </Link>
      </article>

      <Link to="/">
        ← Volver al jardín
      </Link>
    </section>
  );
}
