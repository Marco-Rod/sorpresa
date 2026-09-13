import { Link } from "react-router-dom";

export function MemoriesPage() {
  return (
    <section className="memories-page">
      <header>
        <p className="home-page__eyebrow">Jardines que ya florecieron</p>
        <h1>Recuerdos 🌸</h1>
      </header>

      <div className="memory-cards">
        <Link to="/memories/2026" className="memory-card">
          <span className="memory-card__year">2026</span>

          <strong>Un jardín en septiembre</strong>

          <small>
            El primer cumpleaños. Flores, noche, Virgo y una sorpresa que comenzó
            aquí.
          </small>
        </Link>
      </div>

      <Link to="/" className="memory-card__back">
        ← Volver al jardín actual
      </Link>
    </section>
  );
}
