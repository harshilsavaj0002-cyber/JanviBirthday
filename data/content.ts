/**
 * ─────────────────────────────────────────────────────────────
 *  EVERYTHING PERSONAL LIVES HERE.
 *  Edit names, dates, photos, reasons and the letter in this file —
 *  no other file needs to change.
 * ─────────────────────────────────────────────────────────────
 *
 *  Dates use DD-MM-YYYY (e.g. "02-10-2026" = 2 October 2026) and are
 *  read in the viewer's local time zone.
 *
 *  Photos live in /public/photos. To swap one, drop a new file there, set
 *  `src: "/photos/your-file.jpg"` and update width/height to its real pixel
 *  size (only the ratio matters). `focus` (optional, CSS object-position like
 *  "50% 30%") keeps faces in frame where a photo gets cropped.
 */

export type Photo = {
  src: string;
  alt: string;
  caption?: string;
  /** Intrinsic size, used to reserve space and avoid layout shift. */
  width: number;
  height: number;
  /** Where to keep in frame when cropped — CSS object-position, e.g. "50% 30%". */
  focus?: string;
};

export type TimelineMoment = {
  date: string;
  title: string;
  text: string;
  photo: Photo;
};

export const content = {
  her: {
    name: "Janvi",
    nickname: "Tamuu",
  },
  me: {
    name: "Butter",
  },

  /** Her birthday — DD-MM-YYYY. The countdown runs until midnight of this day. */
  birthday: "03-10-2026",

  /** The day you met — DD-MM-YYYY. Powers the "Days Together" counter. */
  metOn: "14-12-2025",

  /** Optional lock screen (turned off — the site opens straight to the envelope). Set `enabled: true` to bring it back. */
  password: {
    enabled: false,
    prompt: "Only one person knows the key to this door…",
    hint: "Your birthday · DDMMYYYY",
    /** Digits only, compared after stripping spaces, dashes, slashes and dots. */
    accepted: ["03102026", "0310", "3102026", "310"],
  },

  music: {
    /**
     * Leave empty ("") to play the built-in soft music-box melody (generated live,
     * nothing to download). To use your own song, drop an .mp3 into /public/music
     * and set e.g. src: "/music/song.mp3". If that file can't load, the built-in
     * melody plays instead.
     */
    src: "",
    title: "Our Song",
    artist: "for Tamuu",
    volume: 0.55,
  },

  intro: {
    line: "Something special is waiting for you,",
    cta: "Tap to open",
  },

  countdown: {
    eyebrow: "Until the most beautiful day of the year",
    subline: "Every second is a step closer to celebrating you.",
  },

  birthdayWish: {
    eyebrow: "Today the world got a little brighter",
    subline: "Happy birthday to the girl who turned my ordinary days into poetry.",
  },

  hero: {
    eyebrow: "A little universe made for",
    tagline: "You are my favourite place to be.",
    photo: {
      src: "/photos/golden-hour.jpg",
      alt: "Us at golden hour",
      width: 1500,
      height: 2000,
      focus: "50% 40%",
    } satisfies Photo,
  },

  timeline: [
    {
      date: "14 Dec 2025",
      title: "The day we met",
      text: "One ordinary afternoon quietly became the first page of my favourite story.",
      photo: { src: "/photos/story-met.jpg", alt: "The day we met", width: 1124, height: 2000, focus: "50% 45%" },
    },
    {
      date: "Our first date",
      title: "Coffee that went cold",
      text: "We talked so long the coffee went cold and neither of us noticed. I think that was the moment.",
      photo: { src: "/photos/story-coffee.jpg", alt: "Our first date", width: 1500, height: 2000, focus: "50% 20%" },
    },
    {
      date: "The first 'I love you'",
      title: "Three little words",
      text: "Said a little nervously, meant with my whole heart — and every day since.",
      photo: { src: "/photos/story-iloveyou.jpg", alt: "First I love you", width: 1177, height: 2000, focus: "50% 35%" },
    },
    {
      date: "Our first trip",
      title: "Somewhere new, together",
      text: "Wrong turns, late trains, the best sunset. Home turned out to be wherever you were.",
      photo: { src: "/photos/story-trip.jpg", alt: "Our first trip", width: 1500, height: 2000, focus: "50% 40%" },
    },
    {
      date: "Today",
      title: "Still falling",
      text: "Every chapter with you is my favourite one — and this one is all about you.",
      photo: { src: "/photos/story-today.jpg", alt: "Us today", width: 1125, height: 2000, focus: "50% 35%" },
    },
  ] satisfies TimelineMoment[],

  gallery: [
    { src: "/photos/that-smile.jpg", alt: "That smile", caption: "That smile ♡", width: 1516, height: 2000 },
    { src: "/photos/golden-hour.jpg", alt: "Golden hour", caption: "Golden hour", width: 1500, height: 2000 },
    { src: "/photos/us-always.jpg", alt: "Us, always", caption: "Us, always", width: 1125, height: 2000 },
    { src: "/photos/silly-faces.jpg", alt: "Silly faces", caption: "Silly faces", width: 1500, height: 2000 },
    { src: "/photos/sunday-mornings.jpg", alt: "Sunday mornings", caption: "Sunday mornings", width: 1126, height: 2000 },
    { src: "/photos/long-drives.jpg", alt: "Long drives", caption: "Long drives", width: 1125, height: 2000 },
    { src: "/photos/favourite-view.jpg", alt: "My favourite view", caption: "My favourite view", width: 809, height: 1371 },
    { src: "/photos/dessert-first.jpg", alt: "Dessert first", caption: "Dessert first", width: 1126, height: 2000 },
    { src: "/photos/forever-this.jpg", alt: "Forever this", caption: "Forever this", width: 1125, height: 2000 },
  ] satisfies Photo[],

  reasons: [
    "The way your eyes crinkle when you really laugh.",
    "You make even grocery runs feel like an adventure.",
    "Your kindness — to strangers, to animals, to me on my worst days.",
    "How you say my name like it's something precious.",
    "You remember the tiniest details I forget I ever told you.",
    "Your terrible jokes that somehow always make me laugh.",
    "You believe in me more than I believe in myself.",
    "The calm I feel the moment I hear your voice.",
    "You dance like nobody is watching — even when I am.",
    "Your stubborn, beautiful, fearless heart.",
    "You turned 'me' into 'us' without me even noticing.",
    "Because every future I imagine has you in it.",
    "You are my best friend and my favourite person.",
    "Simply because you're you, Tamuu.",
  ],

  daysTogether: {
    eyebrow: "Every moment counts",
    title: "Since the day we met",
    /** Shown if `metOn` is still in the future. */
    futureTitle: "Until the day we meet",
  },

  letter: {
    greeting: "My dearest Tamuu,",
    paragraphs: [
      "Happy birthday, my love. I wanted to give you something you could keep — not a thing that sits on a shelf, but a little corner of the internet that belongs only to you.",
      "Thank you for your laugh, your patience, your warmth, and the million small ways you make my life softer and brighter. You make me want to be better, every single day.",
      "Whatever this new year brings, I hope you feel as loved as you are. I'll be right here — cheering the loudest, holding your hand, and falling for you all over again.",
    ],
    signoff: "Forever and always,",
  },

  cake: {
    candles: 5,
    prompt: "Close your eyes, make a wish…",
    /** The candles blow out automatically after counting down from this number. */
    countdownFrom: 3,
    afterWish: "Your wish is on its way to the stars ✨",
  },

  finale: {
    line: "Forever Yours,",
    note: "Thank you for being my today, my tomorrow and all my forevers.",
    replay: "Replay our story",
  },

  meta: {
    title: "For Janvi ♡ — Happy Birthday",
    description: "A little universe made just for you, Tamuu. Open it with love.",
  },
};

export type Content = typeof content;
