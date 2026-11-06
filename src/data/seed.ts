/**
 * Mock data is generated from a fixed seed and a fixed "today", so the server,
 * the client and every reload all see identical records.
 */
export const MOCK_TODAY = "2026-11-05";

export function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const pick = <T,>(random: () => number, items: readonly T[]) =>
  items[Math.floor(random() * items.length)];

/** ISO timestamp `days` before the mock today, with `hour` and `minute` in Indian Standard Time. */
export function daysAgo(days: number, hour = 12, minute = 0) {
  const date = new Date(`${MOCK_TODAY}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() - days);
  date.setUTCHours(hour - 5, minute - 30);
  return date.toISOString();
}

export const dayKey = (days: number) => daysAgo(days).slice(0, 10);
