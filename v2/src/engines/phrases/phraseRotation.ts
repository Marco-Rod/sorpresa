import { GARDEN_PHRASES, type GardenPhrase } from '../../config/phrases';

export const PHRASE_STORAGE_KEY = 'garden.phrases.history.v1';
interface History { seen: string[]; recent: string[] }
const ids = new Set(GARDEN_PHRASES.map(p => p.id));
let memory: History = { seen: [], recent: [] };

function readHistory(): History {
  try {
    const raw = localStorage.getItem(PHRASE_STORAGE_KEY);
    if (!raw) return memory;
    const data = JSON.parse(raw);
    if (!Array.isArray(data.seen) || !Array.isArray(data.recent)) return memory;
    const valid = (items: unknown[]) => [...new Set(items.filter((id): id is string => typeof id === 'string' && ids.has(id)))];
    return { seen: valid(data.seen), recent: valid(data.recent).slice(-20) };
  } catch { return memory; }
}

/** Draw without replacement; retain the last 20 across cycle boundaries.
 * Read storage on every draw so other tabs' completed draws are respected.
 * If persistence is unavailable, retain the history for this page session. */
export function nextGardenPhrase(): GardenPhrase {
  const history = readHistory();
  let candidates = GARDEN_PHRASES.filter(p => !history.seen.includes(p.id));
  if (!candidates.length) {
    history.seen = [];
    candidates = GARDEN_PHRASES;
  }
  const notRecent = candidates.filter(p => !history.recent.includes(p.id));
  if (notRecent.length) candidates = notRecent;
  const last = GARDEN_PHRASES.find(p => p.id === history.recent.at(-1));
  const otherTopics = candidates.filter(p => p.category !== last?.category);
  if (otherTopics.length) candidates = otherTopics;
  const phrase = candidates[Math.floor(Math.random() * candidates.length)];
  memory = {
    seen: [...history.seen, phrase.id],
    recent: [...history.recent.filter(id => id !== phrase.id), phrase.id].slice(-20),
  };
  try { localStorage.setItem(PHRASE_STORAGE_KEY, JSON.stringify(memory)); } catch { /* Private mode or full storage. */ }
  return phrase;
}
