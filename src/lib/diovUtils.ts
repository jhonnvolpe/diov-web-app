// DIOV - utility functions + all randomized content

// ─── SHUFFLE ARRAY (Fisher-Yates) ──────────────────
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── GET RANDOM ITEM (never same twice) ────────────
export function getRandomItem<T>(arr: T[], last?: T): T {
  if (arr.length <= 1) return arr[0];
  let item = arr[Math.floor(Math.random() * arr.length)];
  while (item === last) {
    item = arr[Math.floor(Math.random() * arr.length)];
  }
  return item;
}

// ─── MOON PHASE ────────────────────────────────────
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
    '\u{1F311} New Moon', '\u{1F312} Waxing Crescent', '\u{1F313} First Quarter',
    '\u{1F314} Waxing Gibbous', '\u{1F315} Full Moon', '\u{1F316} Waning Gibbous',
    '\u{1F317} Last Quarter', '\u{1F318} Waning Crescent'
  ];
  return phases[b];
}

// ─── SLEEP CYCLES ──────────────────────────────────
export interface SleepCycle { cycles: number; hours: number; time12: string; color: string; rest: string; }

export function calculateSleepCycles(wakeTimeStr: string): SleepCycle[] {
  const [h, m] = wakeTimeStr.split(':').map(Number);
  const cycleDefs = [{ count: 4, color: '#ef4444' }, { count: 5, color: '#f59e0b' }, { count: 6, color: '#10b981' }];
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
    return { cycles: c.count, hours: totalMin / 60, time12: `${displayH}:${String(sm).padStart(2, '0')} ${ampm}`, color: c.color, rest: `${c.count * 1.5}h rest` };
  });
}

