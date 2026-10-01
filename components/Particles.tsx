"use client";

import { useEffect, useRef } from "react";

type P = { x: number; y: number; r: number; vy: number; vx: number; rot: number; vr: number; sway: number; phase: number; kind: 0 | 1; color: string; alpha: number };

const COLORS = ["#F8D7DA", "#E8B4B8", "#B76E79", "#F7E7CE"];

/**
 * Lightweight canvas of drifting rose petals and hearts.
 * Pauses when offscreen or when the tab is hidden; disabled for reduced motion.
 */
export function Particles({ density = 1, className = "" }: { density?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let parts: P[] = [];

    const make = (initial: boolean): P => ({
      x: Math.random() * w,
      y: initial ? Math.random() * h : -20,
      r: 5 + Math.random() * 9,
      vy: 0.25 + Math.random() * 0.6,
      vx: (Math.random() - 0.5) * 0.2,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.02,
      sway: 0.4 + Math.random() * 0.8,
      phase: Math.random() * Math.PI * 2,
      kind: Math.random() < 0.35 ? 1 : 0,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: 0.35 + Math.random() * 0.5,
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(60, (w * h) / 22000) * density);
      parts = Array.from({ length: count }, () => make(true));
    };

    const petal = (r: number) => {
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.bezierCurveTo(r * 0.9, -r * 0.6, r * 0.7, r * 0.7, 0, r);
      ctx.bezierCurveTo(-r * 0.7, r * 0.7, -r * 0.9, -r * 0.6, 0, -r);
      ctx.fill();
    };
    const heart = (r: number) => {
      const s = r * 1.1;
      ctx.beginPath();
      ctx.moveTo(0, s * 0.35);
      ctx.bezierCurveTo(-s * 0.1, s * 0.2, -s * 0.6, -s * 0.05, -s * 0.5, -s * 0.4);
      ctx.bezierCurveTo(-s * 0.4, -s * 0.75, 0, -s * 0.7, 0, -s * 0.35);
      ctx.bezierCurveTo(0, -s * 0.7, s * 0.4, -s * 0.75, s * 0.5, -s * 0.4);
      ctx.bezierCurveTo(s * 0.6, -s * 0.05, s * 0.1, s * 0.2, 0, s * 0.35);
      ctx.fill();
    };

    let raf = 0;
    let running = false;
    let t = 0;
    const loop = () => {
      t += 0.016;
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.y += p.vy;
        p.x += p.vx + Math.sin(t * p.sway + p.phase) * 0.35;
        p.rot += p.vr;
        if (p.y > h + 20) Object.assign(p, make(false));
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        if (p.kind) heart(p.r);
        else {
          ctx.scale(1, 0.75 + Math.sin(t * 2 + p.phase) * 0.25); // tumbling
          petal(p.r);
        }
        ctx.restore();
      }
      raf = requestAnimationFrame(loop);
    };
    const play = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const pause = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    let inView = false;
    const sync = () => (inView && !document.hidden ? play() : pause());
    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      sync();
    });
    io.observe(canvas);
    const onVis = sync;
    document.addEventListener("visibilitychange", onVis);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      pause();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [density]);

  return <canvas ref={ref} className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} aria-hidden />;
}
