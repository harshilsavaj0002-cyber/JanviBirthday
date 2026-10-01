"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { content } from "@/data/content";
import { useBirthday } from "@/hooks/useBirthday";
import { celebrate } from "@/lib/confetti";
import { formatLong, splitMs } from "@/lib/date";
import { Starfield } from "./Starfield";

/** Before the day: live flip-card countdown. On/after: confetti + letter-by-letter wish. */
export function Surprise() {
  const { ready, remaining, isBirthday, target } = useBirthday();

  return (
    <section
      id="surprise"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-gradient-to-b from-wine-darker via-wine-dark to-wine px-5 py-24"
    >
      <Starfield count={50} />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-rose-gold/20 blur-[140px]" />
      <div className="relative z-10 w-full max-w-4xl text-center">
        {ready && (isBirthday ? <BirthdayWish /> : <Countdown remaining={remaining ?? 0} target={target} />)}
      </div>
    </section>
  );
}

function Countdown({ remaining, target }: { remaining: number; target: Date }) {
  const t = splitMs(remaining);
  const units: [string, number][] = [
    ["Days", t.days],
    ["Hours", t.hours],
    ["Minutes", t.minutes],
    ["Seconds", t.seconds],
  ];
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.3 }}>
      <p className="eyebrow text-blush/70">{content.countdown.eyebrow}</p>
      <h2 className="mt-5 font-display text-4xl text-cream sm:text-6xl">
        {formatLong(target).split(" ").slice(0, 2).join(" ")}
        <span className="mt-2 block font-script text-5xl text-gold-animated sm:text-7xl">{content.her.name}&apos;s day</span>
      </h2>

      <div className="mx-auto mt-12 grid max-w-2xl grid-cols-4 gap-2.5 sm:gap-5" role="timer" aria-live="off">
        {units.map(([label, value]) => (
          <div key={label} className="flex flex-col items-center">
            <FlipCard value={String(value).padStart(2, "0")} />
            <span className="mt-3 text-[10px] uppercase tracking-[0.3em] text-blush/60 sm:text-xs">{label}</span>
          </div>
        ))}
      </div>
      <p className="mx-auto mt-12 max-w-md font-serif text-xl italic text-champagne/75">{content.countdown.subline}</p>
    </motion.div>
  );
}

function FlipCard({ value }: { value: string }) {
  return (
    <div className="perspective relative h-20 w-full max-w-[120px] sm:h-32">
      <div className="glass-dark absolute inset-0 overflow-hidden rounded-2xl">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            className="absolute inset-0 grid place-items-center py-0 font-display text-4xl tabular-nums text-gold sm:text-6xl"
            initial={{ rotateX: 90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            exit={{ rotateX: -90, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
            style={{ transformOrigin: "50% 50%" }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
        {/* hinge line */}
        <span className="absolute inset-x-0 top-1/2 h-px bg-black/40 shadow-[0_1px_0_rgba(247,231,206,0.08)]" />
        <span className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.06] to-transparent" />
      </div>
    </div>
  );
}

function BirthdayWish() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  useEffect(() => {
    if (inView) celebrate(3200);
  }, [inView]);

  const line = "Happy Birthday";
  return (
    <div ref={ref}>
      <motion.p className="eyebrow text-blush/70" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 1 }}>
        {content.birthdayWish.eyebrow}
      </motion.p>
      <h2 className="mt-6 font-display text-5xl leading-none text-cream sm:text-8xl" aria-label={`${line} ${content.her.name}`}>
        {line.split(" ").map((word, w, words) => {
          const offset = words.slice(0, w).join(" ").length + (w ? 1 : 0);
          return (
            <span key={w} className="inline-block whitespace-nowrap">
              {word.split("").map((ch, i) => (
                <motion.span
                  key={i}
                  aria-hidden
                  className="inline-block"
                  initial={{ opacity: 0, y: 40, rotateX: -90, filter: "blur(10px)" }}
                  animate={inView ? { opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" } : {}}
                  transition={{ duration: 0.8, delay: 0.3 + (offset + i) * 0.07, ease: [0.22, 1, 0.36, 1] }}
                >
                  {ch}
                </motion.span>
              ))}
              {w < words.length - 1 && "\u00A0"}
            </span>
          );
        })}
        <span className="mt-3 block font-script text-7xl sm:text-9xl" aria-hidden>
          {/* Whole-word "handwriting" wipe keeps the script letters joined and the gradient continuous. */}
          <motion.span
            className="inline-block text-gold-animated"
            initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0.4 }}
            animate={inView ? { clipPath: "inset(0 0% 0 0)", opacity: 1 } : {}}
            transition={{ duration: 1.8, delay: 1.3, ease: [0.45, 0, 0.25, 1] }}
          >
            {content.her.name}
          </motion.span>
        </span>
      </h2>
      <motion.p
        className="mx-auto mt-10 max-w-md font-serif text-xl italic text-champagne/80 sm:text-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.2, delay: 2.3 }}
      >
        {content.birthdayWish.subline}
      </motion.p>
    </div>
  );
}
