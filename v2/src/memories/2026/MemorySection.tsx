import { GardenLayer } from "../../components/garden/GardenLayer";
import { Moon } from "../../components/garden/Moon";
import { VirgoConstellation } from "../../components/garden/VirgoConstellation";
import { FireflyField } from "../../effects/FireflyField";
import { PetalField } from "../../effects/PetalField";
import { StarField } from "../../effects/StarField";
import { useNearViewport } from "../../hooks/useNearViewport";

export type MemoryMood = "morning" | "day" | "sunset" | "night";

interface MemorySectionProps {
  mood: MemoryMood;
  eyebrow: string;
  title: string;
  text: string;
}

export function MemorySection({
  mood,
  eyebrow,
  title,
  text,
}: MemorySectionProps) {
  const { ref, near } = useNearViewport("350px");
  const isNight = mood === "night";

  return (
    <section
      ref={ref}
      className={`memory-section memory-section--${mood}`}
    >
      {/* Canvas effects — mounted only when near the viewport */}
      {near && isNight && (
        <>
          <StarField />
          <FireflyField />
          <div className="memory-section__moon">
            <Moon />
          </div>
          <div className="memory-section__virgo">
            <VirgoConstellation />
          </div>
        </>
      )}

      {near && mood === "sunset" && (
        <PetalField intensity={0.8} />
      )}

      {near && mood === "morning" && (
        <PetalField intensity={0.2} />
      )}

      {/* Garden SVG is cheap — always mounted */}
      <GardenLayer mood={mood} />

      <div className="memory-section__content">
        <span>{eyebrow}</span>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
    </section>
  );
}
