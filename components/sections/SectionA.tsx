// Section A: hero. Top bar (centered brand + right contact button),
// eyebrow, two-line display headline, segmented inline nav, and a
// two-tone line pinned at the bottom. Each element rides its own
// Drift vector: brand and eyebrow fall in from above, the button
// slides from the right, the headline surfaces from depth, nav and
// closing line rise from below, each a beat behind the last.

import Drift from "@/components/sections/Drift";

const SECTION_NAV = ["Manifesto", "Journey", "Work", "Playground"];

export default function SectionA() {
  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden text-mist">
      {/* top bar: centered brand, contact button pinned right */}
      <header className="relative z-10 flex items-center justify-center px-6 pt-8 md:px-10">
        <Drift y={-90} className="flex items-center gap-3">
          <span
            aria-hidden
            className="inline-block h-2 w-2 rotate-45 bg-mist"
          />
          <span className="text-xl font-semibold tracking-tight md:text-2xl">
            Pixels by Purpose
          </span>
        </Drift>
        <Drift x={110} y={-40} className="absolute right-6 top-8 hidden md:block">
          <a
            href="/contact"
            className="border border-mist/15 bg-mist/5 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-mist/70 transition-colors hover:border-mist/40 hover:text-mist"
          >
            Say Hello
          </a>
        </Drift>
      </header>

      {/* center: eyebrow + display headline + segmented nav */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center">
        <Drift y={-60} lag={0.1}>
          <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.3em] text-mist/60">
            A Portfolio by Priya Singh
          </p>
        </Drift>
        <Drift s={0.72} lag={0.05}>
          <h1 className="text-[clamp(2.8rem,8.5vw,7.5rem)] font-light leading-[1.02] tracking-[-0.02em]">
            Complexity
            <br />
            Becomes Clarity
          </h1>
        </Drift>

        <Drift y={110} lag={0.15}>
          <nav className="mt-12 flex items-center bg-mist/5 px-2 py-3 backdrop-blur-sm md:px-4">
            {SECTION_NAV.map((label, i) => (
              <span key={label} className="flex items-center">
                {i > 0 && (
                  <span aria-hidden className="mx-3 text-mist/25 md:mx-4">
                    /
                  </span>
                )}
                <a
                  href={`#${label.toLowerCase()}`}
                  className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist/80 transition-colors hover:text-mist"
                >
                  {label}
                </a>
              </span>
            ))}
          </nav>
        </Drift>
      </div>

      {/* bottom: two-tone closing line */}
      <div className="relative z-10 px-6 pb-14 text-center">
        <Drift y={160} lag={0.22}>
          <p className="mx-auto max-w-md text-lg leading-snug md:text-xl">
            <span className="text-mist">Every pixel is a decision. </span>
            <span className="text-mist/40">
              Behind every seamless experience are hundreds of intentional
              ones.
            </span>
          </p>
        </Drift>
      </div>
    </section>
  );
}
