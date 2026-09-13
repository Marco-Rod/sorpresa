import { useEffect, useRef } from 'react';
import { ConfettiEngine } from '../../engines/particles/ConfettiEngine';
import { useCanvasResize } from '../../hooks/useCanvasResize';
import { usePerformance } from '../../context/PerformanceContext';
import { PERFORMANCE_CONFIG } from '../../config/performance';
export function MemoryConfetti({ paused = false }: {
    paused?: boolean;
}) {
    const canvas = useRef<HTMLCanvasElement>(null);
    const engine = useRef<ConfettiEngine | null>(null);
    const { quality, reducedMotion } = usePerformance();
    const resize = useCanvasResize(canvas, engine, quality);
    useEffect(() => {
        if (!canvas.current || reducedMotion)
            return;
        let instance: ConfettiEngine;
        try {
            instance = new ConfettiEngine(canvas.current, 140);
        }
        catch {
            return;
        }
        engine.current = instance;
        resize();
        instance.setTargetFps(PERFORMANCE_CONFIG[quality].targetFps);
        instance.burst(PERFORMANCE_CONFIG[quality].confettiBurst);
        return () => { instance.destroy(); engine.current = null; };
    }, [quality, reducedMotion, resize]);
    useEffect(() => {
        const sync = () => { if (document.hidden || paused)
            engine.current?.stop();
        else if (engine.current?.getActiveCount())
            engine.current.start(); };
        sync();
        document.addEventListener('visibilitychange', sync);
        return () => document.removeEventListener('visibilitychange', sync);
    }, [paused, quality, reducedMotion]);
    return <canvas ref={canvas} className="confetti-field" aria-hidden="true"/>;
}
