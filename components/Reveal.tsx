"use client";

// Reveal — content emerges from black as it enters the frame. The scroll is the
// edit.
//
// Progressive enhancement: the content renders fully visible by default, so it
// is never gated behind JS (if scripts are disabled, slow, or a tab is
// suspended, the content is simply there). When motion is allowed, a layout
// effect hides it before the browser paints (no flash) and a requestAnimationFrame
// tween brings it in as it enters view. Honors prefers-reduced-motion.

import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export default function Reveal({
  children,
  delay = 0,
  y = 22,
  duration = 850,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Hide before paint so there is no flash of the final state.
    el.style.opacity = "0";
    el.style.transform = `translateY(${y}px)`;
    el.style.willChange = "opacity, transform";

    let done = false;
    let tweenRaf = 0;
    let initRaf = 0;
    let delayTimer: ReturnType<typeof setTimeout> | undefined;
    let safety: ReturnType<typeof setTimeout> | undefined;

    const showInstant = () => {
      el.style.opacity = "1";
      el.style.transform = "none";
    };

    const tween = () => {
      let startT = 0;
      const tick = (now: number) => {
        if (!startT) startT = now;
        const p = Math.min(1, (now - startT) / duration);
        const e = easeOut(p);
        el.style.opacity = String(e);
        el.style.transform = `translateY(${(1 - e) * y}px)`;
        if (p < 1) tweenRaf = requestAnimationFrame(tick);
      };
      tweenRaf = requestAnimationFrame(tick);
    };

    const cleanupListeners = () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
      document.removeEventListener("visibilitychange", check);
    };

    const trigger = (animated: boolean) => {
      if (done) return;
      done = true;
      cleanupListeners();
      if (!animated) showInstant();
      else if (delay > 0) delayTimer = setTimeout(tween, delay * 1000);
      else tween();
    };

    function check() {
      if (done) return;
      const r = el!.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.9 && r.bottom > 0) trigger(true);
    }

    initRaf = requestAnimationFrame(check);
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    document.addEventListener("visibilitychange", check);

    // Safety net: never leave content hidden if the rAF path is starved (e.g. a
    // background tab). Reveals in-view content instantly after a short wait.
    safety = setTimeout(() => {
      if (done) return;
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) trigger(false);
    }, 1600 + delay * 1000);

    return () => {
      cancelAnimationFrame(initRaf);
      cancelAnimationFrame(tweenRaf);
      if (delayTimer) clearTimeout(delayTimer);
      if (safety) clearTimeout(safety);
      cleanupListeners();
    };
  }, [delay, duration, y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
