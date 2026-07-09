import { useState, useCallback, useEffect } from 'react';
import './App.css';
import { syncFromApi } from '@/lib/diovStorage';
import Dashboard from '@/components/Dashboard';
import RitualOverlay from '@/components/RitualOverlay';
import CountdownTransition from '@/components/CountdownTransition';
import SleepMode from '@/components/SleepMode';
import SleepComplete from '@/components/SleepComplete';
import AlarmView from '@/components/AlarmView';
import AlarmSilenced from '@/components/AlarmSilenced';
import WakeCountdown from '@/components/WakeCountdown';
import WakeActive from '@/components/WakeActive';
import QualityRating from '@/components/QualityRating';
import PromiseCheck from '@/components/PromiseCheck';
import Gratitude from '@/components/Gratitude';
import { getSettings, addSleepLog, markPromiseKept, updateStreak } from '@/lib/diovStorage';
import { getYesterdayPromise } from '@/lib/diovStorage';

type View =
  | 'dashboard'
  | 'ritual'
  | 'countdown'
  | 'sleep'
  | 'sleep-complete'
  | 'alarm'
  | 'alarm-silenced'
  | 'wake-countdown'
  | 'wake-active'
  | 'quality'
  | 'promise-check'
  | 'gratitude';

export default function App() {
  const [view, setView] = useState<View>('dashboard');
  const [sleepQuality, setSleepQuality] = useState(0);

  const settings = getSettings();

  // Sync data from API on app load
  useEffect(() => { syncFromApi(); }, []);

  // ─── SLEEP FLOW ───
  const startRitual = useCallback(() => setView('ritual'), []);

  const ritualComplete = useCallback(() => setView('countdown'), []);

  const ritualCancel = useCallback(() => setView('dashboard'), []);

  const countdownComplete = useCallback(() => setView('sleep'), []);

  const triggerAlarm = useCallback(() => setView('alarm'), []);

  const sleepCancel = useCallback(() => setView('dashboard'), []);

  const sleepComplete = useCallback(() => setView('sleep-complete'), []);

  // ─── WAKE FLOW ───
  const stopAlarm = useCallback(() => setView('alarm-silenced'), []);

  const startWake = useCallback(() => setView('wake-countdown'), []);

  const wakeCountdownComplete = useCallback(() => setView('wake-active'), []);

  // ─── POST-WAKE FLOW ───
  const submitQuality = useCallback((rating: number) => {
    setSleepQuality(rating);
    const yp = getYesterdayPromise();
    if (yp) {
      setView('promise-check');
    } else {
      addSleepLog(rating, settings.sleepTime, settings.wakeTime, null, '');
      setView('gratitude');
    }
  }, [settings]);

  const answerPromise = useCallback((kept: boolean) => {
    markPromiseKept(kept);
    addSleepLog(sleepQuality, settings.sleepTime, settings.wakeTime, kept, '');
    setView('gratitude');
  }, [sleepQuality, settings]);

  const completeGratitude = useCallback((text: string) => {
    updateStreak();
    const logs = JSON.parse(localStorage.getItem('diov_sleep_logs') || '[]');
    const today = new Date().toISOString().split('T')[0];
    const entry = logs.find((l: { date: string }) => l.date === today);
    if (entry) { entry.gratitude = text; localStorage.setItem('diov_sleep_logs', JSON.stringify(logs)); }
    setSleepQuality(0);
    setView('dashboard');
  }, []);

  return (
    <div className="min-h-screen w-full overflow-hidden flex justify-center" style={{ background: '#050208' }}>
      <div className="w-full max-w-[430px] relative overflow-hidden" style={{ background: view === 'dashboard' || view === 'ritual' || view === 'countdown' || view === 'sleep' || view === 'sleep-complete' || view === 'alarm' ? '#050208' : 'transparent' }}>

        {view === 'dashboard' && <Dashboard onInitSleep={startRitual} />}

        {view === 'ritual' && (
          <div className="fixed inset-0 z-50">
            <RitualOverlay onConfirm={ritualComplete} onClose={ritualCancel} />
          </div>
        )}

        {view === 'countdown' && (
          <div className="fixed inset-0 z-50">
            <CountdownTransition onComplete={countdownComplete} />
          </div>
        )}

        {view === 'sleep' && (
          <div className="fixed inset-0 z-50">
            <SleepMode wakeTime={settings.wakeTime} onTriggerAlarm={triggerAlarm} onComplete={sleepComplete} onCancel={sleepCancel} />
          </div>
        )}

        {view === 'sleep-complete' && (
          <div className="fixed inset-0 z-50">
            <SleepComplete onFadeOut={triggerAlarm} />
          </div>
        )}

        {view === 'alarm' && (
          <div className="fixed inset-0 z-50">
            <AlarmView onStop={stopAlarm} />
          </div>
        )}

        {view === 'alarm-silenced' && (
          <div className="fixed inset-0 z-50">
            <AlarmSilenced onStartWake={startWake} />
          </div>
        )}

        {view === 'wake-countdown' && (
          <div className="fixed inset-0 z-50">
            <WakeCountdown onComplete={wakeCountdownComplete} />
          </div>
        )}

        {view === 'wake-active' && (
          <div className="fixed inset-0 z-50">
            <WakeActive onComplete={() => setView('quality')} onCancel={() => setView('dashboard')} />
          </div>
        )}

        {view === 'quality' && (
          <div className="fixed inset-0 z-50">
            <QualityRating onSubmit={submitQuality} />
          </div>
        )}

        {view === 'promise-check' && (
          <div className="fixed inset-0 z-50">
            <PromiseCheck onAnswer={answerPromise} />
          </div>
        )}

        {view === 'gratitude' && (
          <div className="fixed inset-0 z-50">
            <Gratitude onComplete={completeGratitude} />
          </div>
        )}
      </div>
    </div>
  );
}
