// DIOV — localStorage persistence layer
// All data stored locally for prototype phase

export interface SleepLog {
  date: string;
  quality: number;
  sleepTime: string;
  wakeTime: string;
  promiseKept: boolean | null;
  gratitude: string;
  timestamp: number;
}

export interface PromiseEntry {
  date: string;
  text: string;
  timestamp: number;
  kept: boolean | null;
}

export interface StreakData {
  count: number;
  lastDate: string | null;
}

const KEYS = {
  STREAK: 'diov_streak',
  SLEEP_LOGS: 'diov_sleep_logs',
  PROMISES: 'diov_promises',
  SETTINGS: 'diov_settings',
};

function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

function getYesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

// ─── STREAK ─────────────────────────────

export function getStreak(): StreakData {
  try {
    return JSON.parse(localStorage.getItem(KEYS.STREAK) || '{}');
  } catch {
    return { count: 0, lastDate: null };
  }
}

export function updateStreak(): number {
  const today = getTodayKey();
  const data = getStreak();
  if (data.lastDate === today) return data.count;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yKey = yesterday.toISOString().split('T')[0];

  if (data.lastDate === yKey) {
    data.count += 1;
  } else {
    data.count = 1;
  }
  data.lastDate = today;
  localStorage.setItem(KEYS.STREAK, JSON.stringify(data));
  return data.count;
}

// ─── SLEEP LOGS ─────────────────────────

export function getSleepLogs(): SleepLog[] {
  try {
    return JSON.parse(localStorage.getItem(KEYS.SLEEP_LOGS) || '[]');
  } catch {
    return [];
  }
}

export function addSleepLog(
  quality: number,
  sleepTime: string,
  wakeTime: string,
  promiseKept: boolean | null,
  gratitude: string = ''
): void {
  const logs = getSleepLogs();
  const today = getTodayKey();
  const existing = logs.findIndex((l) => l.date === today);
  const entry: SleepLog = {
    date: today,
    quality,
    sleepTime,
    wakeTime,
    promiseKept,
    gratitude,
    timestamp: Date.now(),
  };
  if (existing >= 0) logs[existing] = entry;
  else logs.push(entry);
  if (logs.length > 90) logs.shift();
  localStorage.setItem(KEYS.SLEEP_LOGS, JSON.stringify(logs));
}

// ─── PROMISES ───────────────────────────

export function getPromises(): PromiseEntry[] {
  try {
    return JSON.parse(localStorage.getItem(KEYS.PROMISES) || '[]');
  } catch {
    return [];
  }
}

export function savePromise(text: string): void {
  const promises = getPromises();
  const today = getTodayKey();
  const existing = promises.findIndex((p) => p.date === today);
  const entry: PromiseEntry = {
    date: today,
    text,
    timestamp: Date.now(),
    kept: null,
  };
  if (existing >= 0) promises[existing] = entry;
  else promises.push(entry);
  if (promises.length > 90) promises.shift();
  localStorage.setItem(KEYS.PROMISES, JSON.stringify(promises));
}

export function markPromiseKept(kept: boolean): void {
  const promises = getPromises();
  const today = getTodayKey();
  const idx = promises.findIndex((p) => p.date === today);
  if (idx >= 0) promises[idx].kept = kept;
  localStorage.setItem(KEYS.PROMISES, JSON.stringify(promises));
}

export function getYesterdayPromise(): PromiseEntry | undefined {
  const yKey = getYesterdayKey();
  const promises = getPromises();
  return promises.find((p) => p.date === yKey);
}

export function getTodayPromise(): PromiseEntry | undefined {
  const today = getTodayKey();
  const promises = getPromises();
  return promises.find((p) => p.date === today);
}

// ─── INTEGRITY SCORE ────────────────────

export function getIntegrityScore(): number | null {
  const promises = getPromises().filter((p) => p.kept !== null);
  if (!promises.length) return null;
  const kept = promises.filter((p) => p.kept === true).length;
  return Math.round((kept / promises.length) * 100);
}

// ─── SETTINGS ───────────────────────────

export interface DiovSettings {
  wakeIntensity: 'gentle' | 'standard' | 'intense';
  sleepTime: string;
  wakeTime: string;
}

export function getSettings(): DiovSettings {
  try {
    return JSON.parse(
      localStorage.getItem(KEYS.SETTINGS) ||
        '{"wakeIntensity":"standard","sleepTime":"23:00","wakeTime":"07:00"}'
    );
  } catch {
    return { wakeIntensity: 'standard', sleepTime: '23:00', wakeTime: '07:00' };
  }
}

export function saveSettings(settings: DiovSettings): void {
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
}
