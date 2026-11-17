"use client";

// ZoomImage: a scroll-linked zoom-out, optionally alive to the
// cursor. The image is born pushed-in and settles back as the reader
// scrolls (the film's camera grammar); with `lean`, it also drifts
// gently away from the mouse, the same parallax the home's scenes
// carry. mode "hero" runs the pull-back as the section leaves the top
// of the viewport; mode "band" runs it while traveling through.

import { motion, useMotionValue, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

export default function ZoomImage({
  src,
  video,
  from = 1.25,
  to = 1.02,
  mode = "hero",
  lean = false,
  imgClassName = "h-full w-full object-cover",
}: {
  src: string;
  video?: string;
  from?: number;
  to?: number;
  mode?: "hero" | "band";
  lean?: boolean;
  imgClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset:
      mode === "hero" ? ["start start", "end start"] : ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [from, to]);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    if (!lean) return;
    const m = { x: 0, y: 0, lx: 0, ly: 0 };
    let raf = 0;
    const onMouse = (e: MouseEvent) => {
      m.x = (e.clientX / window.innerWidth) * 2 - 1;
      m.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMouse);
    const tick = () => {
      raf = requestAnimationFrame(tick);
      m.lx += (m.x - m.lx) * 0.05;
      m.ly += (m.y - m.ly) * 0.05;
      x.set(-m.lx * 16);
      y.set(-m.ly * 10);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouse);
    };
  }, [lean, x, y]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      {video ? (
        <motion.video
          src={video}
          poster={src}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{ scale, x, y }}
          className={`${imgClassName} will-change-transform`}
        />
      ) : (
        <motion.img
          src={src}
          alt=""
          style={{ scale, x, y }}
          className={`${imgClassName} will-change-transform`}
        />
      )}
    </div>
  );
}
