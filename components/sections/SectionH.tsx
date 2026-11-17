// Section H: proof panel. The centered dotted spine carrying in
// from the previous panel, then two stat columns. Drift
// choreography: the two numbers converge from opposite wings like
// approaching bodies, each caption trailing its number by a beat.

import Drift from "@/components/sections/Drift";

export default function SectionH() {
  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden text-mist">
      {/* spine: short continuation from the previous panel */}
      <Drift s={0.1} className="mx-auto flex flex-col">
        <div
          aria-hidden
          className="mx-auto h-[10svh] w-px border-l border-dotted border-mist/20"
        />
      </Drift>

      {/* stat columns */}
      <div className="relative z-10 grid flex-1 grid-cols-1 items-center gap-16 px-6 pb-[8svh] md:grid-cols-2 md:px-10">
        {/* left: the MTTR result */}
        <div className="flex flex-col items-center">
          <Drift x={-220} s={0.85}>
            <p className="text-[clamp(4rem,9vw,9.5rem)] font-light leading-none tracking-[-0.02em]">
              80%
            </p>
          </Drift>
          <Drift x={-120} lag={0.12}>
            <p className="mt-[6svh] max-w-xs text-center text-sm leading-relaxed text-mist/80 md:text-base">
              Faster fault diagnosis after the cnMaestro rebuild, from
              reactive fire-fighting to proactive prevention
            </p>
          </Drift>
        </div>

        {/* right: the scale result */}
        <div className="flex flex-col items-center">
          <Drift x={220} s={0.85} lag={0.06}>
            <p className="text-[clamp(4rem,9vw,9.5rem)] font-light leading-none tracking-[-0.02em]">
              40k+
            </p>
          </Drift>
          <Drift x={120} lag={0.18}>
            <p className="mt-[6svh] max-w-xs text-center text-sm leading-relaxed text-mist/80 md:text-base">
              Devices the redesigned architecture scales to, monitored around
              the clock by the teams who run it
            </p>
          </Drift>
        </div>
      </div>
    </section>
  );
}
