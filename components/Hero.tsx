"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Photo as Image } from "./Photo";
import { useRef } from "react";
import { content } from "@/data/content";
import { Particles } from "./Particles";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1.25]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} id="hero" className="relative flex h-[100svh] min-h-[560px] items-end justify-center overflow-hidden bg-wine">
      <motion.div className="absolute inset-0" style={{ y, scale }}>
        <Image
          src={content.hero.photo.src}
          alt={content.hero.photo.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: content.hero.photo.focus }}
        />
      </motion.div>
      {/* Tonal overlays */}
      {/* Light at the top so faces stay clear, deep wine at the bottom behind the name. */}
      <div className="absolute inset-0 bg-gradient-to-b from-wine-darker/40 via-transparent via-35% to-wine-darker/95" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(22,3,10,0.45)_100%)]" />
      <div className="absolute inset-0 bg-rose-gold/20 mix-blend-soft-light" />

      <Particles />

      <motion.div style={{ y: textY, opacity: fade }} className="relative z-10 px-6 pb-36 text-center sm:pb-40">
        <motion.p
          className="eyebrow text-champagne/90"
          initial={{ opacity: 0, letterSpacing: "0.1em" }}
          whileInView={{ opacity: 1, letterSpacing: "0.35em" }}
          viewport={{ once: true }}
          transition={{ duration: 1.6 }}
        >
          {content.hero.eyebrow}
        </motion.p>
        <motion.h1
          className="text-gold-animated font-script text-[5.5rem] leading-none drop-shadow-[0_4px_30px_rgba(22,3,10,0.4)] sm:text-[11rem]"
          initial={{ opacity: 0, scale: 0.85, filter: "blur(14px)" }}
          whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {content.her.name}
        </motion.h1>
        <motion.p
          className="mx-auto max-w-sm font-serif text-2xl italic text-cream sm:text-3xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.6 }}
        >
          {content.hero.tagline}
        </motion.p>
      </motion.div>

      <div className="absolute inset-x-0 bottom-8 z-10 flex justify-center" aria-hidden>
        <motion.div
          className="flex flex-col items-center gap-2 text-champagne/70"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="pl-[0.4em] text-[10px] uppercase tracking-[0.4em]">Scroll</span>
          <span className="h-10 w-px bg-gradient-to-b from-champagne/60 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
