import { MemorySection } from "./MemorySection";

export function Memory2026Journey() {
  return (
    <div id="memory-2026-story" className="memory-2026-journey">
      <MemorySection
        mood="morning"
        eyebrow="Mañana"
        title="El jardín comenzó a despertar."
        text="Flores, luz suave y una cuenta regresiva que todavía guardaba el secreto."
      />

      <MemorySection
        mood="day"
        eyebrow="Durante el día"
        title="Las pequeñas cosas también formaban parte de la sorpresa."
        text="Frases, flores y detalles fueron apareciendo poco a poco."
      />

      <MemorySection
        mood="sunset"
        eyebrow="Atardecer"
        title="El cielo cambió."
        text="El jardín se volvió más cálido mientras se acercaba la noche."
      />

      <MemorySection
        mood="night"
        eyebrow="Noche"
        title="Virgo apareció entre las estrellas."
        text="La última parte de la espera ocurrió bajo un cielo oscuro."
      />
    </div>
  );
}
