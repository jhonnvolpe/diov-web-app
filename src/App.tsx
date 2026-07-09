import { useState, useCallback, useEffect } from 'react';
import './App.css';
import CosmicBackground from '@/components/CosmicBackground';
import Dashboard from '@/components/Dashboard';
import RitualOverlay from '@/components/RitualOverlay';
import SleepMode from '@/components/SleepMode';
import AlarmView from '@/components/AlarmView';
import QualityRating from '@/components/QualityRating';
import PromiseCheck from '@/components/PromiseCheck';
import Gratitude from '@/components/Gratitude';
import {
  getSettings,
  addSleepLog,
  markPromiseKept,
  updateStreak,
} from '@/lib/diovStorage';
import { getYesterdayPromise } from '@/lib/diovStorage';

type View = 'dashboard' | 'sleep' | 'alarm';
type PostWake = 'quality' | 'promise-check' | 'gratitude' | null;

export default function App() {
  const [view, setView] = useState<View>('dashboard');
  const [showRitual, setShowRitual] = useState(false);
  const [postWake, setPostWake] = useState<PostWake>(null);
  const [sleepQuality, setSleepQuality] = useState(0);

  const settings = getSettings();

  // Check for alarm trigger every second while in sleep mode
  useEffect(() => {
    if (view !== 'sleep') return;
    const interval = setInterval(() => {
      const now = new Date();
      const [h, m] = settings.wakeTime.split(':').map(Number);
      if (now.getHours() === h && now.getMinutes() === m && now.getSeconds() === 0) {
        triggerAlarm();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [view, settings.wakeTime]);

  const handleInitSleep = useCallback(() => {
    setShowRitual(true);
  }, []);

  const handleRitualConfirm = useCallback(() => {
    setShowRitual(false);
    setView('sleep');
  }, []);

  const handleRitualClose = useCallback(() => {
    setShowRitual(false);
  }, []);

  const triggerAlarm = useCallback(() => {
    setView('alarm');
  }, []);

  const handleDismissAlarm = useCallback(() => {
    updateStreak();
    // Check if there's a yesterday's promise to check
    const yp = getYesterdayPromise();
    if (yp) {
      setPostWake('promise-check');
    } else {
      setPostWake('quality');
    }
  }, []);

  const handleSnooze = useCallback(() => {
    setView('sleep');
    // Re-trigger alarm after 5 minutes
    setTimeout(() => {
      triggerAlarm();
    }, 300000);
  }, [triggerAlarm]);

  const handleQualitySubmit = useCallback((rating: number) => {
    setSleepQuality(rating);
    const yp = getYesterdayPromise();
    if (yp) {
      setPostWake('promise-check');
    } else {
      setPostWake('gratitude');
    }
  }, []);

  const handlePromiseAnswer = useCallback(
    (kept: boolean) => {
      markPromiseKept(kept);
      addSleepLog(sleepQuality, settings.sleepTime, settings.wakeTime, kept);
      setPostWake('gratitude');
    },
    [sleepQuality, settings]
  );

  const handleGratitudeComplete = useCallback((text: string) => {
    // Update the last log with gratitude
    const logs = JSON.parse(localStorage.getItem('diov_sleep_logs') || '[]');
    const today = new Date().toISOString().split('T')[0];
    const entry = logs.find((l: { date: string }) => l.date === today);
    if (entry) {
      entry.gratitude = text;
      localStorage.setItem('diov_sleep_logs', JSON.stringify(logs));
    }
    setPostWake(null);
    setView('dashboard');
    setSleepQuality(0);
  }, []);

  return (
    <div className="min-h-screen w-full overflow-hidden flex justify-center" style={{ background: '#050208' }}>
      {/* Mobile container - max-width like a phone screen */}
      <div className="w-full max-w-[430px] relative overflow-hidden" style={{ background: '#050208' }}>
      <CosmicBackground />

      {/* Main views */}
      {view === 'dashboard' && (
        <Dashboard onInitSleep={handleInitSleep} />
      )}

      {view === 'sleep' && (
        <SleepMode wakeTime={settings.wakeTime} onTriggerAlarm={triggerAlarm} />
      )}

      {view === 'alarm' && (
        <AlarmView
          intensity={settings.wakeIntensity}
          onDismiss={handleDismissAlarm}
          onSnooze={handleSnooze}
        />
      )}

      {/* Ritual Overlay (on top of everything) */}
      {showRitual && (
        <div className="fixed inset-0 z-50">
          <RitualOverlay onConfirm={handleRitualConfirm} onClose={handleRitualClose} />
        </div>
      )}

      {/* Post-wake flow (on top of everything) */}
      {postWake === 'quality' && (
        <div className="fixed inset-0 z-50">
          <QualityRating onSubmit={handleQualitySubmit} />
        </div>
      )}

      {postWake === 'promise-check' && (
        <div className="fixed inset-0 z-50">
          <PromiseCheck onAnswer={handlePromiseAnswer} />
        </div>
      )}

      {postWake === 'gratitude' && (
        <div className="fixed inset-0 z-50">
          <Gratitude onComplete={handleGratitudeComplete} />
        </div>
      )}
      </div>{/* end mobile container */}
    </div>
  );
}
