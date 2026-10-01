"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Photo as Image } from "./Photo";
import { useState } from "react";
import { content, type Photo } from "@/data/content";
import { Lightbox } from "./Lightbox";
import { SectionHeading } from "./Reveal";

const TILTS = [-3, 2, -1.5, 3, -2, 1.5, -2.5, 2.5, -1];

export function Gallery() {
  const [open, setOpen] = useState<number | null>(null);
  const photos = content.gallery;

  return (
    <section id="gallery" className="relative bg-gradient-to-b from-cream via-blush/40 to-cream">
      <div className="section">
        <SectionHeading eyebrow="Frames of us" title="Memory" script="Gallery" />
        <div className="columns-2 gap-4 sm:gap-7 md:columns-3">
          {photos.map((p, i) => (
            <Polaroid key={p.src} photo={p} index={i} onOpen={() => setOpen(i)} />
          ))}
        </div>
      </div>
      <Lightbox photos={photos} index={open} onClose={() => setOpen(null)} onChange={setOpen} />
    </section>
  );
}

function Polaroid({ photo, index, onOpen }: { photo: Photo; index: number; onOpen: () => void }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 200, damping: 18 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 200, damping: 18 });
  const tilt = TILTS[index % TILTS.length];

  const onMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      className="perspective mb-4 break-inside-avoid sm:mb-7"
      initial={{ opacity: 0, y: 60, rotate: tilt * 2 }}
      whileInView={{ opacity: 1, y: 0, rotate: tilt }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1, delay: (index % 3) * 0.12, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.button
        type="button"
        onClick={onOpen}
        onPointerMove={onMove}
        onPointerLeave={reset}
        style={{ rotateX, rotateY }}
        whileHover={{ scale: 1.04, zIndex: 5 }}
        whileTap={{ scale: 0.98 }}
        data-cursor="hover"
        aria-label={`Open photo: ${photo.caption ?? photo.alt}`}
        className="group block w-full rounded-sm bg-white p-2 pb-10 text-left shadow-soft transition-shadow duration-500 hover:shadow-[0_30px_70px_-25px_rgba(74,14,31,0.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-gold sm:p-3 sm:pb-12"
      >
        <div className="relative overflow-hidden bg-blush" style={{ aspectRatio: `${photo.width} / ${photo.height}` }}>
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(min-width: 768px) 33vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-wine/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </div>
        {photo.caption && (
          <p className="absolute bottom-2 left-0 right-0 truncate px-2 text-center font-script text-xl text-rose-gold sm:bottom-3 sm:text-2xl">
            {photo.caption}
          </p>
        )}
      </motion.button>
    </motion.div>
  );
}
