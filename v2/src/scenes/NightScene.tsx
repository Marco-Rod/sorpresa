import {
  StarField,
} from "../effects/StarField";

export function NightScene() {
  return (
    <div className="scene scene--night night-scene">
      <StarField />

      <div className="night-scene__content">
        <span
          className="night-scene__moon"
          aria-hidden="true"
        >
          🌙
        </span>

        <p>
          Las estrellas comienzan
          a aparecer.
        </p>
      </div>
    </div>
  );
}
