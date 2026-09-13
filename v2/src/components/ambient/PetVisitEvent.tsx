import { useMemo } from "react";
import type { SceneName } from "../../engines/sceneEngine";

interface PetVisitEventProps {
  scene: SceneName;
}

type PetVisit = "dogs" | "max";

export function PetVisitEvent({ scene }: PetVisitEventProps) {
  // 72 % chance Lucas + Lupe; 28 % chance Max alone.
  const visit = useMemo<PetVisit>(
    () => (Math.random() < 0.72 ? "dogs" : "max"),
    [],
  );

  return (
    <div
      className={[
        "pet-visit",
        `pet-visit--${visit}`,
        `pet-visit--${scene}`,
      ].join(" ")}
      aria-hidden="true"
    >
      {visit === "dogs" ? (
        <>
          <img
            src="/pets/lucas.webp"
            alt=""
            className="pet-visit__lucas"
            draggable="false"
          />
          <img
            src="/pets/lupe.webp"
            alt=""
            className="pet-visit__lupe"
            draggable="false"
          />
        </>
      ) : (
        <img
          src="/pets/max.webp"
          alt=""
          className="pet-visit__max"
          draggable="false"
        />
      )}
    </div>
  );
}
