"use client";

import { motion } from "framer-motion";
import { content } from "@/data/content";
import { HEART_PATH } from "./Heart";
import { Particles } from "./Particles";
import { Reveal } from "./Reveal";
import { Starfield } from "./Starfield";

export function FinalScreen({ onReplay }: { onReplay: () => void }) {
  return (
    <section
      id="forever"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-blush/80 via-wine to-wine-darker px-6 pb-28 pt-40 text-center"
    >
      <Starfield count={40} />
      <Particles density={0.5} />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-gold/20 blur-[120px]" />

      {/* Slow heart: draws its outline, fills, then beats gently forever */}
      <motion.svg
        viewBox="0 0 24 24"
        className="relative h-32 w-32 drop-shadow-[0_0_40px_rgba(183,110,121,0.7)] sm:h-40 sm:w-40"
        animate={{ scale: [1, 1.08, 1, 1.05, 1] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
        aria-hidden
      >
        <defs>
          <linearGradient id="fh" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#F7E7CE" />
            <stop offset="0.5" stopColor="#B76E79" />
            <stop offset="1" stopColor="#8E4A56" />
          </linearGradient>
        </defs>
        <motion.path
          d={HEART_PATH}
          fill="url(#fh)"
          stroke="#F7E7CE"
          strokeWidth="0.3"
          initial={{ pathLength: 0, fillOpacity: 0 }}
          whileInView={{ pathLength: 1, fillOpacity: 1 }}
          viewport={{ once: true }}
          transition={{ pathLength: { duration: 2.2, ease: "easeInOut" }, fillOpacity: { duration: 1.2, delay: 1.6 } }}
        />
      </motion.svg>

      <Reveal delay={0.4} className="relative mt-10">
        <p className="font-serif text-3xl italic text-champagne/90 sm:text-4xl">{content.finale.line}</p>
      </Reveal>
      <Reveal delay={0.8} className="relative">
        <p className="text-gold-animated font-script text-8xl leading-tight sm:text-9xl">{content.me.name}</p>
      </Reveal>
      <Reveal delay={1.2} className="relative">
        <p className="mx-auto mt-4 max-w-md font-serif text-xl italic text-blush/75">{content.finale.note}</p>
      </Reveal>
      <Reveal delay={1.6} className="relative mt-12">
        <button type="button" onClick={onReplay} className="btn-lux">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          {content.finale.replay}
        </button>
      </Reveal>

      <p className="relative mt-20 pl-[0.4em] text-[10px] uppercase tracking-[0.4em] text-blush/40">
        <span className="block">made with all my love</span>
        <span className="mt-1 block">for {content.her.nickname}</span>
      </p>
    </section>
  );
}
