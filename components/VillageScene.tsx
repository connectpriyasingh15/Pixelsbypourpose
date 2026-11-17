"use client";

// ─────────────────────────────────────────────────────────────────────────────
// VillageScene — Stage 1 of "The Quest for Clarity", rebuilt as an immersive
// pixel-art scene. The Village of Real People: a hand-drawn world (sky, cottage,
// tree, bench) with sprite characters. You talk to Ravi through an RPG dialogue
// box; The Assumption appears as a ghost that swells when you lead the witness
// and shatters when you ask the real "why".
//
// The scene is a low-res canvas (320x180) upscaled with pixelated rendering.
// All interaction lives in an HTML overlay styled like a game. The canvas paints
// one frame immediately (so it shows even when a tab is suspended) and animates
// (clouds, idle bob, the ghost) via rAF in a live browser.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from "react";

// ── Dialogue content ──────────────────────────────────────────────────────────
type Kind = "open" | "closed" | "leading";
interface Choice {
  text: string;
  kind: Kind;
  response: string;
  toast: string;
  dInsight: number;
  dHumanity: number;
  dAssumption: number;
}
interface Step {
  speaker: string;
  role: string;
  line: string;
  boss?: boolean;
  choices: Choice[];
}

const START = { insights: 88, humanity: 85, assumption: 70 };

const STEPS: Step[] = [
  {
    speaker: "Ravi",
    role: "Night-shift Ops Lead",
    line: "I'll keep it simple. Give me more alerts, and make the dashboard load faster. That'll fix everything.",
    choices: [
      { text: "Tell me about the last alert that actually mattered.", kind: "open", response: "Last week a node went dark for twenty minutes before I caught it. It was buried under forty others that turned out to be nothing.", toast: "+7 Insight", dInsight: 7, dHumanity: 2, dAssumption: -18 },
      { text: "How many alerts do you get per shift?", kind: "closed", response: "Hundreds? I stopped counting years ago.", toast: "+1 Insight", dInsight: 1, dHumanity: 0, dAssumption: -3 },
      { text: "So, a bigger alerts panel and a speed boost. Got it.", kind: "leading", response: "...Sure. Whatever you think is best.", toast: "Humanity -8 · The Assumption grows", dInsight: 0, dHumanity: -8, dAssumption: 12 },
    ],
  },
  {
    speaker: "Ravi",
    role: "Night-shift Ops Lead",
    line: "Thing is, they're all red. Every alert looks like the world is ending. After a while you just stop believing them.",
    choices: [
      { text: "So what do you do now when one comes in?", kind: "open", response: "Honestly? I ignore most and go check the racks myself. My own eyes beat trusting that screen.", toast: "+8 Insight", dInsight: 8, dHumanity: 3, dAssumption: -20 },
      { text: "So the alerts arrive too slowly.", kind: "leading", response: "I mean... it was never really about speed.", toast: "Humanity -6 · you led the witness", dInsight: 0, dHumanity: -6, dAssumption: 10 },
      { text: "Which alerts show up red?", kind: "closed", response: "All of them. That's the whole problem.", toast: "+1 Insight", dInsight: 1, dHumanity: 0, dAssumption: -2 },
    ],
  },
  {
    speaker: "Ravi",
    role: "Night-shift Ops Lead",
    line: "If I miss the one that matters, that's on me. So I'd rather drown in alerts than miss it. That's why I asked for more.",
    choices: [
      { text: "So the fear is missing the critical one, not having too few?", kind: "open", response: "...Yeah. Exactly that. I never put it that way, but yeah.", toast: "+9 Insight · you found the fear", dInsight: 9, dHumanity: 3, dAssumption: -22 },
      { text: "Got it, we'll add more alerts to be safe.", kind: "leading", response: "...I guess. If you say so.", toast: "Humanity -9 · The Assumption feeds", dInsight: 0, dHumanity: -9, dAssumption: 15 },
      { text: "How long have you worked nights?", kind: "closed", response: "Six years. Why?", toast: "Off the trail", dInsight: 0, dHumanity: -1, dAssumption: 4 },
    ],
  },
  {
    speaker: "The Assumption",
    role: "whispering",
    boss: true,
    line: "He asked for more alerts. Twice. Just build more alerts and move on.",
    choices: [
      { text: "Ask why he wants more, and keep asking.", kind: "open", response: "Why more alerts? To not miss the critical one. Why is that hard? He can't tell critical from noise. Why not? Every alert looks equally urgent. There it is.", toast: "THE ASSUMPTION shatters · +10 Insight", dInsight: 10, dHumanity: 2, dAssumption: -100 },
      { text: "Add more alerts, but color the urgent ones red.", kind: "closed", response: "You're solving before you understand. You skipped the truth that tells you what 'urgent' even means to him.", toast: "Insight lost · you solved too soon", dInsight: 2, dHumanity: -2, dAssumption: -8 },
      { text: "He said it twice. Ship the alerts.", kind: "leading", response: "The Assumption smiles. You leave with his words, not his need.", toast: "Humanity -10 · The Assumption wins", dInsight: 0, dHumanity: -10, dAssumption: 20 },
    ],
  },
];

