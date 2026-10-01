"use client";

import type { Options } from "canvas-confetti";

const PALETTE = ["#F8D7DA", "#B76E79", "#F7E7CE", "#E8B4B8", "#D4AF37", "#FFF8F0"];

async function load() {
  return (await import("canvas-confetti")).default;
}

function reduced() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** A soft two-sided confetti shower. */
export async function celebrate(duration = 2600) {
  const confetti = await load();
  if (reduced()) {
    confetti({ particleCount: 60, spread: 90, origin: { y: 0.6 }, colors: PALETTE, disableForReducedMotion: false });
    return;
  }
  const end = Date.now() + duration;
  const base: Options = { colors: PALETTE, ticks: 260, gravity: 0.9, scalar: 1.05, zIndex: 60 };
  (function frame() {
    confetti({ ...base, particleCount: 3, angle: 60, spread: 60, origin: { x: 0, y: 0.7 } });
    confetti({ ...base, particleCount: 3, angle: 120, spread: 60, origin: { x: 1, y: 0.7 } });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

/** Firework bursts (with heart confetti mixed in) from random points. */
export async function fireworks(duration = 4200) {
  const confetti = await load();
  const heart = confetti.shapeFromPath({
    path: "M167 72c19,-38 37,-56 75,-56 42,0 76,33 76,75 0,76 -76,151 -151,227 -76,-76 -151,-151 -151,-227 0,-42 33,-75 75,-75 38,0 57,18 76,56z",
  });
  const end = Date.now() + (reduced() ? 600 : duration);
  const base: Options = { startVelocity: 32, spread: 360, ticks: 90, zIndex: 60, colors: PALETTE, gravity: 0.7 };
  const rand = (min: number, max: number) => Math.random() * (max - min) + min;

  const id = window.setInterval(() => {
    const left = end - Date.now();
    if (left <= 0) return window.clearInterval(id);
    const count = Math.round(60 * (left / duration)) + 12;
    confetti({ ...base, particleCount: count, origin: { x: rand(0.1, 0.35), y: rand(0.15, 0.45) } });
    confetti({ ...base, particleCount: count, origin: { x: rand(0.65, 0.9), y: rand(0.15, 0.45) } });
    confetti({ ...base, particleCount: 10, shapes: [heart], scalar: 1.8, origin: { x: rand(0.3, 0.7), y: rand(0.2, 0.4) } });
  }, 280);
}
