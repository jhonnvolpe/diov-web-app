// DIOV — localStorage + API persistence layer
// Reads from localStorage (fast, offline)
// Writes to both localStorage AND PostgreSQL API

// Device user ID (until auth is implemented)
function getUserId(): number | undefined {
  const stored = localStorage.getItem("diov_device_user_id");
  return stored ? parseInt(stored, 10) : undefined;
}

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

export interface DiovSettings {
  wakeIntensity: "gentle" | "standard" | "intense";
  sleepTime: string;
  wakeTime: string;
}

const KEYS = {
  STREAK: "diov_streak",
  SLEEP_LOGS: "diov_sleep_logs",
  PROMISES: "diov_promises",
  SETTINGS: "diov_settings",
  USER_ID: "diov_device_user_id",
};

// ─── User ID ──────────────────────────────────────

export function getOrCreateUserId(): number {
  const stored = localStorage.getItem(KEYS.USER_ID);
  if (stored) return parseInt(stored, 10);
  // Generate anonymous user ID (1-1000000)
  const id = Math.floor(Math.random() * 999999) + 1;
  localStorage.setItem(KEYS.USER_ID, String(id));
  return id;
}

// ─── STREAK ───────────────────────────────────────

export function getStreak(): StreakData {
  try {
    return JSON.parse(localStorage.getItem(KEYS.STREAK) || "{}");
  } catch {
    return { count: 0, lastDate: null };
  }
}

export function updateStreak(): number {
  const today = new Date().toISOString().split("T")[0];
  const data = getStreak();
  if (data.lastDate === today) return data.count;

  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  if (data.lastDate === yesterday) {
    data.count += 1;
  } else {
    data.count = 1;
  }
  data.lastDate = today;
  localStorage.setItem(KEYS.STREAK, JSON.stringify(data));
  return data.count;
}

// ─── SLEEP LOGS ───────────────────────────────────

export function getSleepLogs(): SleepLog[] {
  try {
    return JSON.parse(localStorage.getItem(KEYS.SLEEP_LOGS) || "[]");
  } catch {
    return [];
  }
}

export function addSleepLog(
  quality: number,
  sleepTime: string,
  wakeTime: string,
  promiseKept: boolean | null,
  gratitude: string = ""
): void {
  const logs = getSleepLogs();
  const today = new Date().toISOString().split("T")[0];
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

  // Also sync to API (fire-and-forget)
  try {
    const userId = getUserId();
    fetch("/api/trpc/sleep.create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        json: { userId, date: today, quality, sleepTime, wakeTime, promiseKept, gratitude },
      }),
    }).catch(() => {});
  } catch {
    // Offline — data is safe in localStorage
  }
}

// ─── PROMISES ─────────────────────────────────────

export function getPromises(): PromiseEntry[] {
  try {
    return JSON.parse(localStorage.getItem(KEYS.PROMISES) || "[]");
  } catch {
    return [];
  }
}

export function savePromise(text: string): void {
  const promises = getPromises();
  const today = new Date().toISOString().split("T")[0];
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

  // Sync to API
  try {
    const userId = getUserId();
    fetch("/api/trpc/promise.save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ json: { userId, date: today, text } }),
    }).catch(() => {});
  } catch {
    // Offline
  }
}

export function markPromiseKept(kept: boolean): void {
  const promises = getPromises();
  const today = new Date().toISOString().split("T")[0];
  const idx = promises.findIndex((p) => p.date === today);
  if (idx >= 0) promises[idx].kept = kept;
  localStorage.setItem(KEYS.PROMISES, JSON.stringify(promises));

  // Sync to API
  try {
    const userId = getUserId();
    fetch("/api/trpc/promise.markKept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ json: { userId, date: today, kept } }),
    }).catch(() => {});
  } catch {
    // Offline
  }
}

export function getYesterdayPromise(): PromiseEntry | undefined {
  const yKey = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  return getPromises().find((p) => p.date === yKey);
}

export function getTodayPromise(): PromiseEntry | undefined {
  const today = new Date().toISOString().split("T")[0];
  return getPromises().find((p) => p.date === today);
}

// ─── INTEGRITY SCORE ──────────────────────────────

export function getIntegrityScore(): number | null {
  const promises = getPromises().filter((p) => p.kept !== null);
  if (!promises.length) return null;
  const kept = promises.filter((p) => p.kept === true).length;
  return Math.round((kept / promises.length) * 100);
}

// ─── SETTINGS ─────────────────────────────────────

export function getSettings(): DiovSettings {
  try {
    return JSON.parse(
      localStorage.getItem(KEYS.SETTINGS) ||
        '{"wakeIntensity":"standard","sleepTime":"23:00","wakeTime":"07:00"}'
    );
  } catch {
    return { wakeIntensity: "standard", sleepTime: "23:00", wakeTime: "07:00" };
  }
}

export function saveSettings(settings: DiovSettings): void {
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));

  // Sync to API
  try {
    const userId = getUserId();
    fetch("/api/trpc/settings.save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        json: {
          userId,
          sleepTime: settings.sleepTime,
          wakeTime: settings.wakeTime,
          wakeIntensity: settings.wakeIntensity,
        },
      }),
    }).catch(() => {});
  } catch {
    // Offline
  }
}

// ─── API SYNC (call on app load to sync data) ─────

export async function syncFromApi(): Promise<void> {
  const userId = getUserId();
  if (!userId) return;

  try {
    // Fetch sleep logs from API
    const sleepRes = await fetch(`/api/trpc/sleep.list?input=${encodeURIComponent(JSON.stringify({ userId }))}`);
    if (sleepRes.ok) {
      const sleepData = await sleepRes.json();
      if (sleepData.result?.data?.json?.length > 0) {
        const apiLogs = sleepData.result.data.json;
        const localLogs = getSleepLogs();
        const merged = [...localLogs];
        for (const apiLog of apiLogs) {
          const exists = merged.findIndex((l) => l.date === apiLog.date);
          if (exists < 0) {
            merged.push({
              date: apiLog.date,
              quality: apiLog.quality,
              sleepTime: apiLog.sleepTime,
              wakeTime: apiLog.wakeTime,
              promiseKept: apiLog.promiseKept,
              gratitude: apiLog.gratitude || "",
              timestamp: new Date(apiLog.createdAt).getTime(),
            });
          }
        }
        merged.sort((a, b) => a.date.localeCompare(b.date));
        if (merged.length > 90) merged.splice(0, merged.length - 90);
        localStorage.setItem(KEYS.SLEEP_LOGS, JSON.stringify(merged));
      }
    }

    // Fetch promises from API
    const promRes = await fetch(`/api/trpc/promise.list?input=${encodeURIComponent(JSON.stringify({ userId }))}`);
    if (promRes.ok) {
      const promData = await promRes.json();
      if (promData.result?.data?.json?.length > 0) {
        const apiProms = promData.result.data.json;
        const localProms = getPromises();
        const merged = [...localProms];
        for (const apiProm of apiProms) {
          const exists = merged.findIndex((p) => p.date === apiProm.date);
          if (exists < 0) {
            merged.push({
              date: apiProm.date,
              text: apiProm.text,
              timestamp: new Date(apiProm.createdAt).getTime(),
              kept: apiProm.kept ?? null,
            });
          }
        }
        merged.sort((a, b) => a.date.localeCompare(b.date));
        if (merged.length > 90) merged.splice(0, merged.length - 90);
        localStorage.setItem(KEYS.PROMISES, JSON.stringify(merged));
      }
    }
  } catch {
    // API unavailable — localStorage data is current
  }
}
