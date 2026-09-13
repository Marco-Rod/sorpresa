import {
  PetalField,
} from "../effects/PetalField";

export function SunsetScene() {
  return (
    <div className="scene scene--sunset sunset-scene">
      <PetalField />

      <div className="sunset-scene__content">
        <span
          className="sunset-scene__sun"
          aria-hidden="true"
        >
          🌇
        </span>

        <p>
          El cielo comienza a cambiar.
        </p>
      </div>
    </div>
  );
}
