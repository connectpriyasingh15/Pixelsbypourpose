"use client";

// FilmAct: the home's opening act, a chaptered art film built from
// seven bioluminescent garden stills. The frame is sticky and
// full-viewport; scroll advances the script (one quiet serif line per
// chapter, set at the lower left like a subtitle) while the scenes
// crossfade into one another, each diving slowly (a scroll-linked
// Ken Burns zoom, alternating in and out) so the whole act reads as
// one continuous journey: flower, bird, inside the flower, the
// decision network, the stem, the roots, and the bird again.
// A hairline drafting grid with two star markers holds the frame,
// and the stack leans gently away from the cursor.
//
// The metaphor, chapter by chapter: the hummingbird is the user, the
// flower is the experience, and everything inside it is the work.

import { animate, motion, useScroll, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

// ── The script. One line, one scene, and one camera target each. ────────────
// The Varanasi journey: the city, its people, a street, a home, a room,
// a designer, her hand, her sketches, her ideas, her work, her purpose,
// and the city again. Each scene's zoom aims at the detail that becomes
// the next scene, so the scroll reads as one continuous camera move.
// `origin` = the CSS transform-origin the dolly pushes toward.
// Each chapter carries its own text anchor (`pos`), chosen by where
// that scene's composition leaves quiet space: tl/tr = upper corners,
// lc/rc = mid left/right, bl/br = lower corners. The statements are
// her voice: a designer raised by the city, roots first, screens last.
const CHAPTERS = [
  {
    title: "The Life",
    line: "I studied people before pixels.",
    sub: "Every morning at the ghat, a hundred different journeys used the same worn steps.",
    img: "/varanasi/scene-02.webp",
    origin: "40% 60%",
    pos: "tl",
  },
  {
    title: "The Street",
    line: "Chaos taught me clarity.",
    sub: "A street this alive cannot be redesigned. It can only be understood.",
    img: "/varanasi/scene-03.webp",
    origin: "50% 45%",
    pos: "bl",
  },
  {
    title: "A Home",
    line: "Every door hides a system.",
    sub: "Homes here are built by generations. Nothing is accidental, everything has a reason.",
    img: "/varanasi/scene-04.webp",
    origin: "50% 45%",
    pos: "lc",
  },
  {
    title: "The Entrance",
    line: "Light knows the way in.",
    sub: "Old courtyards guide you without a single sign. That is wayfinding.",
    img: "/varanasi/scene-05.webp",
    origin: "55% 45%",
    pos: "tr",
  },
  {
    title: "The Room",
    line: "A small room, a wide world.",
    sub: "Between a window and a desk, the city keeps teaching.",
    img: "/varanasi/scene-06.webp",
    origin: "50% 60%",
    pos: "tl",
  },
  {
    title: "A Closer Look",
    line: "Ideas begin by hand.",
    sub: "Paper first. The pencil is honest, and it forgives.",
    img: "/varanasi/scene-07.webp",
    origin: "50% 55%",
    pos: "br",
  },
  {
    title: "The Sketches",
    line: "I think in rough drafts.",
    sub: "Wireframes, arrows, dead ends. The mess is the method.",
    img: "/varanasi/scene-08.webp",
    origin: "50% 55%",
    pos: "tl",
  },
  {
    title: "The Ideas",
    line: "Options, then opinions.",
    sub: "I explore wide before I choose narrow. Iteration is respect for the problem.",
    img: "/varanasi/scene-09.webp",
    origin: "55% 60%",
    pos: "rc",
  },
  {
    title: "The Designer",
    line: "Doubt is a design tool.",
    sub: "I sit with a question until it answers differently.",
    img: "/varanasi/scene-10.webp",
    origin: "40% 45%",
    pos: "bl",
  },
  {
    title: "The Principles",
    line: "Roots become principles.",
    sub: "Balance, contrast, harmony: the city knew them before I had names for them.",
    img: "/varanasi/scene-11.webp",
    origin: "50% 40%",
    pos: "br",
  },
  {
    title: "The Design",
    line: "Craft moves to the screen.",
    sub: "The sketch grows up: structure, hierarchy, one decision at a time.",
    img: "/varanasi/scene-12.webp",
    origin: "60% 40%",
    pos: "lc",
  },
  {
    title: "The Work",
    line: "Polish is patience.",
    sub: "Late hours, small corrections. The last ten percent is the work.",
    img: "/varanasi/scene-13.webp",
    origin: "50% 45%",
    pos: "tl",
  },
  {
    title: "The Purpose",
    line: "Every light out there is a user.",
    sub: "Design with empathy, ship with intent. Impact you can feel from a window.",
    img: "/varanasi/scene-14.webp",
    origin: "60% 35%",
    pos: "bl",
  },
  {
    title: "The Return",
    line: "The city is in everything I make.",
    sub: "Same ghats, new eyes. The journey loops, the learning does not stop.",
    img: "/varanasi/scene-15.webp",
    origin: "62% 65%",
    pos: "lc",
    pullBack: true,
  },
];

const HERO_IMG = "/varanasi/scene-01.webp";

// Bump when any scene asset is re-exported: busts every stale cache
// (posters, clips, and the loader's warm fetches all carry it).
const ASSET_V = "?v=3";
const motionSrc = (img: string) =>
  img.replace("/varanasi/scene-", "/varanasi/motion/scene-").replace(".webp", ".mp4") + ASSET_V;

// The hero holds the first stretch of the timeline before the script begins.
const HERO_SHARE = 0.16;

// ── One scene: a still that crossfades in, dives, and hands over. ───────────
// The journey grammar: every scene is born slightly distant, dollies
// slowly toward its target detail while it holds, then flies PAST the
// camera (scaling to ~2x, blurring, dissolving) so the next scene is
// revealed already in motion behind it. Earlier scenes stack above
// later ones, so the reader travels through each frame into the next:
// one continuous camera move, never a slideshow cut. Each scene also
// drifts along its own axis while it holds, like the camera walking.
function Scene({
  p,
  start,
  end,
  src,
  origin,
  drift,
  pullBack,
  first,
  last,
  z,
  advance,
}: {
  p: MotionValue<number>;
  start: number;
  end: number;
  src: string;
  origin: string;
  drift: { dx: number; dy: number };
  pullBack?: boolean;
  first?: boolean;
  last?: boolean;
  z: number;
  advance?: () => void;
}) {
  const L = end - start;
  // Handover width, capped so every exit fly-through fully completes
  // before the NEXT section's hold (the hero's window is much longer
  // than a chapter's, so uncapped it was still mid-fly, half visible,
  // at section 02's resting point).
  const f = Math.min(0.32 * L, 0.02);

  // Visible early (revealed beneath the outgoing scene), gone only
  // after its own fly-through completes.
  const opacity = useTransform(
    p,
    first
      ? [start, end + 0.4 * f, end + f]
      : last
      ? [start - f, start - 0.4 * f, 1]
      : [start - f, start - 0.4 * f, end + 0.4 * f, end + f],
    first ? [1, 1, 0] : last ? [0, 1, 1] : [0, 1, 1, 0]
  );

  // Born distant, slow dolly while holding, then past the lens.
  const scale = useTransform(
    p,
    first
      ? [start, end, end + f]
      : last
      ? [start - f, start + 0.35 * L, 1]
      : [start - f, start + 0.25 * L, end, end + f],
    first
      ? [1.04, 1.2, 2.1]
      : pullBack
      ? [1.7, 1.2, 1.02]
      : [0.94, 1.06, 1.26, 2.1]
  );

  // The walk: a gentle directional pan across the hold.
  const x = useTransform(p, [start - f, end + f], [`${drift.dx}%`, `${-drift.dx}%`]);
  const y = useTransform(p, [start - f, end + f], [`${drift.dy}%`, `${-drift.dy}%`]);

  // Rack focus: a scene arrives softly out of focus during the
  // handover only, fully sharp the moment its own section begins;
  // passing the lens on exit it blurs again.
  const filter = useTransform(p, (v) => {
    if (!first && v < start) {
      const t = Math.min(1, Math.max(0, (v - (start - f)) / f));
      return `blur(${(4 * (1 - t)).toFixed(1)}px)`;
    }
    if (!last && v > end) {
      const t = Math.min(1, (v - end) / f);
      return `blur(${(7 * t).toFixed(1)}px)`;
    }
    // "none" (not blur(0px)) so the browser drops the filter layer and
    // composites the video directly while a scene holds.
    return "none";
  });

  // The living frame: each scene is a short motion loop, poster'd by
  // its still so first paint is instant. It plays only while its
  // chapter is anywhere near the lens, and rests otherwise.
  // Play once per visit: the clip runs when its chapter enters the
  // lens and then HOLDS its final frame (no loop). Scrolling away and
  // returning starts the moment over.
  // Virtualized media: only scenes near the camera carry a live
  // <video> element (the poster stands in for far ones), so at most a
  // few hardware decoders are ever in use. Without this, machines with
  // fewer decoder slots quietly refuse to start some scenes.
  const [live, setLive] = useState(!!first);
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    let wasActive = false;
    // Exactly one scene plays at a time: the chapter windows partition
    // the timeline, and a scene is active only while the playhead is
    // inside its own window. (The last scene additionally must not
    // count the clamped below-the-film zone, where progress pins at 1.)
    const activeEnd = last ? end - 0.002 : end;
    const reconcile = () => {
      const v = p.get();
      // Mount just the immediate neighborhood (one section each way);
      // farther scenes are posters, keeping decoder use minimal.
      const near = v >= start - 2 * f && v <= end + 1.5 * f;
      const far = v < start - 4 * f || v > end + 3 * f;
      if (near) setLive(true);
      else if (far && !first) setLive(false);
      const el = videoRef.current;
      if (!el) return;
      const active = first ? v < activeEnd : v >= start && v < activeEnd;
      if (active && !wasActive) {
        if (el.readyState > 0) el.currentTime = 0;
        el.play().catch(() => {});
      } else if (active && el.paused && !el.ended) {
        el.play().catch(() => {});
      } else if (!active && !el.paused) {
        el.pause();
      }
      wasActive = active;
    };
    reconcile();
    const unsub = p.on("change", reconcile);
    // Watchdog: scroll events alone can leave a scene parked-and-paused
    // (an aborted play promise, a slow first load). Reconcile on a slow
    // heartbeat and whenever the media reports readiness, so a visible
    // scene can never stay silently frozen.
    const beat = setInterval(reconcile, 700);
    const el = videoRef.current;
    el?.addEventListener("canplay", reconcile);

    // When the moment completes while the reader is parked inside the
    // chapter, hand the camera onward, like a cut in a film.
    const onEnded = () => {
      const v = p.get();
      if (advance && v >= start && v <= activeEnd) advance();
    };
    el?.addEventListener("ended", onEnded);
    return () => {
      unsub();
      clearInterval(beat);
      el?.removeEventListener("canplay", reconcile);
      el?.removeEventListener("ended", onEnded);
    };
    // re-run when the video element mounts or unmounts (live flips)
  }, [p, start, end, f, advance, last, first, live]);

  return (
    <motion.div style={{ opacity, zIndex: z }} className="absolute inset-0">
      {live ? (
        <motion.video
          ref={videoRef}
          src={motionSrc(src)}
          poster={src + ASSET_V}
          muted
          playsInline
          preload="auto"
          style={{ scale, x, y, filter, transformOrigin: origin }}
          className="h-full w-full object-cover will-change-transform"
        />
      ) : (
        <motion.img
          src={src + ASSET_V}
          alt=""
          style={{ scale, x, y, filter, transformOrigin: origin }}
          className="h-full w-full object-cover will-change-transform"
        />
      )}
    </motion.div>
  );
}

