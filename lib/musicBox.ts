"use client";

/**
 * A gentle, generative music-box / soft-piano loop built with the Web Audio API.
 * Used only as a fallback when no song file is present in /public/music, so the
 * site always has romantic music without shipping a copyrighted track.
 */

// Imaj7 – vi7 – IVmaj7 – V(sus) in D major, voiced as MIDI notes.
const PROGRESSION: number[][] = [
  [50, 57, 61, 64, 66, 69], // Dmaj7(add9-ish)
  [47, 54, 57, 62, 66, 69], // Bm7
  [43, 50, 54, 57, 62, 66], // Gmaj7
  [45, 52, 57, 61, 64, 69], // A
];
const MELODY: (number | null)[][] = [
  [78, null, 76, 74, 76, null, 69, null],
  [74, null, 73, 71, 73, null, 66, null],
  [71, null, 73, 74, 78, null, 76, 74],
  [73, null, 71, 69, 76, null, null, null],
];

const midiToHz = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

export class MusicBox {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private timer: number | null = null;
  private nextTime = 0;
  private step = 0;
  private readonly beat = 0.42; // seconds per eighth note (~71 bpm quarter)
  private volume: number;

  constructor(volume = 0.5) {
    this.volume = volume;
  }

  private ensure() {
    if (this.ctx) return;
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctor();
    const master = ctx.createGain();
    master.gain.value = 0;

    // Soft low-pass + synthetic hall reverb for warmth.
    const tone = ctx.createBiquadFilter();
    tone.type = "lowpass";
    tone.frequency.value = 3200;

    const reverb = ctx.createConvolver();
    reverb.buffer = this.impulse(ctx, 3.2, 2.4);
    const wet = ctx.createGain();
    wet.gain.value = 0.45;

    master.connect(tone);
    tone.connect(ctx.destination);
    tone.connect(reverb);
    reverb.connect(wet);
    wet.connect(ctx.destination);

    this.ctx = ctx;
    this.master = master;
  }

  private impulse(ctx: AudioContext, seconds: number, decay: number) {
    const rate = ctx.sampleRate;
    const length = Math.floor(rate * seconds);
    const buffer = ctx.createBuffer(2, length, rate);
    for (let c = 0; c < 2; c++) {
      const data = buffer.getChannelData(c);
      for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
    return buffer;
  }

  /** Bell-like piano tone: sine fundamental + soft harmonics with a long decay. */
  private note(midi: number, time: number, gain: number, length: number) {
    const ctx = this.ctx!;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, time);
    env.gain.exponentialRampToValueAtTime(gain, time + 0.015);
    env.gain.exponentialRampToValueAtTime(0.0001, time + length);
    env.connect(this.master!);

    const partials: [number, number, OscillatorType][] = [
      [1, 1, "sine"],
      [2, 0.28, "sine"],
      [3, 0.08, "triangle"],
    ];
    for (const [mult, amp, type] of partials) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;
      osc.frequency.value = midiToHz(midi) * mult;
      g.gain.value = amp;
      osc.connect(g);
      g.connect(env);
      osc.start(time);
      osc.stop(time + length + 0.05);
    }
  }

  private schedule = () => {
    const ctx = this.ctx!;
    while (this.nextTime < ctx.currentTime + 0.6) {
      const bar = Math.floor(this.step / 8) % PROGRESSION.length;
      const pos = this.step % 8;
      const chord = PROGRESSION[bar];
      const t = this.nextTime;

      if (pos === 0) this.note(chord[0] - 12, t, 0.16, 4.2); // bass
      // Rolling arpeggio.
      const arp = [1, 2, 3, 4, 5, 4, 3, 2][pos];
      this.note(chord[arp], t, 0.07, 2.4);
      // Melody enters after the first cycle.
      const cycle = Math.floor(this.step / (8 * PROGRESSION.length));
      const m = MELODY[bar][pos];
      if (cycle % 2 === 1 && m) this.note(m, t + 0.01, 0.1, 2.8);

      this.nextTime += this.beat;
      this.step++;
    }
  };

  async play() {
    this.ensure();
    const ctx = this.ctx!;
    if (ctx.state === "suspended") await ctx.resume();
    if (this.timer === null) {
      this.nextTime = Math.max(this.nextTime, ctx.currentTime + 0.1);
      this.timer = window.setInterval(this.schedule, 150);
      this.schedule();
    }
    this.fadeTo(this.volume, 1.8);
  }

  pause() {
    if (!this.ctx) return;
    this.fadeTo(0, 0.6);
    const ctx = this.ctx;
    window.setTimeout(() => {
      if (this.timer !== null) {
        window.clearInterval(this.timer);
        this.timer = null;
      }
      ctx.suspend();
    }, 650);
  }

  setMuted(muted: boolean) {
    if (!this.ctx) return;
    this.fadeTo(muted ? 0 : this.volume, 0.3);
  }

  private fadeTo(value: number, seconds: number) {
    const g = this.master!.gain;
    const now = this.ctx!.currentTime;
    g.cancelScheduledValues(now);
    g.setValueAtTime(g.value, now);
    g.linearRampToValueAtTime(value, now + seconds);
  }
}
