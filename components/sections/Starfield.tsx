"use client";

// Starfield: an interactive neon universe behind the story. Three
// layers deep:
//
//   1. The universe: a static cosmos of thousands of faint stars and
//      a few distant elliptical galaxies, painted once per resize
//      and drifting slowly as you travel.
//   2. The galaxy: ~25,000 fine particles seeded deterministically
//      into four logarithmic spiral arms around a warm bulge,
//      neon-graded from a golden core through pink, magenta and
//      violet to electric blue and cyan, drawn additively with
//      layered nebula haze.
//   3. The camera: scroll dives it linearly from a far overview
//      deep into the disc. Scroll velocity feeds a warp-trail
//      effect (the frame clears softer the faster you travel, so
//      stars streak), the galaxy spins slowly on its own, and the
//      camera leans with the mouse.
//
// A soft dark pocket is held at screen center so the story's type
// always reads over the bright core.

import { useScroll } from "framer-motion";
import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  z: number;
  size: number;
  css: string;
  a: number;
};

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const R = 1000;

const GRADE: [number, [number, number, number]][] = [
  [0.16, [255, 244, 224]],
  [0.32, [255, 170, 215]],
  [0.5, [255, 105, 180]],
  [0.68, [178, 122, 255]],
  [0.85, [96, 130, 255]],
  [1.01, [70, 220, 255]],
];

function buildGalaxy(): Star[] {
  const rand = mulberry32(20260726);
  const stars: Star[] = [];
  const ARMS = 4;
  const TWIST = 2.6;

  for (let i = 0; i < 10000; i++) {
    const arm = i % ARMS;
    const t = Math.pow(rand(), 0.62);
    const r = t * R;
    const spread = 0.16 + 0.5 * t;
    const theta =
      (arm * (Math.PI * 2)) / ARMS + t * TWIST + (rand() - 0.5) * spread * 2.2;
    const off = (rand() - 0.5) * spread * 300;
    const x = Math.cos(theta) * r - Math.sin(theta) * off;
    const y = Math.sin(theta) * r + Math.cos(theta) * off;
    const z = (rand() - 0.5) * (120 - 80 * t) * (rand() < 0.1 ? 2.4 : 1);

    const rr = Math.min(1, Math.hypot(x, y) / R);
    let color = GRADE[GRADE.length - 1][1];
    for (const [limit, c] of GRADE) {
      if (rr < limit) {
        color = c;
        break;
      }
    }
    const accent = rand();
    const [cr, cg, cb] =
      accent > 0.985 ? [70, 240, 255] : accent > 0.97 ? [255, 80, 200] : color;

    stars.push({
      x,
      y,
      z,
      size: 0.35 + 1.5 * rand() * rand(),
      css: `rgb(${cr},${cg},${cb})`,
      a: 0.4 + 0.55 * rand(),
    });
  }

  for (let i = 0; i < 2200; i++) {
    const g = () => (rand() + rand() + rand() + rand() - 2) * 0.5;
    const x = g() * 0.16 * R;
    const y = g() * 0.16 * R;
    const z = g() * 0.09 * R;
    const warm = rand();
    stars.push({
      x,
      y,
      z,
      size: 0.35 + 1.3 * rand() * rand(),
      css: warm > 0.5 ? "rgb(255,244,224)" : "rgb(255,220,200)",
      a: 0.3 + 0.4 * rand(),
    });
  }

  return stars;
}

