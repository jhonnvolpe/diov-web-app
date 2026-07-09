import { useState, useEffect, useRef } from 'react';
import { WAKE_PHRASES } from '@/lib/diovUtils';
import { getTodayPromise } from '@/lib/diovStorage';
import CosmicBackground from './CosmicBackground';

interface AlarmViewProps {
  intensity: string;
  onDismiss: () => void;
  onSnooze: () => void;
}

export default function AlarmView({ intensity, onDismiss, onSnooze }: AlarmViewProps) {
  const [wakeProgress, setWakeProgress] = useState(0);
  const [wakeHolding, setWakeHolding] = useState(false);
  const [wakePhraseIndex, setWakePhraseIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  const alarmAudioRef = useRef<HTMLAudioElement>(null);
  const wakeProgressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const wakePhraseIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const todayPromise = getTodayPromise();

  useEffect(() => {
    setVisible(true);
  }, []);

  // Alarm audio
  useEffect(() => {
    if (alarmAudioRef.current) {
      const vol = intensity === 'intense' ? 0.9 : intensity === 'gentle' ? 0.5 : 0.7;
      alarmAudioRef.current.volume = vol;
      alarmAudioRef.current.play().catch(() => {});
    }
    return () => {
      if (alarmAudioRef.current) {
        alarmAudioRef.current.pause();
        alarmAudioRef.current.currentTime = 0;
      }
    };
  }, [intensity]);

  // Rotating wake phrases
  useEffect(() => {
    wakePhraseIntervalRef.current = setInterval(() => {
      setWakePhraseIndex((prev) => (prev + 1) % WAKE_PHRASES.length);
    }, 4000);
    return () => {
      if (wakePhraseIntervalRef.current) clearInterval(wakePhraseIntervalRef.current);
    };
  }, []);

  const startWakeHold = () => {
    setWakeHolding(true);
    setWakeProgress(0);
    let progress = 0;
    wakeProgressRef.current = setInterval(() => {
      progress += 2;
      setWakeProgress(progress);
      if (progress >= 100) {
        if (wakeProgressRef.current) clearInterval(wakeProgressRef.current);
        setWakeHolding(false);
        if (alarmAudioRef.current) {
          alarmAudioRef.current.pause();
          alarmAudioRef.current.currentTime = 0;
        }
        onDismiss();
      }
    }, 30);
  };

  const endWakeHold = () => {
    setWakeHolding(false);
    if (wakeProgressRef.current) clearInterval(wakeProgressRef.current);
    setWakeProgress(0);
  };

  return (
    <div className="min-h-screen w-full text-white flex flex-col items-center justify-center relative">
      <CosmicBackground />
      <audio
        ref={alarmAudioRef}
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3"
        loop
      />

      <div
        className={`diov-app-content flex flex-col items-center justify-center px-6 text-center h-full transition-all duration-700 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="space-y-6 diov-fade-in">
          <p className="text-[10px] tracking-[0.4em] text-white/50 uppercase font-medium">
            Morning Ignition
          </p>

          <h2 className="text-6xl font-extrabold tracking-tight text-white/95 diov-glow-text-gold">
            WAKE UP.
          </h2>

          {todayPromise && (
            <div className="diov-fade-in-slow">
              <p className="text-[10px] tracking-[0.2em] text-white/40 uppercase mb-2">
                Your Promise
              </p>
              <p className="diov-serif text-xl font-light italic text-white/70">
                &ldquo;{todayPromise.text}&rdquo;
              </p>
            </div>
          )}

          {/* Sun Orb */}
          <div className="relative flex items-center justify-center py-4">
            <div className="diov-sun-rays" />
            <div className="diov-sun-core" />
          </div>

          <p className="text-sm font-light text-white/60 diov-fade-in" key={wakePhraseIndex}>
            {WAKE_PHRASES[wakePhraseIndex]}
          </p>
        </div>

        {/* Hold to Dismiss */}
        <div className="w-full max-w-xs mt-8 space-y-3">
          <div
            className="diov-progress-track flex items-center justify-center cursor-pointer select-none relative"
            onTouchStart={startWakeHold}
            onTouchEnd={endWakeHold}
            onMouseDown={startWakeHold}
            onMouseUp={endWakeHold}
            onMouseLeave={endWakeHold}
          >
            {wakeProgress > 0 && (
              <div
                className="diov-progress-fill absolute left-0 top-0"
                style={{ width: `${wakeProgress}%` }}
              >
                <div className="diov-progress-glow" />
              </div>
            )}
            <span className="relative z-10 text-[11px] tracking-[0.15em] font-semibold uppercase text-white/70">
              {wakeHolding ? 'HOLD TO CLAIM...' : 'HOLD TO DISMISS & CLAIM DAY'}
            </span>
          </div>

          <button
            onClick={() => {
              if (alarmAudioRef.current) {
                alarmAudioRef.current.pause();
                alarmAudioRef.current.currentTime = 0;
              }
              onSnooze();
            }}
            className="w-full py-3 rounded-full text-[11px] tracking-[0.12em] text-white/40 uppercase font-medium transition-all active:scale-95 hover:text-white/60"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
          >
            5 Min Alignment Snooze
          </button>
        </div>
      </div>
    </div>
  );
}
