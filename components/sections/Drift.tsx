"use client";

// Drift: per-element motion inside a SpacePanel. Each wrapped
// element starts displaced along its own vector (x/y px at full
// scale), optionally rotated and shrunk, and converges linearly
// into its place in the layout as the group docks. On exit it keeps
// travelling in the same direction, scattering past the camera.
// `lag` (0..0.5) makes an element complete its journey later than
// its siblings, so a section assembles piece by piece. Everything
// is a linear function of raw scroll progress: no springs, no
// easing, no jitter.

import { motion, useMotionValue, useTransform } from "framer-motion";
import { useContext } from "react";
import type { ReactNode } from "react";
import { SpaceProgress } from "@/components/sections/SpacePanel";

export default function Drift({
  children,
  x = 0,
  y = 0,
  s = 1,
  r = 0,
  lag = 0,
  className,
}: {
  children?: ReactNode;
  x?: number;
  y?: number;
  s?: number;
  r?: number;
  lag?: number;
  className?: string;
}) {
  const ctx = useContext(SpaceProgress);
  const one = useMotionValue(1);
  const zero = useMotionValue(0);
  const entry = ctx ? ctx.entry : one;
  const exit = ctx ? ctx.exit : zero;

  const e = useTransform(entry, [lag, 1], [0, 1]);
  const xv = useTransform<number, number>(
    [e, exit],
    ([ee, ex]) => x * (1 - ee - 0.6 * ex)
  );
  const yv = useTransform<number, number>(
    [e, exit],
    ([ee, ex]) => y * (1 - ee - 0.6 * ex)
  );
  const rotate = useTransform<number, number>(
    [e, exit],
    ([ee, ex]) => r * (1 - ee - 0.6 * ex)
  );
  const scale = useTransform(e, (ee) => s + (1 - s) * ee);
  const opacity = useTransform<number, number>([e, exit], ([ee, ex]) =>
    Math.max(0, Math.min(ee / 0.6, 1) - ex)
  );

  return (
    <motion.div
      className={className}
      style={{ x: xv, y: yv, rotate, scale, opacity }}
    >
      {children}
    </motion.div>
  );
}
