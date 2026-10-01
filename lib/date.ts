/** Parses "DD-MM-YYYY" (also accepts "/" or ".") into a local-midnight Date. */
export function parseDMY(value: string): Date {
  const [d, m, y] = value.split(/[-/.]/).map(Number);
  return new Date(y, (m || 1) - 1, d || 1, 0, 0, 0, 0);
}

export function formatLong(date: Date): string {
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export type TimeParts = { days: number; hours: number; minutes: number; seconds: number };

export function splitMs(ms: number): TimeParts {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}
