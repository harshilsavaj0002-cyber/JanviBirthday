"use client";

import { useEffect, useRef } from "react";
import { useIsDesktopPointer, usePrefersReducedMotion } from "@/hooks/useMediaQuery";

type Trail = { x: number; y: number; life: number; size: number; vx: number; vy: number; rot: number };

/** Glowing cursor dot + a trail of tiny fading hearts. Desktop (fine pointer) only. */
export function CustomCursor() {
  const desktop = useIsDesktopPointer();
  const reduced = usePrefersReducedMotion();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!desktop) return;
    document.documentElement.classList.add("has-custom-cursor");
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const mouse = { x: -100, y: -100 };
    const ring = { x: -100, y: -100 };
    const trail: Trail[] = [];
    let last = 0;
    let hovering = false;

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      const t = performance.now();
      if (!reduced && t - last > 38) {
        last = t;
        trail.push({ x: e.clientX, y: e.clientY, life: 1, size: 5 + Math.random() * 5, vx: (Math.random() - 0.5) * 0.6, vy: -0.4 - Math.random() * 0.5, rot: (Math.random() - 0.5) * 0.6 });
      }
      const target = e.target as HTMLElement | null;
      hovering = !!target?.closest("a,button,[role=button],input,[data-cursor=hover]");
    };

    const heart = (x: number, y: number, s: number) => {
      ctx.beginPath();
      ctx.moveTo(x, y + s * 0.3);
      ctx.bezierCurveTo(x, y, x - s * 0.5, y - s * 0.3, x - s * 0.5, y + s * 0.1);
      ctx.bezierCurveTo(x - s * 0.5, y + s * 0.45, x, y + s * 0.7, x, y + s);
      ctx.bezierCurveTo(x, y + s * 0.7, x + s * 0.5, y + s * 0.45, x + s * 0.5, y + s * 0.1);
      ctx.bezierCurveTo(x + s * 0.5, y - s * 0.3, x, y, x, y + s * 0.3);
      ctx.fill();
    };

    let raf = 0;
    const loop = () => {
      ring.x += (mouse.x - ring.x) * 0.18;
      ring.y += (mouse.y - ring.y) * 0.18;
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`;
      if (ringRef.current)
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%) scale(${hovering ? 1.8 : 1})`;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (let i = trail.length - 1; i >= 0; i--) {
        const p = trail[i];
        p.life -= 0.022;
        if (p.life <= 0) {
          trail.splice(i, 1);
          continue;
        }
        p.x += p.vx;
        p.y += p.vy;
        ctx.save();
        ctx.globalAlpha = p.life * 0.85;
        ctx.fillStyle = i % 3 ? "#B76E79" : "#F7E7CE";
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        heart(0, -p.size / 2, p.size * (0.6 + p.life * 0.4));
        ctx.restore();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [desktop, reduced]);

  if (!desktop) return null;
  return (
    <>
      <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[100] h-full w-full" aria-hidden />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[101] h-9 w-9 rounded-full border border-rose-gold/60 will-change-transform"
        aria-hidden
      />
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[102] h-2 w-2 rounded-full bg-rose-gold shadow-[0_0_12px_3px_rgba(183,110,121,0.6)] will-change-transform"
        aria-hidden
      />
    </>
  );
}
