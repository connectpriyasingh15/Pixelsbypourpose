"use client";

// ─────────────────────────────────────────────────────────────────────────────
// PufferfishHero — a clearly recognizable pufferfish rendered as a halftone field
// of white dots on black (the DRAGONFLY treatment). The dots stream and shimmer
// like wind, and the cursor stirs them; each dot springs back to its place.
//
// The fish is drawn once to an offscreen canvas (spiky body, eye, fins, tail,
// white spots), then sampled into dots whose size follows brightness. Paints one
// static frame immediately; animates via rAF. Throttled, reduced-motion aware.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef } from "react";

const SS = 3; // offscreen sampling step (px)
const CR = 150; // cursor stir radius

export default function PufferfishHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let D = 8; // dot spacing in screen px
    type Dot = { hx: number; hy: number; x: number; y: number; vx: number; vy: number; v: number };
    let dots: Dot[] = [];

    let mx = -9999;
    let my = -9999;

    const drawFish = (octx: CanvasRenderingContext2D, FW: number, FH: number) => {
      octx.clearRect(0, 0, FW, FH);
      const bx = FW * 0.5;
      const by = FH * 0.52;
      const rx = FW * 0.3;
      const ry = FH * 0.34;

      // spikes around the body
      octx.fillStyle = "#c6c6c6";
      const spikes = 46;
      for (let i = 0; i < spikes; i++) {
        const a = (i / spikes) * Math.PI * 2;
        const pa = a + 0.055;
        const pb = a - 0.055;
        const len = rx + 14 + Math.sin(i * 1.3) * 3;
        octx.beginPath();
        octx.moveTo(bx + Math.cos(pa) * rx * 0.98, by + Math.sin(pa) * ry * 0.98);
        octx.lineTo(bx + Math.cos(pb) * rx * 0.98, by + Math.sin(pb) * ry * 0.98);
        octx.lineTo(bx + Math.cos(a) * len, by + Math.sin(a) * (len * (ry / rx)));
        octx.closePath();
        octx.fill();
      }

      // tail
      octx.fillStyle = "#b4b4b4";
      octx.beginPath();
      octx.moveTo(bx - rx * 0.9, by);
      octx.lineTo(bx - rx * 1.55, by - ry * 0.55);
      octx.lineTo(bx - rx * 1.4, by);
      octx.lineTo(bx - rx * 1.55, by + ry * 0.55);
      octx.closePath();
      octx.fill();

      // body
      const grad = octx.createRadialGradient(bx - rx * 0.25, by - ry * 0.3, rx * 0.1, bx, by, rx * 1.15);
      grad.addColorStop(0, "#f2f2f2");
      grad.addColorStop(0.65, "#cccccc");
      grad.addColorStop(1, "#8f8f8f");
      octx.fillStyle = grad;
      octx.beginPath();
      octx.ellipse(bx, by, rx, ry, 0, 0, Math.PI * 2);
      octx.fill();

      // lighter belly
      octx.fillStyle = "rgba(255,255,255,0.28)";
      octx.beginPath();
      octx.ellipse(bx, by + ry * 0.42, rx * 0.72, ry * 0.4, 0, 0, Math.PI * 2);
      octx.fill();

      // pectoral fin
      octx.fillStyle = "rgba(205,205,205,0.9)";
      octx.beginPath();
      octx.ellipse(bx + rx * 0.12, by + ry * 0.34, rx * 0.24, ry * 0.16, -0.3, 0, Math.PI * 2);
      octx.fill();

      // beak / mouth at front
      octx.fillStyle = "#d8d8d8";
      octx.beginPath();
      octx.moveTo(bx + rx * 0.9, by + ry * 0.04);
      octx.lineTo(bx + rx * 1.12, by - ry * 0.02);
      octx.lineTo(bx + rx * 0.9, by + ry * 0.22);
      octx.closePath();
      octx.fill();

      // eye
      const ex = bx + rx * 0.5;
      const ey = by - ry * 0.26;
      octx.fillStyle = "#ffffff";
      octx.beginPath();
      octx.arc(ex, ey, ry * 0.17, 0, Math.PI * 2);
      octx.fill();
      octx.fillStyle = "#0a0a0a"; // dark pupil = no dots = reads as an eye
      octx.beginPath();
      octx.arc(ex + ry * 0.03, ey, ry * 0.085, 0, Math.PI * 2);
      octx.fill();

      // white spots
      octx.fillStyle = "#ffffff";
      const spots = [[-0.25, -0.15], [0.12, 0.12], [-0.4, 0.18], [0.02, -0.32], [0.3, 0.3], [-0.12, 0.42], [0.22, -0.1]];
      for (const [sx, sy] of spots) {
        octx.beginPath();
        octx.arc(bx + sx * rx, by + sy * ry, 4, 0, Math.PI * 2);
        octx.fill();
      }
    };

    const build = () => {
      const parent = canvas.parentElement;
      w = parent?.clientWidth || window.innerWidth;
      h = parent?.clientHeight || window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const FW = 380;
      const FH = 280;
      const off = document.createElement("canvas");
      off.width = FW;
      off.height = FH;
      const octx = off.getContext("2d");
      if (!octx) return;
      drawFish(octx, FW, FH);
      const data = octx.getImageData(0, 0, FW, FH).data;

      const displayW = Math.min(w * 0.82, 1000);
      const scale = displayW / FW;
      D = SS * scale;
      const offX = (w - FW * scale) / 2;
      const offY = (h - FH * scale) / 2 - h * 0.02;

      dots = [];
      for (let py = 0; py < FH; py += SS) {
        for (let px = 0; px < FW; px += SS) {
          const i = (py * FW + px) * 4;
          const v = (data[i] * 0.6 + data[i + 1] * 0.3 + data[i + 2] * 0.1) / 255;
          if (v < 0.16) continue;
          const hx = offX + px * scale;
          const hy = offY + py * scale;
          dots.push({ hx, hy, x: hx, y: hy, vx: 0, vy: 0, v });
        }
      }
    };
    build();

    const render = (t: number) => {
      ctx.fillStyle = "#08090a";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "rgb(216,216,214)";

      for (const d of dots) {
        // wind: gentle horizontal sway + shimmer
        const windX = Math.sin(d.hy * 0.02 + t * 0.0012) * 3 + Math.sin(t * 0.0006) * 2.2;
        const windY = Math.cos(d.hx * 0.02 + t * 0.001) * 1.5;
        const tx = d.hx + windX;
        const ty = d.hy + windY;

        // cursor gust
        let fx = 0;
        let fy = 0;
        const ddx = d.x - mx;
        const ddy = d.y - my;
        const dd = ddx * ddx + ddy * ddy;
        if (dd < CR * CR) {
          const dist = Math.sqrt(dd) || 1;
          const f = (1 - dist / CR) * 6;
          fx = (ddx / dist) * f;
          fy = (ddy / dist) * f;
        }

        d.vx = (d.vx + (tx - d.x) * 0.12 + fx) * 0.72;
        d.vy = (d.vy + (ty - d.y) * 0.12 + fy) * 0.72;
        d.x += d.vx;
        d.y += d.vy;

        const s = Math.max(1, d.v * D * 0.9);
        ctx.globalAlpha = 0.2 + d.v * 0.3;
        ctx.fillRect(d.x - s / 2, d.y - s / 2, s, s);
      }
      ctx.globalAlpha = 1;
    };

    render(0);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
    };
    const onLeave = () => {
      mx = -9999;
      my = -9999;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave, { passive: true });
    window.addEventListener("resize", build);

    let raf = 0;
    let last = 0;
    const start = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (document.hidden || now - last < 33) return;
      last = now;
      render(now - start);
    };
    if (!reduce) raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", build);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}
