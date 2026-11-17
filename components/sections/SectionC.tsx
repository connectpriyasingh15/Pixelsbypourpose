// Section C: approach panel. Four-column mono micro-row (section
// label, brand, handle, positioning paragraph) with dotted
// hairlines dropping from the column edges, and a split pair of
// display headlines. Drift choreography: the four columns rain in
// from above with rising lags like columns of data, then the two
// headlines slide in from opposite edges.

import Drift from "@/components/sections/Drift";

export default function SectionC() {
  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden text-mist">
      {/* micro-row: label / brand / handle / positioning, hairlines drop below */}
      <div className="relative z-10 grid grid-cols-2 gap-6 px-6 pt-[14svh] font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-mist/50 md:grid-cols-4 md:px-10">
        <Drift y={-70}>
          <p className="text-indigo-300/60">My Approach</p>
        </Drift>
        <Drift y={-100} lag={0.06} className="hidden border-l border-dotted border-mist/15 pb-[30svh] pl-6 md:block">
          <p>
            <span className="text-mist/30">Pixels</span> by{" "}
            <span className="text-mist/30">Purp</span>ose
          </p>
        </Drift>
        <Drift y={-130} lag={0.12} className="hidden border-l border-dotted border-mist/15 pb-[30svh] pl-6 md:block">
          <p>@priyathedesigner</p>
        </Drift>
        <Drift y={-160} lag={0.18} className="border-l border-dotted border-mist/15 pb-[10svh] pl-6 normal-case md:pb-[30svh]">
          <p className="max-w-[32ch] text-[10px] leading-relaxed text-mist/30">
            <span className="text-mist/70">Curious enough</span> to question
            every assumption.{" "}
            <span className="text-mist/70">Purposeful enough</span> to justify
            every pixel. Where others accept{" "}
            <span className="text-mist/70">the first answer,</span> we keep
            asking <span className="text-mist/70">what if,</span> until the
            real problem <span className="text-mist/70">shows itself.</span>
          </p>
        </Drift>
      </div>

      {/* split display headlines */}
      <div className="relative z-10 mt-auto grid grid-cols-1 items-end gap-12 px-6 pb-[6svh] md:grid-cols-2 md:px-10">
        <Drift x={-160} lag={0.1}>
          <h2 className="text-[clamp(2.2rem,4.6vw,4.6rem)] font-light leading-[1.06] tracking-[-0.02em] md:mb-[16svh]">
            Unseen
            <br />
            Complexity.
          </h2>
        </Drift>
        <Drift x={160} lag={0.16}>
          <h2 className="text-[clamp(2.2rem,4.6vw,4.6rem)] font-light leading-[1.06] tracking-[-0.02em]">
            Human-
            <br />
            Grade Software.
          </h2>
          <p className="mt-10 max-w-md text-lg leading-snug text-mist/90 md:text-xl">
            Enterprise tools were designed to be endured, even by experts.
            Density, noise &amp; guesswork were once the norm.
          </p>
        </Drift>
      </div>
    </section>
  );
}
