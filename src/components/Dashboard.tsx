import { useState, useEffect, useMemo } from 'react';
import { Settings, Gem, Moon, Sun, BedDouble, Timer } from 'lucide-react';
import { formatTime12, DASHBOARD_QUOTES, intensityLabels, intensityDescriptions, calculateSleepCycles, getMoonPhase } from '@/lib/diovUtils';
import { getStreak, getSleepLogs, getIntegrityScore, getSettings, saveSettings, type DiovSettings } from '@/lib/diovStorage';
import CosmicBackground from './CosmicBackground';

interface Props { onInitSleep: () => void; }

export default function Dashboard({ onInitSleep }: Props) {
  const [time, setTime] = useState(new Date());
  const [tab, setTab] = useState<'sequence' | 'stats'>('sequence');
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<DiovSettings>(getSettings);

  const streak = getStreak().count;
  const moonPhase = getMoonPhase(time);
  const logs = getSleepLogs();
  const last7 = logs.slice(-7);
  const avgQ = last7.length ? (last7.reduce((a, l) => a + l.quality, 0) / last7.length).toFixed(1) : '\u2014';
  const integrity = getIntegrityScore();
  const cycles = calculateSleepCycles(settings.wakeTime);

  const quote = useMemo(() => {
    const idx = time.getDate() % DASHBOARD_QUOTES.length;
    return DASHBOARD_QUOTES[idx];
  }, []);

  const todayPromise = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const promises = JSON.parse(localStorage.getItem('diov_promises') || '[]');
    return promises.find((p: { date: string }) => p.date === today);
  }, []);

  useEffect(() => {
    const i = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  const update = <K extends keyof DiovSettings>(k: K, v: DiovSettings[K]) => {
    const n = { ...settings, [k]: v };
    setSettings(n);
    saveSettings(n);
  };

  const fmtDate = (d: Date) => d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).toUpperCase();
  const weekDays = ['S','M','T','W','T','F','S'];
  const todayIdx = new Date().getDay();

  return (
    <div className="min-h-screen w-full text-white flex flex-col relative">
      <CosmicBackground theme="dark" />
      <div className="diov-app-content flex flex-col h-full overflow-y-auto hide-scrollbar relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-7 pb-1 diov-fade-in">
          <div className="flex items-center gap-2">
            <Gem className="w-4 h-4 text-white/60" strokeWidth={1.5} />
            <span className="text-[11px] font-medium tracking-[0.12em] text-white/50 uppercase">{streak} DAYS STREAK</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-white/40 tracking-wider flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5 text-white/40" strokeWidth={1.5} />
              {moonPhase.split(' ').slice(1).join(' ')}
            </span>
            <button onClick={() => setShowSettings(!showSettings)} className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
              <Settings className="w-[15px] h-[15px] text-white/50" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {showSettings && (
          <div className="mx-5 mb-3 p-4 rounded-2xl diov-glass-card diov-slide-up">
            <p className="text-[10px] tracking-[0.2em] text-white/40 uppercase mb-2">Language</p>
            <div className="flex gap-2">
              {['EN','ES','AR','JP','KR'].map(l => (
                <button key={l} className="px-3 py-1.5 rounded-full text-[10px] font-medium tracking-wider transition-all diov-glass-pill text-white/50 hover:text-white/80">{l}</button>
              ))}
            </div>
          </div>
        )}

        {/* Clock */}
        <div className="px-5 pt-3 pb-5">
          <div className="text-center space-y-2 diov-fade-in">
            <p className="text-[10px] tracking-[0.25em] text-white/35 font-medium uppercase">{fmtDate(time)}</p>
            <h1 className="diov-time-display text-[4.5rem] font-extralight tracking-tight text-white/90 leading-none">
              {time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </h1>
            <p className="diov-serif text-[15px] text-amber-300/70 font-light italic mt-2 px-6 leading-relaxed">&ldquo;{quote}&rdquo;</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-8 mb-5">
          {(['sequence', 'stats'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`text-[11px] tracking-[0.15em] uppercase font-medium pb-1 transition-all ${tab === t ? 'text-white border-b border-white/50' : 'text-white/30'}`}>
              {t}
            </button>
          ))}
        </div>

        {tab === 'sequence' ? (
          <div className="flex-1 px-5 pb-8 space-y-4 diov-fade-in">
            {/* Sleep / Wake */}
            <div className="grid grid-cols-2 gap-3">
              <div className="diov-glass-card p-4 text-center space-y-2">
                <Moon className="w-5 h-5 text-white/40 mx-auto" strokeWidth={1.5} />
                <p className="text-[9px] tracking-[0.2em] text-white/30 uppercase font-medium">SLEEP</p>
                <p className="text-2xl font-light text-white/90">{formatTime12(settings.sleepTime)}</p>
                <p className="text-[10px] text-white/30 font-light">Time for deep rest.</p>
              </div>
              <div className="diov-glass-card p-4 text-center space-y-2">
                <Sun className="w-5 h-5 text-amber-400/60 mx-auto" strokeWidth={1.5} />
                <p className="text-[9px] tracking-[0.2em] text-white/30 uppercase font-medium">WAKE</p>
                <p className="text-2xl font-light text-white/90">{formatTime12(settings.wakeTime)}</p>
                <p className="text-[10px] text-white/30 font-light">Ignite your focus.</p>
              </div>
            </div>

            {/* Hidden time inputs for editing */}
            <div className="grid grid-cols-2 gap-3 opacity-0 h-0 overflow-hidden">
              <input type="time" value={settings.sleepTime} onChange={e => update('sleepTime', e.target.value)} className="diov-glass-card p-3 text-center text-white/80 text-sm outline-none bg-transparent" />
              <input type="time" value={settings.wakeTime} onChange={e => update('wakeTime', e.target.value)} className="diov-glass-card p-3 text-center text-white/80 text-sm outline-none bg-transparent" />
            </div>

            {/* Tonight's Intention */}
            <div className="space-y-2">
              <p className="text-[10px] tracking-[0.25em] text-white/30 uppercase font-medium text-center">TONIGHT&apos;S INTENTION</p>
              <div className="diov-glass-card p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/40"><circle cx="12" cy="12" r="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-20 12 12)"/></svg>
                </div>
                <p className={`text-sm truncate ${todayPromise ? 'diov-serif font-light italic text-white/60' : 'text-white/25 font-light'}`}>
                  {todayPromise ? `\u201C${todayPromise.text}\u201D` : 'Set your intention during the ritual...'}
                </p>
              </div>
            </div>

            {/* Optimal Bedtimes */}
            <div className="space-y-2">
              <p className="text-[10px] tracking-[0.25em] text-white/30 uppercase font-medium text-center">OPTIMAL BEDTIMES FOR {settings.wakeTime}</p>
              <div className="diov-glass-card p-4">
                <div className="flex gap-2 justify-center">
                  {cycles.map((c, idx) => (
                    <div key={c.cycles} className="flex-1 text-center p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        {[<Moon key="m" className="w-3.5 h-3.5 text-white/40" />, <BedDouble key="b" className="w-3.5 h-3.5 text-white/40" />, <Timer key="t" className="w-3.5 h-3.5 text-white/40" />][idx]}
                        <p className="text-sm font-light text-white/90 tabular-nums">
                          {(() => { const [h] = c.time12.split(':'); const min = c.time12.split(':')[1]?.split(' ')[0] || '00'; const isPm = c.time12.includes('p.m.'); const isAm = c.time12.includes('a.m.'); let nh = parseInt(h); if (isPm && nh !== 12) nh += 12; if (isAm && nh === 12) nh = 0; return `${String(nh).padStart(2,'0')}:${min}`; })()}
                        </p>
                      </div>
                      <p className="text-[9px] text-white/30">{c.cycles} cycles &bull; {c.rest}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Intensity */}
            <div className="space-y-2">
              <p className="text-[10px] tracking-[0.25em] text-white/30 uppercase font-medium text-center">WAKE INTENSITY</p>
              <div className="flex gap-0 justify-center">
                {(['gentle','standard','intense'] as const).map(i => (
                  <button key={i} onClick={() => update('wakeIntensity', i)}
                    className={`flex-1 py-2.5 text-[10px] font-medium tracking-[0.1em] uppercase transition-all ${settings.wakeIntensity === i ? 'diov-intensity-active' : 'diov-intensity-inactive'}`}>
                    {intensityLabels[i]}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-center text-white/25 font-light">{intensityDescriptions[settings.wakeIntensity]}</p>
            </div>

            {/* CTA */}
            <button onClick={onInitSleep} className="w-full py-4 rounded-full diov-main-cta text-[13px] font-semibold tracking-[0.15em] uppercase transition-all active:scale-[0.98] mt-2">
              INITIALIZE DEEP SEQUENCE
            </button>
          </div>
        ) : (
          /* Stats */
          <div className="flex-1 px-5 pb-8 space-y-4 diov-fade-in">
            <div className="diov-glass-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] tracking-[0.2em] text-white/30 uppercase font-medium">Last 7 Nights</p>
                <p className="text-[10px] text-white/40">Avg: <span className="text-white font-medium">{avgQ}</span> <span className="text-amber-400">&#9733;</span></p>
              </div>
              <div className="flex items-end justify-between gap-1 h-20 px-1">
                {Array.from({ length: 7 }, (_, i) => {
                  const log = last7[i];
                  const h = log ? `${log.quality * 20}%` : '4%';
                  const day = log ? new Date(log.date).toLocaleDateString('en-US', { weekday: 'narrow' }) : weekDays[(todayIdx - 6 + i + 7) % 7];
                  return (
                    <div key={i} className="flex flex-col items-center gap-1 flex-1">
                      <div className="w-full rounded-md relative overflow-hidden" style={{ height: '64px', background: 'rgba(255,255,255,0.02)' }}>
                        <div className="absolute bottom-0 w-full rounded-md transition-all duration-500" style={{ height: h, background: log ? 'rgba(139,92,246,0.45)' : 'rgba(255,255,255,0.04)' }} />
                      </div>
                      <span className="text-[8px] text-white/25">{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="diov-glass-card p-4 text-center"><p className="text-3xl font-extralight text-white/90">{streak}</p><p className="text-[9px] tracking-[0.12em] text-white/30 uppercase mt-1">Day Streak</p></div>
              <div className="diov-glass-card p-4 text-center"><p className="text-3xl font-extralight text-white/90">{last7.length}</p><p className="text-[9px] tracking-[0.12em] text-white/30 uppercase mt-1">Nights Logged</p></div>
            </div>
            {integrity !== null && (
              <div className="diov-glass-card p-4 text-center space-y-1">
                <p className="text-[10px] tracking-[0.2em] text-white/30 uppercase">Promise Integrity</p>
                <p className="text-4xl font-extralight text-white/90">{integrity}<span className="text-lg text-white/30">%</span></p>
                <p className="text-[10px] text-white/25 font-light">Your reputation with yourself.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
