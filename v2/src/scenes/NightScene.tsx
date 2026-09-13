import {
  GardenLayer,
} from "../components/garden/GardenLayer";

import {
  Moon,
} from "../components/garden/Moon";

import {
  VirgoConstellation,
} from "../components/garden/VirgoConstellation";

import {
  FireflyField,
} from "../effects/FireflyField";

import {
  PetalField,
} from "../effects/PetalField";

import {
  StarField,
} from "../effects/StarField";

export function NightScene() {
  return (
    <section className="scene scene--night night-scene" aria-label="Jardín nocturno">
      <StarField />

      <div className="night-scene__sky">
        <div className="night-scene__moon">
          <Moon />
        </div>

        <div className="night-scene__virgo">
          <VirgoConstellation />
        </div>
      </div>

      <div className="night-scene__horizon" aria-hidden="true" />

      <GardenLayer mood="night" />

      <FireflyField />

      <PetalField
        intensity={0.35}
      />

      <div className="night-scene__content">
        <p>
          Las estrellas empiezan
          a aparecer.
        </p>
      </div>
    </section>
  );
}
