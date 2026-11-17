"use client";

// Intro — a greeting preloader. On the first load of a session the screen is
// black and cycles greetings in many languages, each with the purposeful pixel
// beside it, then the panel rises like a weighted stage curtain (swagged hem,
// forest-green footlight sweeping up) to reveal the stage behind it.
// Plays once per session; skipped for reduced motion.

import { useEffect, useState } from "react";

const GREETINGS = [
  "Hello",
  "नमस्ते",
  "Bonjour",
  "Hola",
  "Ciao",
  "こんにちは",
  "안녕하세요",
  "Olá",
  "Hallo",
  "Hello",
];

const PER_WORD = 260; // ms per greeting
const LEAVE_MS = 1200; // curtain-rise transition (matches CSS 1.15s + buffer)

export default function Intro() {
  const [phase, setPhase] = useState<"loading" | "leaving" | "done">("loading");
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (sessionStorage.getItem("introSeen")) {
      setPhase("done");
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      sessionStorage.setItem("introSeen", "1");
      setPhase("done");
      return;
    }

    document.body.style.overflow = "hidden";

    let i = 0;
    const tick = window.setInterval(() => {
      i += 1;
      if (i >= GREETINGS.length) {
        window.clearInterval(tick);
        setPhase("leaving");
        window.setTimeout(() => {
          setPhase("done");
          sessionStorage.setItem("introSeen", "1");
          document.body.style.overflow = "";
        }, LEAVE_MS);
      } else {
        setIdx(i);
      }
    }, PER_WORD);

    return () => {
      window.clearInterval(tick);
      document.body.style.overflow = "";
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div className={`intro ${phase === "leaving" ? "intro--leaving" : ""}`} aria-hidden="true">
      <div className="intro__word">
        <span>{GREETINGS[idx]}</span>
        <i className="intro__pixel" />
      </div>
    </div>
  );
}
