import {
  DaylightScene,
} from "./components/DaylightScene";

export function DayScene() {
  return (
    <DaylightScene
      mood="day"
      message="El jardín disfruta de la luz."
      petalIntensity={0.12}
    />
  );
}