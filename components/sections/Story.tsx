"use client";

// Story: the home as cinema. The page is one master scroll timeline
// cut into shots. Each shot is a single idea, alone on screen: it
// zooms linearly from 20% up to 100% at the center of the frame,
// holds in focus while you read, then keeps growing past the camera
// until it covers the screen and dissolves. At exactly 80% of the
// outgoing dissolve, the next shot ignites at the center behind it,
// so the film never cuts to black. Every value is a linear function
// of raw scroll progress: no springs, no easing, no jitter. The
// outgoing shot always sits above the incoming one, so you fly
// through the old frame into the new.

import { motion, useScroll, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { useRef } from "react";
import type { ReactNode } from "react";

// ── The cut. One idea per frame, in reading order. ───────────────────────────

const display =
  "text-[clamp(2.6rem,7vw,7rem)] font-light leading-[1.05] tracking-[-0.02em]";
const statement =
  "text-[clamp(1.8rem,4vw,4rem)] font-light leading-[1.15] tracking-[-0.01em]";
const giant =
  "text-[clamp(6rem,16vw,16rem)] font-light leading-none tracking-[-0.02em]";
const caption =
  "mx-auto mt-10 max-w-md text-base leading-relaxed text-white/60 md:text-lg";
const eyebrow =
  "mb-8 font-mono text-[11px] uppercase tracking-[0.3em] text-white/50";

const SHOTS: ReactNode[] = [
  // 01 · Title card
  <div key="title">
    <p className="mb-6 flex items-center justify-center gap-4">
      <span aria-hidden className="inline-block h-3 w-3 rotate-45 bg-white" />
    </p>
    <h1 className="text-[min(12vw,100px)] font-light leading-[1.05] tracking-[-0.02em]">
      Pixels by Purpose
    </h1>
    <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.3em] text-white/50">
      A Portfolio by Priya Singh
    </p>
  </div>,

  // 02 · The garden
  <div key="garden">
    <h2 className={display}>A Garden at Night.</h2>
    <p className={caption}>
      Every product is one. Alive, dense, and easy to get lost in.
    </p>
  </div>,

  // 03 · The bird is the user
  <p key="bird" className={statement}>
    <span>The hummingbird is the user. </span>
    <span className="text-white/35">
      It arrives with intent, hovers, and decides in seconds.
    </span>
  </p>,

  // 04 · The flower is the experience
  <p key="flower" className={statement}>
    <span>The flower is the experience. </span>
    <span className="text-white/35">
      Inviting from afar. Effortless up close.
    </span>
  </p>,

  // 05 · The dive
  <div key="dive">
    <h2 className={display}>Come Closer.</h2>
    <p className={caption}>The real work is inside.</p>
  </div>,

  // 06 · Petals: the disciplines
  <div key="petals">
    <h2 className={statement}>Every petal is a discipline.</h2>
    <p className={caption}>
      Research, architecture, interaction, content, accessibility. Layered so
      no one ever sees the seams.
    </p>
  </div>,

  // 07 · Pollen: the decisions
  <div key="pollen">
    <h2 className={statement}>Every grain of pollen, a decision.</h2>
    <p className={caption}>
      Thousands of small deliberate choices, joined in a living network. Felt,
      together, as one experience.
    </p>
  </div>,

  // 08 · Coherence
  <p key="coherence" className={statement}>
    <span>Alone, details. </span>
    <span className="text-white/35">Together, the experience.</span>
  </p>,

  // 09 · The stem: the system
  <div key="stem">
    <h2 className={statement}>The stem is the system.</h2>
    <p className={caption}>
      Design, product, engineering, and data sharing one channel, so intent
      flows down and truth flows up.
    </p>
  </div>,

  // 10 · The leaves: the feedback
  <div key="leaves">
    <h2 className={statement}>The leaves listen.</h2>
    <p className={caption}>
      Analytics, research, behavior, market signals. An experience that stops
      listening starts wilting.
    </p>
  </div>,

  // 11 · The roots: the foundation
  <div key="roots">
    <h2 className={display}>
      Nothing Blooms
      <br />
      Without Roots.
    </h2>
    <p className={caption}>
      Strategy, principles, design systems, culture, teams. The invisible
      structure that holds every petal in place.
    </p>
  </div>,

  // 12 · The gardens I tend
  <div key="industrial">
    <h2 className={statement}>My gardens are industrial.</h2>
    <p className={caption}>
      Network management, building automation, AI operations, enterprise
      infrastructure. Dense, high-stakes, and worth making calm.
    </p>
  </div>,

  // 11 · Chapters
  <div key="chapters">
    <p className={eyebrow}>Chapters</p>
    <p className="flex flex-wrap items-baseline justify-center gap-x-6 gap-y-3 text-[clamp(1.2rem,2.4vw,2.2rem)]">
      <span className="font-semibold tracking-tight">Honeywell</span>
      <span aria-hidden className="text-white/25">·</span>
      <span className="font-bold tracking-[0.08em]">CAMBIUM</span>
      <span aria-hidden className="text-white/25">·</span>
      <span className="font-semibold tracking-tight">cnMaestro</span>
      <span aria-hidden className="text-white/25">·</span>
      <span className="font-bold tracking-tight">Glynk</span>
      <span aria-hidden className="text-white/25">·</span>
      <span className="font-serif italic">Cessna</span>
    </p>
  </div>,

  // 12 · Proof, announced
  <h2 key="work" className={display}>
    Measured,
    <br />
    Not Claimed.
  </h2>,

  // 13 · Stat one
  <div key="stat-mttr">
    <p className={giant}>80%</p>
    <p className={caption}>
      Faster fault diagnosis after the cnMaestro rebuild, from reactive
      fire-fighting to proactive prevention
    </p>
  </div>,

  // 14 · Stat two
  <div key="stat-scale">
    <p className={giant}>40k+</p>
    <p className={caption}>
      Devices the redesigned architecture scales to, monitored around the
      clock by the teams who run it
    </p>
  </div>,

  // 17 · The return
  <p key="return" className={statement}>
    <span>The bird returns. </span>
    <span className="text-white/35">The garden has evolved.</span>
  </p>,

  // 19 · Closing card
  <div key="closing">
    <h2 className={display}>
      Every Pixel <span className="text-white/35">Is a Decision.</span>
    </h2>
    <p className={caption}>I make them on purpose.</p>
    <div className="mt-14 flex flex-col items-center gap-8">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <a
          href="/work"
          className="inline-flex items-center gap-3 bg-white px-6 py-4 font-mono text-[11px] uppercase tracking-[0.24em] text-[#030303] transition-opacity hover:opacity-85"
        >
          See the Work <span aria-hidden>&rarr;</span>
        </a>
        <a
          href="/contact"
          className="inline-flex items-center gap-3 bg-white/10 px-6 py-4 font-mono text-[11px] uppercase tracking-[0.24em] text-white/80 transition-colors hover:bg-white/15 hover:text-white"
        >
          Start a Conversation
        </a>
      </div>
      <p className="flex items-center gap-3 text-lg font-semibold tracking-tight">
        <span aria-hidden>&#10070;</span> Pixels by Purpose
      </p>
    </div>
  </div>,
];

