"use client";

import { motion } from "framer-motion";
import { Heart } from "./Heart";

export function Loader() {
  return (
    <motion.div
      key="loader"
      className="fixed inset-0 z-[80] grid place-items-center bg-wine-darker"
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
      role="status"
      aria-label="Loading"
    >
      <div className="flex flex-col items-center gap-8">
        <div className="relative">
          <div className="absolute inset-0 -m-8 rounded-full bg-rose-gold/25 blur-3xl" />
          <Heart className="relative h-20 w-20 animate-heartbeat drop-shadow-[0_0_24px_rgba(183,110,121,0.7)]" />
        </div>
        {/* ECG line */}
        <svg viewBox="0 0 200 40" className="h-8 w-48" aria-hidden>
          <motion.path
            d="M0 20 H70 L78 8 L86 32 L94 4 L102 36 L110 20 H200"
            fill="none"
            stroke="#B76E79"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0.2 }}
            animate={{ pathLength: [0, 1, 1], opacity: [0.2, 1, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
        <p className="font-serif text-lg italic tracking-wide text-champagne/70">loading a little love…</p>
      </div>
    </motion.div>
  );
}
