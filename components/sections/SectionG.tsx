// Section G: work panel. A row of bordered wordmark cards bleeding
// off both edges, a mono status micro-row, a centered dotted spine
// with the "Work That Speaks for Itself" headline, and a small
// curiosity paragraph low in the frame. Drift choreography: each
// wordmark card arrives on its own beat like a passing convoy, the
// status row settles from above, the headline surfaces from depth,
// and the paragraph climbs in from below.

import Drift from "@/components/sections/Drift";

const WORDMARKS = [
  { name: "Honeywell", cls: "font-sans font-semibold tracking-tight" },
  { name: "CAMBIUM", cls: "font-sans font-bold tracking-[0.08em]" },
  { name: "cnMaestro", cls: "font-sans font-semibold tracking-tight" },
  { name: "Glynk", cls: "font-sans font-bold tracking-tight" },
  { name: "Cessna", cls: "font-serif italic font-medium" },
  { name: "Vantage", cls: "font-sans font-semibold tracking-tight" },
];

export default function SectionG() {
  return (
    <section className="relative flex min-h-[140svh] flex-col overflow-hidden text-mist">
      {/* wordmark cards: single row bleeding off both edges */}
      <div className="relative z-10 mt-[10svh] flex gap-[2vw]" style={{ marginLeft: "-4vw" }}>
        {WORDMARKS.map((w, i) => (
          <Drift
            key={w.name}
            y={i % 2 ? -120 : -60}
            lag={i * 0.04}
            className="flex h-[9.5vw] w-[17vw] flex-none items-center justify-center border border-mist/12 bg-[#04050b]"
          >
            <span className={`${w.cls} text-[clamp(0.9rem,1.4vw,1.5rem)] text-mist/90`}>
              {w.name}
            </span>
          </Drift>
        ))}
      </div>

      {/* mono status micro-row */}
      <div className="relative z-10 mt-[8svh] grid grid-cols-2 gap-6 px-6 font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-mist/40 md:grid-cols-4 md:px-10">
        <Drift x={-120} lag={0.1}>
          <p>
            Researching<span className="text-mist/25">...</span>
          </p>
        </Drift>
        <Drift y={-60} lag={0.14} className="hidden md:block md:text-center">
          <p>Shipping Weekly</p>
        </Drift>
        <Drift y={-60} lag={0.18} className="text-center">
          <p>PBP | Pixels by Purpose</p>
          <p className="text-mist/25">
            001 <span aria-hidden>▚▚▚</span> By Priya Singh
          </p>
        </Drift>
        <Drift x={120} lag={0.22} className="hidden md:block md:text-right">
          <p>
            Iterating<span className="text-mist/25">...</span>
          </p>
        </Drift>
      </div>

      {/* centered dotted spine dropping to the bottom of the panel */}
      <div
        aria-hidden
        className="absolute bottom-0 left-1/2 top-[38svh] w-px border-l border-dotted border-mist/20"
      />

      {/* centered headline */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center">
        <Drift s={0.7} lag={0.12}>
          <h2 className="py-4 text-[clamp(1.8rem,3.2vw,3.2rem)] font-light leading-[1.16] tracking-[-0.01em]">
            Work That
            <br />
            Speaks for Itself
          </h2>
        </Drift>
      </div>

      {/* bottom-left: curiosity paragraph */}
      <Drift y={140} lag={0.24} className="absolute bottom-[6svh] left-[26%] z-10 max-w-[34ch] font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] text-mist/30">
        <p>
          <span className="text-mist/70">Curiosity</span> is not something we
          do <span className="text-mist/70">after work.</span> It is the
          engine. Most experiments{" "}
          <span className="text-mist/70">fail. The ones</span> that do not{" "}
          <span className="text-mist/70">show up later</span> in real work, as
          an instinct <span className="text-mist/70">we did not have</span>{" "}
          before.
        </p>
      </Drift>
    </section>
  );
}
