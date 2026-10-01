"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { content } from "@/data/content";
import { useIsDesktopPointer } from "@/hooks/useMediaQuery";
import { Heart } from "./Heart";
import { useMusic } from "./MusicProvider";
import { Starfield } from "./Starfield";

type Phase = "closed" | "flap" | "letter" | "done";

/** Dark screen with a glowing envelope. Tapping starts the music and opens it. */
export function IntroGate({ onOpen }: { onOpen: () => void }) {
  const [phase, setPhase] = useState<Phase>("closed");
  const { start } = useMusic();
  const reduced = useReducedMotion();
  const desktop = useIsDesktopPointer();
  const opening = useRef(false);

  const open = () => {
    if (opening.current) return;
    opening.current = true;
    start(); // user gesture → audio is allowed
    if (reduced) return onOpen();
    setPhase("flap");
    window.setTimeout(() => setPhase("letter"), 750);
    window.setTimeout(() => setPhase("done"), 1900);
    window.setTimeout(onOpen, 2500);
  };

  // Enter / Space also open it.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const flapOpen = phase !== "closed";
  const letterUp = phase === "letter" || phase === "done";

  return (
    <motion.div
      key="gate"
      className="fixed inset-0 z-[75] flex cursor-pointer flex-col items-center justify-center overflow-hidden bg-wine-darker px-6"
      onClick={open}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1, ease: [0.65, 0, 0.35, 1] } }}
    >
      <Starfield count={70} />
      <motion.div
        className="pointer-events-none absolute inset-0 m-auto h-[480px] w-[480px] rounded-full bg-rose-gold/25 blur-[110px]"
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: phase === "closed" ? 1 : 0, y: 0 }}
        transition={{ duration: 1.2, delay: phase === "closed" ? 0.3 : 0 }}
        className="relative z-10 mb-14 max-w-xs text-center font-serif text-2xl italic leading-snug text-champagne/85 sm:max-w-md sm:text-3xl"
      >
        {content.intro.line}
        <span className="mt-3 block font-display text-5xl italic tracking-wide text-gold-animated sm:text-6xl">{content.her.nickname}</span>
      </motion.p>

      {/* Envelope */}
      <motion.button
        type="button"
        aria-label={`${content.intro.cta} — a letter for ${content.her.nickname}`}
        className="perspective relative z-10 h-44 w-72 focus:outline-none sm:h-52 sm:w-80"
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={
          phase === "done"
            ? { opacity: 0, scale: 1.6, y: -40, transition: { duration: 0.9, ease: [0.65, 0, 0.35, 1] } }
            : { opacity: 1, y: [0, -8, 0], scale: 1, transition: { opacity: { duration: 1 }, y: { duration: 4, repeat: Infinity, ease: "easeInOut" } } }
        }
        whileTap={{ scale: 0.97 }}
      >
        {/* glow */}
        <span className="absolute -inset-6 rounded-[2rem] bg-rose-gold/30 blur-2xl" />

        {/* back */}
        <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#8E4A56] to-[#4A0E1F] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)]" />

        {/* letter */}
        <motion.span
          className="absolute inset-x-4 top-3 flex h-[85%] flex-col items-center justify-center rounded-md bg-cream shadow-lg"
          style={{ zIndex: letterUp ? 30 : 10 }}
          animate={{ y: letterUp ? "-62%" : "0%" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="font-display text-2xl italic text-rose-gold">For {content.her.nickname}</span>
          <span className="mt-1 text-[10px] uppercase tracking-[0.3em] text-wine/50">with all my love</span>
        </motion.span>

        {/* front pocket */}
        <span
          className="absolute inset-0 z-20 rounded-xl bg-gradient-to-t from-[#6b1a2e] to-[#9c5563]"
          style={{ clipPath: "polygon(0 0, 50% 58%, 100% 0, 100% 100%, 0 100%)" }}
        />
        <span
          className="absolute inset-0 z-20 rounded-xl opacity-40"
          style={{ clipPath: "polygon(0 100%, 50% 50%, 100% 100%)", background: "linear-gradient(0deg,#4A0E1F,#B76E79)" }}
        />

        {/* flap */}
        <motion.span
          className="preserve-3d absolute inset-x-0 top-0 h-[62%] origin-top"
          style={{ zIndex: flapOpen ? 5 : 25 }}
          animate={{ rotateX: flapOpen ? 180 : 0 }}
          transition={{ duration: 0.75, ease: [0.65, 0, 0.35, 1] }}
        >
          <span
            className="absolute inset-0 bg-gradient-to-b from-[#b76e79] to-[#7a2f40]"
            style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
          />
        </motion.span>

        {/* wax seal */}
        <motion.span
          className="absolute left-[calc(50%-1.75rem)] top-[calc(52%-1.75rem)] z-30 grid h-14 w-14 place-items-center rounded-full"
          style={{
            background: "radial-gradient(circle at 35% 30%, #d88a95, #8E4A56 55%, #4A0E1F)",
            boxShadow: "0 6px 14px rgba(0,0,0,0.45), inset 0 -3px 6px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.25)",
          }}
          animate={flapOpen ? { scale: 0, opacity: 0, rotate: 40 } : { scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Heart className="h-6 w-6 opacity-90" />
        </motion.span>
      </motion.button>

      <motion.p
        className="relative z-10 mt-14 text-[11px] uppercase tracking-[0.45em] text-blush/60"
        animate={{ opacity: phase === "closed" ? [0.35, 1, 0.35] : 0 }}
        transition={{ duration: 2.4, repeat: phase === "closed" ? Infinity : 0 }}
      >
        {desktop ? content.intro.cta.replace(/^Tap/, "Click") : content.intro.cta}
      </motion.p>
    </motion.div>
  );
}
