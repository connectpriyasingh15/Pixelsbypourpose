// Section D: standards + industries panel. A two-tone statement
// block on the right, then a tall centered spine of dotted
// hairlines with a centered two-line headline and mono subline.
// Drift choreography: the statement sweeps in from the right, the
// spine draws itself by scaling from nothing, and the centered
// headline surfaces from depth between the spine segments.

import Drift from "@/components/sections/Drift";

export default function SectionD() {
  return (
    <section className="relative flex min-h-[150svh] flex-col overflow-hidden text-mist">
      {/* statement block, right half */}
      <div className="relative z-10 grid grid-cols-1 gap-8 px-6 pt-[10svh] md:grid-cols-2 md:px-10">
        <div className="hidden md:block" />
        <Drift x={200} className="max-w-xl">
          <h2 className="text-[clamp(1.6rem,2.4vw,2.4rem)] font-light leading-snug tracking-[-0.01em]">
            We <span className="text-mist/40">redesign</span> the workflows
            <br />
            once taken for granted.
          </h2>
          <p className="mt-8 max-w-md text-base leading-relaxed text-mist/40 md:text-lg">
            Through research, role-based architecture,{" "}
            <span className="text-mist/90">
              and the power of systems thinking
            </span>
            , every screen is calm, legible, and built for decisions.
          </p>
        </Drift>
      </div>

      {/* centered spine: dotted line, headline + mono subline, dotted line */}
      <div className="relative z-10 mt-[6svh] flex flex-1 flex-col items-center px-6 text-center">
        <Drift s={0.1} lag={0.08} className="flex w-px flex-1 flex-col">
          <div
            aria-hidden
            className="w-px flex-1 border-l border-dotted border-mist/20"
          />
        </Drift>
        <Drift s={0.8} y={40} lag={0.14} className="py-[7svh]">
          <h2 className="text-[clamp(1.8rem,3.2vw,3.2rem)] font-light leading-[1.16] tracking-[-0.01em]">
            Designing the Tools That
            <br />
            Run Entire Industries
          </h2>
          <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.28em] text-mist/40">
            Enterprise, operations, and AI: where design matters most
          </p>
        </Drift>
        <Drift s={0.1} lag={0.2} className="flex w-px flex-1 flex-col">
          <div
            aria-hidden
            className="w-px flex-1 border-l border-dotted border-mist/20"
          />
        </Drift>
      </div>
    </section>
  );
}
