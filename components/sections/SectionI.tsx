// Section I: clarity panel. A faint horizontal hairline near the
// top and a full-width two-tone display statement. Drift
// choreography: the hairline draws itself from a point, the bright
// opening sentence arrives from the left, and the dimmed
// continuation follows from below a beat later.

import Drift from "@/components/sections/Drift";

export default function SectionI() {
  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden text-mist">
      {/* top hairline */}
      <Drift s={0.05} className="mx-4 mt-[14svh] md:mx-6">
        <div aria-hidden className="border-t border-mist/15" />
      </Drift>

      {/* full-width two-tone statement */}
      <div className="relative z-10 px-6 pt-[5svh] md:px-10">
        <Drift x={-200} lag={0.08}>
          <p className="text-[clamp(1.7rem,3.3vw,3.4rem)] font-light leading-[1.18] tracking-[-0.01em]">
            What&apos;s Complex, We Make Calm.
          </p>
        </Drift>
        <Drift y={110} lag={0.18}>
          <p className="text-[clamp(1.7rem,3.3vw,3.4rem)] font-light leading-[1.18] tracking-[-0.01em] text-mist/35">
            Beyond screens, we design systems, holding the complexity in the
            architecture so the person never inherits the mess.
          </p>
        </Drift>
      </div>
    </section>
  );
}
