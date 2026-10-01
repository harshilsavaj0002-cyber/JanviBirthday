"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { content } from "@/data/content";
import { MusicBox } from "@/lib/musicBox";

type MusicState = {
  started: boolean;
  playing: boolean;
  muted: boolean;
  /** Must be called from a user gesture (tap) — browsers block autoplay otherwise. */
  start: () => void;
  toggle: () => void;
  toggleMute: () => void;
};

const MusicContext = createContext<MusicState | null>(null);

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic must be used inside <MusicProvider>");
  return ctx;
}

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const boxRef = useRef<MusicBox | null>(null);
  const useFallback = useRef(false);
  const fadeRef = useRef<number | null>(null);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  const volume = content.music.volume;

  const fadeAudio = useCallback((audio: HTMLAudioElement, to: number, ms: number, done?: () => void) => {
    if (fadeRef.current) window.clearInterval(fadeRef.current);
    const from = audio.volume;
    const t0 = performance.now();
    fadeRef.current = window.setInterval(() => {
      const k = Math.min(1, (performance.now() - t0) / ms);
      audio.volume = from + (to - from) * k;
      if (k >= 1) {
        window.clearInterval(fadeRef.current!);
        fadeRef.current = null;
        done?.();
      }
    }, 30);
  }, []);

  const playFallback = useCallback(() => {
    useFallback.current = true;
    boxRef.current ??= new MusicBox(volume);
    boxRef.current.play().catch(() => {});
    setPlaying(true);
  }, [volume]);

  const play = useCallback(() => {
    if (useFallback.current || !content.music.src) return playFallback();
    const audio = (audioRef.current ??= new Audio(content.music.src));
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0;
    audio.addEventListener("error", playFallback, { once: true });
    audio
      .play()
      .then(() => {
        setPlaying(true);
        fadeAudio(audio, volume, 2000);
      })
      .catch(playFallback);
  }, [fadeAudio, playFallback, volume]);

  const pause = useCallback(() => {
    setPlaying(false);
    if (useFallback.current) return boxRef.current?.pause();
    const audio = audioRef.current;
    if (audio) fadeAudio(audio, 0, 600, () => audio.pause());
  }, [fadeAudio]);

  const start = useCallback(() => {
    if (started) return;
    setStarted(true);
    play();
  }, [play, started]);

  const toggle = useCallback(() => (playing ? pause() : play()), [pause, play, playing]);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      if (audioRef.current) audioRef.current.muted = next;
      boxRef.current?.setMuted(next);
      return next;
    });
  }, []);

  // Pause when the tab is hidden, resume on return (saves battery on phones).
  useEffect(() => {
    let wasPlaying = false;
    const onVis = () => {
      if (document.hidden) {
        wasPlaying = playing;
        if (playing) pause();
      } else if (wasPlaying) play();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [pause, play, playing]);

  const value = useMemo(
    () => ({ started, playing, muted, start, toggle, toggleMute }),
    [started, playing, muted, start, toggle, toggleMute],
  );
  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
}
