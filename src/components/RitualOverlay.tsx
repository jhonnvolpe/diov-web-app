import { useState, useEffect } from 'react';
import { savePromise } from '@/lib/diovStorage';
import CosmicBackground from './CosmicBackground';

interface RitualOverlayProps {
  onConfirm: () => void;
  onClose: () => void;
}

type Phase = 0 | 1 | 2 | 3;

export default function RitualOverlay({ onConfirm, onClose }: RitualOverlayProps) {
  const [phase, setPhase] = useState<Phase>(0);
  const [burden, setBurden] = useState('');
  const [promise, setPromise] = useState('');
  const [burning, setBurning] = useState(false);
  const [smokeParticles, setSmokeParticles] = useState<number[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleRelease = () => {
    if (!burden.trim()) return;
    setPhase(1);
  };

  const handleBurn = () => {
    if (!burden.trim()) return;
    setBurning(true);
    setSmokeParticles(Array.from({ length: 15 }, (_, i) => i));
    setTimeout(() => {
      setBurning(false);
      setPhase(2);
    }, 1800);
  };

  const handleLockPromise = () => {
    if (!promise.trim()) return;
    savePromise(promise);
    setPhase(3);
  };

  const handleConfirmSleep = () => {
    setVisible(false);
    setTimeout(onConfirm, 400);
  };

  return (
    <div className="min-h-screen w-full text-white flex flex-col items-center justify-center relative">
      <CosmicBackground />
      <div
        className={`diov-app-content flex flex-col items-center justify-center px-6 text-center w-full max-w-sm transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        }`}
      >
        {/* ─── PHASE 0: THE BURDEN ─── */}
        {phase === 0 && (
          <div className="space-y-6 w-full diov-fade-in">
            <p className="text-[10px] tracking-[0.3em] text-white/40 uppercase font-medium">
              The DIOV Protocol
            </p>
            <h2 className="diov-serif text-3xl font-normal italic text-white/90">
              Phase 1: The Burden
            </h2>
            <p className="text-sm text-white/50 font-light">
              What are you still carrying?
            </p>
            <textarea
              value={burden}
              onChange={(e) => setBurden(e.target.value)}
              placeholder="The deadline. The argument. The weight..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white/90 placeholder-white/20 outline-none focus:border-white/25 transition-colors min-h-[100px] resize-none"
            />
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-4 rounded-full text-sm font-semibold tracking-[0.12em] uppercase transition-all diov-glass-pill text-white/50 hover:text-white/80"
              >
                Cancel
              </button>
              <button
                onClick={handleRelease}
                disabled={!burden.trim()}
                className={`flex-1 py-4 rounded-full text-sm font-semibold tracking-[0.12em] uppercase transition-all active:scale-95 ${
                  burden.trim()
                    ? 'bg-white text-black diov-cta-btn'
                    : 'bg-white/5 text-white/30'
                }`}
              >
                Release
              </button>
            </div>
          </div>
        )}

        {/* ─── PHASE 1: THE BURN ─── */}
        {phase === 1 && (
          <div className="space-y-6 w-full relative diov-fade-in">
            <p className="text-[10px] tracking-[0.3em] text-white/40 uppercase font-medium">
              The DIOV Protocol
            </p>
            <h2 className="diov-serif text-3xl font-normal italic text-white/90">
              Phase 2: The Burn
            </h2>
            <div className="relative min-h-[120px] flex items-center justify-center">
              <p
                className={`diov-serif text-xl font-light italic text-white/70 ${
                  burning ? 'diov-dissolve-text' : ''
                }`}
              >
                &ldquo;{burden}&rdquo;
              </p>
              {burning &&
                smokeParticles.map((i) => (
                  <div
                    key={i}
                    className="diov-smoke-particle"
                    style={{
                      left: `${40 + Math.random() * 20}%`,
                      top: `${35 + Math.random() * 25}%`,
                      animationDelay: `${Math.random() * 0.5}s`,
                    }}
                  />
                ))}
            </div>
            <p className="text-sm text-white/40 font-light">
              You carried this today. Tonight, it does not follow you.
            </p>
            {!burning && (
              <button
                onClick={handleBurn}
                className="w-full py-4 rounded-full bg-white text-black text-sm font-semibold tracking-[0.12em] uppercase active:scale-95 transition-all diov-cta-btn"
              >
                Burn It
              </button>
            )}
          </div>
        )}

        {/* ─── PHASE 2: THE PROMISE ─── */}
        {phase === 2 && (
          <div className="space-y-6 w-full diov-fade-in">
            <p className="text-[10px] tracking-[0.3em] text-white/40 uppercase font-medium">
              The DIOV Protocol
            </p>
            <h2 className="diov-serif text-3xl font-normal italic text-white/90">
              Phase 3: The Promise
            </h2>
            <p className="text-sm text-white/50 font-light">
              What will you execute tomorrow? One thing. No more.
            </p>
            <input
              type="text"
              value={promise}
              onChange={(e) => setPromise(e.target.value)}
              placeholder="Send the revised proposal..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white/90 text-center placeholder-white/20 outline-none focus:border-white/25 transition-colors"
            />
            <button
              onClick={handleLockPromise}
              disabled={!promise.trim()}
              className={`w-full py-4 rounded-full text-sm font-semibold tracking-[0.12em] uppercase transition-all active:scale-95 ${
                promise.trim()
                  ? 'bg-white text-black diov-cta-btn'
                  : 'bg-white/5 text-white/30'
              }`}
            >
              Lock It
            </button>
          </div>
        )}

        {/* ─── PHASE 3: CONFIRM ─── */}
        {phase === 3 && (
          <div className="space-y-6 w-full diov-fade-in">
            <p className="text-[10px] tracking-[0.3em] text-white/40 uppercase font-medium">
              The DIOV Protocol
            </p>
            <h2 className="diov-serif text-3xl font-normal italic text-white/90">
              Locked.
            </h2>
            <div className="diov-glass-card p-4">
              <p className="text-[10px] tracking-[0.2em] text-white/40 uppercase mb-2">
                Tomorrow&apos;s Promise
              </p>
              <p className="diov-serif text-lg font-light italic text-white/80">
                &ldquo;{promise}&rdquo;
              </p>
            </div>
            <p className="text-sm text-white/40 font-light">
              This cannot be changed. It will greet you at ignition.
            </p>
            <button
              onClick={handleConfirmSleep}
              className="w-full py-4 rounded-full bg-white text-black text-sm font-semibold tracking-[0.12em] uppercase active:scale-95 transition-all diov-cta-btn"
            >
              Initialize Sleep Sequence
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
