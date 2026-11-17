// Section J: manifesto. Two centered mixed-emphasis paragraph pairs
// with a crest ornament between them. Drift choreography: the first
// pair descends from above while the second rises from below, and
// the crest spins into place at the center where they meet.

import Drift from "@/components/sections/Drift";

export default function SectionJ() {
  return (
    <section className="relative flex min-h-svh flex-col items-center overflow-hidden text-mist">
      {/* first paragraph pair */}
      <Drift y={-140} className="relative z-10 mt-[18svh] max-w-3xl px-6 text-center text-[clamp(1.2rem,1.9vw,1.9rem)] font-light leading-relaxed text-mist/40">
        <p>
          Every pixel is{" "}
          <span className="text-mist">a decision with a purpose.</span> Each
          flow is personal, each screen designed as if it were singular. We
          seek <span className="text-mist">no comfort in decoration</span>,
          only in the <span className="text-mist">precision of intent.</span>
        </p>
        <p className="mt-10">
          One intentional decision outweighs a thousand of the ordinary.
        </p>
      </Drift>

      {/* crest ornament */}
      <Drift s={0.3} r={180} lag={0.14} className="relative z-10 mt-[14svh] font-serif text-2xl text-mist/70">
        <span aria-hidden>&#10070;</span>
      </Drift>

      {/* second paragraph pair */}
      <Drift
        y={140}
        lag={0.08}
        className="relative z-10 mb-[12svh] mt-[12svh] max-w-3xl px-6 text-center text-[clamp(1.2rem,1.9vw,1.9rem)] font-light leading-relaxed text-mist/40"
      >
        <p>
          Inside the work, <span className="text-mist">curiosity</span> is
          constant, <span className="text-mist">evidence</span> is absolute,
          and <span className="text-mist">craft</span> is not fleeting but{" "}
          <span className="text-mist">compounding.</span>
        </p>
        <p className="mt-10">
          This is not simply an interface. It is a system of decisions, chosen
          and bound together to shape{" "}
          <span className="text-mist">calm experiences.</span>
        </p>
      </Drift>
    </section>
  );
}
