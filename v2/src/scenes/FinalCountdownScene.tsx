import {
  useBirthday,
} from "../context/BirthdayContext";

export function FinalCountdownScene() {
  const { countdown } =
    useBirthday();

  return (
    <div
      role="timer"
      aria-live="off"
      className="
        scene
        scene--final-countdown
      "
    >
      <p>
        Algo está a punto de
        florecer...
      </p>

      <strong>
        {Math.max(
          Math.ceil(countdown.totalMs / 1000),
          0,
        )}
      </strong>
    </div>
  );
}
