// @vitest-environment jsdom
import { beforeEach, expect, it, vi } from 'vitest';
import { GARDEN_PHRASES, PHRASE_SOURCES } from '../../config/phrases';
import { PHRASE_STORAGE_KEY } from './phraseRotation';
beforeEach(() => { vi.restoreAllMocks(); localStorage.clear(); vi.resetModules(); });
it('has over 100 unique, sourced entries without countdown references', () => {
  expect(GARDEN_PHRASES.length).toBeGreaterThan(100);
  expect(new Set(GARDEN_PHRASES.map(p => p.id)).size).toBe(GARDEN_PHRASES.length);
  expect(new Set(GARDEN_PHRASES.map(p => p.text)).size).toBe(GARDEN_PHRASES.length);
  for (const p of GARDEN_PHRASES) {
    expect(p.text).not.toMatch(/cumpleaños|cuenta regresiva/i);
    if (p.kind !== 'reflection') expect(PHRASE_SOURCES[p.source!]?.url).toMatch(/^https:/);
  }
});
it('exhausts the collection before repeating, protecting the last 20 at cycle boundaries', async () => {
  const { nextGardenPhrase } = await import('./phraseRotation');
  const first = Array.from({ length: GARDEN_PHRASES.length }, () => nextGardenPhrase().id);
  expect(new Set(first).size).toBe(GARDEN_PHRASES.length);
  expect(first.slice(-20)).not.toContain(nextGardenPhrase().id);
});
it('continues across reloads and sees another tabs completed draw', async () => {
  let rotation = await import('./phraseRotation');
  const first = rotation.nextGardenPhrase();
  vi.resetModules();
  rotation = await import('./phraseRotation');
  const second = rotation.nextGardenPhrase();
  expect(second.id).not.toBe(first.id);
  const history = JSON.parse(localStorage.getItem(PHRASE_STORAGE_KEY)!);
  expect(history.seen).toContain(first.id);
  const external = GARDEN_PHRASES.find(p => !history.seen.includes(p.id))!;
  history.seen.push(external.id);
  localStorage.setItem(PHRASE_STORAGE_KEY, JSON.stringify(history));
  expect(rotation.nextGardenPhrase().id).not.toBe(external.id);
});
it('survives corrupt, outdated and unavailable storage', async () => {
  const { nextGardenPhrase } = await import('./phraseRotation');
  localStorage.setItem(PHRASE_STORAGE_KEY, '{broken');
  expect(nextGardenPhrase().id).toBeTruthy();
  localStorage.setItem(PHRASE_STORAGE_KEY, JSON.stringify({ seen: ['removed', 3], recent: ['removed'] }));
  expect(nextGardenPhrase().id).toBeTruthy();
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('quota'); });
  const drawn = Array.from({ length: 30 }, () => nextGardenPhrase().id);
  expect(new Set(drawn).size).toBe(30);
});
