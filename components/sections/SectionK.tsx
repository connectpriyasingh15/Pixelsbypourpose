// Section K: simplicity panel. A centered mono ticker line high in
// the frame and a huge centered two-tone statement. Drift
// choreography: the ticker descends from above like a readout
// coming online, the bright opening surfaces from depth, and the
// dimmed continuation rises to meet it from below.

import Drift from "@/components/sections/Drift";

export default function SectionK() {
  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden text-mist">
      {/* mono ticker */}
      <Drift y={-120} className="relative z-10 mt-[26svh] text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-mist/70">
          Simplicity <span className="text-mist/30">&gt;</span>{" "}
          <span className="ml-4">In</span>{" "}
          <span className="text-mist/30">_</span>{" "}
          <span className="text-mist/30">PB</span>P{" "}
          <span className="text-mist/30">[25]</span> Is{" "}
          <span className="text-mist/30">_</span> Not{" "}
          <span className="text-mist/30">[?]</span> Accidental
        </p>
      </Drift>

      {/* two-tone statement */}
      <div className="relative z-10 mt-[16svh] px-6 text-center md:px-10">
        <Drift s={0.75} lag={0.1}>
          <p className="mx-auto max-w-6xl text-[clamp(1.8rem,3.6vw,3.7rem)] font-light leading-[1.18] tracking-[-0.01em]">
            <span>It is Designed. </span>
            <span className="text-mist/35">
              We quietly question and remove assumptions with extraordinary
              patience and serious craft, those rare details whose presence
              strengthens the whole.
            </span>
          </p>
        </Drift>
      </div>
    </section>
  );
}
