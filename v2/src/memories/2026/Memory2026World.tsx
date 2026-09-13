import { memo, type CSSProperties } from 'react';
import { GardenSymbols } from '../../components/garden/GardenSymbols';
import { VirgoConstellation } from '../../components/garden/VirgoConstellation';
import { ButterflyLayer } from '../../components/garden/ButterflyLayer';
import { StarField } from '../../effects/StarField';
import { FireflyField } from '../../effects/FireflyField';
import { PetalField } from '../../effects/PetalField';
import { usePerformance } from '../../context/PerformanceContext';
import type { Memory2026Phase } from './Memory2026Timeline';
const flowers = Array.from({ length: 39 }, (_, i) => ({ id: i, x: (i * 37 % 103) - 2, depth: i % 3, size: 26 + (i % 3) * 19 + (i * 13 % 25), rotation: (i * 7 % 19) - 9, type: i % 4 === 0 ? 'gerbera' : 'tulip' }));
const skies = ['morning', 'day', 'sunset', 'night'] as const;
export const Memory2026World = memo(function Memory2026World({ phase, progress, calm, bloom, shootingStar, paused }: {
    phase: Memory2026Phase;
    progress: number;
    calm: boolean;
    bloom: boolean;
    shootingStar: boolean;
    paused: boolean;
}) {
    const { quality, reducedMotion } = usePerformance();
    const night = phase === 'night' || phase === 'final-countdown';
    const weights = [1, Math.min(1, Math.max(0, (progress - .2) / .1)), Math.min(1, Math.max(0, (progress - .4) / .1)), Math.min(1, Math.max(0, (progress - .58) / .1))];
    return <div className={`memory-world ${calm ? 'memory-world--calm' : ''} ${bloom ? 'memory-world--bloom' : ''}`} aria-hidden="true">
  {skies.map((sky, i) => <div key={sky} className={`memory-sky memory-sky--${sky}`} style={{ opacity: phase === 'birthday' ? (sky === 'morning' ? 1 : 0) : weights[i] }}/>)}
  <div className="memory-cloud memory-cloud--one"/><div className="memory-cloud memory-cloud--two"/>
  {!night && <div className={`memory-sun memory-sun--${phase}`}/>}
  {night && <><StarField paused={paused || calm}/><div className="memory-moon"/><div className="memory-virgo"><VirgoConstellation /><span>Virgo · Spica ✦</span></div>{!calm && !paused && <FireflyField />}</>}
  {shootingStar && <div className="memory-shooting-star"/>}
  {!calm && !paused && <PetalField intensity={phase === 'sunset' ? .7 : night ? .15 : .3}/>}
  {!calm && (phase === 'day' || phase === 'sunset') && <ButterflyLayer />}
  <svg width="0" height="0" className="memory-symbols"><GardenSymbols /></svg>
  <div className={`memory-garden memory-garden--${quality} ${reducedMotion ? 'memory-garden--static' : ''}`}>
   <div className="memory-foliage"/>
   {flowers.filter(f => quality !== 'low' || f.id % 2 === 0 || f.depth === 2).map(f => <svg key={f.id} className={`memory-flower memory-flower--${f.depth}`} viewBox="0 0 60 110" style={{ '--x': `${f.x}%`, '--size': `${f.size}px`, '--tilt': `${f.rotation}deg`, '--delay': `${-f.id * .7}s`, '--tulip-main': '#f08ab7', '--tulip-light': '#ffc6de', '--tulip-dark': '#c9548c', '--gerbera-main': '#f49abd' } as CSSProperties}><use href={`#garden-${f.type}`} width="60" height="110"/></svg>)}
  </div>
  {['left', 'right'].map(side => <div key={side} className={`memory-edge memory-edge--${side}`}>{[0, 1, 2, 3, 4, 5].map(i => <svg key={i} viewBox="0 0 60 110" style={{ top: `${28 + i * 11}%`, transform: `rotate(${(side === 'left' ? 1 : -1) * (48 + i % 3 * 4)}deg)` }}><use href={i === 2 ? '#garden-gerbera' : '#garden-tulip'} width="60" height="110"/></svg>)}</div>)}
 </div>;
});
