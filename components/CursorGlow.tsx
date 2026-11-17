"use client";

// A soft green light that follows the cursor with inertia and screen-blends over
// the scene, so hovering gently illuminates the part of the world under the mouse.
// Fades in on movement, out when the pointer leaves. Purely additive, no layout.

import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let vis = 0;
    let tvis = 0;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      tvis = 1;
    };
    const onLeave = () => {
      tvis = 0;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    const loop = () => {
      raf = requestAnimationFrame(loop);
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      vis += (tvis - vis) * 0.06;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      el.style.opacity = String(vis * 0.6);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[5]"
      style={{
        width: "44vmax",
        height: "44vmax",
        marginLeft: "-22vmax",
        marginTop: "-22vmax",
        background:
          "radial-gradient(circle, rgba(140,210,90,0.15) 0%, rgba(90,150,55,0.06) 32%, rgba(0,0,0,0) 62%)",
        mixBlendMode: "screen",
        opacity: 0,
        willChange: "transform, opacity",
      }}
    />
  );
}
