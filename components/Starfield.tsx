"use client";

import { useMemo } from "react";

/** Tiny twinkling stars for dark screens (pure CSS, deterministic positions). */
export function Starfield({ count = 60 }: { count?: number }) {
  const stars = useMemo(() => {
    let seed = 7;
    const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    return Array.from({ length: count }, () => ({
      left: rand() * 100,
      top: rand() * 100,
      size: rand() * 2 + 0.6,
      delay: rand() * 4,
      duration: 2.5 + rand() * 3,
    }));
  }, [count]);

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-champagne"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            opacity: 0.6,
            animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
            boxShadow: "0 0 6px rgba(247,231,206,0.8)",
          }}
        />
      ))}
    </div>
  );
}
