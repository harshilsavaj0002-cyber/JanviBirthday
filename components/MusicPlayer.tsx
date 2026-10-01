"use client";

import { AnimatePresence, motion } from "framer-motion";
import { content } from "@/data/content";
import { useMusic } from "./MusicProvider";

export function MusicPlayer() {
  const { started, playing, muted, toggle, toggleMute } = useMusic();

  return (
    <AnimatePresence>
      {started && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.2, type: "spring", stiffness: 140, damping: 18 }}
          className="glass-dark fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3 sm:bottom-6 sm:right-6"
          style={{ paddingBottom: "max(0.375rem, env(safe-area-inset-bottom) * 0.3)" }}
        >
          <button
            onClick={toggle}
            aria-label={playing ? "Pause music" : "Play music"}
            className="relative grid h-11 w-11 place-items-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-champagne"
          >
            {/* Vinyl */}
            <span
              className={`vinyl absolute inset-0 rounded-full ${playing ? "animate-spin-slow" : ""}`}
              style={{ animationPlayState: playing ? "running" : "paused" }}
            />
            <span className="relative z-10 grid h-4 w-4 place-items-center text-cream">
              {playing ? (
                <svg viewBox="0 0 12 12" className="h-3 w-3" fill="currentColor" aria-hidden>
                  <rect x="2" y="1.5" width="2.6" height="9" rx="0.8" />
                  <rect x="7.4" y="1.5" width="2.6" height="9" rx="0.8" />
                </svg>
              ) : (
                <svg viewBox="0 0 12 12" className="ml-0.5 h-3 w-3" fill="currentColor" aria-hidden>
                  <path d="M3 1.8v8.4a.6.6 0 0 0 .9.5l6.6-4.2a.6.6 0 0 0 0-1L3.9 1.3a.6.6 0 0 0-.9.5z" />
                </svg>
              )}
            </span>
          </button>

          <div className="hidden min-w-0 flex-col leading-tight sm:flex">
            <span className="font-serif text-sm italic text-champagne">{content.music.title}</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-blush/60">{content.music.artist}</span>
          </div>

          {/* Equalizer bars */}
          <div className="hidden h-4 items-end gap-[2px] sm:flex" aria-hidden>
            {[0, 1, 2, 3].map((i) => (
              <motion.span
                key={i}
                className="w-[3px] rounded-full bg-gradient-to-t from-rose-gold to-champagne"
                animate={playing && !muted ? { height: ["30%", "100%", "45%", "80%", "30%"] } : { height: "25%" }}
                transition={{ duration: 1.1 + i * 0.15, repeat: Infinity, ease: "easeInOut", delay: i * 0.12 }}
              />
            ))}
          </div>

          <button
            onClick={toggleMute}
            aria-label={muted ? "Unmute" : "Mute"}
            className="grid h-8 w-8 place-items-center rounded-full text-champagne/80 transition hover:text-champagne focus-visible:outline focus-visible:outline-2 focus-visible:outline-champagne"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
              <path d="M11 5 6 9H3v6h3l5 4V5z" fill="currentColor" stroke="none" />
              {muted ? (
                <path d="m16 9 5 6m0-6-5 6" />
              ) : (
                <>
                  <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                  <path d="M18.5 5.5a9 9 0 0 1 0 13" />
                </>
              )}
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
