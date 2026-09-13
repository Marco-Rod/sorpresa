import type { SceneName } from "../engines/sceneEngine";

export interface GardenPhrase {
  id: string;
  text: string;

  /**
   * Which scenes this phrase appears in.
   * Omit (or leave undefined) for phrases that appear in all scenes.
   */
  scenes?: SceneName[];

  /**
   * Relative weight for random selection (default 1).
   * A phrase with weight 2 is twice as likely to be chosen.
   */
  weight?: number;
}

/**
 * Narrative phrases that appear at the bottom of each garden scene.
 *
 * Design principles:
 *  - Morning: lighter, welcoming, gentle
 *  - Day: playful, personal, her personality
 *  - Sunset: emotional, reflective, anticipatory
 *  - Night: intimate, poetic, most personal
 *
 * Edit freely — no component changes needed.
 */
export const GARDEN_PHRASES: GardenPhrase[] = [
  // ─── Morning ─────────────────────────────────────────────────────────────

  {
    id: "morning-wake",
    text: "Buenos días, Ale 🌸",
    scenes: ["morning"],
    weight: 2,
  },
  {
    id: "morning-garden",
    text: "El jardín apenas comienza a despertar.",
    scenes: ["morning"],
  },
  {
    id: "morning-days",
    text: "Hay días que empiezan un poquito más bonitos que otros.",
    scenes: ["morning"],
  },
  {
    id: "morning-quiet",
    text: "Este tipo de mañanas hace que todo valga la pena.",
    scenes: ["morning"],
  },

  // ─── Day ─────────────────────────────────────────────────────────────────

  {
    id: "day-tulips",
    text: "Tulipanes rosas. Obviamente.",
    scenes: ["day"],
    weight: 2,
  },
  {
    id: "day-gerberas",
    text: "Si hubiera gerberas suficientes, probablemente aún faltarían.",
    scenes: ["day"],
  },
  {
    id: "day-perfectionist",
    text: "Dicen que eres perfeccionista. Yo diría que solo sabes cómo quieres las cosas.",
    scenes: ["day"],
  },
  {
    id: "day-light",
    text: "La luz siempre te encuentra.",
    scenes: ["day"],
  },
  {
    id: "day-ordinary",
    text: "Hoy también es un día para ti.",
    scenes: ["day"],
  },

  // ─── Sunset ──────────────────────────────────────────────────────────────

  {
    id: "sunset-stay",
    text: "Quería darte algo que pudiera quedarse un poquito más.",
    scenes: ["sunset"],
    weight: 2,
  },
  {
    id: "sunset-luck",
    text: "Gasté toda mi suerte encontrándote.",
    scenes: ["sunset"],
    weight: 2,
  },
  {
    id: "sunset-searching",
    text: "Te he estado buscando.",
    scenes: ["sunset"],
  },
  {
    id: "sunset-sky",
    text: "El cielo cambia de color cuando tú estás cerca.",
    scenes: ["sunset"],
  },
  {
    id: "sunset-almost",
    text: "Ya casi.",
    scenes: ["sunset"],
  },

  // ─── Night ───────────────────────────────────────────────────────────────

  {
    id: "night-queen",
    text: "Tú eres la reina.",
    scenes: ["night"],
    weight: 3,
  },
  {
    id: "night-dream",
    text: "Sueño contigo.",
    scenes: ["night"],
    weight: 2,
  },
  {
    id: "night-never-tired",
    text: "Nunca me cansaré de recordarte lo especial que eres.",
    scenes: ["night"],
    weight: 2,
  },
  {
    id: "night-stars",
    text: "Las estrellas siempre estuvieron ahí. Solo faltabas tú para verlas.",
    scenes: ["night"],
  },
  {
    id: "night-virgo",
    text: "Virgo. Tuya.",
    scenes: ["night"],
  },
  {
    id: "night-excited",
    text: "Sí, yo también estoy emocionado.",
    scenes: ["night"],
  },
  {
    id: "night-waiting",
    text: "El jardín esperó todo este tiempo para esto.",
    scenes: ["night"],
  },
];
