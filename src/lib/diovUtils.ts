// DIOV — utility functions

export function getMoonPhase(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  let c = 0, e = 0, jd = 0, b = 0;
  let y = year, m = month;
  if (m < 3) { y--; m += 12; }
  c = 365.25 * y;
  e = 30.6 * m;
  jd = c + e + day - 694039.09;
  jd /= 29.5305882;
  b = parseInt(String(jd));
  jd -= b;
  b = Math.round(jd * 8);
  if (b >= 8) b = 0;
  const phases = [
    '\u{1F311} New Moon',
    '\u{1F312} Waxing Crescent',
    '\u{1F313} First Quarter',
    '\u{1F314} Waxing Gibbous',
    '\u{1F315} Full Moon',
    '\u{1F316} Waning Gibbous',
    '\u{1F317} Last Quarter',
    '\u{1F318} Waning Crescent'
  ];
  return phases[b];
}

export interface SleepCycle {
  cycles: number;
  hours: number;
  time12: string;
  color: string;
  rest: string;
}

export function calculateSleepCycles(wakeTimeStr: string): SleepCycle[] {
  const [h, m] = wakeTimeStr.split(':').map(Number);
  const cycleDefs = [
    { count: 4, color: '#ef4444' },
    { count: 5, color: '#f59e0b' },
    { count: 6, color: '#10b981' },
  ];
  return cycleDefs.map((c) => {
    const totalMin = c.count * 90;
    const wakeMin = h * 60 + m;
    let sleepMin = wakeMin - totalMin;
    if (sleepMin < 0) sleepMin += 24 * 60;
    const sh = Math.floor(sleepMin / 60) % 24;
    const sm = sleepMin % 60;
    const isAm = sh < 12;
    const displayH = sh === 0 ? 12 : sh > 12 ? sh - 12 : sh;
    const ampm = isAm ? 'a.m.' : 'p.m.';
    return {
      cycles: c.count,
      hours: totalMin / 60,
      time12: `${displayH}:${String(sm).padStart(2, '0')} ${ampm}`,
      color: c.color,
      rest: `${c.count * 1.5}h rest`,
    };
  });
}

export function formatTime12(timeStr: string): string {
  const [h, m] = timeStr.split(':').map(Number);
  const isAm = h < 12;
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${displayH}:${String(m).padStart(2, '0')} ${isAm ? 'a.m.' : 'p.m.'}`;
}

export function formatTime24(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function formatDate(date: Date): string {
  return date
    .toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    })
    .toUpperCase();
}

export function getWakeCountdown(wakeTimeStr: string): string {
  const now = new Date();
  const [h, m] = wakeTimeStr.split(':').map(Number);
  const target = new Date(now);
  target.setHours(h, m, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1);
  const diff = target.getTime() - now.getTime();
  const hrs = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  return `${hrs}h ${mins}m`;
}

// ─── BRAND-COMPLIANT CONTENT ─────────────────────

export const DASHBOARD_QUOTES = [
  "Discipline builds your edge.",
  "You architect your focus.",
  "Your consistency compounds.",
  "Recovery is your competitive advantage.",
  "You operate with precision and intent.",
  "Rest is not retreat. It is preparation.",
  "Your attention is your most valuable asset.",
  "Identity is built in the dark hours.",
];

export const SLEEP_PHRASES = [
  "Release the day.",
  "Your mind is clear.",
  "Rest in recovery.",
  "Your protocol is active.",
  "You are safe. Reset begins.",
];

export const WAKE_PHRASES = [
  "You are operational.",
  "Today, you execute.",
  "Your focus is your power.",
  "Claim the work that awaits.",
];

export const TRANSCRIPTS = [
  "As your eyes close, let this darkness become the architecture for tomorrow. Your first breath seeds the protocol. In... drawing in the structure of your next victory. Hold... feel that intention lock into your core. Out... clearing the path of all noise.",
  "You are not just releasing the day. You are running a neural reset on your entire system. Breathe in clarity. Hold discipline. Release distraction. You are the operator. The system responds to you.",
  "Trust the protocol. Reset. Align. Execute.",
];

export const QUALITY_CONTEXT: Record<number, string> = {
  1: "Tonight will be deeper.",
  2: "Recovery is a skill. Keep training it.",
  3: "Steady rest, operator.",
  4: "Strong recovery cycle detected.",
  5: "Optimal recovery achieved. You are primed.",
};

export const intensityLabels: Record<string, string> = {
  gentle: 'GENTLE',
  standard: 'STANDARD',
  intense: 'INTENSE',
};

export const intensityDescriptions: Record<string, string> = {
  gentle: 'Soft awakening for recovery mornings.',
  standard: 'Balanced power for operational clarity.',
  intense: 'Full ignition for maximum execution.',
};
