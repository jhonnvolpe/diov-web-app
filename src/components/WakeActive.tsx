import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { WAKE_TRANSCRIPTS, WAKE_PHRASES } from '@/lib/diovUtils';
import CosmicBackground from './CosmicBackground';

interface Props { onComplete: () => void; onCancel: () => void; }

export default function WakeActive({ onComplete, onCancel }: Props) {
  const [breathPhase, setBreathPhase] = useState(0);
  const [transIdx, setTransIdx] = useState(0);
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [phraseVis, setPhraseVis] = useState(true);

  // Box breathing: 4-4-4-4
  const breathLabels = ['IN (4s)', 'HOLD (4s)', 'OUT (4s)', 'HOLD (4s)'];
  const breathDurs = [4000, 4000, 4000, 4000];

  useEffect(() => {
    let idx = 0;
    const next = () => {
      setBreathPhase(idx);
      const dur = breathDurs[idx];
      idx = (idx + 1) % 4;
      return setTimeout(next, dur);
    };
    let t = setTimeout(next, breathDurs[0]);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const i = setInterval(() => setTransIdx(t => (t + 1) % WAKE_TRANSCRIPTS.length), 12000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    const i = setInterval(() => {
      setPhraseVis(false);
      setTimeout(() => { setPhraseIdx(p => (p + 1) % WAKE_PHRASES.length); setPhraseVis(true); }, 800);
    }, 5000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative" style={{ color: 'rgba(60,50,30,0.9)' }}>
      <CosmicBackground theme="light" />
      <div className="diov-app-content absolute inset-0 flex flex-col items-center justify-center px-6 z-10">

        <p className="absolute top-20 left-0 right-0 text-center text-[10px] tracking-[0.25em] uppercase font-medium" style={{ color: 'rgba(60,50,30,0.35)' }}>
          ACTIVE WAKE SEQUENCE
        </p>

        {/* Wake orb */}
        <div className="relative w-56 h-56 flex items-center justify-center mb-4">
          <img src="/orb-wake.png" alt="" className="w-full h-full object-contain" style={{ animation: 'diovOrbPulse 2s ease-in-out infinite' }} />
          <div className="diov-wake-ring" style={{ animationDelay: '0s' }} />
          <div className="diov-wake-ring" style={{ animationDelay: '0.5s' }} />
          <div className="diov-wake-ring" style={{ animationDelay: '1s' }} />

          {/* Breath labels around orb */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2">
            <span className={`text-[9px] tracking-[0.15em] font-semibold uppercase transition-all duration-500 ${breathPhase === 0 ? 'text-amber-600/80' : 'text-black/10'}`}>{breathLabels[0]}</span>
          </div>
          <div className="absolute top-1/2 -right-1 -translate-y-1/2" style={{ writingMode: 'vertical-rl' }}>
            <span className={`text-[9px] tracking-[0.15em] font-semibold uppercase transition-all duration-500 ${breathPhase === 1 ? 'text-amber-600/80' : 'text-black/10'}`}>{breathLabels[1]}</span>
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
            <span className={`text-[9px] tracking-[0.15em] font-semibold uppercase transition-all duration-500 ${breathPhase === 2 ? 'text-amber-600/80' : 'text-black/10'}`}>{breathLabels[2]}</span>
          </div>
          <div className="absolute top-1/2 -left-1 -translate-y-1/2" style={{ writingMode: 'vertical-lr' }}>
            <span className={`text-[9px] tracking-[0.15em] font-semibold uppercase transition-all duration-500 ${breathPhase === 3 ? 'text-amber-600/80' : 'text-black/10'}`}>{breathLabels[3]}</span>
          </div>
        </div>

        {/* Phrase */}
        <div className="text-center max-w-xs mb-6">
          <p className={`text-lg font-light italic transition-all duration-800 ${phraseVis ? 'opacity-100' : 'opacity-0'}`} style={{ color: 'rgba(60,50,30,0.6)' }} key={phraseIdx}>{WAKE_PHRASES[phraseIdx]}</p>
        </div>

        {/* Transcript */}
        <div className="absolute bottom-24 left-5 right-5 diov-glass-card-light p-4 max-h-36 overflow-y-auto hide-scrollbar">
          <p className="text-[11px] leading-relaxed font-light" style={{ color: 'rgba(60,50,30,0.65)' }}>{WAKE_TRANSCRIPTS[transIdx]}</p>
        </div>

        {/* Buttons */}
        <div className="absolute bottom-6 left-5 right-5 flex gap-3">
          <button onClick={onComplete} className="flex-1 py-3 rounded-full diov-cta-light text-[11px] tracking-[0.12em] uppercase font-medium flex items-center justify-center gap-2">
            Complete Ritual
          </button>
          <button onClick={onCancel} className="flex-1 py-3 rounded-full diov-cyan-btn-light text-[11px] tracking-[0.12em] uppercase font-medium flex items-center justify-center gap-2">
            <X className="w-4 h-4" /> Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