export function formatTime12(timeStr: string): string {
  const [h, m] = timeStr.split(':').map(Number);
  const isAm = h < 12;
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${displayH}:${String(m).padStart(2, '0')} ${isAm ? 'a.m.' : 'p.m.'}`;
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

// ─── ALL RANDOMIZED CONTENT ────────────────────────

// Dashboard quotes - brand compliant, performance-focused
export const DASHBOARD_QUOTES = shuffle([
  "Discipline builds your edge.",
  "You architect your focus.",
  "Your consistency compounds.",
  "Recovery is your competitive advantage.",
  "You operate with precision and intent.",
  "Rest is not retreat. It is preparation.",
  "Your attention is your most valuable asset.",
  "Identity is built in the dark hours.",
  "Execute today. Recover tonight.",
  "Clarity comes from structured rest.",
  "Your mind is a system. Maintain it.",
  "Precision in rest. Power in execution.",
  "The protocol activates when you do.",
  "Sleep is training for tomorrow.",
  "You do not rise by accident. You rise by design.",
  "Focus is a skill. You are sharpening it.",
  "Every cycle counts. Every night matters.",
  "Your output depends on your recovery.",
  "The best operators optimize rest.",
  "Tonight you reset. Tomorrow you own.",
]);

// Sleep floating phrases - randomized, never same
export const SLEEP_PHRASES = shuffle([
  "Release the day.",
  "Your mind is clearing.",
  "Rest in recovery.",
  "Your protocol is active.",
  "You are safe. Reset begins.",
  "Let the noise fade.",
  "Each breath resets the system.",
  "Tomorrow is loading.",
  "Your focus regenerates now.",
  "Deep rest. Sharp mind.",
  "The operator powers down.",
  "Recovery protocol engaged.",
  "Stillness is preparation.",
  "Breathe the day away.",
]);

// Wake phrases - morning ignition
export const WAKE_PHRASES = shuffle([
  "You are operational.",
  "Today, you execute.",
  "Your focus is your power.",
  "Claim the work that awaits.",
  "The system is online.",
  "Your protocol demands action.",
  "Rise with precision.",
  "The day responds to you.",
  "Execute with intent.",
  "Your edge is sharp. Use it.",
]);

// Sleep transcripts - Voice of Command style, brand compliant
export const SLEEP_TRANSCRIPTS = shuffle([
  "[ Voice of Command ] As you release this final breath, imagine all resistance dissolving like vapor in the dark. You are in complete flow. Focus. Clarity is not a gift; it is an alignment you command. Trust the OS.",
  "[ Voice of Command ] The day is shutting down. Every task, every decision, every interaction — logged and filed. Your mind is now off-duty. Rest is not passive. It is the most productive thing you will do tonight.",
  "[ Voice of Command ] Feel the weight leave your shoulders. Not because the problems disappeared, but because you chose to set them down. That is power. That is control. Now sleep.",
  "[ Voice of Command ] Your neural pathways are being optimized. In this stillness, your brain consolidates memory, clears waste, and rebuilds focus. You are not doing nothing. You are doing the most important work.",
  "[ Voice of Command ] The operator acknowledges the day. All systems now entering recovery mode. Deep rest initiates. Morning clarity is loading. Trust the protocol.",
  "[ Voice of Command ] Let go. Not of responsibility — of the tension you carried while executing it. You handled today. Tomorrow will be handled the same way. For now, rest.",
]);

// Wake transcripts - Voice of Command style, box breathing guidance
export const WAKE_TRANSCRIPTS = shuffle([
  "[ Voice of Command ] The alarm has served its purpose. Transitioning to optimized readiness. Guided Breath Ritual: Box Breathing, Cycle 1 of 4. IN for four seconds. HOLD for four. OUT for four. HOLD for four. Focus now. Energy flows where attention goes.",
  "[ Voice of Command ] Welcome back, operator. Your system has completed recovery. Oxygen floods the brain. Box Breathing activates your prefrontal cortex. You are not waking up. You are powering up.",
  "[ Voice of Command ] Sit up. Plant your feet. Feel the ground. This ritual primes your nervous system for execution. Breathe in power. Hold strength. Release hesitation. Hold focus. Again.",
  "[ Voice of Command ] The day does not start when you check your phone. It starts now, in this breath. Box Breathing, Cycle 1. IN... HOLD... OUT... HOLD. Your heart rate synchronizes. Your mind clears. Execute the ritual.",
]);

// Countdown phrases
export const COUNTDOWN_PHRASES = [
  "Breathe in... hold... prepare.",
  "Systems aligning...",
  "Protocol activating...",
];

// Quality rating context
export const QUALITY_CONTEXT: Record<number, string> = {
  1: "Tonight will be deeper.",
  2: "Recovery is a skill. Keep training it.",
  3: "Steady rest, operator.",
  4: "Strong recovery cycle detected.",
  5: "Optimal recovery achieved. You are primed.",
};

// Intensity labels & descriptions
export const intensityLabels: Record<string, string> = { gentle: 'GENTLE', standard: 'STANDARD', intense: 'INTENSE' };
export const intensityDescriptions: Record<string, string> = {
  gentle: 'Soft awakening for recovery mornings.',
  standard: 'Balanced power for operational clarity.',
  intense: 'Full ignition for maximum execution.',
};

// Sleep complete messages
export const SLEEP_COMPLETE_MESSAGES = shuffle([
  "Session complete. Data logged. Your performance shield is updated. Device transitioning to void black for optimal battery preservation and deep rest.",
  "Sequence complete. Sleep metrics recorded. Recovery protocol successful. System entering standby mode until ignition.",
  "Deep sequence: COMPLETE. Your rest has been archived. The operator is now in full recovery. See you at ignition.",
]);

// Alarm active messages
export const ALARM_MESSAGES = shuffle([
  "ALARM PROTOCOL: ENGAGED. ALARM ACTIVE. Prepare to initiate ritual.",
  "MORNING IGNITION TRIGGERED. Your system demands activation.",
  "WAKE PROTOCOL: ACTIVE. The day is waiting for your command.",
]);

// Alarm silenced messages
export const ALARM_SILENCED_MESSAGES = shuffle([
  { main: "Alarm Silenced. Sit up. Plant your feet.", sub: "Tap to begin." },
  { main: "Sound stopped. Body moves now.", sub: "Begin the ritual." },
  { main: "Alarm dismissed. Vertical position required.", sub: "Start wake sequence." },
]);

// Burden prompts — system metaphor + emotional depth
export const BURDEN_PROMPTS = shuffle([
  "What's still running in your system?",
  "What are you carrying into tonight?",
  "What won't let you rest?",
  "Name the weight. Then set it down.",
  "What is heaviest right now?",
  "What needs to end before sleep begins?",
]);

// Burn phrases
export const BURN_PHRASES = shuffle([
  "You carried this today. Tonight, it does not follow you.",
  "Acknowledged. Released. Archived.",
  "This ends here. Your system is now clear.",
  "Dissolved. The weight leaves with your breath.",
]);
