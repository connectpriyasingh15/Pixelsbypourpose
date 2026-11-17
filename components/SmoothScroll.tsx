"use client";

// Lenis smooth scroll + feeds the shared scrollStore (progress, velocity, mouse)
// that drives the WebGL camera and particle flow.

import { useEffect } from "react";
import Lenis from "lenis";
import { scrollStore } from "@/lib/scrollStore";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = new Lenis({ lerp: reduce ? 1 : 0.09, smoothWheel: !reduce });

    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    lenis.on(
      "scroll",
      (e: { scroll: number; limit: number; velocity: number }) => {
        scrollStore.progress = e.limit > 0 ? e.scroll / e.limit : 0;
        scrollStore.velocity = e.velocity * 0.02;
      }
    );

    // Bleed velocity back to zero when idle so the flow eases to its base speed.
    const decay = window.setInterval(() => {
      scrollStore.velocity *= 0.85;
    }, 50);

    const onMove = (e: PointerEvent) => {
      scrollStore.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      scrollStore.mouseY = -((e.clientY / window.innerHeight) * 2 - 1);
      scrollStore.pointerActive = 1;
    };
    const onLeave = () => {
      scrollStore.pointerActive = 0;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(decay);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
