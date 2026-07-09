import { useState, useEffect, useRef } from 'react';
import { Flame } from 'lucide-react';
import {
  formatDate,
  getWakeCountdown,
  SLEEP_PHRASES,
  TRANSCRIPTS,
} from '@/lib/diovUtils';
import { getStreak } from '@/lib/diovStorage';
import CosmicBackground from './CosmicBackground';

interface SleepModeProps {
  wakeTime: string;
  onTriggerAlarm: () => void;
}

export default function SleepMode({ wakeTime, onTriggerAlarm }: SleepModeProps) {
  const [breathPhase, setBreathPhase] = useState(0);
  const [countdown, setCountdown] = useState(() => getWakeCountdown(wakeTime));
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [phraseVisible, setPhraseVisible] = useState(true);
  const [transcriptIndex, setTranscriptIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  const breathLabels = ['IN', 'HOLD', 'OUT'];
  const streak = getStreak().count;

  const sleepAudioRef = useRef<HTMLAudioElement>(null);
  const phraseIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const breathIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const transcriptIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Clock
  useEffect(() => {
    timeIntervalRef.current = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => {
      if (timeIntervalRef.current) clearInterval(timeIntervalRef.current);
    };
  }, []);

  // Countdown
  useEffect(() => {
    setCountdown(getWakeCountdown(wakeTime));
    countdownIntervalRef.current = setInterval(() => {
      setCountdown(getWakeCountdown(wakeTime));
    }, 60000);
    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [wakeTime]);

  // Breathing cycle (4-7-8: 4s in, 7s hold, 8s out ~ approximated as 4s phases)
  useEffect(() => {
    breathIntervalRef.current = setInterval(() => {
      setBreathPhase((prev) => (prev + 1) % 3);
    }, 4000);
    return () => {
      if (breathIntervalRef.current) clearInterval(breathIntervalRef.current);
    };
  }, []);

  // Rotating phrases
  useEffect(() => {
    phraseIntervalRef.current = setInterval(() => {
      setPhraseVisible(false);
      setTimeout(() => {
        setPhraseIndex((prev) => (prev + 1) % SLEEP_PHRASES.length);
        setPhraseVisible(true);
      }, 800);
    }, 6000);
    return () => {
      if (phraseIntervalRef.current) clearInterval(phraseIntervalRef.current);
    };
  }, []);

  // Rotating transcripts
  useEffect(() => {
    transcriptIntervalRef.current = setInterval(() => {
      setTranscriptIndex((prev) => (prev + 1) % TRANSCRIPTS.length);
    }, 12000);
    return () => {
      if (transcriptIntervalRef.current) clearInterval(transcriptIntervalRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen w-full text-white flex flex-col items-center justify-center relative">
      <CosmicBackground />
      {/* Demo audio placeholder — will be replaced with DIOV sleep audio */}
      <audio
        ref={sleepAudioRef}
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        loop
      />

      <div className="diov-app-content absolute inset-0 flex flex-col items-center justify-center px-6">
        {/* Top Bar */}
        <div className="absolute top-8 left-0 right-0 px-6 flex justify-between items-center diov-fade-in">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] tracking-[0.15em] text-white/50 uppercase">
              {streak} DAYS
            </span>
          </div>
          <span className="text-[10px] text-white/40 tracking-wider">
            {formatDate(currentTime)}
          </span>
        </div>

        {/* Transcript Label */}
        <div className="absolute top-20 left-0 right-0 text-center diov-fade-in">
          <p className="text-[10px] tracking-[0.25em] text-white/40 uppercase">
            Audio Transcript: Neural Reset Protocol
          </p>
        </div>

        {/* Countdown */}
        <div className="absolute top-28 left-0 right-0 text-center diov-fade-in">
          <p className="text-[10px] tracking-[0.2em] text-white/40 uppercase">
            Ignition in
          </p>
          <p className="text-sm font-light text-white/60 mt-0.5">{countdown}</p>
        </div>

        {/* Breathing Orb */}
        <div className="relative flex items-center justify-center mb-8">
          <div className="diov-orb-core" />
          <div className="diov-orb-ring" style={{ animationDelay: '0s' }} />
          <div className="diov-orb-ring" style={{ animationDelay: '1s' }} />
          <div className="diov-orb-ring" style={{ animationDelay: '2s' }} />

          <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-center">
            <span
              className={`text-[10px] tracking-[0.3em] font-semibold uppercase transition-all duration-500 ${
                breathPhase === 0 ? 'text-white/80' : 'text-white/20'
              }`}
            >
              {breathLabels[0]}
            </span>
          </div>
          <div className="absolute top-1/2 -right-10 -translate-y-1/2 text-center">
            <span
              className={`text-[10px] tracking-[0.3em] font-semibold uppercase transition-all duration-500 ${
                breathPhase === 1 ? 'text-white/80' : 'text-white/20'
              }`}
            >
              {breathLabels[1]}
            </span>
          </div>
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-center">
            <span
              className={`text-[10px] tracking-[0.3em] font-semibold uppercase transition-all duration-500 ${
                breathPhase === 2 ? 'text-white/80' : 'text-white/20'
              }`}
            >
              {breathLabels[2]}
            </span>
          </div>
          <div className="absolute top-1/2 -left-10 -translate-y-1/2 text-center">
            <span className="text-[10px] tracking-[0.2em] text-white/20 uppercase">
              4-7-8
            </span>
          </div>
        </div>

        {/* Floating Phrase */}
        <div className="text-center max-w-xs relative z-10">
          <p
            className={`diov-serif text-2xl font-light italic text-white/80 diov-glow-text transition-all duration-800 ${
              phraseVisible ? 'opacity-100' : 'opacity-0'
            }`}
            key={phraseIndex}
          >
            {SLEEP_PHRASES[phraseIndex]}
          </p>
          <p className="text-[10px] tracking-[0.3em] text-white/30 uppercase mt-4">
            Breathe with the Orb.
          </p>
        </div>

        {/* Transcript Box */}
        <div className="absolute bottom-24 left-6 right-6 diov-glass-card p-4 max-h-32 overflow-y-auto hide-scrollbar diov-fade-in">
          <p className="text-[10px] tracking-[0.15em] text-white/40 uppercase mb-2">
            [TRANSCRIPT]
          </p>
          <p className="text-[11px] text-white/60 leading-relaxed font-light">
            {TRANSCRIPTS[transcriptIndex]}
          </p>
        </div>

        {/* Dev Trigger */}
        <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-2">
          <button
            onClick={onTriggerAlarm}
            className="diov-glass-pill px-5 py-2 text-[10px] tracking-[0.15em] text-white/40 uppercase font-medium hover:text-white/70 transition-colors"
          >
            Wake / Trigger Alarm
          </button>
        </div>
      </div>
    </div>
  );
}
