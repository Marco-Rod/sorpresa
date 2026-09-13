import { useMemo } from "react";

interface Seed {
  id: number;
  y: number;
  delay: number;
  duration: number;
}

export function DandelionEvent() {
  const seeds = useMemo<Seed[]>(
    () =>
      Array.from({ length: 8 }, (_, index) => ({
        id: index,
        y: 38 + Math.random() * 34,
        delay: Math.random() * 900,
        duration: 4 + Math.random() * 2.5,
      })),
    [],
  );

  return (
    <div className="dandelion-event" aria-hidden="true">
      {seeds.map(seed => (
        <span
          key={seed.id}
          className="dandelion-seed"
          style={{
            top: `${seed.y}%`,
            animationDelay: `${seed.delay}ms`,
            animationDuration: `${seed.duration}s`,
          }}
        >
          <i />
        </span>
      ))}
    </div>
  );
}
