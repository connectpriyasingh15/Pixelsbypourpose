// Section F: domains panel. Two staggered stacks of large display
// lines naming the domains Priya designs for. Drift choreography:
// the lines interleave from alternating wings, each one a beat
// behind the last, so the whole list knits itself together at the
// dock and unravels on the way out.

import Drift from "@/components/sections/Drift";

const TOP_SECTORS = [
  { label: "Network Management", indent: "10%" },
  { label: "Building Automation", indent: "18%" },
  { label: "AI-Enabled Operations", indent: "0%" },
  { label: "Enterprise Infrastructure", indent: "18%" },
];

const BOTTOM_SECTORS = [
  { label: "Design Systems", indent: "57%" },
  { label: "Mobile", indent: "57%" },
  { label: "Data Visualization", indent: "41%" },
  { label: "Consumer Platforms", indent: "32%" },
];

export default function SectionF() {
  return (
    <section className="relative flex min-h-svh flex-col justify-between overflow-hidden py-[10svh] text-mist">
      {/* top stack: staggered domain lines */}
      <div className="relative z-10 flex flex-col gap-2 px-6 md:px-10">
        {TOP_SECTORS.map((s, i) => (
          <Drift key={s.label} x={i % 2 ? 180 : -180} lag={i * 0.05}>
            <p
              className="text-[clamp(2rem,4.6vw,4.6rem)] font-light leading-[1.12] tracking-[-0.02em]"
              style={{ marginLeft: s.indent }}
            >
              {s.label}
            </p>
          </Drift>
        ))}
      </div>

      {/* bottom stack: staggered toward the lower-right */}
      <div className="relative z-10 mt-[8svh] flex flex-col gap-2 px-6 md:px-10">
        {BOTTOM_SECTORS.map((s, i) => (
          <Drift key={s.label} x={i % 2 ? -180 : 180} lag={0.2 + i * 0.05}>
            <p
              className="text-[clamp(2rem,4.6vw,4.6rem)] font-light leading-[1.12] tracking-[-0.02em]"
              style={{ marginLeft: s.indent }}
            >
              {s.label}
            </p>
          </Drift>
        ))}
      </div>
    </section>
  );
}
