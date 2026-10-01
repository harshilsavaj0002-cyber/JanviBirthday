"use client";

import { motion, type Variants } from "framer-motion";

const variants: Variants = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

/** Fades + lifts children into view once. */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section" | "p" | "h2";
}) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Comp>
  );
}

export function SectionHeading({ eyebrow, title, script, light = false }: { eyebrow: string; title: string; script?: string; light?: boolean }) {
  return (
    <div className="mb-14 text-center sm:mb-20">
      <Reveal>
        <p className="eyebrow">{eyebrow}</p>
      </Reveal>
      <Reveal delay={0.1}>
        <h2 className={`mt-4 font-display text-4xl leading-tight sm:text-6xl ${light ? "text-cream" : "text-wine"}`}>
          {title}
          {script && <span className={`mt-1 block font-script text-5xl sm:text-7xl ${light ? "text-gold" : "text-gold-deep"}`}>{script}</span>}
        </h2>
      </Reveal>
      <Reveal delay={0.2}>
        <div className="mx-auto mt-6 flex items-center justify-center gap-3" aria-hidden>
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-rose-gold" />
          <span className="text-rose-gold">♡</span>
          <span className="h-px w-12 bg-gradient-to-l from-transparent to-rose-gold" />
        </div>
      </Reveal>
    </div>
  );
}
