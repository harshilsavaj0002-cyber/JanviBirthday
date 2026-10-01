"use client";

import { useEffect, useState } from "react";
import { content } from "@/data/content";
import { parseDMY } from "@/lib/date";
import { useNow } from "./useNow";

/**
 * Birthday state. Add `?preview=birthday` (or `?preview=countdown`) to the URL
 * to test either experience before the big day.
 */
export function useBirthday() {
  const now = useNow(1000);
  const [override, setOverride] = useState<"birthday" | "countdown" | null>(null);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("preview");
    if (p === "birthday" || p === "countdown") setOverride(p);
  }, []);

  const target = parseDMY(content.birthday);
  let remaining = now ? target.getTime() - now.getTime() : null;
  // Previewing the countdown after the day has passed: fake a 3-day countdown.
  if (override === "countdown" && remaining !== null && remaining <= 0) remaining = 3 * 86400000 - (now!.getTime() % 86400000);

  const isBirthday = override ? override === "birthday" : remaining !== null && remaining <= 0;

  return { now, target, remaining, isBirthday, ready: now !== null };
}
