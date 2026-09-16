import { GardenMessage } from "../components/narrative/GardenMessage";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import { BIRTHDAY_CONFIG } from "../config/birthday";
import { useBirthday } from "../context/BirthdayContext";
import { useScene } from "../hooks/useScene";
import { SceneRenderer } from "../scenes/SceneRenderer";
import { MusicControl } from "../components/audio/MusicControl";
import { prepareMemoryMusic } from "../memories/2026/Memory2026Audio";


const birthdayDate = new Intl.DateTimeFormat("es-CO", {
  timeZone: "UTC", day: "numeric", month: "long", year: "numeric",
}).format(new Date(Date.UTC(BIRTHDAY_CONFIG.nextBirthday.year, BIRTHDAY_CONFIG.nextBirthday.month - 1, BIRTHDAY_CONFIG.nextBirthday.day)));

// Only these four numbers subscribe to the clock; the garden does not rerender on ticks.
function Countdown() {
  const { countdown } = useBirthday();
  const units = [[countdown.days, "Días"], [countdown.hours, "Horas"], [countdown.minutes, "Min"], [countdown.seconds, "Seg"]] as const;
  return <div className="home-countdown" role="timer" aria-live="off" aria-label="Tiempo para el cumpleaños">
    {units.map(([value, label], index) => <Fragment key={label}>
      {index > 0 && <b aria-hidden="true">:</b>}
      <div><strong>{String(value).padStart(2, "0")}</strong><span>{label}</span></div>
    </Fragment>)}
  </div>;
}

export function HomePage() {
  const scene = useScene();
  const waiting = !["birthday", "final-countdown"].includes(scene);
  const month = Number(new Intl.DateTimeFormat("en", { timeZone: BIRTHDAY_CONFIG.timezone, month: "numeric" }).format(new Date()));
  const season = month >= 3 && month <= 5 ? "spring" : month >= 6 && month <= 8 ? "summer" : month >= 9 && month <= 11 ? "autumn" : "winter";
  const seasonLabel = { spring: "Primavera", summer: "Verano", autumn: "Otoño", winter: "Invierno" }[season];
  return <section className={`home-page home-page--${scene}`} data-season={season}>
    <div className="home-page__world"><SceneRenderer /></div>
    {waiting && <div className="home-page__content">
      <p className="home-page__eyebrow">Para {BIRTHDAY_CONFIG.person.name} 🌷</p>
      <h1>Hay algo bonito<br />esperando por ti…</h1>
      <p className="home-page__subtitle">Cada segundo nos acerca al {birthdayDate}.</p>
      <Countdown />
      <p className="home-page__season">{seasonLabel} · {scene === "night" ? "Noche" : "Día"} en Colombia</p>
      <GardenMessage className="home-page__message" />
      <MusicControl inline />
      <Link className="home-page__relive" to="/memories/2026?replay=1" onClick={prepareMemoryMusic}>
        <span aria-hidden="true">↻</span> Revivir aquel momento
        <small>Los últimos 10 segundos de 2026</small>
      </Link>
    </div>}
    {!waiting && <MusicControl />}
  </section>;
}
