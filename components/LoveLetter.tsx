"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { content } from "@/data/content";
import { SectionHeading } from "./Reveal";

const { greeting, paragraphs, signoff } = content.letter;
const BLOCKS = [greeting, ...paragraphs, signoff];
const TOTAL = BLOCKS.reduce((n, b) => n + b.length, 0);

export function LoveLetter() {
  const [opened, setOpened] = useState(false);
  const [typed, setTyped] = useState(0);
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.25 });

  // Typewriter — pauses while offscreen, speeds through punctuation naturally.
  useEffect(() => {
    if (!opened || !inView || typed >= TOTAL) return;
    if (reduced) return setTyped(TOTAL);
    const ch = BLOCKS.join("")[typed];
    const delay = ch === "." || ch === "," || ch === "—" ? 180 : 26 + Math.random() * 30;
    const id = window.setTimeout(() => setTyped((t) => Math.min(TOTAL, t + 1)), delay);
    return () => window.clearTimeout(id);
  }, [opened, inView, typed, reduced]);

  const slices = useMemo(() => {
    let left = typed;
    return BLOCKS.map((b) => {
      const n = Math.max(0, Math.min(b.length, left));
      left -= b.length;
      return [b.slice(0, n), b.slice(n)] as const;
    });
  }, [typed]);

  const finished = typed >= TOTAL;
  const activeBlock = slices.findIndex(([, rest]) => rest.length > 0);

  return (
    <section id="letter" className="relative overflow-hidden bg-gradient-to-b from-blush/50 via-cream to-cream">
      <div className="section max-w-3xl">
        <SectionHeading eyebrow="Sealed with love" title="A Letter" script="for you" />

        <div ref={ref} className="relative mx-auto">
          <motion.div
            className="paper relative overflow-hidden rounded-[4px] py-12 pl-10 pr-6 sm:py-16 sm:pl-16 sm:pr-14"
            initial={{ opacity: 0, y: 50, rotate: -1.5 }}
            whileInView={{ opacity: 1, y: 0, rotate: -0.6 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => opened && !finished && setTyped(TOTAL)}
          >
            {/* margin rule */}
            <span className="absolute bottom-0 left-4 top-0 w-px bg-rose-gold/25 sm:left-9" aria-hidden />

            <div
              className="relative transition-[filter,opacity] duration-700"
              style={{ filter: opened ? "none" : "blur(6px)", opacity: opened ? 1 : 0.45 }}
              aria-live="polite"
            >
              {slices.map(([shown, rest], i) => {
                const isGreeting = i === 0;
                const isSignoff = i === BLOCKS.length - 1;
                const caret = opened && !finished && i === activeBlock;
                return (
                  <p
                    key={i}
                    className={
                      isGreeting
                        ? "mb-6 font-script text-4xl text-rose-gold sm:text-5xl"
                        : isSignoff
                          ? "mt-10 text-right font-serif text-xl italic text-wine/80 sm:text-2xl"
                          : "mb-5 font-serif text-[1.3rem] italic leading-[1.75] text-wine/85 sm:text-[1.45rem]"
                    }
                  >
                    {opened ? shown : shown + rest}
                    {caret && <span className="ml-px inline-block h-[1em] w-[2px] translate-y-[3px] animate-pulse bg-rose-gold" aria-hidden />}
                    <span className="invisible" aria-hidden>
                      {opened ? rest : ""}
                    </span>
                  </p>
                );
              })}
              <motion.p
                className="text-right font-script text-5xl text-gold-deep sm:text-6xl"
                initial={{ opacity: 0, y: 10 }}
                animate={finished ? { opacity: 1, y: 0 } : { opacity: 0 }}
                transition={{ duration: 1.2 }}
              >
                {content.me.name}
              </motion.p>
            </div>

            {opened && !finished && (
              <p className="mt-6 text-center text-[10px] uppercase tracking-[0.35em] text-wine/35">tap to read it all</p>
            )}
          </motion.div>

          {/* Wax seal */}
          <AnimatePresence>
            {!opened && (
              <motion.button
                type="button"
                onClick={() => setOpened(true)}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4"
                exit={{ opacity: 0, transition: { duration: 0.8, delay: 0.5 } }}
                data-cursor="hover"
                aria-label="Break the seal and read the letter"
              >
                <WaxSeal />
                <span className="rounded-full bg-cream/80 px-4 py-1.5 text-[11px] uppercase tracking-[0.35em] text-wine/70 backdrop-blur">
                  Tap to break the seal
                </span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function WaxSeal() {
  // Irregular wax edge.
  const edge = useMemo(() => {
    const pts: string[] = [];
    const n = 28;
    for (let k = 0; k < n; k++) {
      const a = (k / n) * Math.PI * 2;
      const r = 46 + (k % 2 ? 3.5 : -1) + Math.sin(k * 2.3) * 1.8;
      pts.push(`${50 + Math.cos(a) * r},${50 + Math.sin(a) * r}`);
    }
    return `M${pts.join("L")}Z`;
  }, []);

  return (
    <motion.svg
      viewBox="0 0 100 100"
      className="h-28 w-28 drop-shadow-[0_10px_18px_rgba(74,14,31,0.45)] sm:h-32 sm:w-32"
      initial={{ scale: 0.6, rotate: -20, opacity: 0 }}
      whileInView={{ scale: 1, rotate: -8, opacity: 1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.06, rotate: 0 }}
      exit={{ scale: 1.3, opacity: 0, rotate: 30, transition: { duration: 0.6 } }}
      transition={{ type: "spring", stiffness: 160, damping: 14 }}
      aria-hidden
    >
      <defs>
        <radialGradient id="wax" cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor="#c4697a" />
          <stop offset="0.55" stopColor="#7a1d33" />
          <stop offset="1" stopColor="#3a0816" />
        </radialGradient>
        <radialGradient id="waxInner" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#a8404f" />
          <stop offset="1" stopColor="#5a1024" />
        </radialGradient>
      </defs>
      <path d={edge} fill="url(#wax)" />
      <circle cx="50" cy="50" r="33" fill="url(#waxInner)" stroke="#3a0816" strokeOpacity="0.5" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="29" fill="none" stroke="#e8a4ae" strokeOpacity="0.35" strokeWidth="0.8" strokeDasharray="1.5 2" />
      <text x="50" y="50" textAnchor="middle" dominantBaseline="central" fontFamily="var(--font-vibes), cursive" fontSize="30" fill="#f2c6cc" fillOpacity="0.85">
        {content.me.name.charAt(0)}
        {content.her.name.charAt(0)}
      </text>
      <ellipse cx="38" cy="30" rx="12" ry="5" fill="#fff" opacity="0.12" transform="rotate(-25 38 30)" />
    </motion.svg>
  );
}
