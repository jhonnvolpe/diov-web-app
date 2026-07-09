import { useState, useEffect } from 'react';
import { Settings, Flame } from 'lucide-react';
import {
  formatTime24,
  formatDate,
  getMoonPhase,
  calculateSleepCycles,
  formatTime12,
  DASHBOARD_QUOTES,
  intensityLabels,
  intensityDescriptions,
} from '@/lib/diovUtils';
import {
  getStreak,
  getSleepLogs,
  getIntegrityScore,
  getSettings,
  saveSettings,
  type DiovSettings,
} from '@/lib/diovStorage';

interface DashboardProps {
  onInitSleep: () => void;
}

export default function Dashboard({ onInitSleep }: DashboardProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [subView, setSubView] = useState<'main' | 'stats'>('main');
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<DiovSettings>(getSettings);

  const streak = getStreak().count;
  const quote = DASHBOARD_QUOTES[new Date().getDate() % DASHBOARD_QUOTES.length];
  const moonPhase = getMoonPhase(currentTime);
  const logs = getSleepLogs();
  const last7 = logs.slice(-7);
  const avgQuality = last7.length
    ? (last7.reduce((a, l) => a + l.quality, 0) / last7.length).toFixed(1)
    : '\u2014';
  const integrityScore = getIntegrityScore();
  const sleepCycles = calculateSleepCycles(settings.wakeTime);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const updateSetting = <K extends keyof DiovSettings>(
    key: K,
    value: DiovSettings[K]
  ) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    saveSettings(next);
  };

  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const todayIdx = new Date().getDay();

  return (
    <div className="min-h-screen w-full text-white flex flex-col relative">
      <div className="diov-app-content flex flex-col h-full overflow-y-auto hide-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-8 pb-2 diov-fade-in">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <span className="text-[11px] font-semibold tracking-[0.15em] text-white/60 uppercase">
              {streak} DAYS
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-white/40 tracking-wider flex items-center gap-1.5">
              <span className="text-sm">{moonPhase.split(' ')[0]}</span>
              <span className="hidden sm:inline">{moonPhase.split(' ').slice(1).join(' ')}</span>
            </span>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="w-8 h-8 rounded-full flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
            >
              <Settings className="w-[18px] h-[18px]" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mx-6 mb-4 p-4 rounded-2xl diov-glass-card diov-slide-up">
            <div className="space-y-4">
              <div>
                <p className="text-[10px] tracking-[0.2em] text-white/40 uppercase mb-2">
                  Language
                </p>
                <div className="flex gap-2">
                  {['EN', 'ES', 'AR', 'JP', 'KR'].map((l) => (
                    <button
                      key={l}
                      className="px-3 py-1.5 rounded-full text-[10px] font-semibold tracking-wider transition-all diov-glass-pill text-white/50"
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Clock */}
        <div className="px-6 pt-2 pb-6">
          <div className="text-center space-y-2 diov-fade-in">
            <p className="text-[10px] tracking-[0.3em] text-white/40 font-medium uppercase">
              {formatDate(currentTime)}
            </p>
            <h1 className="diov-time-display text-6xl font-extralight tracking-tight text-white/95 diov-shimmer-text">
              {formatTime24(currentTime)}
            </h1>
            <p className="diov-serif text-base text-white/40 font-light italic mt-2 px-6">
              &ldquo;{quote}&rdquo;
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-6 mb-5 px-6">
          <button
            onClick={() => setSubView('main')}
            className={`text-[10px] tracking-[0.2em] uppercase font-semibold pb-1.5 transition-all ${
              subView === 'main'
                ? 'text-white border-b border-white/60'
                : 'text-white/40'
            }`}
          >
            Sequence
          </button>
          <button
            onClick={() => setSubView('stats')}
            className={`text-[10px] tracking-[0.2em] uppercase font-semibold pb-1.5 transition-all ${
              subView === 'stats'
                ? 'text-white border-b border-white/60'
                : 'text-white/40'
            }`}
          >
            Stats
          </button>
        </div>

        {subView === 'main' ? (
          <div className="flex-1 px-6 pb-8 space-y-4 diov-fade-in">
            {/* Sleep / Wake Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="diov-glass-card p-4 text-center space-y-1">
                <p className="text-[10px] tracking-[0.2em] text-white/40 uppercase font-medium">
                  Sleep
                </p>
                <p className="text-2xl font-light text-white/90">
                  {formatTime12(settings.sleepTime)}
                </p>
                <p className="text-[10px] text-white/30">Time for deep rest.</p>
              </div>
              <div className="diov-glass-card p-4 text-center space-y-1">
                <p className="text-[10px] tracking-[0.2em] text-white/40 uppercase font-medium">
                  Wake
                </p>
                <p className="text-2xl font-light text-white/90">
                  {formatTime12(settings.wakeTime)}
                </p>
                <p className="text-[10px] text-white/30">Ignite your focus.</p>
              </div>
            </div>

            {/* Time Inputs */}
            <div className="grid grid-cols-2 gap-3">
              <input
                type="time"
                value={settings.sleepTime}
                onChange={(e) => updateSetting('sleepTime', e.target.value)}
                className="diov-glass-card p-3 text-center text-white/80 text-sm outline-none bg-transparent"
              />
              <input
                type="time"
                value={settings.wakeTime}
                onChange={(e) => updateSetting('wakeTime', e.target.value)}
                className="diov-glass-card p-3 text-center text-white/80 text-sm outline-none bg-transparent"
              />
            </div>

            {/* Optimal Bedtimes */}
            <div className="diov-glass-card p-4 space-y-3">
              <p className="text-[10px] tracking-[0.2em] text-white/40 uppercase font-medium text-center">
                Optimal Bedtimes for {formatTime12(settings.wakeTime)}
              </p>
              <div className="flex gap-2 justify-center">
                {sleepCycles.map((c) => (
                  <div
                    key={c.cycles}
                    className="flex-1 text-center p-2.5 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.02)' }}
                  >
                    <p className="text-lg font-light text-white/90">{c.time12}</p>
                    <p className="text-[9px] text-white/40 mt-1">{c.cycles} cycles</p>
                    <p className="text-[9px] text-white/30">{c.rest}</p>
                    <div className="flex justify-center mt-1.5">
                      {Array.from({ length: c.cycles }, (_, i) => (
                        <div
                          key={i}
                          className="diov-cycle-bar"
                          style={{ width: '8px', background: c.color }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Wake Intensity */}
            <div className="diov-glass-card p-4 space-y-3">
              <p className="text-[10px] tracking-[0.25em] text-white/40 uppercase font-medium text-center">
                Wake Intensity
              </p>
              <div className="flex gap-2 justify-center">
                {(['gentle', 'standard', 'intense'] as const).map((i) => (
                  <button
                    key={i}
                    onClick={() => updateSetting('wakeIntensity', i)}
                    className={`flex-1 py-2.5 rounded-full text-[10px] font-semibold tracking-wider transition-all ${
                      settings.wakeIntensity === i
                        ? 'diov-glass-pill-active'
                        : 'diov-glass-pill text-white/50'
                    }`}
                  >
                    {intensityLabels[i]}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-center text-white/30">
                {intensityDescriptions[settings.wakeIntensity]}
              </p>
            </div>

            {/* Main CTA */}
            <button
              onClick={onInitSleep}
              className="w-full py-4 rounded-full bg-white text-black text-sm font-bold tracking-[0.12em] uppercase transition-all active:scale-95 diov-cta-btn"
            >
              Initialize Sleep Sequence
            </button>
          </div>
        ) : (
          <div className="flex-1 px-6 pb-8 space-y-4 diov-fade-in">
            {/* 7-Day Chart */}
            <div className="diov-glass-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] tracking-[0.2em] text-white/40 uppercase font-medium">
                  Last 7 Nights
                </p>
                <p className="text-[10px] text-white/50">
                  Avg: <span className="text-white font-semibold">{avgQuality}</span>{' '}
                  <span className="text-amber-400">★</span>
                </p>
              </div>
              <div className="flex items-end justify-between gap-1 h-24 px-1">
                {Array.from({ length: 7 }, (_, i) => {
                  const log = last7[i];
                  const h = log ? `${log.quality * 20}%` : '4%';
                  const day = log
                    ? new Date(log.date).toLocaleDateString('en-US', {
                        weekday: 'narrow',
                      })
                    : weekDays[(todayIdx - 6 + i + 7) % 7];
                  return (
                    <div key={i} className="flex flex-col items-center gap-1 flex-1">
                      <div
                        className="w-full rounded-t-lg relative overflow-hidden"
                        style={{
                          height: '80px',
                          background: 'rgba(255,255,255,0.03)',
                        }}
                      >
                        <div
                          className="absolute bottom-0 w-full rounded-t-lg transition-all duration-500"
                          style={{
                            height: h,
                            background: log
                              ? 'rgba(139,92,246,0.5)'
                              : 'rgba(255,255,255,0.05)',
                          }}
                        />
                      </div>
                      <span className="text-[9px] text-white/30">{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="diov-glass-card p-4 text-center">
                <p className="text-3xl font-extralight text-white/90">{streak}</p>
                <p className="text-[9px] tracking-[0.15em] text-white/40 uppercase mt-1">
                  Day Streak
                </p>
              </div>
              <div className="diov-glass-card p-4 text-center">
                <p className="text-3xl font-extralight text-white/90">
                  {last7.length}
                </p>
                <p className="text-[9px] tracking-[0.15em] text-white/40 uppercase mt-1">
                  Nights Logged
                </p>
              </div>
            </div>

            {/* Integrity Score */}
            {integrityScore !== null && (
              <div className="diov-glass-card p-4 text-center space-y-1">
                <p className="text-[10px] tracking-[0.2em] text-white/40 uppercase">
                  Promise Integrity
                </p>
                <p className="text-4xl font-extralight text-white/95">
                  {integrityScore}
                  <span className="text-lg text-white/40">%</span>
                </p>
                <p className="text-[10px] text-white/30">
                  Your reputation with yourself.
                </p>
              </div>
            )}

            {/* Moon Phase */}
            <div className="diov-glass-card p-4 text-center">
              <p className="text-[10px] tracking-[0.2em] text-white/40 uppercase mb-2">
                Lunar Alignment
              </p>
              <p className="text-sm text-white/70 font-light">{moonPhase}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
