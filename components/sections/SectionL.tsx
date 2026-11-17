// Section L: systems panel. A mono pager chip top-left, a two-tone
// headline on the left, and two stacked black comparison cards on
// the right with corner brackets. Drift choreography: the chip
// drops in first, the headline slides from the left, and the two
// cards fly in from the right on separate beats, the winning card
// leading.

import Drift from "@/components/sections/Drift";

function CornerBrackets() {
  return (
    <>
      <span
        aria-hidden
        className="absolute -left-3 -top-3 h-5 w-5 border-l border-t border-mist/50"
      />
      <span
        aria-hidden
        className="absolute -right-3 -top-3 h-5 w-5 border-r border-t border-mist/50"
      />
      <span
        aria-hidden
        className="absolute -bottom-3 -left-3 h-5 w-5 border-b border-l border-mist/50"
      />
      <span
        aria-hidden
        className="absolute -bottom-3 -right-3 h-5 w-5 border-b border-r border-mist/50"
      />
    </>
  );
}

export default function SectionL() {
  return (
    <section className="relative overflow-hidden text-mist">
      <div className="relative z-10 grid min-h-svh grid-cols-1 gap-10 px-6 py-[10svh] md:grid-cols-2 md:px-10">
        {/* left: pager chip + headline */}
        <div className="flex flex-col">
          <Drift y={-90} className="w-fit">
            <div className="inline-flex items-center gap-2 bg-mist/10 px-4 py-2 font-mono text-[11px] tracking-[0.2em]">
              <span>01</span>
              <span className="text-mist/30">/</span>
              <span className="text-mist/30">04</span>
            </div>
          </Drift>
          <Drift x={-180} lag={0.08} className="my-auto pt-[10svh]">
            <h2 className="text-[clamp(2rem,3.8vw,3.8rem)] font-light leading-[1.12] tracking-[-0.01em]">
              Systems
              <br />
              <span className="text-mist/40">vs One-Off Screens</span>
            </h2>
          </Drift>
        </div>

        {/* right: stacked comparison cards */}
        <div className="flex flex-col gap-10">
          <Drift x={200} y={-50} lag={0.12} className="relative">
            <div className="relative flex min-h-[38svh] flex-col justify-between bg-black p-8 md:p-10">
              <CornerBrackets />
              <p className="text-2xl font-semibold tracking-[0.12em]">
                <span className="text-mist/70">P</span>BP
              </p>
              <p className="mt-16 max-w-md text-xl leading-snug md:text-2xl">
                A design system enforces coherence. If a pattern exists, teams
                reuse it instantly.
              </p>
            </div>
          </Drift>
          <Drift x={200} y={70} lag={0.2} className="relative">
            <div className="relative flex min-h-[38svh] flex-col justify-between bg-black p-8 md:p-10">
              <CornerBrackets />
              <p className="text-2xl font-light">The Old World</p>
              <p className="mt-16 max-w-md text-xl leading-snug text-mist/40 md:text-2xl">
                Screens drift, patterns fork, teams redraw the same component
                for weeks.
              </p>
            </div>
          </Drift>
        </div>
      </div>
    </section>
  );
}
