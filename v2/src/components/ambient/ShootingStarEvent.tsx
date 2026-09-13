import { useMemo, type CSSProperties } from "react";

export function ShootingStarEvent() {
  // Randomize position once per mount (i.e. once per event).
  const style = useMemo(
    () =>
      ({
        "--shooting-top": `${8 + Math.random() * 24}%`,
        "--shooting-left": `${62 + Math.random() * 26}%`,
      }) as CSSProperties,
    [],
  );

  return (
    <div className="shooting-star-event" aria-hidden="true">
      <span style={style} />
    </div>
  );
}