// ── The projector. ───────────────────────────────────────────────────────────

const OVERLAP = 0.05; // the next shot ignites at 80% of the outgoing dissolve

// The first stretch of scroll belongs to the galaxy: the camera
// dives to the core while the title holds. The story itself plays
// out over the remaining share of the timeline. Mirrors DIVE in
// Starfield.
const LEAD = 0.08;

// Where each shot hides in the galaxy: a dock offset (vw/svh) away
// from dead center. Shots emerge purely through depth (scale and
// focus), never sliding in from the sides. Cycled by index; the
// opening and closing shots stay centered.
const POSES = [
  { ax: -8, ay: -7 },
  { ax: 8, ay: 6 },
  { ax: 0, ay: -9 },
  { ax: -8, ay: 8 },
  { ax: 9, ay: -5 },
  { ax: -3, ay: 9 },
  { ax: -9, ay: 2 },
  { ax: 7, ay: -8 },
];

function Shot({
  p,
  i,
  n,
  children,
}: {
  p: MotionValue<number>;
  i: number;
  n: number;
  children: ReactNode;
}) {
  const L = (1 - LEAD) / n;
  const first = i === 0;
  const last = i === n - 1;
  // Shots occupy the timeline after the dive; the title also covers
  // the dive itself, holding on screen while the camera plunges.
  const start = first ? 0 : LEAD + i * L - OVERLAP * L;
  const end = LEAD + (i + 1) * L;
  const S = end - start;
  const pose = first || last ? { ax: 0, ay: 0 } : POSES[i % POSES.length];

  // Slow reading pace: focus at half the shot, hold to 78%, then
  // dissolve to the cut.
  const scale = useTransform(
    p,
    first
      ? [start, start + 0.82 * S, end]
      : last
      ? [start, start + 0.5 * S, end]
      : [start, start + 0.5 * S, start + 0.78 * S, end],
    first ? [1, 1, 1.9] : last ? [0.2, 1, 1] : [0.2, 1, 1, 1.9]
  );
  const opacity = useTransform(
    p,
    first
      ? [start, start + 0.82 * S, end]
      : last
      ? [start, start + 0.1 * S, end]
      : [start, start + 0.1 * S, start + 0.78 * S, end],
    first ? [1, 1, 0] : last ? [0, 1, 1] : [0, 1, 1, 0]
  );
  // Depth of field while approaching; sharp from focus onward. The
  // opening title card is born in focus.
  const filter = useTransform(p, (v) => {
    if (first) return "none";
    const t = Math.min(1, Math.max(0, (v - start) / (0.5 * S)));
    return t >= 1 ? "none" : `blur(${(6 * (1 - t)).toFixed(1)}px)`;
  });
  const visibility = useTransform(p, (v) =>
    v < start - 0.001 || (!last && v > end + 0.001)
      ? ("hidden" as const)
      : ("visible" as const)
  );

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center px-6 text-center will-change-transform"
      style={{ zIndex: n - i, scale, opacity, filter, visibility }}
    >
      <div
        className="w-full max-w-5xl text-white"
        style={{
          marginLeft: `${pose.ax}vw`,
          marginTop: `${pose.ay}svh`,
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}

export default function Story() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={ref} style={{ height: `${SHOTS.length * 100}vh` }}>
      <div className="sticky top-0 h-svh overflow-hidden">
        {SHOTS.map((shot, i) => (
          <Shot key={i} p={scrollYProgress} i={i} n={SHOTS.length}>
            {shot}
          </Shot>
        ))}
      </div>
    </div>
  );
}
