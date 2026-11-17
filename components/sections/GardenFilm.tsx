"use client";

// GardenFilm: the story's living background. A seamless bioluminescent
// garden loop (holographic hummingbird and flower, wireframe petals,
// glowing pollen) plays fixed behind the scroll story. The metaphor is
// the site's thesis made visible: the bird is the user, the flower is
// the experience, and every glowing particle is one small design
// decision.
//
// The film is alive to the reader in two ways:
//   1. Scroll dives. As the story descends, the film slowly zooms
//      from 1.08x to ~1.3x, so the whole page reads as one continuous
//      dive into the flower.
//   2. Mouse parallax. The frame leans gently away from the cursor,
//      lerped every frame, so the garden sits on its own depth plane
//      behind the type.
//
// Two veils sit over the film so the type always reads: a soft dark
// pocket at screen center (where the shots land) and an edge vignette
// so the frame dissolves into the page instead of ending on it.

import { useEffect, useRef } from "react";

export default function GardenFilm() {
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const mouse = { x: 0, y: 0, lx: 0, ly: 0 };
    let progress = 0;
    let raf = 0;

    const onMouse = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const tick = () => {
      raf = requestAnimationFrame(tick);
      mouse.lx += (mouse.x - mouse.lx) * 0.045;
      mouse.ly += (mouse.y - mouse.ly) * 0.045;
      // Base 1.08x hides the parallax travel; the dive adds up to +0.24x.
      const scale = 1.08 + 0.24 * progress;
      const tx = -mouse.lx * 22;
      const ty = -mouse.ly * 14;
      frame.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(
        2
      )}px, 0) scale(${scale.toFixed(4)})`;
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#030303]">
      <div ref={frameRef} className="absolute inset-0 will-change-transform">
        <video
          className="h-full w-full object-cover"
          src="/story-garden.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      </div>
      {/* center text pocket */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 52% at 50% 50%, rgba(3,3,3,0.62) 0%, rgba(3,3,3,0.34) 55%, rgba(3,3,3,0) 100%)",
        }}
      />
      {/* edge vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 85% 80% at 50% 50%, rgba(3,3,3,0) 45%, rgba(3,3,3,0.78) 100%)",
        }}
      />
    </div>
  );
}
