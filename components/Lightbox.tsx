"use client";

import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { Photo as Image } from "./Photo";
import { useCallback, useEffect, useState } from "react";
import type { Photo } from "@/data/content";
import { useLenis } from "./SmoothScroll";

type Props = { photos: Photo[]; index: number | null; onClose: () => void; onChange: (i: number) => void };

export function Lightbox({ photos, index, onClose, onChange }: Props) {
  const lenis = useLenis();
  const [dir, setDir] = useState(0);
  const open = index !== null;

  const go = useCallback(
    (delta: number) => {
      if (index === null) return;
      setDir(delta);
      onChange((index + delta + photos.length) % photos.length);
    },
    [index, onChange, photos.length],
  );

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    document.body.classList.add("locked");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.body.classList.remove("locked");
      window.removeEventListener("keydown", onKey);
    };
  }, [open, lenis, onClose, go]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -70 || info.velocity.x < -400) go(1);
    else if (info.offset.x > 70 || info.velocity.x > 400) go(-1);
    else if (Math.abs(info.offset.y) > 120) onClose();
  };

  const photo = index !== null ? photos[index] : null;

  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          className="fixed inset-0 z-[66] flex flex-col items-center justify-center bg-wine-darker/95 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
        >
          <div className="relative flex h-[78svh] w-full max-w-5xl items-center justify-center px-4" onClick={(e) => e.stopPropagation()}>
            <AnimatePresence initial={false} custom={dir} mode="popLayout">
              <motion.div
                key={index}
                custom={dir}
                className="relative h-full w-full cursor-grab touch-none active:cursor-grabbing"
                variants={{
                  enter: (d: number) => ({ x: d >= 0 ? 300 : -300, opacity: 0, scale: 0.92 }),
                  center: { x: 0, opacity: 1, scale: 1 },
                  exit: (d: number) => ({ x: d >= 0 ? -300 : 300, opacity: 0, scale: 0.92 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 260, damping: 30 }}
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.6}
                onDragEnd={onDragEnd}
              >
                <Image src={photo.src} alt={photo.alt} fill sizes="100vw" className="pointer-events-none select-none object-contain" draggable={false} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-4 flex flex-col items-center gap-1 px-6 text-center" onClick={(e) => e.stopPropagation()}>
            {photo.caption && <p className="font-script text-3xl text-gold">{photo.caption}</p>}
            <p className="text-[11px] uppercase tracking-[0.35em] text-blush/60">
              {index! + 1} / {photos.length} · swipe
            </p>
          </div>

          <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full text-champagne glass-dark" style={{ top: "max(1rem, env(safe-area-inset-top))" }}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
          {(["prev", "next"] as const).map((k) => (
            <button
              key={k}
              onClick={(e) => {
                e.stopPropagation();
                go(k === "next" ? 1 : -1);
              }}
              aria-label={k === "next" ? "Next photo" : "Previous photo"}
              className={`glass-dark absolute top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full text-champagne sm:grid ${k === "next" ? "right-6" : "left-6"}`}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
                <path d={k === "next" ? "M9 5l7 7-7 7" : "M15 5l-7 7 7 7"} />
              </svg>
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
