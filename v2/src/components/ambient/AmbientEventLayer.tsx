import { useAmbientEvent } from "../../context/AmbientEventContext";
import { DandelionEvent } from "./DandelionEvent";
import { PetVisitEvent } from "./PetVisitEvent";
import { ShootingStarEvent } from "./ShootingStarEvent";
import { SparkleEvent } from "./SparkleEvent";
import { WindGustEvent } from "./WindGustEvent";

export function AmbientEventLayer() {
  const { event } = useAmbientEvent();

  if (!event) {
    return (
      <div className="ambient-event-layer" aria-hidden="true" />
    );
  }

  const renderEvent = () => {
    switch (event.type) {
      case "shooting-star":
        return <ShootingStarEvent key={event.id} />;

      case "wind-gust":
        return <WindGustEvent key={event.id} />;

      case "dandelion":
        return <DandelionEvent key={event.id} />;

      case "pet-visit":
        return <PetVisitEvent key={event.id} scene={event.scene} />;

      case "sparkle":
        return <SparkleEvent key={event.id} />;

      default:
        return null;
    }
  };

  return (
    <div className="ambient-event-layer" aria-hidden="true">
      {renderEvent()}
    </div>
  );
}
