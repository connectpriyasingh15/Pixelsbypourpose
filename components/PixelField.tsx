"use client";

// ─────────────────────────────────────────────────────────────────────────────
// PixelField — the signature interaction.
//
// A field of pixels living in the dark (film grain). They stay almost invisible
// at rest, then sharpen and take the one forest-green light toward the cursor:
// "the frame sharpening where you look." Pixels finding their purpose.
//
// Devices, per the concept:
//   · Develop-in on load        → complexity resolving into clarity (perfection)
//   · Focus glow at the cursor  → attention gives pixels purpose
//   · Idle drift when the mouse  → the frame searches on its own (curiosity)
//     is still or absent
//
// Canvas-based for performance, throttled to ~30fps, and paused when the tab is
// hidden. Fully degrades under prefers-reduced-motion.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef } from "react";

const NIGHT: [number, number, number] = [8, 9, 10];
const MIST: [number, number, number] = [232, 232, 227];
const FOREST: [number, number, number] = [62, 155, 114];

const CELL = 16; // grid cell size in CSS px
const GAP = 1; // gap between squares so they read as pixels
const RADIUS = 175; // cursor focus radius in px

const clamp = (v: number) => (v < 0 ? 0 : v > 255 ? 255 : v);

export default function PixelField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    let grain = new Float32Array(0);
    let dpr = 1;

    const sq = CELL - GAP;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / CELL) + 1;
      rows = Math.ceil(h / CELL) + 1;
      grain = new Float32Array(cols * rows);
      for (let i = 0; i < grain.length; i++) grain[i] = Math.random();
    };
    resize();

    // Reduced motion: a single faint static frame, no loop, no cursor reactivity.
    if (reduced) {
      ctx.fillStyle = `rgb(${NIGHT[0]},${NIGHT[1]},${NIGHT[2]})`;
      ctx.fillRect(0, 0, w, h);
      for (let gy = 0; gy < rows; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          const g = grain[gy * cols + gx];
          const b = 0.02 + g * 0.03;
          if (b < 0.03) continue;
          ctx.fillStyle = `rgb(${clamp(NIGHT[0] + MIST[0] * b * 0.6) | 0},${
            clamp(NIGHT[1] + MIST[1] * b * 0.6) | 0
          },${clamp(NIGHT[2] + MIST[2] * b * 0.6) | 0})`;
          ctx.fillRect(gx * CELL, gy * CELL, sq, sq);
        }
      }
      const onResize = () => {
        resize();
        ctx.fillStyle = `rgb(${NIGHT[0]},${NIGHT[1]},${NIGHT[2]})`;
        ctx.fillRect(0, 0, w, h);
      };
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    // Pointer + smoothed focus point.
    let mx = w / 2;
    let my = h * 0.42;
    let tx = mx;
    let ty = my;
    let lastMove = performance.now();
    let seenPointer = false;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      lastMove = performance.now();
      seenPointer = true;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", resize);

    const start = performance.now();
    let raf = 0;
    let lastDraw = 0;

    const render = (now: number) => {
      // Develop-in: a global glow that recedes over the first ~1.6s.
      const intro = Math.min(1, (now - start) / 1600);
      const introEase = 1 - Math.pow(1 - intro, 3);
      const introGlow = (1 - introEase) * 0.55;

      // Idle drift: with no recent pointer, the focus point wanders, searching.
      if (!seenPointer || now - lastMove > 2400) {
        const t = now * 0.00016;
        tx = w * (0.5 + 0.34 * Math.sin(t) * Math.cos(t * 0.5));
        ty = h * (0.42 + 0.28 * Math.sin(t * 0.9));
      }
      mx += (tx - mx) * 0.08;
      my += (ty - my) * 0.08;

      ctx.fillStyle = `rgb(${NIGHT[0]},${NIGHT[1]},${NIGHT[2]})`;
      ctx.fillRect(0, 0, w, h);

      const r2 = RADIUS * RADIUS;
      const tsec = now * 0.001;

      for (let gy = 0; gy < rows; gy++) {
        const py = gy * CELL;
        const cy = py + sq / 2;
        for (let gx = 0; gx < cols; gx++) {
          const g = grain[gy * cols + gx];
          const px = gx * CELL;
          const cx = px + sq / 2;

          // Faint living grain, gently twinkling.
          const twinkle = 0.5 + 0.5 * Math.sin(tsec * 1.1 + g * 40);
          const mistAmt = 0.015 + g * 0.022 + twinkle * 0.012 + introGlow * g;

          // Forest focus toward the cursor.
          const dx = cx - mx;
          const dy = cy - my;
          const d2 = dx * dx + dy * dy;
          let focus = 0;
          if (d2 < r2) {
            const f = 1 - Math.sqrt(d2) / RADIUS;
            focus = f * f;
          }

          if (mistAmt + focus < 0.05) continue;

          const rC = clamp(NIGHT[0] + MIST[0] * mistAmt * 0.6 + FOREST[0] * focus);
          const gC = clamp(NIGHT[1] + MIST[1] * mistAmt * 0.6 + FOREST[1] * focus);
          const bC = clamp(NIGHT[2] + MIST[2] * mistAmt * 0.6 + FOREST[2] * focus);

          ctx.fillStyle = `rgb(${rC | 0},${gC | 0},${bC | 0})`;
          ctx.fillRect(px, py, sq, sq);
        }
      }
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      // Throttle to ~30fps and pause when hidden, so the loop never monopolizes
      // the main thread.
      if (document.hidden || now - lastDraw < 33) return;
      lastDraw = now;
      render(now);
    };

    // Paint one frame immediately so the field is present even before the loop
    // ticks (and even if the tab starts hidden).
    render(start);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
