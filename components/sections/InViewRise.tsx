"use client";

// InViewRise: the film's motion carried into the editorial. Blocks
// rise and settle as they enter the viewport, once, with a long soft
// ease, in the manner of noomo's masked line reveals.

import { motion } from "framer-motion";

export default function InViewRise({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
