"use client";

// Editorial typography floating in the universe. Each heading fades in, drifts
// upward, scales a touch, and fades away as the next takes its place. Transitions
// overlap; nothing snaps. Driven entirely by scroll progress.

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

type Heading = {
  label: string;
  title: string;
  line?: string;
  body?: string;
  // Hero-only (beat 0): a name-dominant layout (reference data layout).
  // Giant name, the thesis as the statement line, then a small aside.
  hero?: boolean;
  name?: [string, string];
  aside?: string;
};

const HEADINGS: Heading[] = [
  {
    hero: true,
    label: "Product Designer",
    title: "Every pixel is a decision.",
    name: ["Priya", "Singh"],
    aside: "Let me show you how I learned to see them.",
  },
  {
    label: "01",
    title: "It begins with a single point of light.",
    line: "A pixel, deciding what to become.",
    body: "One square, lit on purpose, is already a choice: to clarify, to guide, to reassure, to disappear. I have never been able to see a screen as anything less than a thousand of those small decisions, held together.",
  },
  {
    label: "02",
    title: "I walk toward the noise.",
    line: "The dense, difficult, unglamorous rooms.",
    body: "Enterprise, operations, the machinery that runs buildings and keeps networks alive. Where the complexity is real and the stakes are heavy, and most designers look away. That is the room I want. Making the hard thing feel simple is the most honest work I know.",
  },
  {
    label: "03",
    title: "I carry the weight, so the screen can stay light.",
    line: "Calm is built, not decorated.",
    body: "The complexity never disappears. I move it into the structure, out of sight, and leave the person with nothing but their decision. The interface goes quiet. The system does the lifting. That quiet is the entire point.",
  },
  {
    label: "04",
    title: "I teach a product to speak in one voice.",
    line: "Decide it once. Mean it everywhere.",
    body: "A design system is less a library than a language. Built well, a growing team moves fast without coming apart, and every surface remembers the same intention. One product. One voice. Nothing decided twice.",
  },
  {
    label: "05",
    title: "Now the machine has opinions too.",
    line: "So the work became trust.",
    body: "I shape intelligence the way I shape anything else, as a material and not an ornament. It should lift what a person carries, and know the difference between deciding for them and asking. The best intelligence leaves you steadier than it found you.",
  },
  {
    label: "06",
    title: "Still, I keep a light on in the lab.",
    line: "What happens if, asked again and again.",
    body: "Creative coding, motion, small experiments with no purpose but the question. This site is one of them, built by hand rather than bought. Curiosity is not a thing I do after work. It is the current running under all of it.",
  },
  {
    label: "The invitation",
    title: "Every pixel is a decision. I make them on purpose.",
    line: "If your team is building something hard and worth getting right, I would like to hear about it.",
  },
];

export default function FloatingHeadings() {
  const { scrollYProgress } = useScroll();

  return (
    <div className="pointer-events-none fixed inset-0 z-10">
      {HEADINGS.map((h, i) => (
        <Item key={i} h={h} i={i} total={HEADINGS.length} progress={scrollYProgress} />
      ))}
      <div className="pointer-events-none fixed bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.28em] text-mist/35">
        Scroll
      </div>
    </div>
  );
}

function Item({
  h,
  i,
  total,
  progress,
}: {
  h: Heading;
  i: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const center = (i + 0.5) / total;
  const span = 1 / total;
  const isFirst = i === 0;
  const isLast = i === total - 1;
  // The first heading is fully present at the top; the last stays at the bottom.
  const opIn = isFirst
    ? [0, center + span * 0.28, center + span * 0.75]
    : isLast
      ? [center - span * 0.75, center - span * 0.28, 1]
      : [center - span * 0.75, center - span * 0.28, center + span * 0.28, center + span * 0.75];
  const opOut = isFirst ? [1, 1, 0] : isLast ? [0, 1, 1] : [0, 1, 1, 0];
  const opacity = useTransform(progress, opIn, opOut);
  const y = useTransform(
    progress,
    [center - span * 0.75, center + span * 0.75],
    [70, -70]
  );
  const scale = useTransform(
    progress,
    [center - span * 0.75, center + span * 0.75],
    [0.94, 1.08]
  );

  return (
    <motion.div
      style={{ opacity, y, scale }}
      className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center will-change-transform"
    >
      {h.hero ? (
        <>
          <p className="mb-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-mist/50">
            <span className="inline-block h-1.5 w-1.5 bg-forest-bright" />
            {h.label}
          </p>
          <h1
            className="font-semibold leading-[0.86] tracking-[-0.04em]"
            style={{ fontFamily: "var(--font-brico)" }}
          >
            <span className="block text-[clamp(3.5rem,14vw,12rem)] text-mist">
              {h.name![0]}
            </span>
            <span className="block text-[clamp(3.5rem,14vw,12rem)] text-mist/35">
              {h.name![1]}
            </span>
          </h1>
          <p className="mt-9 max-w-2xl text-lg leading-relaxed text-mist/85 md:text-xl">
            {h.title}
          </p>
          <p className="mt-6 max-w-md font-serif text-sm italic leading-snug text-mist/35">
            {h.aside}
          </p>
        </>
      ) : (
        <>
          <p className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-mist/50">
            <span className="inline-block h-1.5 w-1.5 bg-forest-bright" />
            {h.label}
          </p>
          <h2
            className="max-w-4xl text-[clamp(2.2rem,6.5vw,5.5rem)] font-semibold leading-[0.98] tracking-[-0.02em] text-mist"
            style={{ fontFamily: "var(--font-brico)" }}
          >
            {h.title}
          </h2>
          {h.line && (
            <p className="mt-7 max-w-md font-serif text-lg italic leading-snug text-mist/60 md:text-xl">
              {h.line}
            </p>
          )}
          {h.body && (
            <p className="mt-6 max-w-xl text-base leading-relaxed text-mist/45">
              {h.body}
            </p>
          )}
        </>
      )}
    </motion.div>
  );
}
