import {
  DaylightScene,
} from "./components/DaylightScene";

export function MorningScene() {
  return (
    <DaylightScene
      mood="morning"
      message="El jardín comienza a despertar."
      petalIntensity={0.18}
    />
  );
}