import { Link } from "react-router-dom";
import { BIRTHDAY_CONFIG } from "../config/birthday";

export function HomePage() {
  return (
    <section className="home-page">
      <div className="home-page__content">
        <span className="home-page__flower" aria-hidden="true">
          🌷
        </span>

        <p className="home-page__eyebrow">
          Para {BIRTHDAY_CONFIG.person.name}
        </p>

        <h1>{BIRTHDAY_CONFIG.experience.title}</h1>

        <p className="home-page__description">
          El jardín descansa por ahora.
          <br />
          Volverá a florecer en septiembre.
        </p>

        <Link
          className="home-page__memories"
          to="/memories"
        >
          Visitar recuerdos
        </Link>
      </div>
    </section>
  );
}
