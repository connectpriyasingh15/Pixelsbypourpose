"use client";

// ─────────────────────────────────────────────────────────────────────────────
// PixelTerrain — an original interpretation of a flying-over-terrain particle
// field. A rolling wave surface of green pixels on black, seen in perspective,
// with the camera scrolling forward and the focal length breathing so the whole
// field zooms in and out. Built with Canvas 2D and our own palette.
//
// Paints one static frame immediately; animates via rAF. Throttled, pauses when
// hidden, honors reduced motion.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef } from "react";

const GX = 56; // half grid width (x from -GX..GX)
const DEPTH = 82; // depth rows
const NEAR = 6; // near clip
const CAM_H = 7; // camera height above the terrain baseline

// far → near colour (dark green to a bright yellow-green highlight)
const FAR = [10, 26, 14];
const NEAR_C = [150, 214, 96];

export default function PixelTerrain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      w = parent?.clientWidth || window.innerWidth;
      h = parent?.clientHeight || window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const waveAt = (x: number, z: number) =>
      Math.sin(x * 0.18 + z * 0.05) * 1.1 +
      Math.sin(z * 0.12) * 1.5 +
      Math.sin(x * 0.07 + z * 0.09) * 0.8;

    const draw = (t: number) => {
      ctx.fillStyle = "#08090a";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const horizon = h * 0.42;
      const zOff = t * 0.004; // fly forward
      // zoom in / out: the focal length breathes slowly
      const f = h * 0.82 * (1 + 0.26 * Math.sin(t * 0.00055));

      // ambient green glow pooled at the horizon
      const glow = ctx.createRadialGradient(cx, horizon + h * 0.12, 0, cx, horizon + h * 0.12, h * 0.6);
      glow.addColorStop(0, "rgba(70,150,70,0.18)");
      glow.addColorStop(0.5, "rgba(40,90,45,0.06)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      // far to near so nearer pixels draw on top
      for (let dz = DEPTH - 1; dz >= 0; dz--) {
        const z = NEAR + dz;
        const d = z;
        const fade = 1 - dz / DEPTH;
        const b = fade * fade; // brightness by proximity
        if (b < 0.015) continue;

        const rC = FAR[0] + (NEAR_C[0] - FAR[0]) * b;
        const gC = FAR[1] + (NEAR_C[1] - FAR[1]) * b;
        const bC = FAR[2] + (NEAR_C[2] - FAR[2]) * b;
        ctx.fillStyle = `rgb(${rC | 0},${gC | 0},${bC | 0})`;
        ctx.globalAlpha = 0.28 + b * 0.72;

        const s = Math.max(1, Math.min(3.4, (f / d) * 0.14));
        const half = s / 2;

        for (let gx = -GX; gx <= GX; gx++) {
          const y = waveAt(gx, z + zOff);
          const sx = cx + (gx / d) * f;
          if (sx < -4 || sx > w + 4) continue;
          const sy = horizon + ((CAM_H - y) / d) * f;
          if (sy < horizon - 4 || sy > h + 4) continue;
          ctx.fillRect(sx - half, sy - half, s, s);
        }
      }
      ctx.globalAlpha = 1;
    };

    draw(reduce ? 0 : 0);

    window.addEventListener("resize", resize);

    if (reduce) {
      const onResize = () => {
        resize();
        draw(0);
      };
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    let raf = 0;
    let last = 0;
    const start = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (document.hidden || now - last < 33) return;
      last = now;
      draw(now - start);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}
