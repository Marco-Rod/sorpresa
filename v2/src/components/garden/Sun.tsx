interface SunProps {
  mood:
    | "morning"
    | "day"
    | "sunset";
}

export function Sun({
  mood,
}: SunProps) {
  return (
    <div
      className={`sun sun--${mood}`}
      aria-hidden="true"
    >
      <div className="sun__glow" />

      <div className="sun__core" />
    </div>
  );
}