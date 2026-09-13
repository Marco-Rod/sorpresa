// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';

afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.resetModules(); });
it('primes on gesture, waits for congratulations, and pauses/resumes without rewinding', async () => {
  const instances: FakeAudio[] = [];
  class FakeAudio extends EventTarget {
    paused = true; currentTime = 0; volume = 1; preload = ''; loop = false;
    src: string;
    constructor(src: string) { super(); this.src = src; instances.push(this); }
    play = vi.fn(async () => { this.paused = false; this.dispatchEvent(new Event('play')); });
    pause = vi.fn(() => { this.paused = true; this.dispatchEvent(new Event('pause')); });
  }
  vi.stubGlobal('Audio', FakeAudio);
  const { Memory2026Audio, prepareMemoryMusic } = await import('./Memory2026Audio');
  await act(async () => { prepareMemoryMusic(); });
  const audio = instances[0];
  expect(audio.paused).toBe(true);
  const view = render(<Memory2026Audio started={false} paused={false} quiet={false} visible={false}/>);
  await act(async () => {});
  expect(audio.paused).toBe(true);
  await act(async () => view.rerender(<Memory2026Audio started paused={false} quiet={false} visible/>));
  expect(audio.paused).toBe(false);
  expect(audio.volume).toBeGreaterThan(0);
  audio.currentTime = 23;
  fireEvent.click(screen.getByRole('button', {name:'Pausar tu canción favorita de cumpleaños'}));
  expect(audio.paused).toBe(true);
  await act(async () => fireEvent.click(screen.getByRole('button', {name:'Reproducir tu canción favorita de cumpleaños'})));
  expect(audio.currentTime).toBe(23);
  expect(audio.paused).toBe(false);
  await act(async () => { prepareMemoryMusic(); view.rerender(<Memory2026Audio started={false} paused={false} quiet={false} visible={false}/>); });
  expect(audio.currentTime).toBe(0);
  expect(audio.paused).toBe(true);
  expect(instances).toHaveLength(1);
});
