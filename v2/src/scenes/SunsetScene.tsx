import {
  DaylightScene,
} from "./components/DaylightScene";

export function SunsetScene() {
  return (
    <DaylightScene
      mood="sunset"
      message="El cielo comienza a cambiar."
      petalIntensity={1}
    />
  );
}