import { useEffect, useRef, useState } from 'react';
import { MEMORY_2026_AUDIO } from './audio';

let birthdayAudio: HTMLAudioElement | undefined;
let preparation: Promise<void> = Promise.resolve();
function getAudio() {
  if (!birthdayAudio) {
    birthdayAudio = new Audio(MEMORY_2026_AUDIO.birthday.src);
    birthdayAudio.preload = 'auto';
    birthdayAudio.loop = false;
  }
  return birthdayAudio;
}

// Called by the actual replay click, before routing. Keep this same media element
// so mobile browsers retain the user gesture when the countdown finishes.
export function prepareMemoryMusic() {
  const audio = getAudio();
  audio.pause();
  audio.currentTime = 0;
  audio.volume = 0;
  preparation = audio.play().then(() => { audio.pause(); audio.currentTime = 0; }).catch(() => {});
}

export function Memory2026Audio({ started, paused, quiet, visible }: {
  started: boolean; paused: boolean; quiet: boolean; visible: boolean;
}) {
  const [playing, setPlaying] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const manualPause = useRef(false);
  const ended = useRef(false);
  useEffect(() => {
    const audio = getAudio();
    const onPlay = () => { setPlaying(true); setBlocked(false); };
    const onPause = () => setPlaying(false);
    const onEnded = () => { ended.current = true; setPlaying(false); };
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.pause();
    };
  }, []);
  useEffect(() => {
    const audio = getAudio();
    let cancelled = false;
    if (!started) { manualPause.current = false; ended.current = false; }
    const sync = async () => {
      await preparation;
      if (cancelled) return;
      audio.volume = quiet ? .12 : MEMORY_2026_AUDIO.birthday.volume;
      if (!started || paused || document.hidden || manualPause.current || ended.current) {
        audio.pause();
        if (!started) audio.currentTime = 0;
        return;
      }
      try { await audio.play(); } catch { if (!cancelled) setBlocked(true); }
    };
    void sync();
    document.addEventListener('visibilitychange', sync);
    return () => { cancelled = true; document.removeEventListener('visibilitychange', sync); };
  }, [started, paused, quiet]);
  return <button type="button" className="memory-song" hidden={!visible}
    aria-label={playing ? 'Pausar tu canción favorita de cumpleaños' : 'Reproducir tu canción favorita de cumpleaños'}
    onClick={() => {
      const audio = getAudio();
      if (!audio.paused) { manualPause.current = true; audio.pause(); return; }
      manualPause.current = false;
      ended.current = false;
      audio.volume = MEMORY_2026_AUDIO.birthday.volume;
      void audio.play().catch(() => setBlocked(true));
    }}>
    <span aria-hidden="true">{playing ? 'Ⅱ' : '▶'}</span>
    <span className="memory-song__text"><small>{blocked ? 'Toca para reproducir' : playing ? 'Ahora suena' : 'Reproducir'}</small><strong>Tu canción favorita de cumpleaños</strong></span>
  </button>;
}
