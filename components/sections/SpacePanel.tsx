"use client";

// SpacePanel: the scroll interaction for the home. Every section is
// a group pinned at the center of the page. As you scroll, it zooms
// in from a small point at the exact middle of the viewport up to
// 60% of the page width, holds there while you read, then drifts
// slightly past and fades as the next group begins its approach.
//
// The mapping is strictly linear: raw scroll progress drives the
// transforms directly, with no springs and no easing curves. The
// panel also publishes its entry and exit progress through context
// so every element inside can run its own scroll-locked journey
// (see Drift), assembling into the layout as the group docks and
// scattering as it passes.

import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { createContext, useRef } from "react";
import type { ReactNode } from "react";

export const SpaceProgress = createContext<{
  entry: MotionValue<number>;
  exit: MotionValue<number>;
} | null>(null);

export default function SpacePanel({
  children,
  first = false,
  last = false,
}: {
  children: ReactNode;
  first?: boolean;
  last?: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  const scale = useTransform(
    scrollYProgress,
    first ? [0, 0.85, 1] : last ? [0, 0.78, 1] : [0, 0.78, 0.9, 1],
    first ? [0.6, 0.6, 0.68] : last ? [0.05, 0.6, 0.6] : [0.05, 0.6, 0.6, 0.68]
  );
  const opacity = useTransform(
    scrollYProgress,
    first ? [0, 0.85, 1] : last ? [0, 0.15, 1] : [0, 0.15, 0.88, 1],
    first ? [1, 1, 0] : last ? [0, 1, 1] : [0, 1, 1, 0]
  );
  const visibility = useTransform(scrollYProgress, (p) =>
    (!first && p <= 0.005) || (!last && p >= 0.995)
      ? ("hidden" as const)
      : ("visible" as const)
  );

  // Element-level progress, shared through context. Entry runs while
  // the group grows; exit runs while it passes. The first group is
  // born assembled; the last one never scatters.
  const entry = useTransform(
    scrollYProgress,
    first ? [0, 0.0001] : [0, 0.78],
    first ? [1, 1] : [0, 1]
  );
  const exit = useTransform(
    scrollYProgress,
    last ? [0.9999, 1] : first ? [0.85, 1] : [0.9, 1],
    last ? [0, 0] : [0, 1]
  );

  return (
    <div ref={wrapRef} style={{ height: first ? "170vh" : "220vh" }}>
      <div className="sticky top-0 flex h-svh items-center justify-center">
        <motion.div
          className="w-screen flex-none will-change-transform"
          style={{ scale, opacity, visibility }}
        >
          <SpaceProgress.Provider value={{ entry, exit }}>
            {children}
          </SpaceProgress.Provider>
        </motion.div>
      </div>
    </div>
  );
}
