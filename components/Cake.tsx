"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { content } from "@/data/content";
import { celebrate, fireworks } from "@/lib/confetti";
import { SectionHeading } from "./Reveal";

/** Frosting path: full top ellipse + drips hanging off the front edge. */
function frosting(cx: number, cy: number, rx: number, ry: number, drips: number[]) {
  const pts: string[] = [`M${cx - rx},${cy}`];
  const steps = 40;
  for (let s = 1; s <= steps; s++) {
    const t = Math.PI - (s / steps) * Math.PI; // left → right along the front
    const x = cx + rx * Math.cos(t);
    const y = cy + ry * Math.sin(t) + 3;
    const len = drips[s % drips.length];
    if (s % 4 === 2 && s < steps - 1) {
      pts.push(`L${x - 5},${y}`, `L${x - 5},${y + len}`, `Q${x},${y + len + 8} ${x + 5},${y + len}`, `L${x + 5},${y}`);
    } else pts.push(`L${x},${y}`);
  }
  pts.push(`A${rx},${ry} 0 0 0 ${cx - rx},${cy}`, "Z");
  return pts.join(" ");
}

export function Cake() {
  const [lit, setLit] = useState(true);
  const count = content.cake.candles;

  const blow = useCallback(() => {
    if (!lit) return;
    setLit(false);
    window.setTimeout(() => {
      fireworks(4500);
      celebrate(2500);
    }, 700);
  }, [lit]);

  // Scrolling the cake into view starts a 3-2-1 wish countdown, then the candles blow out by themselves.
  const cakeRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cakeRef, { amount: 0.6 });
  const [count3, setCount3] = useState<number | null>(null);

  useEffect(() => {
    if (!lit || !inView) {
      setCount3(null); // scrolled away mid-countdown → start over next time
      return;
    }
    setCount3(content.cake.countdownFrom);
  }, [lit, inView]);

  useEffect(() => {
    if (count3 === null) return;
    const id = window.setTimeout(() => {
      if (count3 <= 1) {
        setCount3(null);
        blow();
      } else setCount3(count3 - 1);
    }, 1100);
    return () => window.clearTimeout(id);
  }, [count3, blow]);

  const candles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const t = count === 1 ? 0.5 : i / (count - 1);
        const x = 105 + t * 90;
        const y = 118 + Math.sin(t * Math.PI) * 6; // follow the ellipse front
        return { x, y, h: 34 + ((i * 7) % 3) * 4, color: i % 2 ? "#F7E7CE" : "#F8D7DA" };
      }),
    [count],
  );

  const relight = () => setLit(true);

  return (
    <section id="cake" className="relative overflow-hidden bg-gradient-to-b from-cream via-blush/40 to-blush/80 pb-10">
      <div className="section pb-10 text-center">
        <SectionHeading eyebrow="Make it count" title="Make a" script="Wish" />

        <div ref={cakeRef} className="relative mx-auto w-full max-w-sm">
          {/* candle glow */}
          <motion.div
            className="pointer-events-none absolute inset-x-0 top-[18%] mx-auto h-48 w-64 rounded-full bg-amber-200/50 blur-3xl"
            animate={{ opacity: lit ? [0.55, 0.8, 0.55] : 0 }}
            transition={{ duration: 2, repeat: lit ? Infinity : 0 }}
          />
          <svg viewBox="0 0 300 300" className="relative w-full" role="img" aria-label={lit ? "Birthday cake with lit candles" : "Birthday cake, candles blown out"}>
            <defs>
              <linearGradient id="tierA" x1="0" x2="1">
                <stop offset="0" stopColor="#c98590" />
                <stop offset="0.35" stopColor="#F8D7DA" />
                <stop offset="0.7" stopColor="#e7b2b9" />
                <stop offset="1" stopColor="#b76e79" />
              </linearGradient>
              <linearGradient id="tierB" x1="0" x2="1">
                <stop offset="0" stopColor="#8E4A56" />
                <stop offset="0.4" stopColor="#c7818c" />
                <stop offset="1" stopColor="#6d2a3a" />
              </linearGradient>
              <linearGradient id="cream" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#FFFDF8" />
                <stop offset="1" stopColor="#F7E7CE" />
              </linearGradient>
              <radialGradient id="flame" cx="50%" cy="70%" r="60%">
                <stop offset="0" stopColor="#fffbe6" />
                <stop offset="0.45" stopColor="#ffd36b" />
                <stop offset="1" stopColor="#ff8a3d" />
              </radialGradient>
              <radialGradient id="halo">
                <stop offset="0" stopColor="#ffd98a" stopOpacity="0.7" />
                <stop offset="1" stopColor="#ffd98a" stopOpacity="0" />
              </radialGradient>
              <pattern id="stripes" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
                <rect width="8" height="8" fill="currentColor" />
                <rect width="3" height="8" fill="#B76E79" opacity="0.8" />
              </pattern>
            </defs>

            {/* plate */}
            <ellipse cx="150" cy="266" rx="138" ry="18" fill="#e9d3b4" />
            <ellipse cx="150" cy="262" rx="132" ry="15" fill="#FFF8F0" />

            {/* bottom tier */}
            <path d="M40 190 v64 a110 16 0 0 0 220 0 v-64 z" fill="url(#tierB)" />
            <path d={frosting(150, 190, 110, 16, [14, 22, 10, 26, 16, 12])} fill="url(#cream)" />
            {Array.from({ length: 15 }, (_, i) => {
              const t = Math.PI - ((i + 0.5) / 15) * Math.PI;
              return <circle key={i} cx={150 + 108 * Math.cos(t)} cy={254 + 15 * Math.sin(t)} r="4" fill="#F7E7CE" />;
            })}

            {/* top tier */}
            <path d="M72 128 v58 a78 12 0 0 0 156 0 v-58 z" fill="url(#tierA)" />
            <path d={frosting(150, 128, 78, 12, [10, 18, 8, 20, 12])} fill="url(#cream)" />
            {Array.from({ length: 11 }, (_, i) => {
              const t = Math.PI - ((i + 0.5) / 11) * Math.PI;
              return <circle key={i} cx={150 + 76 * Math.cos(t)} cy={186 + 11 * Math.sin(t)} r="3.2" fill="#B76E79" />;
            })}
            {/* sprinkles */}
            {[
              [95, 160, "#B76E79"], [120, 170, "#F7E7CE"], [180, 165, "#8E4A56"], [205, 158, "#F7E7CE"], [150, 175, "#B76E79"],
              [70, 225, "#F8D7DA"], [110, 235, "#F7E7CE"], [190, 232, "#F8D7DA"], [230, 222, "#F7E7CE"], [150, 240, "#F8D7DA"],
            ].map(([x, y, c], i) => (
              <rect key={i} x={x as number} y={y as number} width="7" height="2.4" rx="1.2" fill={c as string} transform={`rotate(${(i * 47) % 180} ${x} ${y})`} />
            ))}

            {/* candles */}
            {candles.map((c, i) => (
              <g key={i}>
                <rect x={c.x - 4} y={c.y - c.h} width="8" height={c.h} rx="2" fill="url(#stripes)" style={{ color: c.color }} />
                <line x1={c.x} y1={c.y - c.h} x2={c.x} y2={c.y - c.h - 5} stroke="#3a2a22" strokeWidth="1.4" strokeLinecap="round" />
                <AnimatePresence>
                  {lit && (
                    <motion.g
                      key="flame"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0, transition: { duration: 0.35, delay: i * 0.06 } }}
                      style={{ originX: `${c.x}px`, originY: `${c.y - c.h - 4}px` }}
                    >
                      <circle cx={c.x} cy={c.y - c.h - 14} r="16" fill="url(#halo)" />
                      <g className="flame animate-flicker" style={{ animationDelay: `${i * 0.13}s` }}>
                        <path
                          d={`M${c.x},${c.y - c.h - 26} C${c.x + 7},${c.y - c.h - 15} ${c.x + 6},${c.y - c.h - 5} ${c.x},${c.y - c.h - 4} C${c.x - 6},${c.y - c.h - 5} ${c.x - 7},${c.y - c.h - 15} ${c.x},${c.y - c.h - 26}Z`}
                          fill="url(#flame)"
                        />
                        <ellipse cx={c.x} cy={c.y - c.h - 9} rx="2" ry="4" fill="#8fb8ff" opacity="0.55" />
                      </g>
                    </motion.g>
                  )}
                </AnimatePresence>
                {!lit && (
                  <motion.path
                    d={`M${c.x},${c.y - c.h - 6} q-6,-10 0,-20 q6,-10 0,-22`}
                    fill="none"
                    stroke="#bfb3ae"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0.8, y: 0 }}
                    animate={{ pathLength: 1, opacity: 0, y: -18 }}
                    transition={{ duration: 2.2, delay: 0.1 + i * 0.06, ease: "easeOut" }}
                  />
                )}
              </g>
            ))}
          </svg>
        </div>

        <div className="relative z-10 mt-6 flex min-h-[150px] flex-col items-center gap-4">
          <AnimatePresence mode="wait">
            {lit ? (
              <motion.div key="lit" className="flex flex-col items-center gap-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <p className="font-serif text-2xl italic text-wine">{content.cake.prompt}</p>
                <div className="grid h-16 place-items-center" aria-live="polite">
                  <AnimatePresence mode="popLayout">
                    {count3 !== null && (
                      <motion.span
                        key={count3}
                        className="font-display text-5xl text-rose-gold"
                        initial={{ opacity: 0, scale: 1.6, filter: "blur(6px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        transition={{ duration: 0.45 }}
                      >
                        {count3}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ) : (
              <motion.div key="out" className="flex flex-col items-center gap-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
                <p className="max-w-sm font-script text-4xl text-rose-deep sm:text-5xl">{content.cake.afterWish}</p>
                <button type="button" onClick={relight} className="text-xs uppercase tracking-[0.3em] text-rose-gold underline decoration-rose-gold/30 underline-offset-4">
                  light the candles again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
