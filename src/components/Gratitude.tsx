import { useState, useEffect } from 'react';
import { Flame } from 'lucide-react';
import { getStreak, getIntegrityScore } from '@/lib/diovStorage';
import CosmicBackground from './CosmicBackground';

interface GratitudeProps {
  onComplete: (text: string) => void;
}

export default function Gratitude({ onComplete }: GratitudeProps) {
  const [gratitude, setGratitude] = useState('');
  const [visible, setVisible] = useState(false);
  const streak = getStreak().count;
  const integrityScore = getIntegrityScore();

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen w-full text-white flex flex-col items-center justify-center relative">
      <CosmicBackground />
      <div
        className={`diov-app-content w-full max-w-sm px-6 transition-all duration-700 ${
          visible ? 'diov-slide-up' : 'opacity-0 translate-y-5'
        }`}
      >
        <div className="diov-glass-card-strong p-8 space-y-6 text-center">
          <div className="space-y-2">
            <p className="text-[10px] tracking-[0.3em] text-white/40 uppercase font-medium">
              Day Claimed
            </p>
            <h3 className="diov-serif text-2xl font-normal italic text-white/90">
              You are aligned.
            </h3>
            <p className="text-sm text-white/50 font-light flex items-center justify-center gap-2">
              Streak:{" "}
              <span className="text-white font-semibold flex items-center gap-1">
                {streak} days <Flame className="w-3.5 h-3.5 text-amber-400" />
              </span>
            </p>
            {integrityScore !== null && (
              <p className="text-sm text-white/50 font-light">
                Integrity:{" "}
                <span className="text-white font-semibold">{integrityScore}%</span>
              </p>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-[10px] tracking-[0.2em] text-white/40 uppercase font-medium block">
              One line of gratitude
            </label>
            <input
              type="text"
              value={gratitude}
              onChange={(e) => setGratitude(e.target.value)}
              placeholder="I am grateful for..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-center text-white placeholder-white/20 outline-none focus:border-white/25 transition-colors"
            />
          </div>

          <button
            onClick={() => onComplete(gratitude)}
            className="w-full py-3.5 rounded-full bg-white text-black text-xs font-semibold tracking-[0.15em] uppercase active:scale-95 transition-all diov-cta-btn"
          >
            Close and Start Day
          </button>
        </div>
      </div>
    </div>
  );
}
