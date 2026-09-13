import { useBirthday } from "../context/BirthdayContext";

export function FinalCountdownScene() {
  const { countdown } = useBirthday();

  // Math.ceil so the display reads 10…1 and never shows 0
  // before the phase transitions to "birthday".
  const number = Math.max(
    1,
    Math.ceil(countdown.totalMs / 1000),
  );

  return (
    <section
      className="scene final-countdown-scene"
      role="timer"
      aria-live="off"
      aria-label={`Cuenta regresiva: ${number} segundo${number !== 1 ? "s" : ""}`}
    >
      <div className="final-countdown-scene__backdrop" aria-hidden="true" />

      <div className="final-countdown-scene__content">
        <p>Hay algo que está a punto de florecer...</p>

        {/* key triggers a fresh mount → fresh CSS animation on each tick */}
        <div
          key={number}
          className="final-countdown-number"
          aria-hidden="true"
        >
          {number}
        </div>
      </div>
    </section>
  );
}
