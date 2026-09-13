import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { HeartFrame } from '../../components/celebration/HeartFrame';
import { LetterModal } from '../../components/celebration/LetterModal';
import { usePerformance } from '../../context/PerformanceContext';
import { useAudio } from '../../context/AudioContext';
import { MEMORY_2026_LETTER } from './content/letter';
import { Memory2026World } from './Memory2026World';
import { useMemory2026Timeline } from './Memory2026Timeline';
import { Memory2026Audio, prepareMemoryMusic } from './Memory2026Audio';
import { MemoryConfetti } from './MemoryConfetti';
import './memory2026.css';

const photo = '/memories/2026/images/birthday-photo.jpg';
const names = ['Lucas', 'Lupe', 'Max'];
export function Memory2026() {
  const root = useRef<HTMLElement>(null);
  const t = useMemory2026Timeline(root);
  const [letter, setLetter] = useState(false);
  const [secret, setSecret] = useState(false);
  const { suspend } = useAudio();
  useEffect(() => { suspend(true); return () => suspend(false); }, [suspend]);
  const { quality, reducedMotion } = usePerformance();
  const counting = t.finalMs !== null && t.finalMs < 0;
  const revealed = t.phase === 'birthday' && t.stages.photo;
  const replaying = !revealed;
  const seconds = Math.max(1, Math.ceil(-(t.finalMs ?? -10000) / 1000));
  const replay = () => { prepareMemoryMusic(); setLetter(false); setSecret(false); t.replay(); window.scrollTo({top: 0, behavior: 'instant'}); };
  return <article ref={root} className="memory-2026-page" data-phase={t.phase}>
    <div className={`memory-stage ${reducedMotion ? 'memory-stage--static' : ''} memory-stage--${quality}`} data-paused={!t.playing && replaying}>
      <Memory2026World phase={t.phase} progress={t.progress} calm={replaying} bloom={t.stages.bloom} paused={!t.playing && replaying} shootingStar={t.stages.shootingStar}/>
      <nav className="memory-nav" aria-label="Recuerdo"><Link to="/">← Volver al inicio</Link><span>Un recuerdo · 2026</span></nav>
      {counting && <div className="memory-final" role="timer" aria-live="off" aria-label={`Cuenta regresiva: ${seconds} segundos`}><strong key={seconds}>{seconds}</strong></div>}
      {!counting && !revealed && <div className="memory-finale" aria-live="polite"><span key={t.stages.moment ? 'moment' : t.stages.message ? 'message' : 'empty'}>{t.stages.moment ? 'Llegó el momento…' : t.stages.message ? 'Feliz cumpleaños, Ale 🌸' : ''}</span></div>}
      <div className="memory-birthday" hidden={!revealed}>
        <header><p className="memory-eyebrow">10 de septiembre de 2026</p><h1>¡Feliz cumpleaños,<br/><span>Ale!</span></h1><p>Hoy el mundo tiene una razón más para celebrar. 💗</p></header>
        <div className="memory-heart"><HeartFrame src={photo} alt="Foto de Ale"/><span aria-hidden="true" className="memory-heart__spark">✦</span><span aria-hidden="true" className="memory-heart__love">♡</span></div>
        <p className="memory-dedication">Que este nuevo año de vida te encuentre rodeada de cariño, sueños cumplidos y muchísimas razones para sonreír.</p>
        <button className="memory-letter" onClick={() => setLetter(true)} aria-haspopup="dialog">💌 Hay algo que quiero decirte</button>
        <Memory2026Audio started={t.stages.music} quiet={letter} paused={replaying && !t.playing} visible={revealed}/>
        <button className="memory-paw" onClick={() => setSecret(value => !value)} aria-label="Un pequeño secreto de Lucas, Lupe y Max" aria-expanded={secret}>🐾</button>
        {secret && <p className="memory-secret" role="status">Lucas, Lupe y Max también vinieron a celebrar contigo. 🐾💗</p>}
        {t.stages.pets && <div className="memory-pets" aria-label="Lucas, Lupe y Max">{names.map(name => <img key={name} src={`/memories/2026/pets/${name.toLowerCase()}.svg`} alt={name} width="85" height="85"/>)}</div>}
        <button className="memory-replay" onClick={replay}>↻ Volver a vivir este momento</button>
        <p className="memory-signature">Un jardín en septiembre 🌷</p>
      </div>
      {t.stages.confetti && !letter && <MemoryConfetti paused={!t.playing}/>}
      <div className="memory-controls">{replaying && <><button onClick={() => t.setPlaying(!t.playing)}>{t.playing ? 'Pausar' : 'Continuar'}</button><button onClick={() => t.seek(1)}>Volver al recuerdo</button></>}</div>
      <LetterModal open={letter} onClose={() => setLetter(false)} paragraphs={MEMORY_2026_LETTER}/>
    </div>
  </article>;
}
