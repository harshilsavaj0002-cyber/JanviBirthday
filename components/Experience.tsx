"use client";

import { AnimatePresence, MotionConfig } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { content } from "@/data/content";
import { Cake } from "./Cake";
import { CustomCursor } from "./CustomCursor";
import { DaysTogether } from "./DaysTogether";
import { FinalScreen } from "./FinalScreen";
import { Gallery } from "./Gallery";
import { Hero } from "./Hero";
import { IntroGate } from "./IntroGate";
import { Loader } from "./Loader";
import { LoveLetter } from "./LoveLetter";
import { MusicPlayer } from "./MusicPlayer";
import { MusicProvider } from "./MusicProvider";
import { PasswordGate } from "./PasswordGate";
import { Reasons } from "./Reasons";
import { SmoothScroll } from "./SmoothScroll";
import { Surprise } from "./Surprise";
import { Timeline } from "./Timeline";

type Stage = "loading" | "locked" | "gate" | "open";
const UNLOCK_KEY = "bday-unlocked";

function wasUnlocked() {
  try {
    return sessionStorage.getItem(UNLOCK_KEY) === "1";
  } catch {
    return false;
  }
}

export function Experience() {
  const [stage, setStage] = useState<Stage>("loading");
  const [showMain, setShowMain] = useState(false);

  // Loader: wait for fonts (so nothing reflows) with a short cinematic minimum.
  useEffect(() => {
    const min = new Promise((r) => setTimeout(r, 1600));
    const fonts = document.fonts?.ready ?? Promise.resolve();
    Promise.all([min, fonts]).then(() => setStage(content.password.enabled && !wasUnlocked() ? "locked" : "gate"));
  }, []);

  useEffect(() => {
    document.body.classList.toggle("locked", stage !== "open");
  }, [stage]);

  const unlock = useCallback(() => {
    try {
      sessionStorage.setItem(UNLOCK_KEY, "1");
    } catch {}
    setStage("gate");
  }, []);

  const open = useCallback(() => {
    window.scrollTo(0, 0);
    setShowMain(true);
    setStage("open");
  }, []);

  const replay = useCallback(() => {
    setStage("gate");
    window.setTimeout(() => {
      window.scrollTo(0, 0);
      setShowMain(false);
    }, 900);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <MusicProvider>
        <SmoothScroll enabled={stage === "open"}>
          <AnimatePresence mode="wait">
            {stage === "loading" && <Loader key="loader" />}
            {stage === "locked" && <PasswordGate key="password" onUnlock={unlock} />}
            {stage === "gate" && <IntroGate key="gate" onOpen={open} />}
          </AnimatePresence>

          {showMain && (
            <main>
              <Surprise />
              <Hero />
              <Timeline />
              <Gallery />
              <Reasons />
              <DaysTogether />
              <LoveLetter />
              <Cake />
              <FinalScreen onReplay={replay} />
            </main>
          )}

          <MusicPlayer />
          <CustomCursor />
        </SmoothScroll>
      </MusicProvider>
    </MotionConfig>
  );
}
