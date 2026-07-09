// DIOV API Layer — tRPC frontend client
// Replaces localStorage with PostgreSQL-backed API calls
// Falls back to localStorage when API is unavailable (offline mode)

import { trpc } from "@/providers/trpc";

// Get or create a device user ID
function getDeviceUserId(): number {
  const stored = localStorage.getItem("diov_device_user_id");
  if (stored) return parseInt(stored, 10);
  // For now, use a default anonymous user ID
  // When auth is added, this will be replaced with the actual user ID
  return 1;
}

// ─── Settings ─────────────────────────────────────

export interface DiovSettings {
  wakeIntensity: "gentle" | "standard" | "intense";
  sleepTime: string;
  wakeTime: string;
}

export function useSettings() {
  const utils = trpc.useUtils();
  const userId = getDeviceUserId();

  const { data: dbSettings, isLoading } = trpc.settings.get.useQuery({ userId });

  const saveMutation = trpc.settings.save.useMutation({
    onSuccess: () => utils.settings.get.invalidate(),
  });

  // Fallback to localStorage if API not ready
  const localSettings: DiovSettings = (() => {
    try {
      return JSON.parse(
        localStorage.getItem("diov_settings") ||
          '{"wakeIntensity":"standard","sleepTime":"23:00","wakeTime":"07:00"}'
      );
    } catch {
      return { wakeIntensity: "standard" as const, sleepTime: "23:00", wakeTime: "07:00" };
    }
  })();

  const settings: DiovSettings = dbSettings
    ? {
        wakeIntensity: (dbSettings.wakeIntensity as "gentle" | "standard" | "intense") || "standard",
        sleepTime: dbSettings.sleepTime || "23:00",
        wakeTime: dbSettings.wakeTime || "07:00",
      }
    : localSettings;

  const saveSettings = (s: DiovSettings) => {
    localStorage.setItem("diov_settings", JSON.stringify(s));
    saveMutation.mutate({
      userId,
      sleepTime: s.sleepTime,
      wakeTime: s.wakeTime,
      wakeIntensity: s.wakeIntensity,
    });
  };

  return { settings, saveSettings, isLoading };
}

// ─── Sleep Logs ───────────────────────────────────

export interface SleepLog {
  date: string;
  quality: number;
  sleepTime: string;
  wakeTime: string;
  promiseKept: boolean | null;
  gratitude: string;
  timestamp: number;
}

export function useSleepLogs() {
  const utils = trpc.useUtils();
  const userId = getDeviceUserId();

  const { data: dbLogs } = trpc.sleep.last7.useQuery({ userId });

  const createMutation = trpc.sleep.create.useMutation({
    onSuccess: () => {
      utils.sleep.last7.invalidate();
      utils.sleep.list.invalidate();
    },
  });

  const localLogs: SleepLog[] = (() => {
    try {
      return JSON.parse(localStorage.getItem("diov_sleep_logs") || "[]");
    } catch {
      return [];
    }
  })();

  const logs: SleepLog[] = (dbLogs || localLogs).map((log: any) => ({
    date: log.date,
    quality: log.quality,
    sleepTime: log.sleepTime,
    wakeTime: log.wakeTime,
    promiseKept: log.promiseKept ?? null,
    gratitude: log.gratitude || "",
    timestamp: new Date(log.createdAt).getTime(),
  }));

  const addSleepLog = (
    quality: number,
    sleepTime: string,
    wakeTime: string,
    promiseKept: boolean | null,
    gratitude: string = ""
  ) => {
    const today = new Date().toISOString().split("T")[0];
    const entry: SleepLog = {
      date: today,
      quality,
      sleepTime,
      wakeTime,
      promiseKept,
      gratitude,
      timestamp: Date.now(),
    };

    // Save to localStorage (cache/fallback)
    const logs = JSON.parse(localStorage.getItem("diov_sleep_logs") || "[]");
    const idx = logs.findIndex((l: SleepLog) => l.date === today);
    if (idx >= 0) logs[idx] = entry;
    else logs.push(entry);
    if (logs.length > 90) logs.shift();
    localStorage.setItem("diov_sleep_logs", JSON.stringify(logs));

    // Save to API
    createMutation.mutate({
      userId,
      date: today,
      quality,
      sleepTime,
      wakeTime,
      promiseKept,
      gratitude: gratitude || undefined,
    });
  };

  return { logs, addSleepLog };
}