// The distant universe: painted once per resize onto its own canvas.
function paintUniverse(canvas: HTMLCanvasElement, W: number, H: number, dpr: number) {
  const UH = H + 160;
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(UH * dpr);
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, UH);
  const rand = mulberry32(99120);

  // far galaxies: tilted elliptical smudges, many sizes, everywhere
  for (let i = 0; i < 22; i++) {
    const gx = rand() * W;
    const gy = rand() * UH;
    const grot = rand() * Math.PI;
    const grx = 12 + rand() * rand() * 130;
    const tint =
      i % 3 === 0
        ? "160,120,255"
        : i % 3 === 1
        ? "255,120,200"
        : "110,190,255";
    ctx.save();
    ctx.translate(gx, gy);
    ctx.rotate(grot);
    ctx.scale(1, 0.32 + rand() * 0.2);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, grx);
    g.addColorStop(0, `rgba(${tint},0.20)`);
    g.addColorStop(0.4, `rgba(${tint},0.07)`);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(-grx, -grx, grx * 2, grx * 2);
    ctx.restore();
  }

  // deep-field stars
  for (let i = 0; i < 2600; i++) {
    const x = rand() * W;
    const y = rand() * UH;
    const s = 0.4 + rand() * 1.1;
    const c = rand();
    const tint =
      c > 0.92
        ? "140,200,255"
        : c > 0.84
        ? "255,170,220"
        : "230,230,240";
    ctx.fillStyle = `rgba(${tint},${(0.12 + rand() * 0.5).toFixed(3)})`;
    ctx.fillRect(x, y, s, s);
  }
}

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { scrollYProgress } = useScroll();
  const progressRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0, lx: 0, ly: 0 });

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      progressRef.current = v;
    });
    progressRef.current = scrollYProgress.get();
    return unsub;
  }, [scrollYProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const stars = buildGalaxy();
    const universe = document.createElement("canvas");
    let W = 0;
    let H = 0;
    let dpr = 1;

    const resize = () => {
      dpr = 1; // render at 1x: the speed budget goes to particles, not pixels
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      paintUniverse(universe, W, H, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / W) * 2 - 1;
      mouseRef.current.y = (e.clientY / H) * 2 - 1;
    };
    window.addEventListener("mousemove", onMouse);

    let raf = 0;
    let lastP = progressRef.current;
    let velocity = 0;
    const start = performance.now();

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const time = (now - start) / 1000;
      const p = progressRef.current;
      const m = mouseRef.current;
      m.lx += (m.x - m.lx) * 0.05;
      m.ly += (m.y - m.ly) * 0.05;

      // Scroll speed feeds the warp trails, then decays.
      velocity = Math.max(Math.abs(p - lastP), velocity * 0.9);
      lastP = p;
      const clearAlpha = Math.max(0.2, 1 - velocity * 900);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = clearAlpha;
      ctx.fillStyle = "#030303";
      ctx.fillRect(0, 0, W, H);
      // the distant universe drifts slowly upward as you travel
      ctx.drawImage(
        universe,
        0,
        0,
        universe.width,
        universe.height,
        0,
        -p * 160,
        W,
        H + 160
      );
      ctx.globalAlpha = 1;

      // Camera in two acts. Act one (the first scroll): a straight
      // plunge from the far overview to the center of the galaxy.
      // Act two (the rest of the story): a slow cruise through the
      // interior, winding gently between the arms while the text
      // plays.
      const DIVE = 0.08; // share of the scroll spent on the opening plunge
      let dist: number;
      let elev: number;
      let wAmp: number;
      if (p < DIVE) {
        const t = p / DIVE;
        dist = 320 + (2980 - 320) * Math.pow(1 - t, 1.6);
        elev = 0.5 - 0.3 * t;
        wAmp = 80 * t;
      } else {
        const t = (p - DIVE) / (1 - DIVE);
        dist = 320 - t * (320 - 80);
        elev = 0.2 - t * 0.1;
        wAmp = 220;
      }
      const wanderX = Math.sin(p * 9) * wAmp;
      const wanderZ = Math.sin(p * 6 + 1.7) * wAmp * 0.6;
      const cam = {
        x: m.lx * 120 + wanderX,
        y: -Math.cos(elev) * dist,
        z: Math.sin(elev) * dist + m.ly * 80 + wanderZ,
      };
      const fl = Math.hypot(cam.x, cam.y, cam.z);
      const f = { x: -cam.x / fl, y: -cam.y / fl, z: -cam.z / fl };
      const rl = Math.hypot(f.y, -f.x) || 1;
      const rt = { x: -f.y / rl, y: f.x / rl, z: 0 };
      const up = {
        x: f.y * rt.z - f.z * rt.y,
        y: f.z * rt.x - f.x * rt.z,
        z: f.x * rt.y - f.y * rt.x,
      };
      const focal = 0.9 * Math.min(W, H);
      // The view itself sways along the flight path, so the dive
      // reads as banking through the arms rather than a straight
      // elevator drop.
      const cx = W / 2 + Math.sin(p * 6.7) * 0.14 * W * (1 - 0.4 * p);
      const cy = H / 2 + Math.sin(p * 4.3 + 1.7) * 0.1 * H * (1 - 0.4 * p);

      const ang = time * 0.02 + p * 2.0;
      const ca = Math.cos(ang);
      const sa = Math.sin(ang);

      ctx.globalCompositeOperation = "lighter";

      // Nebula haze
      const vzc = -cam.x * f.x - cam.y * f.y - cam.z * f.z;
      if (vzc > 40) {
        const pr = Math.max(90, (R * focal) / vzc);
        const inside = Math.min(1, dist / (0.55 * R));
        const haze: [number, string][] = [
          [1.25, `rgba(96,80,255,${(0.09 * inside).toFixed(3)})`],
          [0.8, `rgba(255,90,190,${(0.08 * inside).toFixed(3)})`],
          [0.42, `rgba(255,150,215,${(0.1 * inside).toFixed(3)})`],
          [0.13, `rgba(255,240,228,${(0.12 * inside).toFixed(3)})`],
        ];
        for (const [k, color] of haze) {
          const rad = pr * k;
          const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
          g.addColorStop(0, color);
          g.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = g;
          ctx.fillRect(cx - rad, cy - rad, rad * 2, rad * 2);
        }
      }

      // Stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const wx = s.x * ca - s.y * sa;
        const wy = s.x * sa + s.y * ca;
        const vx = wx - cam.x;
        const vy = wy - cam.y;
        const vz = s.z - cam.z;
        const Z = vx * f.x + vy * f.y + vz * f.z;
        if (Z < 20) continue;
        const X = vx * rt.x + vy * rt.y + vz * rt.z;
        const Y = vx * up.x + vy * up.y + vz * up.z;
        const sx = cx + (X * focal) / Z;
        const sy = cy - (Y * focal) / Z;
        if (sx < -12 || sx > W + 12 || sy < -12 || sy > H + 12) continue;
        const size = Math.min(5, ((s.size * focal) / Z) * 2.5);
        const fade = Math.min(1, 2.6 - Z / (1.7 * R));
        if (fade <= 0) continue;
        ctx.globalAlpha = s.a * fade * 0.75;
        ctx.fillStyle = s.css;
        ctx.fillRect(sx - size / 2, sy - size / 2, size, size);
      }
      ctx.globalAlpha = 1;

      // Text pocket: a soft dark veil at screen center so the story
      // always reads over the core. Light while zoomed out, stronger
      // the deeper we travel into the bright interior.
      ctx.globalCompositeOperation = "source-over";
      const veilA = 0.22 + 0.32 * p;
      const veilR = 0.5 * Math.min(W, H);
      const veil = ctx.createRadialGradient(cx, cy, 0, cx, cy, veilR);
      veil.addColorStop(0, `rgba(3,3,3,${veilA.toFixed(3)})`);
      veil.addColorStop(0.7, `rgba(3,3,3,${(veilA * 0.44).toFixed(3)})`);
      veil.addColorStop(1, "rgba(3,3,3,0)");
      ctx.fillStyle = veil;
      ctx.fillRect(cx - veilR, cy - veilR, veilR * 2, veilR * 2);

      // Edge blend: the frame darkens toward its borders so the
      // galaxy dissolves into the screen instead of ending on it.
      const vigR = 0.72 * Math.max(W, H);
      const vig = ctx.createRadialGradient(
        W / 2,
        H / 2,
        vigR * 0.45,
        W / 2,
        H / 2,
        vigR
      );
      vig.addColorStop(0, "rgba(3,3,3,0)");
      vig.addColorStop(1, "rgba(3,3,3,0.72)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 bg-[#030303]"
    >
      <canvas ref={canvasRef} className="block" />
    </div>
  );
}
