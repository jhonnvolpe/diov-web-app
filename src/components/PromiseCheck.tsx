import { useState, useEffect } from 'react';
import { getYesterdayPromise } from '@/lib/diovStorage';
import CosmicBackground from './CosmicBackground';

interface Props { onAnswer: (kept: boolean) => void; }

export default function PromiseCheck({ onAnswer }: Props) {
  const [visible, setVisible] = useState(false);
  const yp = getYesterdayPromise();

  useEffect(() => { const t = setTimeout(() => setVisible(true), 50); return () => clearTimeout(t); }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative" style={{ color: 'rgba(60,50,30,0.9)' }}>
      <CosmicBackground theme="light" />
      <div className={`diov-app-content w-full max-w-sm px-6 z-10 transition-all duration-700 ${visible ? 'diov-slide-up' : 'opacity-0 translate-y-5'}`}>
        <div className="diov-glass-card-strong-light p-8 space-y-6 text-center">
          <div className="space-y-2">
            <p className="text-[10px] tracking-[0.3em] uppercase font-medium" style={{ color: 'rgba(60,50,30,0.4)' }}>Integrity Check</p>
            <h3 className="diov-serif text-2xl font-normal italic" style={{ color: 'rgba(60,50,30,0.85)' }}>Did you keep yesterday&apos;s promise?</h3>
          </div>
          {yp && (
            <div className="diov-glass-card-light p-4">
              <p className="text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: 'rgba(60,50,30,0.35)' }}>Yesterday&apos;s Promise</p>
              <p className="diov-serif text-lg font-light italic" style={{ color: 'rgba(60,50,30,0.7)' }}>&ldquo;{yp.text}&rdquo;</p>
            </div>
          )}
          <div className="flex gap-3">
            <button onClick={() => onAnswer(true)} className="flex-1 py-4 rounded-full diov-cta-light text-sm font-semibold tracking-[0.12em] uppercase active:scale-95 transition-all">YES</button>
            <button onClick={() => onAnswer(false)} className="flex-1 py-4 rounded-full text-sm font-semibold tracking-[0.12em] uppercase active:scale-95 transition-all" style={{ border: '1px solid rgba(60,50,30,0.15)', color: 'rgba(60,50,30,0.7)' }}>NO</button>
          </div>
        </div>
      </div>
    </div>
  );
}
