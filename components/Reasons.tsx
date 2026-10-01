"use client";

import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { useRef, useState } from "react";
import { content } from "@/data/content";
import { Heart } from "./Heart";
import { SectionHeading } from "./Reveal";

/** A deck of cards: tap to flip and reveal a reason, swipe (or tap "next") to send it flying. */
export function Reasons() {
  const reasons = content.reasons;
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [exitX, setExitX] = useState(400);
  const [seen, setSeen] = useState(1);
  const dragged = useRef(false);

  const next = (direction = 1) => {
    setExitX(direction * 420);
    setFlipped(false);
    setI((v) => (v + 1) % reasons.length);
    setSeen((s) => Math.min(reasons.length, s + 1));
  };

  const tap = () => {
    if (dragged.current) return;
    if (flipped) next();
    else setFlipped(true);
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    window.setTimeout(() => (dragged.current = false), 50);
    if (Math.abs(info.offset.x) > 90 || Math.abs(info.velocity.x) > 500) next(info.offset.x > 0 ? 1 : -1);
  };

  const stack = [2, 1].map((k) => (i + k) % reasons.length);

  return (
    <section id="reasons" className="relative overflow-hidden bg-gradient-to-b from-cream to-blush/50">
      <div className="section">
        <SectionHeading eyebrow={`${reasons.length} of a million`} title="Reasons I" script="Love You" />

        <div className="perspective relative mx-auto h-[430px] w-full max-w-[300px] sm:h-[460px] sm:max-w-[330px]">
          {/* cards underneath */}
          {stack.map((idx, depth) => (
            <motion.div
              key={`under-${idx}`}
              className="absolute inset-0 rounded-[1.75rem] bg-gradient-to-br from-rose-gold to-wine shadow-soft"
              animate={{ rotate: depth === 0 ? -8 : 5, scale: depth === 0 ? 0.9 : 0.95, y: depth === 0 ? 22 : 11 }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
              aria-hidden
            >
              <CardPattern />
            </motion.div>
          ))}

          <AnimatePresence initial={false} custom={exitX}>
            <motion.div
              key={i}
              className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing"
              initial={{ scale: 0.95, y: 11, rotate: 5, opacity: 1 }}
              animate={{ scale: 1, y: 0, rotate: 0, opacity: 1 }}
              custom={exitX}
              variants={{ out: (x: number) => ({ x, rotate: x > 0 ? 25 : -25, opacity: 0, transition: { duration: 0.45 } }) }}
              exit="out"
              transition={{ type: "spring", stiffness: 220, damping: 24 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.9}
              onDragStart={() => (dragged.current = true)}
              onDragEnd={onDragEnd}
            >
              <motion.button
                type="button"
                onClick={tap}
                className="preserve-3d relative h-full w-full focus:outline-none"
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                data-cursor="hover"
                aria-label={flipped ? `Reason ${i + 1}: ${reasons[i]}. Tap for next reason.` : `Reveal reason ${i + 1}`}
              >
                {/* front */}
                <span className="backface-hidden absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-rose-gold via-[#9a5563] to-wine text-cream shadow-soft ring-1 ring-champagne/30">
                  <CardPattern />
                  <span className="absolute inset-3 rounded-[1.35rem] border border-champagne/30" />
                  <span className="text-[11px] uppercase tracking-[0.4em] text-champagne/80">Reason</span>
                  <span className="text-gold my-2 font-display text-8xl">{String(i + 1).padStart(2, "0")}</span>
                  <Heart className="h-9 w-9 animate-heartbeat" />
                  <span className="mt-8 text-[11px] uppercase tracking-[0.35em] text-champagne/70">tap to reveal</span>
                </span>
                {/* back */}
                <span className="backface-hidden absolute inset-0 flex flex-col items-center justify-center rounded-[1.75rem] bg-cream px-8 text-center shadow-soft ring-1 ring-rose-gold/25 [transform:rotateY(180deg)]">
                  <span className="absolute inset-3 rounded-[1.35rem] border border-rose-gold/20" />
                  <span className="font-script text-4xl text-rose-gold">#{i + 1}</span>
                  <span className="mt-4 font-serif text-[1.65rem] italic leading-snug text-wine">{reasons[i]}</span>
                  <span className="mt-8 text-[10px] uppercase tracking-[0.35em] text-wine/40">swipe or tap for next</span>
                </span>
              </motion.button>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-14 flex flex-col items-center gap-5">
          <div className="flex flex-wrap justify-center gap-1.5" aria-hidden>
            {reasons.map((_, k) => (
              <span key={k} className={`h-1.5 rounded-full transition-all duration-500 ${k === i ? "w-6 bg-rose-gold" : k < seen ? "w-1.5 bg-rose-gold/50" : "w-1.5 bg-rose-gold/15"}`} />
            ))}
          </div>
          <button type="button" onClick={tap} className="btn-lux">
            {flipped ? "Next reason" : "Reveal this one"}
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>
    </section>
  );
}

function CardPattern() {
  return (
    <span
      className="absolute inset-0 rounded-[1.75rem] opacity-[0.12]"
      style={{
        backgroundImage:
          "radial-gradient(circle at 25% 25%, #F7E7CE 1.5px, transparent 1.6px), radial-gradient(circle at 75% 75%, #F7E7CE 1.5px, transparent 1.6px)",
        backgroundSize: "22px 22px",
      }}
      aria-hidden
    />
  );
}
