import { useState, useEffect } from 'react';
import { savePromise } from '@/lib/diovStorage';
import { BURDEN_PROMPTS, BURN_PHRASES } from '@/lib/diovUtils';
import CosmicBackground from './CosmicBackground';

interface Props { onConfirm: () => void; onClose: () => void; }

type Step = 'burden' | 'burn' | 'promise' | 'confirm';

export default function RitualOverlay({ onConfirm, onClose }: Props) {
  const [step, setStep] = useState<Step>('burden');
  const [burden, setBurden] = useState('');
  const [promise, setPromise] = useState('');
  const [visible, setVisible] = useState(false);

  const burdenPrompt = BURDEN_PROMPTS[0];
  const burnPhrase = BURN_PHRASES[0];

  useEffect(() => { const t = setTimeout(() => setVisible(true), 50); return () => clearTimeout(t); }, []);

  const handleRelease = () => {
    if (!burden.trim()) return;
    setStep('burn');
    setTimeout(() => setStep('promise'), 2200);
  };

  const handleLock = () => {
    if (!promise.trim()) return;
    savePromise(promise);
    setStep('confirm');
  };

  return (
    <div className="min-h-screen w-full text-white flex flex-col items-center justify-center relative">
      <CosmicBackground theme="dark" />
      <div className={`diov-app-content flex flex-col items-center justify-center px-6 text-center w-full max-w-sm transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>

        {/* ─── BURDEN ─── */}
        {step === 'burden' && (
          <div className="space-y-6 w-full diov-fade-in">
            <p className="text-[10px] tracking-[0.3em] text-white/40 uppercase font-medium">Pre-Sleep Protocol</p>
            <h2 className="diov-serif text-2xl font-normal italic text-white/90 leading-snug">{burdenPrompt}</h2>
            <textarea
              value={burden}
              onChange={e => setBurden(e.target.value)}
              placeholder="The deadline that haunts you. The conversation you avoided. The weight you didn't ask for..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white/90 placeholder-white/20 outline-none focus:border-white/25 transition-colors min-h-[120px] resize-none"
            />
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-4 rounded-full text-sm font-semibold tracking-[0.12em] uppercase transition-all diov-glass-pill text-white/50 hover:text-white/80">Cancel</button>
              <button onClick={handleRelease} disabled={!burden.trim()}
                className={`flex-1 py-4 rounded-full text-sm font-semibold tracking-[0.12em] uppercase transition-all active:scale-95 ${burden.trim() ? 'bg-white text-black' : 'bg-white/5 text-white/30'}`}>
                Release
              </button>
            </div>
          </div>
        )}

        {/* ─── BURN (auto, no user action) ─── */}
        {step === 'burn' && (
          <div className="space-y-8 w-full diov-fade-in">
            <div className="relative min-h-[160px] flex items-center justify-center">
              <p className="diov-serif text-xl font-light italic text-white/70 diov-dissolve-text">
                &ldquo;{burden}&rdquo;
              </p>
              {Array.from({ length: 18 }).map((_, i) => (
                <div key={i} className="diov-smoke-particle" style={{
                  left: `${35 + Math.random() * 30}%`,
                  top: `${30 + Math.random() * 30}%`,
                  animationDelay: `${Math.random() * 0.8}s`,
                  width: `${1 + Math.random() * 3}px`,
                  height: `${1 + Math.random() * 3}px`,
                }} />
              ))}
            </div>
            <p className="text-sm text-white/40 font-light diov-fade-in">{burnPhrase}</p>
          </div>
        )}

        {/* ─── PROMISE ─── */}
        {step === 'promise' && (
          <div className="space-y-6 w-full diov-fade-in">
            <p className="text-[10px] tracking-[0.3em] text-white/40 uppercase font-medium">Pre-Sleep Protocol</p>
            <h2 className="diov-serif text-2xl font-normal italic text-white/90 leading-snug">Lock in your one commitment for tomorrow.</h2>
            <p className="text-sm text-white/40 font-light">One thing. When you wake, this is what you execute.</p>
            <input
              type="text"
              value={promise}
              onChange={e => setPromise(e.target.value)}
              placeholder="Finish what matters most..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white/90 text-center placeholder-white/20 outline-none focus:border-white/25 transition-colors"
            />
            <button onClick={handleLock} disabled={!promise.trim()}
              className={`w-full py-4 rounded-full text-sm font-semibold tracking-[0.12em] uppercase transition-all active:scale-95 ${promise.trim() ? 'bg-white text-black' : 'bg-white/5 text-white/30'}`}>
              Lock It
            </button>
          </div>
        )}

        {/* ─── CONFIRM ─── */}
        {step === 'confirm' && (
          <div className="space-y-6 w-full diov-fade-in">
            <p className="text-[10px] tracking-[0.3em] text-white/40 uppercase font-medium">Pre-Sleep Protocol</p>
            <h2 className="diov-serif text-3xl font-normal italic text-white/90">Locked.</h2>
            <div className="diov-glass-card p-5">
              <p className="text-[10px] tracking-[0.2em] text-white/40 uppercase mb-2">Tomorrow&apos;s Commitment</p>
              <p className="diov-serif text-lg font-light italic text-white/80">&ldquo;{promise}&rdquo;</p>
            </div>
            <p className="text-sm text-white/40 font-light">This cannot be changed. It will greet you at ignition.</p>
            <button onClick={() => { setVisible(false); setTimeout(onConfirm, 400); }}
              className="w-full py-4 rounded-full bg-white text-black text-sm font-semibold tracking-[0.12em] uppercase active:scale-95 transition-all">
              Initialize Deep Sequence
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
