import {
  usePerformance,
} from "../../context/PerformanceContext";

import {
  Butterfly,
} from "./Butterfly";

export function ButterflyLayer() {
  const {
    quality,
    reducedMotion,
  } = usePerformance();

  if (
    quality === "low" ||
    reducedMotion
  ) {
    return null;
  }

  const count =
    quality === "high"
      ? 4
      : 2;

  return (
    <div
      className="butterfly-layer"
      aria-hidden="true"
    >
      {Array.from({
        length: count,
      }).map(
        (_, index) => (
          <div
            key={index}
            className={
              `butterfly-flight butterfly-flight--${index + 1}`
            }
          >
            <Butterfly
              variant={
                (
                  index %
                  3
                ) as
                  | 0
                  | 1
                  | 2
              }
            />
          </div>
        ),
      )}
    </div>
  );
}