const clamp = (v: number) => (v < 0 ? 0 : v > 100 ? 100 : v);
const kindColor: Record<Kind, string> = { open: "#57d38c", closed: "#8b93a0", leading: "#b48bff" };

// ── Sprites (each char = one art pixel; "." = transparent) ────────────────────
const PLAYER = [
  "....2222....",
  "...222222...",
  "..2211112...",
  "..21ssss12..",
  "..2ssssss2..",
  "..2s1ss1s2..",
  "..2ssssss2..",
  "...sssss....",
  "..tttttt....",
  ".uttttttu...",
  ".uttttttu...",
  ".tttttttt...",
  "..tttttt....",
  "..jjjjjj....",
  "..jj..jj....",
  "..jj..jj....",
  "..kk..kk....",
  "..oo..oo....",
];
const PLAYER_MAP: Record<string, string> = { "1": "#3f2c1c", "2": "#6d4a2c", s: "#e9b78d", t: "#d8cdb6", u: "#b3a88f", j: "#35527d", k: "#26395a", o: "#f2f2ee" };

const RAVI = [
  "...11111.....",
  "..1111111....",
  "..11ssss1....",
  "..1ssssss....",
  "..1s1ss1s....",
  "..1ssssss....",
  "...sssss.....",
  "..gggggg.....",
  ".gggggggg....",
  ".gggggggg....",
  ".gggggggg....",
  "..pppppp.....",
  ".ppp..ppp....",
  ".bb....bb....",
];
const RAVI_MAP: Record<string, string> = { "1": "#241a12", s: "#d9a679", g: "#5c6b76", p: "#333842", b: "#22252b" };

const GHOST = [
  "...aaaa....",
  "..aaaaaa...",
  ".aaaaaaaa..",
  ".aaaaaaaa..",
  ".aaeaaeaa..",
  ".aaaaaaaa..",
  ".aawaawaa..",
  ".aaaaaaaa..",
  ".aaaaaaaa..",
  ".a.aa.aa.a.",
];
const GHOST_MAP: Record<string, string> = { a: "#9a6bff", e: "#1a0e33", w: "#c9b0ff" };

