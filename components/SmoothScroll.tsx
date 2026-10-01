"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useState } from "react";

const LenisContext = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisContext);

/** Lenis smooth scrolling (disabled for reduced motion; native touch scrolling kept on phones). */
export function SmoothScroll({ children, enabled }: { children: React.ReactNode; enabled: boolean }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (!enabled || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const instance = new Lenis({ duration: 1.25, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    let raf = 0;
    const loop = (time: number) => {
      instance.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    setLenis(instance);
    if (process.env.NODE_ENV !== "production") (window as unknown as { __lenis?: Lenis }).__lenis = instance;
    return () => {
      cancelAnimationFrame(raf);
      instance.destroy();
      setLenis(null);
    };
  }, [enabled]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