// ─── Promises ─────────────────────────────────────

export interface PromiseEntry {
  date: string;
  text: string;
  timestamp: number;
  kept: boolean | null;
}

export function usePromises() {
  const utils = trpc.useUtils();
  const userId = getDeviceUserId();

  const { data: dbPromises } = trpc.promise.list.useQuery({ userId });

  const saveMutation = trpc.promise.save.useMutation({
    onSuccess: () => utils.promise.list.invalidate(),
  });

  const markKeptMutation = trpc.promise.markKept.useMutation({
    onSuccess: () => utils.promise.list.invalidate(),
  });

  const localPromises: PromiseEntry[] = (() => {
    try {
      return JSON.parse(localStorage.getItem("diov_promises") || "[]");
    } catch {
      return [];
    }
  })();

  const promises: PromiseEntry[] = (dbPromises || localPromises).map((p: any) => ({
    date: p.date,
    text: p.text,
    timestamp: new Date(p.createdAt).getTime(),
    kept: p.kept ?? null,
  }));

  const savePromise = (text: string) => {
    const today = new Date().toISOString().split("T")[0];
    const entry: PromiseEntry = { date: today, text, timestamp: Date.now(), kept: null };

    const ps = JSON.parse(localStorage.getItem("diov_promises") || "[]");
    const idx = ps.findIndex((p: PromiseEntry) => p.date === today);
    if (idx >= 0) ps[idx] = entry;
    else ps.push(entry);
    if (ps.length > 90) ps.shift();
    localStorage.setItem("diov_promises", JSON.stringify(ps));

    saveMutation.mutate({ userId, date: today, text });
  };

  const markPromiseKept = (kept: boolean) => {
    const today = new Date().toISOString().split("T")[0];
    const ps = JSON.parse(localStorage.getItem("diov_promises") || "[]");
    const idx = ps.findIndex((p: PromiseEntry) => p.date === today);
    if (idx >= 0) ps[idx].kept = kept;
    localStorage.setItem("diov_promises", JSON.stringify(ps));

    markKeptMutation.mutate({ userId, date: today, kept });
  };

  const getYesterdayPromise = (): PromiseEntry | undefined => {
    const yKey = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    return promises.find((p) => p.date === yKey);
  };

  const getTodayPromise = (): PromiseEntry | undefined => {
    const today = new Date().toISOString().split("T")[0];
    return promises.find((p) => p.date === today);
  };

  return { promises, savePromise, markPromiseKept, getYesterdayPromise, getTodayPromise };
}

// ─── Integrity Score ──────────────────────────────

export function useIntegrityScore(): number | null {
  const userId = getDeviceUserId();
  const { data: score } = trpc.promise.integrityScore.useQuery({ userId });

  if (score !== undefined) return score;

  // Fallback: calculate from localStorage
  const ps = JSON.parse(localStorage.getItem("diov_promises") || "[]").filter(
    (p: PromiseEntry) => p.kept !== null
  );
  if (!ps.length) return null;
  const kept = ps.filter((p: PromiseEntry) => p.kept === true).length;
  return Math.round((kept / ps.length) * 100);
}

// ─── Streak ───────────────────────────────────────

export interface StreakData {
  count: number;
  lastDate: string | null;
}

export function useStreak(): number {
  const data: StreakData = (() => {
    try {
      return JSON.parse(localStorage.getItem("diov_streak") || "{}");
    } catch {
      return { count: 0, lastDate: null };
    }
  })();

  return data.count || 0;
}

export function updateStreak(): number {
  const today = new Date().toISOString().split("T")[0];
  const data: StreakData = JSON.parse(localStorage.getItem("diov_streak") || "{}");
  if (data.lastDate === today) return data.count;

  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  if (data.lastDate === yesterday) {
    data.count += 1;
  } else {
    data.count = 1;
  }
  data.lastDate = today;
  localStorage.setItem("diov_streak", JSON.stringify(data));
  return data.count;
}
