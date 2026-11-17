"use client";

// ─────────────────────────────────────────────────────────────────────────────
// GameHUD — the first playable piece of the "UX Designer" game concept.
//
// A live pixel-game status bar: avatar + level, an XP bar that fills, an HP
// meter, the mission, and Ideas / Insights / Score counters that tick up on
// load. Rendered at final values by default (robust, works with no JS) and
// animated from zero as a foreground enhancement. Honors reduced motion.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useLayoutEffect, useRef } from "react";

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

// ── Tiny pixel icons ──────────────────────────────────────────────────────────
const Heart = ({ c = "#ff5165", s = 16 }: { c?: string; s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 16 16" aria-hidden="true">
    <path
      fill={c}
      d="M8 14L2 8.2C.7 6.9.7 4.8 2 3.6c1.2-1.2 3-1 4 .2l2 2 2-2c1-1.2 2.8-1.4 4-.2 1.3 1.2 1.3 3.3 0 4.6L8 14z"
    />
  </svg>
);
const Bulb = ({ s = 16 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 16 16" aria-hidden="true">
    <path fill="#ffcf4a" d="M8 1a5 5 0 0 0-3 9v2h6V10A5 5 0 0 0 8 1z" />
    <rect x="5.5" y="13" width="5" height="1.6" rx="0.5" fill="#c9992e" />
  </svg>
);
const Gem = ({ s = 16 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 16 16" aria-hidden="true">
    <path fill="#5cc8ff" d="M3 3h10l2.5 3.5L8 15 .5 6.5 3 3z" />
    <path fill="#9adcff" d="M3 3h10l-1.5 3.5h-7L3 3z" opacity=".8" />
  </svg>
);
const Star = ({ s = 16 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 16 16" aria-hidden="true">
    <path
      fill="#ffcf4a"
      d="M8 1l2 4.3 4.7.6-3.5 3.2 1 4.6L8 11.3 3.8 13.7l1-4.6L1.3 5.9 6 5.3 8 1z"
    />
  </svg>
);
const Gear = ({ s = 18 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 20 20" aria-hidden="true">
    <path
      fill="#7c828b"
      d="M10 6.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm0 2a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z"
    />
    <path
      fill="#7c828b"
      d="M8.7 1h2.6l.5 2.1 1.6.9 2-.8 1.3 2.3-1.5 1.5v1.9l1.5 1.5-1.3 2.3-2-.8-1.6.9-.5 2.1H8.7l-.5-2.1-1.6-.9-2 .8L3.3 12l1.5-1.5V8.6L3.3 7.1l1.3-2.3 2 .8 1.6-.9L8.7 1z"
      opacity=".5"
    />
  </svg>
);

function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg border border-white/10 bg-[#0c0e11] px-4 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] ${className}`}
    >
      {children}
    </div>
  );
}

export default function GameHUD() {
  const rootRef = useRef<HTMLDivElement>(null);

  useIso(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || document.hidden) return; // leave final values (robust baseline)

    const counters = Array.from(
      root.querySelectorAll<HTMLElement>("[data-count]")
    );
    const fills = Array.from(root.querySelectorAll<HTMLElement>("[data-fill]"));

    counters.forEach((el) => (el.textContent = "0"));
    fills.forEach((el) => (el.style.width = "0%"));

    const DUR = 1200;
    let raf = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      const e = easeOut(Math.min(1, (now - start) / DUR));
      counters.forEach((el) => {
        const f = Number(el.dataset.count || 0);
        el.textContent = Math.round(f * e).toLocaleString();
      });
      fills.forEach((el) => {
        const f = Number(el.dataset.fill || 0);
        el.style.width = f * e + "%";
      });
      if (e < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={rootRef}
      className="rounded-xl border border-white/10 bg-[#08090a] p-2.5 shadow-[0_0_0_1px_rgba(0,0,0,0.6),0_18px_40px_-20px_rgba(0,0,0,0.8)]"
      style={{ fontFamily: "var(--font-mono)" }}
    >
      <div className="flex flex-wrap items-stretch gap-2.5">
        {/* Avatar + Level + XP */}
        <Panel className="flex min-w-[240px] flex-1 items-center gap-3">
          <div
            className="h-14 w-14 shrink-0 rounded-md border-2 border-white/15 bg-[#111]"
            style={{
              backgroundImage: "url(/priya-pixel.png)",
              backgroundSize: "230%",
              backgroundPosition: "50% 20%",
              imageRendering: "pixelated",
            }}
            aria-label="Player avatar"
            role="img"
          />
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-white">
              UX Designer
            </p>
            <div className="mt-0.5 flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-forest-bright">
                Lvl 12
              </span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                <div
                  data-fill="71.6"
                  className="h-full rounded-full bg-gradient-to-r from-[#f2b23a] to-[#ffd873]"
                  style={{ width: "71.6%" }}
                />
              </div>
            </div>
            <p className="mt-1 text-[10px] tracking-[0.08em] text-white/40">
              XP <span className="text-white/60">6450 / 9000</span>
            </p>
          </div>
        </Panel>

        {/* HP */}
        <Panel className="flex items-center gap-2.5">
          <Heart s={18} />
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-white/45">
              HP
            </p>
            <p className="text-[13px] font-bold text-white">5/5</p>
          </div>
          <div className="ml-1 flex gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="h-4 w-1.5 rounded-[2px]"
                style={{ background: "#49d17a" }}
              />
            ))}
          </div>
        </Panel>

        {/* Mission */}
        <Panel className="flex min-w-[220px] flex-1 flex-col justify-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#f2a93a]">
            Mission
          </p>
          <p className="mt-0.5 text-[11px] font-medium leading-tight text-white/80">
            Design meaningful experiences.
            <br />
            Solve real user problems.
          </p>
        </Panel>

        {/* Stats */}
        <Panel className="flex items-center gap-5">
          <Stat icon={<Bulb />} label="Ideas" value={126} />
          <Stat icon={<Gem />} label="Insights" value={88} />
          <Stat icon={<Star />} label="Score" value={9450} />
        </Panel>

        {/* Settings */}
        <Panel className="flex items-center justify-center px-3">
          <Gear />
        </Panel>
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <div>
        <p className="text-[9px] uppercase tracking-[0.14em] text-white/45">
          {label}
        </p>
        <p
          data-count={value}
          className="text-[15px] font-bold leading-none text-white"
        >
          {value.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