// Camera walk directions, cycled scene to scene so successive
// handovers never move the same way twice.
const DRIFTS = [
  { dx: 1.8, dy: 0 },
  { dx: 0, dy: 1.6 },
  { dx: -1.8, dy: 0 },
  { dx: 0, dy: -1.4 },
];

// StoryLoader: the film downloads before the curtain lifts. All
// posters and motion clips are fetched into the browser cache with a
// real progress readout (a hairline that fills, with the percentage
// riding its tip), so the scroll never hits an unloaded scene. The
// page holds still while it loads, then the veil lifts.
function StoryLoader({ assets }: { assets: string[] }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let alive = true;
    let loaded = 0;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    window.scrollTo(0, 0);

    const queue = [...assets];
    const finishOne = () => {
      if (!alive) return;
      loaded++;
      setProgress(loaded / assets.length);
      if (loaded >= assets.length) {
        document.documentElement.style.overflow = prev;
        setDone(true);
      } else {
        next();
      }
    };
    const next = () => {
      const url = queue.shift();
      if (!url) return;
      fetch(url, { cache: "force-cache" })
        .then((r) => r.blob())
        .then(finishOne)
        .catch(finishOne);
    };
    for (let i = 0; i < 5; i++) next();

    return () => {
      alive = false;
      document.documentElement.style.overflow = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (gone) return null;
  const pct = Math.round(progress * 100);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#030303] px-10"
      animate={{ opacity: done ? 0 : 1 }}
      transition={{ duration: 1.1, ease: [0.6, 0, 0.2, 1] }}
      onAnimationComplete={() => done && setGone(true)}
    >
      <p className="mb-10 font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">
        Pixels by Purpose &middot; A Varanasi story
      </p>
      <div className="relative h-px w-full max-w-2xl bg-white/15">
        <div
          className="absolute inset-y-0 left-0 bg-white/80"
          style={{ width: `${pct}%` }}
        />
        <span
          className="absolute top-2 -translate-x-1/2 font-mono text-[10px] text-white/60"
          style={{ left: `${pct}%` }}
        >
          {pct}%
        </span>
      </div>
    </motion.div>
  );
}

