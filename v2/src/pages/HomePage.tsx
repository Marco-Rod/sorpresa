import { Link } from "react-router-dom";

import { BIRTHDAY_CONFIG } from "../config/birthday";
import { useCountdown } from "../hooks/useCountdown";

export function HomePage() {
  const {
    countdown,
    phase,
  } = useCountdown();

  return (
    <section className="home-page">
      <div className="home-page__content">
        <span
          className="home-page__flower"
          aria-hidden="true"
        >
          🌷
        </span>

        <p className="home-page__eyebrow">
          Para {
            BIRTHDAY_CONFIG.person.name
          }
        </p>

        <h1>
          {
            BIRTHDAY_CONFIG
              .experience
              .title
          }
        </h1>

        {phase === "waiting" && (
          <>
            <p className="home-page__description">
              El jardín descansa por ahora.
              <br />
              Volverá a florecer en septiembre.
            </p>

            <Countdown
              days={countdown.days}
              hours={countdown.hours}
              minutes={countdown.minutes}
              seconds={countdown.seconds}
            />
          </>
        )}

        {phase === "final-countdown" && (
          <FinalCountdown
            seconds={
              Math.ceil(countdown.totalMs / 1000)
            }
          />
        )}

        {phase === "birthday" && (
          <p className="home-page__description">
            🌸 El jardín está floreciendo.
          </p>
        )}

        <Link
          className="home-page__memories"
          to="/memories"
        >
          Visitar recuerdos
        </Link>
      </div>
    </section>
  );
}

interface CountdownProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function Countdown({
  days,
  hours,
  minutes,
  seconds,
}: CountdownProps) {
  return (
    <div
      className="countdown" role="timer" aria-live="off"
      aria-label={
        `${days} días, ` +
        `${hours} horas, ` +
        `${minutes} minutos y ` +
        `${seconds} segundos`
      }
    >
      <CountdownUnit
        value={days}
        label="días"
      />

      <CountdownUnit
        value={hours}
        label="horas"
      />

      <CountdownUnit
        value={minutes}
        label="min"
      />

      <CountdownUnit
        value={seconds}
        label="seg"
      />
    </div>
  );
}

interface CountdownUnitProps {
  value: number;
  label: string;
}

function CountdownUnit({
  value,
  label,
}: CountdownUnitProps) {
  return (
    <div className="countdown__unit">
      <strong>
        {String(value).padStart(
          2,
          "0",
        )}
      </strong>

      <span>{label}</span>
    </div>
  );
}

function FinalCountdown({
  seconds,
}: {
  seconds: number;
}) {
  return (
    <div className="final-countdown" role="timer" aria-live="off">
      <p>
        Algo está a punto de florecer...
      </p>

      <strong>
        {Math.max(
          seconds,
          0,
        )}
      </strong>
    </div>
  );
}
