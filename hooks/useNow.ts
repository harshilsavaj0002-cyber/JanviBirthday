"use client";

import { useEffect, useState } from "react";

/** Current time, re-rendered every `interval` ms. `null` until mounted (avoids hydration mismatch). */
export function useNow(interval = 1000): Date | null {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), interval);
    return () => window.clearInterval(id);
  }, [interval]);
  return now;
}
