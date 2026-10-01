"use client";

import { animate, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { content } from "@/data/content";
import { useNow } from "@/hooks/useNow";
import { formatLong, parseDMY } from "@/lib/date";
import { Heart } from "./Heart";
import { Reveal } from "./Reveal";

export function DaysTogether() {
  const now = useNow(1000);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const met = parseDMY(content.metOn);

  const diff = now ? now.getTime() - met.getTime() : 0;
  const future = diff < 0;
  const ms = Math.abs(diff);
  const stats: [string, number][] = [
    ["Days", Math.floor(ms / 86400000)],
    ["Hours", Math.floor(ms / 3600000)],
    ["Minutes", Math.floor(ms / 60000)],
    ["Seconds", Math.floor(ms / 1000)],
  ];
  const heartbeats = Math.floor((ms / 60000) * 72);

  return (
    <section id="together" className="relative overflow-hidden bg-wine py-24 text-cream sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(183,110,121,0.35),transparent_60%)]" />
      <div className="pointer-events-none absolute -bottom-24 left-1/2 h-72 w-[140%] -translate-x-1/2 rounded-[100%] bg-rose-gold/10 blur-3xl" />

      <div ref={ref} className="relative mx-auto max-w-5xl px-5 text-center sm:px-8">
        <Reveal>
          <p className="eyebrow text-blush/70">{content.daysTogether.eyebrow}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-4 font-display text-4xl sm:text-6xl">
            {future ? content.daysTogether.futureTitle : content.daysTogether.title}
            <span className="mt-2 block font-script text-4xl text-gold sm:text-6xl">{formatLong(met)}</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-3 sm:mt-20 sm:gap-5 lg:grid-cols-4">
          {stats.map(([label, value], i) => (
            <motion.div
              key={label}
              className="glass-dark rounded-3xl px-3 py-7 sm:py-10"
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.2 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="text-gold whitespace-nowrap font-display text-2xl tabular-nums sm:text-4xl">
                <CountUp value={value} start={inView && now !== null} />
              </div>
              <div className="mt-2 text-[10px] uppercase tracking-[0.35em] text-blush/60 sm:text-xs">{label}</div>
            </motion.div>
          ))}
        </div>

        <Reveal delay={0.3} className="mt-12 flex items-center justify-center gap-3 font-serif text-xl italic text-champagne/80 sm:text-2xl">
          <Heart className="h-5 w-5 shrink-0 animate-heartbeat" />
          <span>
            {future ? "and" : "that's"} ≈ <span className="tabular-nums not-italic text-champagne">{heartbeats.toLocaleString("en-IN")}</span>{" "}
            heartbeats {future ? "to go" : "that beat for you"}
          </span>
        </Reveal>
      </div>
    </section>
  );
}

/** Counts up from 0 the first time it starts, then tracks the live value. */
function CountUp({ value, start }: { value: number; start: boolean }) {
  const [display, setDisplay] = useState(0);
  const [done, setDone] = useState(false);
  const latest = useRef(value);
  latest.current = value;

  useEffect(() => {
    if (!start) return;
    const controls = animate(0, latest.current, {
      duration: 2.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
      onComplete: () => setDone(true),
    });
    return () => controls.stop();
  }, [start]);

  useEffect(() => {
    if (done) setDisplay(value);
  }, [done, value]);

  return <>{display.toLocaleString("en-IN")}</>;
}
