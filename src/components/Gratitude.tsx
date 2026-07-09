import { useState, useEffect } from 'react';
import { Gem } from 'lucide-react';
import { getStreak, getIntegrityScore } from '@/lib/diovStorage';
import CosmicBackground from './CosmicBackground';

interface Props { onComplete: (text: string) => void; }

export default function Gratitude({ onComplete }: Props) {
  const [text, setText] = useState('');
  const [visible, setVisible] = useState(false);
  const streak = getStreak().count;
  const integrity = getIntegrityScore();

  useEffect(() => { const t = setTimeout(() => setVisible(true), 50); return () => clearTimeout(t); }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative" style={{ color: 'rgba(60,50,30,0.9)' }}>
      <CosmicBackground theme="light" />
      <div className={`diov-app-content w-full max-w-sm px-6 z-10 transition-all duration-700 ${visible ? 'diov-slide-up' : 'opacity-0 translate-y-5'}`}>
        <div className="diov-glass-card-strong-light p-8 space-y-6 text-center">
          <div className="space-y-2">
            <p className="text-[10px] tracking-[0.3em] uppercase font-medium" style={{ color: 'rgba(60,50,30,0.4)' }}>Day Claimed</p>
            <h3 className="diov-serif text-2xl font-normal italic" style={{ color: 'rgba(60,50,30,0.85)' }}>You are aligned.</h3>
            <p className="text-sm font-light flex items-center justify-center gap-2" style={{ color: 'rgba(60,50,30,0.5)' }}>
              Streak: <span className="font-semibold flex items-center gap-1" style={{ color: 'rgba(60,50,30,0.8)' }}>{streak} days <Gem className="w-3.5 h-3.5 text-amber-500" /></span>
            </p>
            {integrity !== null && (
              <p className="text-sm font-light" style={{ color: 'rgba(60,50,30,0.5)' }}>
                Integrity: <span className="font-semibold" style={{ color: 'rgba(60,50,30,0.8)' }}>{integrity}%</span>
              </p>
            )}
          </div>
          <div className="space-y-3">
            <label className="text-[10px] tracking-[0.2em] uppercase font-medium block" style={{ color: 'rgba(60,50,30,0.35)' }}>One line of gratitude</label>
            <input type="text" value={text} onChange={e => setText(e.target.value)} placeholder="I am grateful for..."
              className="w-full rounded-xl px-4 py-3 text-sm text-center placeholder-black/20 outline-none transition-colors diov-glass-card-light"
              style={{ color: 'rgba(60,50,30,0.8)' }} />
          </div>
          <button onClick={() => onComplete(text)} className="w-full py-3.5 rounded-full diov-cta-light text-xs font-semibold tracking-[0.15em] uppercase active:scale-95 transition-all">
            Close and Start Day
          </button>
        </div>
      </div>
    </div>
  );
}
