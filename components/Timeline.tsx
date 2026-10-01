"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { Photo as Image } from "./Photo";
import { useRef } from "react";
import { content, type TimelineMoment } from "@/data/content";
import { Heart } from "./Heart";
import { SectionHeading } from "./Reveal";

export function Timeline() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 25, restDelta: 0.001 });

  return (
    <section id="story" className="relative overflow-hidden bg-cream">
      <div className="pointer-events-none absolute -left-40 top-40 h-96 w-96 rounded-full bg-blush/60 blur-[100px]" />
      <div className="pointer-events-none absolute -right-40 bottom-40 h-96 w-96 rounded-full bg-champagne blur-[100px]" />
      <div className="section">
        <SectionHeading eyebrow="Chapter one" title="Our Story" script="so far" />

        <ol ref={ref} className="relative mx-auto max-w-5xl">
          {/* rail */}
          <span className="absolute bottom-0 left-5 top-0 w-px bg-rose-gold/15 md:left-1/2 md:-translate-x-1/2" aria-hidden />
          <motion.span
            className="absolute bottom-0 left-[19px] top-0 w-[2px] origin-top bg-gradient-to-b from-champagne via-rose-gold to-wine md:left-[calc(50%-1px)]"
            style={{ scaleY: progress }}
            aria-hidden
          />
          {content.timeline.map((m, i) => (
            <Moment key={m.title} moment={m} index={i} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function Moment({ moment, index }: { moment: TimelineMoment; index: number }) {
  const right = index % 2 === 1;
  return (
    <li className="relative mb-16 pl-14 last:mb-0 md:mb-24 md:grid md:grid-cols-2 md:gap-16 md:pl-0">
      {/* node */}
      <motion.span
        className="absolute left-[2px] top-6 z-10 grid h-9 w-9 place-items-center rounded-full bg-cream shadow-soft ring-1 ring-rose-gold/30 md:left-[calc(50%-18px)]"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "-20% 0px" }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        aria-hidden
      >
        <Heart className="h-4 w-4" />
      </motion.span>

      <motion.div
        className={right ? "md:order-2" : "md:text-right"}
        initial={{ opacity: 0, x: right ? 60 : -60, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="inline-block rounded-full bg-blush/70 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.25em] text-rose-deep">
          {moment.date}
        </span>
        <h3 className="mt-4 font-display text-3xl text-wine sm:text-4xl">{moment.title}</h3>
        <p className="mt-3 font-serif text-xl leading-relaxed text-wine/75">{moment.text}</p>
      </motion.div>

      <motion.div
        className={`mt-6 md:mt-0 ${right ? "md:order-1" : ""}`}
        initial={{ opacity: 0, y: 50, rotate: right ? -6 : 6 }}
        whileInView={{ opacity: 1, y: 0, rotate: right ? -2.5 : 2.5 }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: 1.2, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative mx-auto max-w-xs rounded-sm bg-white p-3 pb-12 shadow-soft md:max-w-sm">
          <div className="relative aspect-[4/5] overflow-hidden bg-blush">
            <Image
              src={moment.photo.src}
              alt={moment.photo.alt}
              fill
              sizes="(min-width: 768px) 380px, 80vw"
              className="object-cover"
              style={{ objectPosition: moment.photo.focus }}
              loading="lazy"
            />
          </div>
          <p className="absolute bottom-3 left-0 right-0 text-center font-script text-2xl text-rose-gold">{moment.title}</p>
          {/* tape */}
          <span className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 rotate-[-4deg] bg-champagne/80 shadow-sm" aria-hidden />
        </div>
      </motion.div>
    </li>
  );
}
