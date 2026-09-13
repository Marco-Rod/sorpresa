/**
 * Configuración de audio histórico de 2026.
 * Separado de src/config/audio.ts para que los cambios de 2027
 * no afecten el recuerdo.
 *
 * Los archivos de audio están excluidos del repositorio (.gitignore).
 * Añádelos en public/memories/2026/audio/ antes del deploy.
 */
export const MEMORY_2026_AUDIO = {
  waiting: {
    src: "/memories/2026/audio/waiting.mp3",
    volume: 0.52,
  },

  sunset: {
    src: "/memories/2026/audio/sunset.mp3",
    volume: 0.55,
  },

  birthday: {
    src: "/memories/2026/audio/birthday.mp3",
    volume: 0.65,
  },
} as const;
