"use client";

// ─────────────────────────────────────────────────────────────────────────────
// PixelPortrait — a portrait that develops out of the void.
//
// The image is sampled into a grid of beads. Each bead starts scattered in the
// dark, then blooms from the center outward, igniting forest-green as it lands
// and resolving to its true color. "Pixels finding their purpose": complexity
// becoming a face. Move the cursor and the beads ripple away and reform; click
// to re-develop.
//
// Canvas-based, throttled, honors prefers-reduced-motion. Renders a static final
// frame when the tab is hidden so it is never blank (and animates on focus).
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef } from "react";

const FOREST: [number, number, number] = [62, 155, 114];

const CELL_TARGET = 7; // target bead size in CSS px
const SPREAD = 1150; // ms range over which beads begin to land
const DUR = 850; // ms for a single bead to land
const HOVER_RADIUS = 130; // px
const HOVER_PUSH = 26; // px max displacement

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);

export default function PixelPortrait({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let dispW = 0;
    let dispH = 0;
    let bead = 6;
    let n = 0;
    let TX = new Float32Array(0);
    let TY = new Float32Array(0);
    let OX = new Float32Array(0);
    let OY = new Float32Array(0);
    let DL = new Float32Array(0);
    let CR = new Uint8Array(0);
    let CG = new Uint8Array(0);
    let CB = new Uint8Array(0);
    let CDX = new Float32Array(0);
    let CDY = new Float32Array(0);

    let raf = 0;
    let started = false;
    let startTime = 0;
    let lastDraw = 0;

    // Pointer, in canvas-local CSS px. Off-canvas by default.
    let mx = -9999;
    let my = -9999;

    const img = new Image();

    // Deterministic pseudo-random so the scatter is stable across renders.
    const rand = (seed: number) => {
      const s = Math.sin(seed * 12.9898) * 43758.5453;
      return s - Math.floor(s);
    };

    const build = () => {
      const parentWidth = canvas.parentElement?.clientWidth || 480;
      dispW = Math.min(parentWidth, 560);
      const aspect = img.height / img.width;
      dispH = dispW * aspect;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.style.width = dispW + "px";
      canvas.style.height = dispH + "px";
      canvas.width = Math.floor(dispW * dpr);
      canvas.height = Math.floor(dispH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cols = Math.max(1, Math.round(dispW / CELL_TARGET));
      const rows = Math.max(1, Math.round(dispH / CELL_TARGET));
      const cellW = dispW / cols;
      const cellH = dispH / rows;
      bead = Math.min(cellW, cellH) * 0.82;

      // Sample the image down to the grid.
      const off = document.createElement("canvas");
      off.width = cols;
      off.height = rows;
      const octx = off.getContext("2d");
      if (!octx) return;
      octx.drawImage(img, 0, 0, cols, rows);
      const data = octx.getImageData(0, 0, cols, rows).data;

      const cx = dispW / 2;
      const cy = dispH / 2;
      const maxD = Math.hypot(cx, cy) || 1;

      // Collect active beads (skip near-black background so she emerges cleanly).
      const idx: number[] = [];
      for (let gy = 0; gy < rows; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          const p = (gy * cols + gx) * 4;
          const r = data[p];
          const g = data[p + 1];
          const b = data[p + 2];
          const luma = 0.299 * r + 0.587 * g + 0.114 * b;
          if (luma < 14) continue;
          idx.push(gx, gy, r, g, b);
        }
      }

      n = idx.length / 5;
      TX = new Float32Array(n);
      TY = new Float32Array(n);
      OX = new Float32Array(n);
      OY = new Float32Array(n);
      DL = new Float32Array(n);
      CR = new Uint8Array(n);
      CG = new Uint8Array(n);
      CB = new Uint8Array(n);
      CDX = new Float32Array(n);
      CDY = new Float32Array(n);

      for (let i = 0; i < n; i++) {
        const gx = idx[i * 5];
        const gy = idx[i * 5 + 1];
        CR[i] = idx[i * 5 + 2];
        CG[i] = idx[i * 5 + 3];
        CB[i] = idx[i * 5 + 4];
        const tx = (gx + 0.5) * cellW;
        const ty = (gy + 0.5) * cellH;
        TX[i] = tx;
        TY[i] = ty;

        // Scatter: each bead starts offset in a random direction.
        const ang = rand(i + 1) * Math.PI * 2;
        const mag = 14 + rand(i + 7) * 70;
        OX[i] = Math.cos(ang) * mag;
        OY[i] = Math.sin(ang) * mag;

        // Bloom from the center outward, with texture.
        const dNorm = Math.hypot(tx - cx, ty - cy) / maxD;
        DL[i] = dNorm * SPREAD * 0.72 + rand(i + 3) * SPREAD * 0.28;
      }
    };

    // Draw one frame. `t` is elapsed ms since assemble start; pass Infinity for
    // the fully-resolved static portrait.
    const draw = (t: number, interactive: boolean) => {
      ctx.clearRect(0, 0, dispW, dispH);
      const r2 = HOVER_RADIUS * HOVER_RADIUS;
      const half = bead / 2;

      for (let i = 0; i < n; i++) {
        const L = clamp01((t - DL[i]) / DUR);
        if (L <= 0) continue;
        const e = easeOut(L);

        let px = TX[i] - OX[i] * (1 - e);
        let py = TY[i] - OY[i] * (1 - e);

        // Cursor ripple, only on landed beads.
        if (interactive && e > 0.6) {
          const dx = TX[i] - mx;
          const dy = TY[i] - my;
          const d2 = dx * dx + dy * dy;
          let wantX = 0;
          let wantY = 0;
          if (d2 < r2 && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const f = 1 - d / HOVER_RADIUS;
            const push = f * f * HOVER_PUSH;
            wantX = (dx / d) * push;
            wantY = (dy / d) * push;
          }
          CDX[i] += (wantX - CDX[i]) * 0.16;
          CDY[i] += (wantY - CDY[i]) * 0.16;
          px += CDX[i];
          py += CDY[i];
        }

        // Ignite forest-green mid-flight, resolve to true color as it lands.
        const glow = Math.sin(clamp01(L) * Math.PI) * 0.55;
        const r = CR[i] + (FOREST[0] - CR[i]) * glow;
        const g = CG[i] + (FOREST[1] - CG[i]) * glow;
        const b = CB[i] + (FOREST[2] - CB[i]) * glow;

        const s = (0.35 + 0.65 * e) * bead;
        ctx.globalAlpha = e;
        ctx.fillStyle = `rgb(${r | 0},${g | 0},${b | 0})`;
        ctx.fillRect(px - half, py - half, s, s);
      }
      ctx.globalAlpha = 1;
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - lastDraw < 28) return; // ~35fps
      lastDraw = now;
      draw(now - startTime, true);
    };

    const startAnim = () => {
      if (started || reduce) return;
      started = true;
      startTime = performance.now();
      lastDraw = 0;
      raf = requestAnimationFrame(loop);
    };

    const onPointerMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
    };
    const onPointerLeave = () => {
      mx = -9999;
      my = -9999;
    };
    const onClick = () => {
      if (reduce) return;
      started = true;
      startTime = performance.now();
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const onVisible = () => {
      if (!document.hidden) {
        document.removeEventListener("visibilitychange", onVisible);
        startAnim();
      }
    };

    let ready = false;
    const setup = () => {
      if (ready) return;
      build();
      ready = true;

      canvas.addEventListener("pointermove", onPointerMove, { passive: true });
      canvas.addEventListener("pointerleave", onPointerLeave, { passive: true });
      canvas.addEventListener("click", onClick);

      if (reduce) {
        draw(Infinity, false);
        return;
      }
      if (document.hidden) {
        // Baseline for background tabs / non-animating previews.
        draw(Infinity, false);
        document.addEventListener("visibilitychange", onVisible);
      } else {
        startAnim();
      }
    };

    if (img.complete && img.naturalWidth) {
      img.decode?.().then(setup).catch(setup);
      if (!ready) setTimeout(() => !ready && setup(), 0);
    } else {
      img.onload = setup;
    }
    img.src = src;

    const onResize = () => {
      if (!ready) return;
      build();
      if (started) draw(performance.now() - startTime, true);
      else draw(Infinity, false);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisible);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("click", onClick);
    };
  }, [src]);

  return (
    <canvas
      ref={canvasRef}
      aria-label="Portrait of Priya Singh, rendered as pixels"
      role="img"
      className={className}
      style={{ display: "block", cursor: "crosshair" }}
    />
  );
}
