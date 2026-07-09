import { useState, useEffect } from 'react';
import { Gem, Pause, X } from 'lucide-react';
import { getWakeCountdown, SLEEP_PHRASES, SLEEP_TRANSCRIPTS } from '@/lib/diovUtils';
import { getStreak } from '@/lib/diovStorage';
import CosmicBackground from './CosmicBackground';

interface Props { wakeTime: string; onTriggerAlarm: () => void; onComplete: () => void; onCancel: () => void; }

export default function SleepMode({ wakeTime, onTriggerAlarm, onComplete, onCancel }: Props) {
  const [breathPhase, setBreathPhase] = useState(0);
  const [countdown, setCountdown] = useState(() => getWakeCountdown(wakeTime));
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [phraseVis, setPhraseVis] = useState(true);
  const [transIdx, setTransIdx] = useState(0);
  const [time, setTime] = useState(new Date());

  const breathLabels = ['IN (4s)', 'HOLD (7s)', 'OUT (8s)'];
  const breathDurs = [4000, 7000, 8000];
  const streak = getStreak().count;

  // Clock
  useEffect(() => { const i = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(i); }, []);

  // Countdown
  useEffect(() => {
    setCountdown(getWakeCountdown(wakeTime));
    const i = setInterval(() => setCountdown(getWakeCountdown(wakeTime)), 60000);
    return () => clearInterval(i);
  }, [wakeTime]);

  // Breathing cycle (4-7-8)
  useEffect(() => {
    let idx = 0;
    const next = () => {
      setBreathPhase(idx);
      idx = (idx + 1) % 3;
      const dur = breathDurs[idx === 0 ? 2 : idx === 1 ? 0 : 1];
      return setTimeout(next, dur);
    };
    let t = setTimeout(next, breathDurs[0]);
    return () => clearTimeout(t);
  }, []);

  // Phrases
  useEffect(() => {
    const i = setInterval(() => {
      setPhraseVis(false);
      setTimeout(() => { setPhraseIdx(p => (p + 1) % SLEEP_PHRASES.length); setPhraseVis(true); }, 800);
    }, 6000);
    return () => clearInterval(i);
  }, []);

  // Transcripts
  useEffect(() => {
    const i = setInterval(() => setTransIdx(t => (t + 1) % SLEEP_TRANSCRIPTS.length), 15000);
    return () => clearInterval(i);
  }, []);

  // Check alarm
  useEffect(() => {
    const [h, m] = wakeTime.split(':').map(Number);
    if (time.getHours() === h && time.getMinutes() === m && time.getSeconds() === 0) {
      onTriggerAlarm();
    }
  }, [time, wakeTime, onTriggerAlarm]);

  const fmtDate = (d: Date) => d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).toUpperCase();

  return (
    <div className="min-h-screen w-full text-white flex flex-col items-center justify-center relative">
      <CosmicBackground theme="dark" />
      <div className="diov-app-content absolute inset-0 flex flex-col items-center justify-center px-6 z-10">

        {/* Top bar */}
        <div className="absolute top-8 left-0 right-0 px-6 flex justify-between items-center diov-fade-in">
          <div className="flex items-center gap-2"><Gem className="w-3.5 h-3.5 text-white/40" strokeWidth={1.5} /><span className="text-[10px] tracking-[0.15em] text-white/50 uppercase">{streak} DAYS</span></div>
          <span className="text-[10px] text-white/40 tracking-wider">{fmtDate(time)}</span>
        </div>

        {/* Header */}
        <div className="absolute top-20 left-0 right-0 text-center diov-fade-in">
          <p className="text-[10px] tracking-[0.25em] text-white/40 uppercase">ACTIVE DEEP SEQUENCE</p>
        </div>

        {/* Countdown */}
        <div className="absolute top-28 left-0 right-0 text-center diov-fade-in">
          <p className="text-[10px] tracking-[0.2em] text-white/40 uppercase">Ignition in</p>
          <p className="text-sm font-light text-white/60 mt-0.5">{countdown}</p>
        </div>

        {/* Orb with breathing labels */}
        <div className="relative w-64 h-64 flex items-center justify-center mb-4">
          <img src="/orb-sleep.png" alt="" className="w-full h-full object-contain diov-orb-pulse" />

          <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-center">
            <span className={`text-[10px] tracking-[0.2em] font-medium uppercase transition-all duration-500 ${breathPhase === 0 ? 'text-amber-300/80' : 'text-white/15'}`}>{breathLabels[0]}</span>
          </div>
          <div className="absolute top-1/2 -right-2 -translate-y-1/2 text-center" style={{ writingMode: 'vertical-rl' }}>
            <span className={`text-[10px] tracking-[0.2em] font-medium uppercase transition-all duration-500 ${breathPhase === 1 ? 'text-amber-300/80' : 'text-white/15'}`}>{breathLabels[1]}</span>
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-center">
            <span className={`text-[10px] tracking-[0.2em] font-medium uppercase transition-all duration-500 ${breathPhase === 2 ? 'text-amber-300/80' : 'text-white/15'}`}>{breathLabels[2]}</span>
          </div>
        </div>

        {/* Floating phrase */}
        <div className="text-center max-w-xs relative z-10 mb-6">
          <p className={`diov-serif text-2xl font-light italic text-white/80 diov-glow-text transition-all duration-800 ${phraseVis ? 'opacity-100' : 'opacity-0'}`} key={phraseIdx}>{SLEEP_PHRASES[phraseIdx]}</p>
        </div>

        {/* Transcript */}
        <div className="absolute bottom-24 left-5 right-5 diov-glass-card p-4 max-h-36 overflow-y-auto hide-scrollbar diov-fade-in">
          <p className="text-[11px] text-white/60 leading-relaxed font-light">{SLEEP_TRANSCRIPTS[transIdx]}</p>
        </div>

        {/* Buttons */}
        <div className="absolute bottom-6 left-5 right-5 flex gap-3">
          <button onClick={() => {}} className="flex-1 py-3 rounded-full diov-cyan-btn text-[11px] tracking-[0.12em] uppercase font-medium flex items-center justify-center gap-2">
            <Pause className="w-4 h-4" /> Pause
          </button>
          <button onClick={onCancel} className="flex-1 py-3 rounded-full diov-cyan-btn text-[11px] tracking-[0.12em] uppercase font-medium flex items-center justify-center gap-2">
            <X className="w-4 h-4" /> Cancel
          </button>
        </div>

        {/* Dev triggers */}
        <div className="absolute top-8 right-16 flex gap-2">
          <button onClick={onComplete} className="diov-glass-pill px-3 py-1 text-[9px] tracking-[0.1em] text-white/30 uppercase">End</button>
          <button onClick={onTriggerAlarm} className="diov-glass-pill px-3 py-1 text-[9px] tracking-[0.1em] text-white/30 uppercase">Alarm</button>
        </div>
      </div>
    </div>
  );
}
