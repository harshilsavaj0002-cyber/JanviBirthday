"use client";

import { motion, useAnimationControls } from "framer-motion";
import { useRef, useState } from "react";
import { content } from "@/data/content";
import { Heart } from "./Heart";
import { Starfield } from "./Starfield";

export function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const controls = useAnimationControls();
  const inputRef = useRef<HTMLInputElement>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = value.replace(/[\s\-/.]/g, "");
    if (content.password.accepted.includes(digits)) {
      setError(false);
      setUnlocking(true);
      window.setTimeout(onUnlock, 900);
    } else {
      setError(true);
      controls.start({ x: [0, -12, 12, -8, 8, -4, 4, 0], transition: { duration: 0.5 } });
      inputRef.current?.select();
    }
  };

  return (
    <motion.div
      key="password"
      className="fixed inset-0 z-[75] flex items-center justify-center overflow-hidden bg-wine-darker px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04, transition: { duration: 0.7 } }}
    >
      <Starfield />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-gold/15 blur-[120px]" />

      <motion.form
        onSubmit={submit}
        animate={controls}
        className="glass-dark relative w-full max-w-sm rounded-[2rem] px-7 py-10 text-center"
      >
        <motion.div
          animate={unlocking ? { scale: [1, 1.4, 0], rotate: [0, 0, 20] } : { scale: 1 }}
          transition={{ duration: 0.9 }}
          className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-rose-gold/40 to-wine/60 ring-1 ring-champagne/20"
        >
          {unlocking ? (
            <Heart className="h-8 w-8" />
          ) : (
            <svg viewBox="0 0 24 24" className="h-7 w-7 text-champagne" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <rect x="5" y="11" width="14" height="9" rx="2" />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" />
            </svg>
          )}
        </motion.div>

        <p className="mb-1 font-script text-4xl text-gold">Hello, {content.her.nickname}</p>
        <p className="mb-8 font-serif text-lg italic text-champagne/75">{content.password.prompt}</p>

        <label htmlFor="pw" className="sr-only">
          Password
        </label>
        <input
          id="pw"
          ref={inputRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(false);
          }}
          inputMode="numeric"
          autoComplete="off"
          autoFocus
          placeholder="• • • • • • • •"
          className={`w-full rounded-2xl border bg-white/5 px-5 py-4 text-center font-serif text-2xl tracking-[0.4em] text-champagne placeholder:text-champagne/25 focus:outline-none focus:ring-2 ${
            error ? "border-red-300/60 focus:ring-red-300/40" : "border-champagne/15 focus:ring-rose-gold/50"
          }`}
        />
        <p className={`mt-3 h-5 text-xs tracking-wider ${error ? "text-red-200/90" : "text-blush/50"}`} aria-live="polite">
          {error ? "Not quite, my love — try again ♡" : content.password.hint}
        </p>

        <button type="submit" className="btn-lux mt-6 w-full">
          Unlock
        </button>
      </motion.form>
    </motion.div>
  );
}
