import { useState } from 'react';
import { PHRASE_SOURCES } from '../../config/phrases';
import { useGardenPhrase } from '../../hooks/useGardenPhrase';

const labels = { fact: 'Dato curioso', mystery: 'Pregunta abierta', theory: 'Teoría no demostrada', paraphrase: 'Lectura · paráfrasis', reflection: 'Reflexión original' };

export function GardenMessage({ className = '' }: { className?: string }) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const { phrase, visible } = useGardenPhrase(hovered || focused);
  const source = phrase?.source ? PHRASE_SOURCES[phrase.source] : undefined;
  return <div className={['garden-message', visible ? 'garden-message--visible' : 'garden-message--hidden', className].join(' ')}
    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    onFocus={() => setFocused(true)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
    <div aria-live="polite" aria-atomic="true">
      <span className="garden-message__category">{phrase ? phrase.category + ' · ' + labels[phrase.kind] : 'Un momento de curiosidad'}</span>
      <p className="garden-message__text">{phrase?.text ?? '\u00a0'}</p>
    </div>
    {source && <a className="garden-message__source" href={source.url} target="_blank" rel="noopener noreferrer" aria-label={'Consultar fuente: ' + source.label}>Fuente: {source.label} ↗</a>}
  </div>;
}
