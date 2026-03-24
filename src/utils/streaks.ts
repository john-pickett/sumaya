import type { MeditationLog } from '../types/breathing';

export type StreakResult = {
  currentStreak: number;
  longestStreak: number;
  longestStart: string; // YYYY-MM-DD, or '' if no sessions
  longestEnd: string;   // YYYY-MM-DD, or '' if no sessions
};

export function toLocalDateKey(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function isConsecutiveDay(a: string, b: string): boolean {
  const [ay, am, ad] = a.split('-').map(Number);
  const [by, bm, bd] = b.split('-').map(Number);
  const diff = new Date(by, bm - 1, bd).getTime() - new Date(ay, am - 1, ad).getTime();
  // Allow 23–25 hours to handle DST transitions
  return diff >= 82_800_000 && diff <= 90_000_000;
}

export function calculateStreaks(sessions: MeditationLog[]): StreakResult {
  if (sessions.length === 0) {
    return { currentStreak: 0, longestStreak: 0, longestStart: '', longestEnd: '' };
  }

  // Deduplicate and sort dates ascending
  const dates = Array.from(new Set(sessions.map((s) => toLocalDateKey(s.completedAt)))).sort();

  // Build consecutive runs
  type Run = { start: string; end: string; length: number };
  const runs: Run[] = [];
  let runStart = dates[0];
  let runLen = 1;

  for (let i = 1; i < dates.length; i++) {
    if (isConsecutiveDay(dates[i - 1], dates[i])) {
      runLen++;
    } else {
      runs.push({ start: runStart, end: dates[i - 1], length: runLen });
      runStart = dates[i];
      runLen = 1;
    }
  }
  runs.push({ start: runStart, end: dates[dates.length - 1], length: runLen });

  // Longest streak
  const longest = runs.reduce((best, r) => (r.length > best.length ? r : best), runs[0]);

  // Current streak — active if most recent run ends today or yesterday
  const todayKey = toLocalDateKey(new Date().toISOString());
  const [ty, tm, td] = todayKey.split('-').map(Number);
  const yesterdayKey = toLocalDateKey(new Date(ty, tm - 1, td - 1).toISOString());

  const lastRun = runs[runs.length - 1];
  const currentStreak =
    lastRun.end === todayKey || lastRun.end === yesterdayKey ? lastRun.length : 0;

  return {
    currentStreak,
    longestStreak: longest.length,
    longestStart: longest.start,
    longestEnd: longest.end,
  };
}
