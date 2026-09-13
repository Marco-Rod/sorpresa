import { Link } from "react-router-dom";

import {
  BIRTHDAY_CONFIG,
} from "../config/birthday";

import {
  SceneRenderer,
} from "../scenes/SceneRenderer";

export function HomePage() {
  return (
    <section className="home-page">
      <div className="home-page__content">
        <p className="home-page__eyebrow">
          Para {
            BIRTHDAY_CONFIG
              .person
              .name
          }
        </p>

        <h1>
          {
            BIRTHDAY_CONFIG
              .experience
              .title
          }
        </h1>

        <SceneRenderer />

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
