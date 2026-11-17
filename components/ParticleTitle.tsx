"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ParticleTitle — the hero title as gradient pixels (yellow to pink), in a thick
// display font, no italic. Each word is sampled into particles. Hover a word and
// its pixels scatter and blow away on the wind, then spring back when you leave.
//
// Pointer is tracked on window (canvas is pointer-events-none) so the fish behind
// and the links above still work. Paints a static rest frame immediately.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef } from "react";

const LINES = [["PIXELS"], ["BY", "PURPOSE"]];
const C1 = [255, 209, 71]; // yellow
const C2 = [255, 79, 158]; // pink

type Particle = {
  hx: number;
  hy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  word: number;
  r: number;
  g: number;
  b: number;
};
type WordBox = { i: number; x: number; y: number; w: number; h: number };

export default function ParticleTitle() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Resolve the display font family from the CSS variable for canvas use.
    const probe = document.createElement("span");
    probe.style.cssText =
      "position:absolute;visibility:hidden;font-family:var(--font-display),sans-serif";
    document.body.appendChild(probe);
    const family = getComputedStyle(probe).fontFamily || "sans-serif";
    probe.remove();

    let W = 0;
    let H = 0;
    let particles: Particle[] = [];
    let words: WordBox[] = [];
    let hoverWord = -1;

    const build = () => {
      const parent = canvas.parentElement;
      W = parent?.clientWidth || window.innerWidth;
      H = parent?.clientHeight || 500;
      // The container may not be laid out yet; retry shortly.
      if (W < 20 || H < 20) {
        setTimeout(build, 60);
        return;
      }
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const fs = Math.max(14, Math.min(W * 0.135, 168));
      const gap = fs * 0.26;
      const lineH = fs * 0.98;
      const step = Math.max(3, Math.round(fs / 30));

      ctx.font = `${fs}px ${family}`;
      const measured = LINES.map((ws) => {
        const widths = ws.map((word) => ctx.measureText(word).width);
        const total = widths.reduce((a, b) => a + b, 0) + gap * (ws.length - 1);
        return { ws, widths, total };
      });

      const totalH = measured.length * lineH;
      const top = (H - totalH) / 2 - H * 0.03; // nudge up, leaving room below
      const off = document.createElement("canvas");
      const octx = off.getContext("2d");
      if (!octx) return;

      particles = [];
      words = [];
      let wi = 0;

      measured.forEach((ln, li) => {
        let x = (W - ln.total) / 2;
        const baseY = top + li * lineH + fs * 0.82; // baseline
        ln.ws.forEach((word, k) => {
          const wWidth = ln.widths[k];
          if (!Number.isFinite(wWidth) || wWidth < 1) {
            words.push({ i: wi, x, y: baseY - fs, w: 1, h: fs });
            wi++;
            return;
          }
          const pad = 8;
          off.width = Math.max(2, Math.ceil(wWidth) + pad * 2);
          off.height = Math.max(2, Math.ceil(fs * 1.35));
          octx.clearRect(0, 0, off.width, off.height);
          octx.font = `${fs}px ${family}`;
          octx.textBaseline = "alphabetic";
          octx.fillStyle = "#fff";
          octx.fillText(word, pad, fs * 1.0);
          const data = octx.getImageData(0, 0, off.width, off.height).data;

          const glyphTop = baseY - fs * 1.0;
          for (let py = 0; py < off.height; py += step) {
            for (let px = 0; px < off.width; px += step) {
              if (data[(py * off.width + px) * 4 + 3] > 128) {
                const cx = x + (px - pad);
                const cy = glyphTop + py;
                const tg = Math.max(0, Math.min(1, cx / W));
                particles.push({
                  hx: cx,
                  hy: cy,
                  x: cx,
                  y: cy,
                  vx: 0,
                  vy: 0,
                  word: wi,
                  r: Math.round(C1[0] + (C2[0] - C1[0]) * tg),
                  g: Math.round(C1[1] + (C2[1] - C1[1]) * tg),
                  b: Math.round(C1[2] + (C2[2] - C1[2]) * tg),
                });
              }
            }
          }
          words.push({ i: wi, x, y: baseY - fs, w: wWidth, h: fs * 1.12 });
          x += wWidth + gap;
          wi++;
        });
      });
    };

    build();
    const anyDoc = document as unknown as { fonts?: { ready?: Promise<unknown> } };
    anyDoc.fonts?.ready?.then(build);

    const drawRest = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of particles) {
        ctx.fillStyle = `rgb(${p.r},${p.g},${p.b})`;
        ctx.fillRect(p.x - 1.2, p.y - 1.2, 2.6, 2.6);
      }
    };
    drawRest();

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const px = e.clientX - r.left;
      const py = e.clientY - r.top;
      hoverWord = -1;
      for (const wb of words) {
        if (px >= wb.x && px <= wb.x + wb.w && py >= wb.y && py <= wb.y + wb.h) {
          hoverWord = wb.i;
          break;
        }
      }
    };
    const onLeave = () => {
      hoverWord = -1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave, { passive: true });
    window.addEventListener("resize", build);

    if (reduce) {
      return () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerleave", onLeave);
        window.removeEventListener("resize", build);
      };
    }

    let raf = 0;
    let last = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (document.hidden || now - last < 20) return;
      last = now;

      ctx.clearRect(0, 0, W, H);
      for (const p of particles) {
        if (p.word === hoverWord) {
          // blow away on the wind
          const gust = Math.sin(p.y * 0.05 + now * 0.004);
          p.vx += (5 + gust * 2.4) * 0.5;
          p.vy += (Math.sin(p.x * 0.05 + now * 0.003) * 1.8 - 0.4) * 0.5;
          p.vx *= 0.95;
          p.vy *= 0.95;
        } else {
          // spring home
          p.vx += (p.hx - p.x) * 0.055;
          p.vy += (p.hy - p.y) * 0.055;
          p.vx *= 0.8;
          p.vy *= 0.8;
        }
        p.x += p.vx;
        p.y += p.vy;

        let alpha = 1;
        if (p.word === hoverWord) {
          const dh = Math.abs(p.x - p.hx) + Math.abs(p.y - p.hy);
          alpha = Math.max(0.12, 1 - dh / 320);
        }
        ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${alpha})`;
        ctx.fillRect(p.x - 1.2, p.y - 1.2, 2.6, 2.6);
      }
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", build);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-label="Pixels by Purpose"
      role="img"
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ imageRendering: "pixelated" }}
    />
  );
}
