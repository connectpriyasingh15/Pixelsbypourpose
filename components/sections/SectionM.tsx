// Section M: closing panel. A giant "PBP" wordmark cropped by the
// top edge, a split display pair with the closing paragraphs, and a
// bottom row with the brand lockup and contact chip. Drift
// choreography: the wordmark sinks down from beyond the top edge,
// the two headlines part from opposite wings, the paragraphs rise,
// and the lockup and chip arrive last from below like a signature.

import Drift from "@/components/sections/Drift";

export default function SectionM() {
  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden text-mist">
      {/* giant cropped wordmark */}
      <Drift y={-180} s={0.9} className="pointer-events-none select-none">
        <div aria-hidden className="overflow-hidden leading-none">
          <p className="-mt-[9vw] whitespace-nowrap text-center text-[30vw] font-bold tracking-[-0.02em] text-mist/90">
            PBP
          </p>
        </div>
      </Drift>

      {/* split display pair */}
      <div className="relative z-10 mt-[6svh] grid flex-1 grid-cols-1 gap-12 px-6 md:grid-cols-2 md:px-14">
        <Drift x={-160} lag={0.08}>
          <h2 className="text-[clamp(2.4rem,4.6vw,4.6rem)] font-light leading-none tracking-[-0.02em]">
            A Craft.
          </h2>
        </Drift>
        <div>
          <Drift x={160} lag={0.12}>
            <h2 className="text-[clamp(2.4rem,4.6vw,4.6rem)] font-light leading-none tracking-[-0.02em] text-mist/40">
              Beyond Trends.
            </h2>
          </Drift>
          <Drift y={100} lag={0.18}>
            <p className="mt-[8svh] max-w-lg text-lg leading-relaxed text-mist/40 md:text-xl">
              This work will never be about decoration, and it was never
              meant to be. Those inside the systems live the results.
            </p>
            <p className="mt-8 max-w-lg text-lg leading-relaxed md:text-xl">
              Those outside will only see the pixels.
            </p>
          </Drift>
        </div>
      </div>

      {/* bottom row: brand lockup + contact chip */}
      <div className="relative z-10 grid grid-cols-1 items-center gap-8 px-6 pb-[10svh] pt-[8svh] md:grid-cols-2 md:px-14">
        <Drift y={120} lag={0.24}>
          <div className="flex items-center gap-3">
            <span aria-hidden className="text-xl leading-none">
              &#10070;
            </span>
            <span className="text-2xl font-semibold tracking-tight">
              Pixels by Purpose
            </span>
          </div>
        </Drift>
        <Drift y={120} lag={0.3}>
          <a
            href="/contact"
            className="inline-flex items-center gap-3 bg-mist/10 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.24em] text-mist/80 transition-colors hover:bg-mist/15 hover:text-mist"
          >
            <span aria-hidden>&#8853;</span> Start a Conversation
          </a>
        </Drift>
      </div>
    </section>
  );
}
