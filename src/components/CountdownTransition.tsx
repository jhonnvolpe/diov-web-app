import { useState, useEffect } from 'react';
import { COUNTDOWN_PHRASES } from '@/lib/diovUtils';
import CosmicBackground from './CosmicBackground';

interface Props { onComplete: () => void; }

export default function CountdownTransition({ onComplete }: Props) {
  const [count, setCount] = useState(3);
  const [show, setShow] = useState(true);
  const [orbVisible, setOrbVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setOrbVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (count <= 0) { onComplete(); return; }
    setShow(true);
    const hideTimer = setTimeout(() => setShow(false), 800);
    const nextTimer = setTimeout(() => setCount(c => c - 1), 1000);
    return () => { clearTimeout(hideTimer); clearTimeout(nextTimer); };
  }, [count, onComplete]);

  return (
    <div className="min-h-screen w-full text-white flex flex-col items-center justify-center relative">
      <CosmicBackground theme="dark" />
      <div className="diov-app-content flex flex-col items-center justify-center px-6 text-center z-10">
        <p className="text-[10px] tracking-[0.4em] text-white/40 uppercase font-medium mb-8 diov-fade-in">DIOV Transition</p>

        <div className={`relative w-64 h-64 mb-8 transition-all duration-1000 ${orbVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
          <img src="/orb-sleep.png" alt="" className="w-full h-full object-contain diov-orb-pulse" />
        </div>

        <div className="relative h-32 flex items-center justify-center">
          <span key={count}
            className={`text-8xl font-extralight text-white/90 diov-glow-text-gold absolute transition-all duration-300 ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
            {count > 0 ? count : ''}{count > 0 ? '...' : ''}
          </span>
        </div>

        <p className="text-sm text-white/40 font-light tracking-wider mt-4 diov-fade-in">
          {COUNTDOWN_PHRASES[0]}
        </p>
      </div>
    </div>
  );
}
