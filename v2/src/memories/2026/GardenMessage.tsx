import { LEGACY_PHRASES } from '../../config/memories/2026/phrases';
import type { Memory2026Phase } from './Memory2026Timeline';
const pools = {
    intro: LEGACY_PHRASES.general, morning: [...LEGACY_PHRASES.general, ...LEGACY_PHRASES.personal],
    day: [...LEGACY_PHRASES.flowers, ...LEGACY_PHRASES.cosmetology, ...LEGACY_PHRASES.pets],
    sunset: LEGACY_PHRASES.sunset, night: LEGACY_PHRASES.night,
    'final-countdown': ['Las estrellas están listas. El jardín está listo. Falta alguien… 🌸✨'], birthday: [],
};
export function GardenMessage({ phase, elapsed }: {
    phase: Memory2026Phase;
    elapsed: number;
}) {
    const pool = pools[phase];
    const index = Math.floor(elapsed / 10000) % pool.length;
    return <p className="memory-whisper" key={`${phase}-${index}`}>{pool[index]}</p>;
}