export default function FilmAct() {
  const actRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: actRef,
    offset: ["start start", "end end"],
  });

  // Mouse parallax: the whole scene stack leans away from the cursor.
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const m = { x: 0, y: 0, lx: 0, ly: 0 };
    let raf = 0;
    const onMouse = (e: MouseEvent) => {
      m.x = (e.clientX / window.innerWidth) * 2 - 1;
      m.y = (e.clientY / window.innerHeight) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMouse);
    // The loop runs only while the lean is still easing toward the
    // cursor, then sleeps until the mouse moves again, so an idle page
    // is not recompositing the full video stack every frame.
    const tick = () => {
      m.lx += (m.x - m.lx) * 0.045;
      m.ly += (m.y - m.ly) * 0.045;
      if (Math.abs(m.x - m.lx) > 0.001 || Math.abs(m.y - m.ly) > 0.001) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
      frame.style.transform = `translate3d(${(-m.lx * 20).toFixed(2)}px, ${(
        -m.ly * 12
      ).toFixed(2)}px, 0) scale(1.03)`;
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  // Hero fades as the script begins.
  const heroOpacity = useTransform(
    scrollYProgress,
    [0, HERO_SHARE * 0.55, HERO_SHARE],
    [1, 1, 0]
  );
  const heroPointer = useTransform(scrollYProgress, (v) =>
    v > HERO_SHARE * 0.8 ? ("none" as const) : ("auto" as const)
  );

  // The rush: as the scroll crosses a chapter boundary, a vignette
  // closes in briefly, so every handover feels like the camera
  // accelerating through the cut.
  const nCh = CHAPTERS.length;
  const LCh = (1 - HERO_SHARE) / nCh;
  const travelPulse = useTransform(scrollYProgress, (v) => {
    let dist = Math.abs(v - HERO_SHARE);
    for (let k = 1; k <= nCh; k++) {
      dist = Math.min(dist, Math.abs(v - (HERO_SHARE + k * LCh)));
    }
    const w = 0.22 * LCh;
    return Math.max(0, 1 - dist / w) * 0.5;
  });

  // The dolly. One shared glide engine drives both the autopilot
  // (a finished clip hands the camera onward) and the stepped
  // navigation below. While a glide runs the scroll is locked, so the
  // film always comes to rest exactly on a section hold.
  const glideState = useRef<{ locked: boolean; until: number; stop?: () => void }>({
    locked: false,
    until: 0,
  });
  const glideTo = useCallback((pTarget: number, duration = 2.4) => {
    const act = actRef.current;
    if (!act) return;
    glideState.current.stop?.();
    const actTop = act.getBoundingClientRect().top + window.scrollY;
    const target = actTop + pTarget * (act.offsetHeight - window.innerHeight);
    glideState.current.locked = true;
    const controls = animate(window.scrollY, target, {
      duration,
      ease: [0.5, 0, 0.12, 1],
      onUpdate: (v) => window.scrollTo(0, v),
      onComplete: () => {
        glideState.current.locked = false;
        glideState.current.until = Date.now() + 350;
      },
    });
    glideState.current.stop = () => {
      controls.stop();
      glideState.current.locked = false;
      glideState.current.until = Date.now() + 350;
    };
  }, []);

  // Progressive magnetic scroll: the wheel is never intercepted, so
  // scrolling feels completely native and fluid, fling as far as you
  // like. The moment the scroll comes to rest inside the film, the
  // camera gently settles onto the nearest section hold, where the
  // text is at full strength and the scene plays from its first
  // frame. Any user input instantly cancels a glide in progress; the
  // scroll always belongs to the person.
  useEffect(() => {
    const nC = CHAPTERS.length;
    const LC = (1 - HERO_SHARE) / nC;
    const holds = [0, ...CHAPTERS.map((_, i) => HERO_SHARE + (i + 0.55) * LC), 1];

    let idle: ReturnType<typeof setTimeout> | undefined;
    // The hold the camera last rested on. Settling is directional: once
    // the reader has scrolled clearly away from it, the magnet carries
    // them on to the next hold in the direction they were going, never
    // back. (Snapping to the *nearest* hold pulled short trackpad
    // flicks back to where they started, so the film felt stuck.)
    let restV = scrollYProgress.get();
    const settle = () => {
      if (glideState.current.locked) return;
      const v = scrollYProgress.get();
      if (v >= 0.999) return; // below the film: fully native
      let best = 0;
      for (let k = 1; k < holds.length; k++) {
        if (Math.abs(v - holds[k]) < Math.abs(v - holds[best])) best = k;
      }
      const moved = v - restV;
      if (Math.abs(moved) > 0.004) {
        // Nearest hold among those past the last rest in the travel
        // direction.
        let pick = -1;
        holds.forEach((h, k) => {
          const onward = moved > 0 ? h > restV + 0.001 : h < restV - 0.001;
          if (onward && (pick < 0 || Math.abs(v - h) < Math.abs(v - holds[pick]))) pick = k;
        });
        if (pick >= 0) best = pick;
      }
      restV = holds[best];
      if (Math.abs(v - holds[best]) > 0.003) glideTo(holds[best], 0.9);
    };
    const kick = () => {
      clearTimeout(idle);
      idle = setTimeout(settle, 180);
    };
    // User input takes the camera back instantly, then the magnet
    // re-arms once the scroll rests.
    const takeOver = () => {
      glideState.current.stop?.();
      kick();
    };

    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("wheel", takeOver, { passive: true });
    window.addEventListener("touchmove", takeOver, { passive: true });
    kick();
    return () => {
      clearTimeout(idle);
      window.removeEventListener("scroll", kick);
      window.removeEventListener("wheel", takeOver);
      window.removeEventListener("touchmove", takeOver);
    };
  }, [glideTo, scrollYProgress]);

  const n = CHAPTERS.length;
  const L = (1 - HERO_SHARE) / n;
  const height = `${(n + 2) * 100}svh`;

  const assets = [
    HERO_IMG + ASSET_V,
    motionSrc(HERO_IMG),
    ...CHAPTERS.flatMap((c) => [c.img + ASSET_V, motionSrc(c.img)]),
  ];

  return (
    <div ref={actRef} style={{ height }}>
      <StoryLoader assets={[...new Set(assets)]} />
      <div className="sticky top-0 h-svh overflow-hidden bg-[#030303]">
        {/* the scenes */}
        <div ref={frameRef} className="absolute inset-0 will-change-transform">
          <Scene
            p={scrollYProgress}
            start={0}
            end={HERO_SHARE}
            src={HERO_IMG}
            origin="50% 50%"
            drift={{ dx: 0, dy: 0.9 }}
            first
            z={n + 1}
          />
          {CHAPTERS.map((c, i) => (
            <Scene
              key={i}
              p={scrollYProgress}
              start={HERO_SHARE + i * L}
              end={HERO_SHARE + (i + 1) * L}
              src={c.img}
              origin={c.origin}
              drift={DRIFTS[i % DRIFTS.length]}
              pullBack={"pullBack" in c && c.pullBack === true}
              last={i === n - 1}
              z={n - i}
            />
          ))}
        </div>

        {/* legibility veils */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(3,3,3,0.72) 0%, rgba(3,3,3,0.18) 34%, rgba(3,3,3,0) 55%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 85% 80% at 50% 50%, rgba(3,3,3,0) 55%, rgba(3,3,3,0.6) 100%)",
          }}
        />
        {/* travel vignette: closes in at every handover */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: travelPulse,
            background:
              "radial-gradient(ellipse 70% 62% at 50% 50%, rgba(3,3,3,0) 38%, rgba(3,3,3,0.9) 100%)",
          }}
        />

        {/* hairline drafting grid + star markers */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-y-0 left-6 w-px bg-white/[0.08] md:left-14" />
          <div className="absolute inset-y-0 right-6 w-px bg-white/[0.08] md:right-14" />
          <div className="absolute inset-x-0 top-[13svh] h-px bg-white/[0.07]" />
          <div className="absolute inset-x-0 bottom-[13svh] h-px bg-white/[0.07]" />
          <span className="absolute left-6 top-[13svh] -translate-x-1/2 -translate-y-1/2 text-[10px] text-white/70 md:left-14">
            &#10022;
          </span>
          <span className="absolute bottom-[13svh] right-6 -translate-y-1/2 translate-x-1/2 text-[10px] text-white/70 md:right-14">
            &#10022;
          </span>
          {/* instrument chrome, in the manner of mantis.works: a city
              label at top center (hero only, it leaves with the title),
              data running vertically down the rails, a maker's mark in
              the lower corner. */}
          <motion.p
            style={{ opacity: heroOpacity }}
            className="absolute left-1/2 top-[13svh] mt-2 -translate-x-1/2 text-center font-mono text-[9px] uppercase leading-relaxed tracking-[0.24em] text-white/45"
          >
            &#9675; Varanasi, India
            <br />
            Golden hour
          </motion.p>
          <p className="absolute right-1.5 top-1/2 hidden -translate-y-1/2 font-mono text-[9px] uppercase tracking-[0.24em] text-white/40 [writing-mode:vertical-rl] md:block md:right-4">
            25.3176&deg; N, 82.9739&deg; E &nbsp;|&nbsp; One continuous journey
          </p>
          <p className="absolute left-1.5 top-[17svh] hidden rotate-180 font-mono text-[9px] uppercase tracking-[0.24em] text-white/40 [writing-mode:vertical-rl] md:block md:left-4">
            Enterprise &nbsp;|&nbsp; AI &nbsp;|&nbsp; Design systems
          </p>
          <p className="absolute bottom-[15svh] left-1.5 hidden rotate-180 font-mono text-[9px] uppercase tracking-[0.24em] text-white/40 [writing-mode:vertical-rl] md:block md:left-4">
            Made with purpose &#10022;
          </p>
        </div>

        {/* hero: a giant staggered cascade at center stage, in the
            manner of mantis.works ("we / stimulate / memory."), lines
            offset so they interleave with the scene behind; the sub
            and CTAs retreat to the lower-left corner. */}
        <motion.div
          style={{ opacity: heroOpacity, pointerEvents: heroPointer }}
          className="absolute inset-0"
        >
          {/* The cascade sits above the corner block's zone: centered in
              the frame's upper band so the two never meet, even on
              short viewports. */}
          <div className="pointer-events-none absolute inset-x-0 top-[13svh] bottom-[47svh] flex items-center justify-center px-6">
            <h1
              className="font-sans text-[clamp(2.4rem,min(9.5vw,12.5svh),8rem)] font-medium leading-[0.95] tracking-[-0.04em] text-white"
              style={TEXT_SHADOW}
            >
              <span className="block -translate-x-[12%]">My first</span>
              <span className="block translate-x-[10%]">design school</span>
              <span className="block -translate-x-[5%]">was a city.</span>
            </h1>
          </div>
          <div className="absolute bottom-[14svh] left-6 max-w-xs md:left-14">
            <p
              className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-white/50"
              style={TEXT_SHADOW}
            >
              01 / 15 &middot; Pixels by Purpose
            </p>
            <p
              className="text-sm leading-snug text-white/60 md:text-[15px]"
              style={TEXT_SHADOW}
            >
              Varanasi raised me on rhythm, ritual, and people. Pixels by
              Purpose is the portfolio of Priya Singh, product designer.
            </p>
            <div className="mt-6">
              <Link
                href="/work"
                className="inline-flex items-center gap-2 bg-white px-5 py-3 font-sans text-[13px] font-medium text-[#030303] transition-opacity hover:opacity-85"
              >
                See the Work <span aria-hidden>&rarr;</span>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* the script */}
        {CHAPTERS.map((c, i) => (
          <Chapter
            key={i}
            p={scrollYProgress}
            i={i}
            n={n}
            title={c.title}
            line={c.line}
            sub={c.sub}
            pos={c.pos}
          />
        ))}

        {/* scroll cue */}
        <p className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.28em] text-white/35">
          Scroll
        </p>
      </div>
    </div>
  );
}

