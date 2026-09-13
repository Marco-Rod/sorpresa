import { useMemo } from "react";

export function SparkleEvent() {
  const sparkles = useMemo(
    () =>
      Array.from({ length: 6 }, (_, index) => ({
        id: index,
        x: 15 + Math.random() * 70,
        y: 15 + Math.random() * 55,
        delay: Math.random() * 700,
      })),
    [],
  );

  return (
    <div className="sparkle-event" aria-hidden="true">
      {sparkles.map(sparkle => (
        <span
          key={sparkle.id}
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            animationDelay: `${sparkle.delay}ms`,
          }}
        />
      ))}
    </div>
  );
}