export default function VillageScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Game state
  const [idx, setIdx] = useState(0);
  const [insights, setInsights] = useState(START.insights);
  const [humanity, setHumanity] = useState(START.humanity);
  const [assumption, setAssumption] = useState(START.assumption);
  const [chosen, setChosen] = useState<number | null>(null);
  const [talking, setTalking] = useState(false);
  const [finished, setFinished] = useState(false);

  const step = STEPS[idx];
  const picked = chosen !== null ? step.choices[chosen] : null;

  // Refs the render loop reads (so the scene reacts without re-running the loop).
  const assumptionRef = useRef(assumption);
  const talkingRef = useRef(talking);
  const bossRef = useRef(false);
  useEffect(() => { assumptionRef.current = assumption; }, [assumption]);
  useEffect(() => { talkingRef.current = talking; }, [talking]);
  useEffect(() => { bossRef.current = talking && !!step.boss && chosen === null; }, [talking, step.boss, chosen]);

  // ── Canvas: draw the village ────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 320, H = 180;
    canvas.width = W;
    canvas.height = H;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const rect = (x: number, y: number, w: number, h: number, c: string) => {
      ctx.fillStyle = c;
      ctx.fillRect(x | 0, y | 0, Math.ceil(w), Math.ceil(h));
    };
    const blit = (
      rows: string[],
      map: Record<string, string>,
      ox: number,
      oy: number,
      alpha = 1
    ) => {
      ctx.globalAlpha = alpha;
      for (let y = 0; y < rows.length; y++) {
        const row = rows[y];
        for (let x = 0; x < row.length; x++) {
          const c = map[row[x]];
          if (c) rect(ox + x, oy + y, 1, 1, c);
        }
      }
      ctx.globalAlpha = 1;
    };

    const draw = (t: number) => {
      // Sky
      const bands = ["#5aa9e0", "#69b4e6", "#7cc0ec", "#93cdf1", "#aed9f5"];
      for (let i = 0; i < bands.length; i++) rect(0, i * 9, W, 9, bands[i]);
      rect(0, 45, W, 52, "#c3e6fa");

      // Clouds drift
      const drift = reduce ? 0 : (t * 0.006) % (W + 60);
      const cloud = (cx: number, cy: number) => {
        const x = ((cx - drift) % (W + 60) + (W + 60)) % (W + 60) - 30;
        rect(x, cy, 22, 6, "#ffffff");
        rect(x + 5, cy - 3, 14, 4, "#ffffff");
        rect(x, cy + 6, 22, 2, "#dfeefc");
      };
      cloud(60, 18); cloud(200, 30); cloud(280, 14);

      // Distant hills
      rect(0, 78, W, 22, "#4f9a44");
      for (let x = 0; x < W; x += 24) { rect(x, 74, 16, 6, "#57a84b"); }

      // Ground platform (grass top, dirt body)
      rect(0, 96, W, 6, "#68c153");   // lit grass edge
      rect(0, 102, W, 10, "#4f9a3f"); // grass
      rect(0, 112, W, 68, "#6b4a2c"); // dirt
      for (let x = 0; x < W; x += 10) { rect(x + 3, 120, 2, 2, "#5a3d24"); rect(x + 7, 134, 2, 2, "#7a5636"); }
      rect(0, 150, W, 30, "#5c3f26"); // darker lower dirt

      // Path
      for (let i = 0; i < 7; i++) rect(150 - i, 104 + i * 6, 26 + i * 3, 5, "#b9975f");

      // Cottage (left)
      rect(40, 62, 58, 40, "#c8a06a");           // wall
      rect(38, 60, 62, 6, "#a5794a");            // wall top trim
      // roof
      for (let i = 0; i < 12; i++) rect(34 + i * 2.6, 46 + i, 60 - i * 5.2, 2, "#8a4b34");
      rect(46, 78, 12, 24, "#5b3a24");           // door
      rect(56, 88, 2, 2, "#e8c86a");             // knob
      rect(72, 70, 14, 12, "#8fd0e6");           // window
      rect(72, 76, 14, 1, "#3d5560"); rect(79, 70, 1, 12, "#3d5560");

      // Tree (right)
      rect(268, 74, 6, 28, "#5b3a22");
      rect(256, 46, 30, 24, "#3f7d38");
      rect(260, 40, 22, 12, "#4a9040");
      rect(252, 56, 12, 12, "#478c3d");
      rect(278, 56, 12, 12, "#478c3d");

      // Bench (center-right)
      rect(176, 104, 40, 4, "#8a5a34");
      rect(178, 108, 4, 8, "#6f4526"); rect(210, 108, 4, 8, "#6f4526");
      rect(176, 98, 40, 3, "#9a663c");

      // Idle bob
      const bob = reduce ? 0 : Math.round(Math.sin(t * 0.004));

      // Ravi on the bench
      blit(RAVI, RAVI_MAP, 184, 88 + bob, 1);

      // Player standing near the path
      blit(PLAYER, PLAYER_MAP, 132, 84 - bob, 1);

      // The Assumption ghost, only while facing the boss beat
      if (bossRef.current) {
        const a = assumptionRef.current / 100;
        const float = reduce ? 0 : Math.round(Math.sin(t * 0.005) * 2);
        blit(GHOST, GHOST_MAP, 196, 66 + float, 0.35 + a * 0.5);
      }
    };

    draw(0); // immediate first frame

    if (reduce) return;
    let raf = 0;
    let last = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (document.hidden || now - last < 33) return;
      last = now;
      draw(now);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // ── Actions ─────────────────────────────────────────────────────────────────
  const choose = (ci: number) => {
    if (chosen !== null) return;
    const c = step.choices[ci];
    setChosen(ci);
    setInsights((v) => v + c.dInsight);
    setHumanity((v) => clamp(v + c.dHumanity));
    setAssumption((v) => clamp(v + c.dAssumption));
  };
  const next = () => {
    if (idx + 1 >= STEPS.length) { setFinished(true); return; }
    setIdx(idx + 1);
    setChosen(null);
  };
  const replay = () => {
    setIdx(0); setInsights(START.insights); setHumanity(START.humanity);
    setAssumption(START.assumption); setChosen(null); setFinished(false); setTalking(true);
  };

  const hearts = Math.round(humanity / 20);
  const defeated = assumption <= 15;
  const empathyKept = humanity >= 80;

  return (
    <div className="mx-auto w-full max-w-3xl" style={{ fontFamily: "var(--font-mono)" }}>
      {/* Stage title */}
      <div className="mb-3 flex items-baseline justify-between">
        <p className="text-[11px] uppercase tracking-[0.22em] text-forest-bright">
          Stage 1 · Empathize
        </p>
        <p className="text-[10px] uppercase tracking-[0.18em] text-mist/35">
          The Village of Real People
        </p>
      </div>

      {/* The scene */}
      <div
        className="relative w-full overflow-hidden rounded-lg border border-white/10"
        style={{ aspectRatio: "16 / 9", boxShadow: "0 0 0 3px #05070a, 0 24px 50px -24px #000" }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          style={{ imageRendering: "pixelated" }}
          aria-label="A pixel-art village. Ravi sits on a bench outside a cottage."
          role="img"
        />

        {/* Pixel HUD */}
        <div className="absolute left-2 top-2 flex flex-col gap-1 text-[9px] uppercase tracking-[0.1em]">
          <Chip label={`◆ ${insights}`} sub="Insights" color="#5cc8ff" />
          <Chip label={"♥".repeat(Math.max(0, hearts)) + "♡".repeat(Math.max(0, 5 - hearts))} sub="Humanity" color="#ff6a97" />
          <Chip label={`👁 ${assumption}`} sub="Assumption" color="#b48bff" />
        </div>

        {/* Idle prompt: talk to Ravi */}
        {!talking && !finished && (
          <button
            onClick={() => setTalking(true)}
            className="absolute inset-0 flex items-end justify-center pb-8"
          >
            <span className="animate-pulse rounded border-2 border-white/70 bg-black/70 px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-white">
              ▶ Talk to Ravi
            </span>
          </button>
        )}

        {/* RPG dialogue box */}
        {talking && !finished && (
          <div className="absolute inset-x-2 bottom-2">
            <div
              className="border-2 border-white/70 bg-[#0a0e16]/95 p-3"
              style={{ boxShadow: "0 0 0 2px #05070a, inset 0 0 0 1px #2a3550" }}
            >
              {/* nameplate */}
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="flex h-6 w-6 items-center justify-center border text-[11px] font-bold"
                  style={{
                    borderColor: step.boss ? "#b48bff88" : "#ffffff55",
                    background: step.boss ? "#241436" : "#15202f",
                    color: step.boss ? "#d3b6ff" : "#e8e8e3",
                  }}
                >
                  {step.boss ? "👁" : "R"}
                </span>
                <span
                  className="text-[11px] font-bold uppercase tracking-[0.14em]"
                  style={{ color: step.boss ? "#d3b6ff" : "#e8e8e3" }}
                >
                  {step.speaker}
                </span>
                <span className="text-[9px] uppercase tracking-[0.14em] text-mist/40">
                  {step.role}
                </span>
              </div>

              {/* line or response */}
              <p
                className="min-h-[2.5rem] text-[13px] leading-snug"
                style={{ color: step.boss ? "#cdb6ff" : "#e8e8e3", fontStyle: step.boss ? "italic" : "normal" }}
              >
                {picked ? picked.response : step.line}
              </p>

              {picked ? (
                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: kindColor[picked.kind] }}>
                    {picked.toast}
                  </span>
                  <button
                    onClick={next}
                    className="border-2 border-forest-bright/60 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-mist transition-colors hover:bg-forest-bright hover:text-night"
                  >
                    {idx + 1 >= STEPS.length ? "Finish ▸" : "Next ▸"}
                  </button>
                </div>
              ) : (
                <div className="mt-2 space-y-1">
                  {step.choices.map((c, ci) => (
                    <button
                      key={ci}
                      onClick={() => choose(ci)}
                      className="group flex w-full items-start gap-2 px-1 py-1 text-left"
                    >
                      <span className="text-forest-bright opacity-0 group-hover:opacity-100">▸</span>
                      <span className="text-[12px] leading-snug text-mist/70 group-hover:text-mist">
                        {c.text}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Debrief overlay */}
        {finished && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 p-4">
            <div className="w-full max-w-md border-2 border-white/70 bg-[#0a0e16] p-5" style={{ boxShadow: "0 0 0 2px #05070a" }}>
              <p className="text-[10px] uppercase tracking-[0.2em] text-forest-bright">
                {defeated ? "Stage cleared" : "Stage ended"}
              </p>
              <h3 className="mt-1 font-serif text-2xl font-light tracking-tight text-mist">
                {defeated && empathyKept ? "You found the real need." : defeated ? "You got there, at a cost." : "You left with his solution."}
              </h3>
              <p className="mt-3 border-l-2 border-forest-bright/40 pl-3 font-serif text-[15px] italic leading-snug text-mist/85">
                He needed less, made clear. The dashboard was never too dense. It was undifferentiated.
              </p>
              <div className="mt-4 flex gap-4 text-[11px]">
                <span style={{ color: "#5cc8ff" }}>+{insights - START.insights} Insight</span>
                <span style={{ color: "#ff6a97" }}>{humanity}/100 Humanity</span>
                <span style={{ color: defeated ? "#57d38c" : "#b48bff" }}>{defeated ? "Assumption defeated" : "Assumption survived"}</span>
              </div>
              <div className="mt-5 flex gap-3">
                <button onClick={replay} className="border-2 border-mist/30 px-4 py-2 text-[10px] uppercase tracking-[0.14em] text-mist/80 hover:border-mist hover:text-mist">
                  ↺ Replay
                </button>
                <span className="border-2 border-white/10 px-4 py-2 text-[10px] uppercase tracking-[0.14em] text-mist/30" title="Coming next">
                  Stage 2 · Define (soon)
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <p className="mt-3 text-center text-[10px] uppercase tracking-[0.16em] text-mist/30">
        Listen beneath the words
      </p>
    </div>
  );
}

function Chip({ label, sub, color }: { label: string; sub: string; color: string }) {
  return (
    <div className="border border-white/15 bg-black/55 px-1.5 py-0.5 leading-tight">
      <span className="font-bold" style={{ color }}>{label}</span>
      <span className="ml-1 text-white/40">{sub}</span>
    </div>
  );
}
