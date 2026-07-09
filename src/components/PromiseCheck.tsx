import { useState } from 'react';
import { getYesterdayPromise } from '@/lib/diovStorage';
import CosmicBackground from './CosmicBackground';

interface PromiseCheckProps {
  onAnswer: (kept: boolean) => void;
}

export default function PromiseCheck({ onAnswer }: PromiseCheckProps) {
  const [visible, setVisible] = useState(false);
  const yesterdayPromise = getYesterdayPromise();

  useState(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  });

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
              Integrity Check
            </p>
            <h3 className="diov-serif text-2xl font-normal italic text-white/90">
              Did you keep yesterday&apos;s promise?
            </h3>
          </div>

          {yesterdayPromise && (
            <div className="diov-glass-card p-4">
              <p className="text-[10px] tracking-[0.2em] text-white/40 uppercase mb-2">
                Yesterday&apos;s Promise
              </p>
              <p className="diov-serif text-lg font-light italic text-white/80">
                &ldquo;{yesterdayPromise.text}&rdquo;
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => onAnswer(true)}
              className="flex-1 py-4 rounded-full bg-white text-black text-sm font-semibold tracking-[0.12em] uppercase active:scale-95 transition-all diov-cta-btn"
            >
              YES
            </button>
            <button
              onClick={() => onAnswer(false)}
              className="flex-1 py-4 rounded-full text-sm font-semibold tracking-[0.12em] uppercase active:scale-95 transition-all text-white/70 hover:text-white"
              style={{ border: '1px solid rgba(255,255,255,0.15)' }}
            >
              NO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
