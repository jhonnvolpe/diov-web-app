import { useState, useEffect } from 'react';
import { SLEEP_COMPLETE_MESSAGES } from '@/lib/diovUtils';
import CosmicBackground from './CosmicBackground';

interface Props { onFadeOut: () => void; }

export default function SleepComplete({ onFadeOut }: Props) {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setFade(true), 4000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (fade) { const t = setTimeout(onFadeOut, 1000); return () => clearTimeout(t); }
  }, [fade, onFadeOut]);

  return (
    <div className={`min-h-screen w-full text-white flex flex-col items-center justify-center relative transition-opacity duration-1000 ${fade ? 'opacity-0' : 'opacity-100'}`}>
      <CosmicBackground theme="dark" />
      <div className="diov-app-content flex flex-col items-center justify-center px-6 text-center z-10 max-w-sm">
        <div className="relative w-48 h-48 mb-8 opacity-40">
          <img src="/orb-sleep.png" alt="" className="w-full h-full object-contain" style={{ filter: 'brightness(0.3) blur(2px)' }} />
        </div>
        <p className="text-[10px] tracking-[0.4em] text-white/40 uppercase font-medium mb-4">DEEP SEQUENCE: COMPLETE</p>
        <div className="diov-glass-card p-5">
          <p className="text-sm text-white/50 font-light leading-relaxed">{SLEEP_COMPLETE_MESSAGES[0]}</p>
        </div>
      </div>
    </div>
  );
}