// Statements in the manner of mantis.works: massive neutral grotesk,
// line-height 1.0, tight negative tracking, broken into short stacked
// lines. Each statement is anchored where its scene's composition
// leaves quiet space (pos), so the type moves around the frame with
// the journey instead of following a template. A tiny mono index and
// scene title ride above each statement like an instrument label.
const POS: Record<string, { outer: string; inner: string }> = {
  tl: { outer: "top-[17svh] left-6 md:left-14", inner: "items-start text-left" },
  tr: { outer: "top-[17svh] right-6 md:right-14", inner: "items-end text-right" },
  lc: { outer: "top-1/2 left-6 md:left-14", inner: "-translate-y-1/2 items-start text-left" },
  rc: { outer: "top-1/2 right-6 md:right-14", inner: "-translate-y-1/2 items-end text-right" },
  bl: { outer: "bottom-[14svh] left-6 md:left-14", inner: "items-start text-left" },
  br: { outer: "bottom-[14svh] right-6 md:right-14", inner: "items-end text-right" },
};

const TEXT_SHADOW = {
  textShadow: "0 2px 28px rgba(3,3,3,0.75), 0 1px 6px rgba(3,3,3,0.55)",
};

function Chapter({
  p,
  i,
  n,
  title,
  line,
  sub,
  pos,
}: {
  p: MotionValue<number>;
  i: number;
  n: number;
  title: string;
  line: string;
  sub: string;
  pos: string;
}) {
  const L = (1 - HERO_SHARE) / n;
  const start = HERO_SHARE + i * L;
  const end = start + L;
  const opacity = useTransform(
    p,
    [start, start + 0.25 * L, end - 0.25 * L, end],
    [0, 1, 1, 0]
  );
  const y = useTransform(p, [start, end], [26, -26]);
  const at = POS[pos] ?? POS.bl;

  // Break the statement into short stacked rows, cascaded like the
  // reference: each row steps sideways so the type interleaves with
  // the scene instead of sitting in a block.
  const words = line.split(" ");
  let rows: string[];
  if (words.length >= 5) {
    const a = Math.ceil(words.length / 3);
    const b = Math.ceil((2 * words.length) / 3);
    rows = [
      words.slice(0, a).join(" "),
      words.slice(a, b).join(" "),
      words.slice(b).join(" "),
    ];
  } else if (words.length >= 3) {
    const mid = Math.ceil(words.length / 2);
    rows = [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
  } else {
    rows = [line];
  }
  const fromRight = at.inner.includes("items-end");

  return (
    <motion.div style={{ opacity, y }} className={`absolute max-w-2xl ${at.outer}`}>
      <div className={`flex flex-col ${at.inner}`}>
        <p
          className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-white/50"
          style={TEXT_SHADOW}
        >
          {String(i + 2).padStart(2, "0")} / 15 &middot; {title}
        </p>
        <h2
          className="font-sans text-[clamp(2.4rem,7vw,5.8rem)] font-medium leading-[0.98] tracking-[-0.04em] text-white"
          style={TEXT_SHADOW}
        >
          {rows.map((r, k) => (
            <span
              key={k}
              className="block"
              style={
                fromRight
                  ? { marginRight: `${k * 1.4}em` }
                  : { marginLeft: `${k * 1.4}em` }
              }
            >
              {r}
            </span>
          ))}
        </h2>
        <p
          className="mt-5 max-w-xs text-sm leading-snug text-white/60 md:text-[15px]"
          style={TEXT_SHADOW}
        >
          {sub}
        </p>
      </div>
    </motion.div>
  );
}
