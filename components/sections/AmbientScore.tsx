"use client";

// AmbientScore: a generative classical underscore, composed in code.
// A tanpura-style drone on D (two soft sawtooth strings and a low
// sine, breathing slowly) under a sparse alap melody that wanders
// Raga Yaman by random walk: triangle plucks with long decays,
// spaced out through an echoing delay, and a low temple bell about
// every half minute. No audio file, no loop point, never the same
// twice. Browsers require a gesture to start sound, so it lives
// behind a quiet toggle in the corner.

import { useEffect, useRef, useState } from "react";

// Raga Yaman on D: D E F# G# A B C#, across one octave and a fifth.
const SCALE = [293.66, 329.63, 369.99, 415.3, 440.0, 493.88, 554.37, 587.33];

export default function AmbientScore() {
  const [on, setOn] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const stop = () => {
    const ctx = ctxRef.current;
    const master = masterRef.current;
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (ctx && master) {
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.2);
      const t = setTimeout(() => ctx.suspend(), 1400);
      timersRef.current.push(t);
    }
  };

  const start = () => {
    let ctx = ctxRef.current;
    if (!ctx) {
      ctx = new AudioContext();
      ctxRef.current = ctx;

      const master = ctx.createGain();
      master.gain.value = 0;
      masterRef.current = master;

      const soften = ctx.createBiquadFilter();
      soften.type = "lowpass";
      soften.frequency.value = 2600;
      master.connect(soften);
      soften.connect(ctx.destination);

      // the echo room
      const delay = ctx.createDelay(2);
      delay.delayTime.value = 0.52;
      const feedback = ctx.createGain();
      feedback.gain.value = 0.34;
      const wet = ctx.createGain();
      wet.gain.value = 0.32;
      delay.connect(feedback);
      feedback.connect(delay);
      delay.connect(wet);
      wet.connect(master);

      // the tanpura: two strings and a low sine, breathing
      const droneBus = ctx.createGain();
      droneBus.gain.value = 0.055;
      const droneLp = ctx.createBiquadFilter();
      droneLp.type = "lowpass";
      droneLp.frequency.value = 520;
      droneBus.connect(droneLp);
      droneLp.connect(master);
      for (const [freq, g] of [
        [73.42, 0.9],
        [110.0, 0.55],
        [146.83, 0.35],
      ] as const) {
        const o = ctx.createOscillator();
        o.type = "sawtooth";
        o.frequency.value = freq;
        const og = ctx.createGain();
        og.gain.value = g;
        o.connect(og);
        og.connect(droneBus);
        o.start();
      }
      const breath = ctx.createOscillator();
      breath.frequency.value = 0.05;
      const breathAmt = ctx.createGain();
      breathAmt.gain.value = 0.018;
      breath.connect(breathAmt);
      breathAmt.connect(droneBus.gain);
      breath.start();

      // the alap: a sparse random walk through the raga
      let step = 3;
      const pluck = () => {
        const c = ctxRef.current;
        if (!c || c.state !== "running") return schedule(pluck, 1500);
        step = Math.max(0, Math.min(SCALE.length - 1, step + (Math.floor(Math.random() * 5) - 2)));
        const o = c.createOscillator();
        o.type = "triangle";
        o.frequency.value = SCALE[step];
        const env = c.createGain();
        env.gain.setValueAtTime(0, c.currentTime);
        env.gain.linearRampToValueAtTime(0.085, c.currentTime + 0.09);
        env.gain.exponentialRampToValueAtTime(0.0004, c.currentTime + 3.4);
        o.connect(env);
        env.connect(master!);
        env.connect(delay);
        o.start();
        o.stop(c.currentTime + 3.6);
        schedule(pluck, 2600 + Math.random() * 3200);
      };
      // the temple bell, rarely
      const bell = () => {
        const c = ctxRef.current;
        if (!c || c.state !== "running") return schedule(bell, 8000);
        const o = c.createOscillator();
        o.type = "sine";
        o.frequency.value = 146.83;
        const env = c.createGain();
        env.gain.setValueAtTime(0, c.currentTime);
        env.gain.linearRampToValueAtTime(0.07, c.currentTime + 0.02);
        env.gain.exponentialRampToValueAtTime(0.0004, c.currentTime + 6);
        o.connect(env);
        env.connect(master!);
        env.connect(delay);
        o.start();
        o.stop(c.currentTime + 6.2);
        schedule(bell, 24000 + Math.random() * 18000);
      };
      const schedule = (fn: () => void, ms: number) => {
        const t = setTimeout(fn, ms);
        timersRef.current.push(t);
      };
      schedule(pluck, 900);
      schedule(bell, 6000);
    }
    ctx.resume();
    const master = masterRef.current;
    if (master) {
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.linearRampToValueAtTime(0.16, ctx.currentTime + 1.6);
    }
  };

  const toggle = () => {
    const next = !on;
    setOn(next);
    if (next) start();
    else stop();
  };

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
      ctxRef.current?.close().catch(() => {});
    };
  }, []);

  return (
    <button
      onClick={toggle}
      aria-pressed={on}
      className="fixed bottom-5 right-6 z-40 flex items-center gap-2 font-sans text-[12px] font-medium text-white/60 transition-colors hover:text-white md:right-14"
    >
      <span
        className={`inline-block h-1.5 w-1.5 rounded-full ${
          on ? "animate-pulse bg-white/80" : "bg-white/35"
        }`}
      />
      {on ? "Sound on" : "Sound off"}
    </button>
  );
}
