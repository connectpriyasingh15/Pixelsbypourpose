// Section B: statement panel. Mono micro-row (index block, two-tone
// statement, ledger numerals), a huge left-aligned display headline
// with a dimmed last word, and supporting copy pinned bottom-left.
// Drift choreography: the micro-row pieces slide in from opposite
// wings, the headline sweeps in from the left a beat later, and the
// closing copy rises from below last.

import Drift from "@/components/sections/Drift";

export default function SectionB() {
  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden text-mist">
      {/* micro-row: index block / statement / ledger numerals */}
      <div className="relative z-10 grid grid-cols-2 items-start gap-6 px-6 pt-8 font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-mist/60 md:grid-cols-4 md:px-10">
        <Drift x={-140} y={-40}>
          <p>PBP | Pixels by Purpose</p>
          <p className="text-mist/35">
            001 <span aria-hidden>▚▚▚</span> By Priya Singh
          </p>
        </Drift>
        <Drift y={-80} lag={0.08} className="hidden md:block">
          <p>
            <span>Where </span>
            <span className="text-mist/35">others decorate </span>
            <span>interfaces,</span>
          </p>
          <p>
            <span>we design </span>
            <span className="text-mist/35">the </span>
            <span>decisions behind </span>
            <span className="text-mist/35">them.</span>
          </p>
        </Drift>
        <div className="hidden md:block" />
        <Drift x={140} y={-40} className="text-right leading-none">
          <span className="align-top text-mist/40">
            PB
            <br />
            PX
          </span>
          <span className="ml-2 text-2xl font-light tracking-tight text-mist/80">
            0<span className="align-sub">02</span>
            <span className="align-top">5</span>
          </span>
        </Drift>
      </div>

      {/* headline: left-aligned display, dimmed last word */}
      <div className="relative z-10 px-6 pt-[12svh] md:px-10">
        <Drift x={-180} lag={0.1}>
          <h2 className="text-[clamp(2.6rem,7.5vw,6.5rem)] font-light leading-[1.04] tracking-[-0.02em]">
            Enterprise-Grade
            <br />
            Complexity. <span className="text-mist/35">Humanized.</span>
          </h2>
        </Drift>
      </div>

      {/* bottom: supporting copy pinned bottom-left */}
      <div className="relative z-10 mt-auto flex items-end justify-between gap-8 px-6 pb-16 md:px-10">
        <Drift y={130} lag={0.2} className="max-w-md text-lg leading-snug md:text-xl">
          <p>
            Dense, high-stakes systems turned into products people trust,
            across enterprise, operations, and AI.
          </p>
          <p className="mt-8">Complexity in, clarity out.</p>
        </Drift>
      </div>
    </section>
  );
}
