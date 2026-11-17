"use client";

// ─────────────────────────────────────────────────────────────────────────────
// PufferfishArt — the hero background. A pufferfish rendered as a field of white
// dots on black (the DRAGONFLY treatment), clearly seen. Hover anywhere in the
// hero and the fish "starts making its art": concentric sand-ripple rings draw
// outward from beneath it, the way a real pufferfish carves its mandala.
//
// Monochrome. Paints one static frame immediately; animates via rAF. Throttled,
// pauses when hidden, honors reduced motion.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef } from "react";

const D = 8; // dot spacing in CSS px
const FW = 300;
const FH = 220;

function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

export default function PufferfishArt() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    let fishV = new Float32Array(0);
    let sandN = new Float32Array(0);
    let rcx = 0;
    let rcy = 0;

    const fishOff = document.createElement("canvas");
    fishOff.width = FW;
    fishOff.height = FH;

    const drawFish = () => {
      const o = fishOff.getContext("2d");
      if (!o) return;
      o.clearRect(0, 0, FW, FH);
      const bx = FW * 0.5;
      const by = FH * 0.52;
      const rx = FW * 0.32;
      const ry = FH * 0.34;

      // spikes
      o.fillStyle = "#cfcfcf";
      for (let i = 0; i < 48; i++) {
        const a = (i / 48) * Math.PI * 2;
        const pa = a + 0.05;
        const pb = a - 0.05;
        const len = rx + 13 + Math.sin(i * 1.7) * 3;
        o.beginPath();
        o.moveTo(bx + Math.cos(pa) * rx * 0.98, by + Math.sin(pa) * ry * 0.98);
        o.lineTo(bx + Math.cos(pb) * rx * 0.98, by + Math.sin(pb) * ry * 0.98);
        o.lineTo(bx + Math.cos(a) * len, by + Math.sin(a) * (len * (ry / rx)));
        o.closePath();
        o.fill();
      }
      // tail
      o.fillStyle = "#bcbcbc";
      o.beginPath();
      o.moveTo(bx - rx * 0.9, by);
      o.lineTo(bx - rx * 1.5, by - ry * 0.5);
      o.lineTo(bx - rx * 1.38, by);
      o.lineTo(bx - rx * 1.5, by + ry * 0.5);
      o.closePath();
      o.fill();
      // body
      const g = o.createRadialGradient(bx - rx * 0.2, by - ry * 0.3, rx * 0.1, bx, by, rx * 1.15);
      g.addColorStop(0, "#f4f4f4");
      g.addColorStop(0.6, "#cfcfcf");
      g.addColorStop(1, "#8f8f8f");
      o.fillStyle = g;
      o.beginPath();
      o.ellipse(bx, by, rx, ry, 0, 0, Math.PI * 2);
      o.fill();
      // net / stripe pattern for tonal texture
      o.strokeStyle = "rgba(64,64,64,0.5)";
      o.lineWidth = 2;
      for (let k = -3; k <= 3; k++) {
        o.beginPath();
        o.ellipse(bx, by, rx * 0.92, ry * 0.92, 0, k * 0.42, k * 0.42 + Math.PI);
        o.stroke();
      }
      // belly
      o.fillStyle = "rgba(255,255,255,0.28)";
      o.beginPath();
      o.ellipse(bx, by + ry * 0.4, rx * 0.68, ry * 0.36, 0, 0, Math.PI * 2);
      o.fill();
      // pectoral fin
      o.fillStyle = "rgba(206,206,206,0.9)";
      o.beginPath();
      o.ellipse(bx + rx * 0.12, by + ry * 0.34, rx * 0.24, ry * 0.15, -0.3, 0, Math.PI * 2);
      o.fill();
      // beak
      o.fillStyle = "#d8d8d8";
      o.beginPath();
      o.moveTo(bx + rx * 0.9, by + ry * 0.04);
      o.lineTo(bx + rx * 1.12, by - ry * 0.02);
      o.lineTo(bx + rx * 0.9, by + ry * 0.22);
      o.closePath();
      o.fill();
      // eye
      const ex = bx + rx * 0.5;
      const ey = by - ry * 0.26;
      o.fillStyle = "#ffffff";
      o.beginPath();
      o.arc(ex, ey, ry * 0.17, 0, Math.PI * 2);
      o.fill();
      o.fillStyle = "#0a0a0a";
      o.beginPath();
      o.arc(ex + ry * 0.03, ey, ry * 0.085, 0, Math.PI * 2);
      o.fill();
      // spots
      o.fillStyle = "#ffffff";
      const spots = [[-0.25, -0.15], [0.12, 0.12], [-0.4, 0.18], [0.02, -0.32], [0.3, 0.3], [-0.12, 0.42]];
      for (const [sx, sy] of spots) {
        o.beginPath();
        o.arc(bx + sx * rx, by + sy * ry, 3.5, 0, Math.PI * 2);
        o.fill();
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

      cols = Math.ceil(w / D);
      rows = Math.ceil(h / D);

      drawFish();
      const fctx = fishOff.getContext("2d");
      if (!fctx) return;
      const fd = fctx.getImageData(0, 0, FW, FH).data;

      // Fish placement: centered, in the middle band (below the title).
      const fbW = Math.min(w * 0.44, 500);
      const fbH = fbW * (FH / FW);
      const fbX = (w - fbW) / 2;
      const fbY = h * 0.52 - fbH / 2;

      fishV = new Float32Array(cols * rows);
      sandN = new Float32Array(cols * rows);
      for (let gy = 0; gy < rows; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          const i = gy * cols + gx;
          sandN[i] = hash(gx, gy);
          const px = gx * D + D / 2;
          const py = gy * D + D / 2;
          if (px >= fbX && px < fbX + fbW && py >= fbY && py < fbY + fbH) {
            const u = Math.floor(((px - fbX) / fbW) * FW);
            const vv = Math.floor(((py - fbY) / fbH) * FH);
            const p = (vv * FW + u) * 4;
            if (fd[p + 3] > 40) {
              fishV[i] = (fd[p] * 0.6 + fd[p + 1] * 0.3 + fd[p + 2] * 0.1) / 255;
            }
          }
        }
      }
      rcx = w * 0.5;
      rcy = fbY + fbH * 0.96; // ripple origin just beneath the fish
    };

    let hover = 0;
    let hoverTarget = 0;

    const render = (t: number) => {
      hover += (hoverTarget - hover) * 0.05;
      ctx.fillStyle = "#08090a";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "rgb(238,238,236)";

      const maxR = Math.max(w, h) * 0.62;

      for (let gy = 0; gy < rows; gy++) {
        const py = gy * D + D / 2;
        // fade the top so the title stays clear of the dots
        const vfade = Math.min(1, Math.max(0, (py / h - 0.08) / 0.2));
        for (let gx = 0; gx < cols; gx++) {
          const i = gy * cols + gx;
          const px = gx * D + D / 2;

          let v = fishV[i];
          v += (0.028 + sandN[i] * 0.02) * vfade; // faint sand grains

          if (hover > 0.01) {
            const dx = px - rcx;
            const dy = py - rcy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const fall = Math.max(0, 1 - dist / maxR);
            const wave = Math.sin(dist * 0.05 - t * 0.006);
            v += hover * Math.max(0, wave) * 0.5 * fall * vfade;
          }

          if (v < 0.08) continue;
          if (v > 1) v = 1;
          const s = v * D * 0.92;
          ctx.fillRect(px - s / 2, py - s / 2, s, s);
        }
      }
    };

    build();
    render(0);

    const parent = canvas.parentElement;
    const onEnter = () => (hoverTarget = 1);
    const onLeave = () => (hoverTarget = 0);
    parent?.addEventListener("pointerenter", onEnter);
    parent?.addEventListener("pointerleave", onLeave);
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
      parent?.removeEventListener("pointerenter", onEnter);
      parent?.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", build);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}
