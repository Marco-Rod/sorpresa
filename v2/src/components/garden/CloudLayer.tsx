import {
  Cloud,
} from "./Cloud";

import {
  usePerformance,
} from "../../context/PerformanceContext";

interface CloudLayerProps {
  mood:
    | "morning"
    | "day"
    | "sunset";
}

export function CloudLayer({
  mood,
}: CloudLayerProps) {
  const {
    quality,
    reducedMotion,
  } = usePerformance();

  return (
    <div
      className={[
        "cloud-layer",
        `cloud-layer--${mood}`,
        reducedMotion
          ? "cloud-layer--static"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-hidden="true"
    >
      <div className="cloud-layer__cloud cloud-layer__cloud--1">
        <Cloud
          size="small"
        />
      </div>

      {quality !== "low" && (
        <div className="cloud-layer__cloud cloud-layer__cloud--2">
          <Cloud
            size="large"
          />
        </div>
      )}

      {quality === "high" && (
        <div className="cloud-layer__cloud cloud-layer__cloud--3">
          <Cloud />
        </div>
      )}
    </div>
  );
}