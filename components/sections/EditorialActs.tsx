// EditorialActs: the acts after the film. Where the garden speaks in
// metaphor, these speak in evidence: the pitch, the proof, and the
// invitation, set left-aligned on the night canvas with hairline
// rules and mono eyebrows, in the manner of a printed spec sheet.

import Link from "next/link";
import { caseStudies } from "@/lib/content";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-8 inline-flex items-center gap-3 bg-white/[0.06] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.24em] text-white/60">
      {children}
    </p>
  );
}

export default function EditorialActs() {
  return (
    <div className="relative z-10 bg-[#030303]">
      {/* At your service */}
      <section className="border-t border-white/10 px-6 py-24 md:px-14 md:py-32">
        <div className="max-w-3xl">
          <Eyebrow>At your service</Eyebrow>
          <p className="font-sans text-[clamp(1.5rem,3vw,2.4rem)] font-medium leading-snug tracking-[-0.02em] text-white/90">
            I design the dense, high-stakes software most designers avoid:
            enterprise systems, operations, AI. I keep the complexity in the
            architecture so the person using it stays calm.
          </p>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/50">
            Advanced UX Designer at Honeywell. Before that, the end-to-end
            redesign of Cambium Networks&apos; flagship platform. Evidence over
            opinion, systems over screens, and the last ten percent treated as
            the whole point.
          </p>
        </div>
      </section>

      {/* The proof */}
      <section className="border-t border-white/10 px-6 py-24 md:px-14 md:py-32">
        <Eyebrow>The proof</Eyebrow>
        <h2 className="max-w-2xl font-sans text-[clamp(2rem,4.5vw,3.6rem)] font-medium leading-[1.02] tracking-[-0.03em] text-white">
          Measured, not claimed.
        </h2>
        <div className="mt-14 space-y-12">
          {caseStudies.map((cs) => (
            <article
              key={cs.slug}
              className="grid grid-cols-1 gap-6 border-t border-white/10 pt-8 md:grid-cols-12"
            >
              <div className="md:col-span-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                  {cs.category} &middot; {cs.year}
                </p>
                <h3 className="mt-3 font-sans text-3xl font-medium tracking-[-0.02em] text-white">
                  {cs.name}
                </h3>
              </div>
              <p className="text-base leading-relaxed text-white/55 md:col-span-4">
                {cs.premise}
              </p>
              <div className="flex flex-wrap items-start gap-x-10 gap-y-4 md:col-span-4 md:justify-end">
                {cs.outcomes.slice(0, 2).map((o) => (
                  <div key={o.label}>
                    <p className="font-sans text-3xl font-medium tracking-[-0.02em] text-white">
                      {o.value}
                    </p>
                    <p className="mt-1 max-w-[16ch] font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">
                      {o.label}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
        <Link
          href="/work"
          className="mt-14 inline-flex items-center gap-2 font-sans text-[14px] font-medium text-white/75 underline-offset-8 transition-colors hover:text-white hover:underline"
        >
          All case studies <span aria-hidden>&rarr;</span>
        </Link>
      </section>

      {/* The invitation */}
      <section className="border-t border-white/10 px-6 py-28 md:px-14 md:py-40">
        <Eyebrow>The invitation</Eyebrow>
        <h2 className="max-w-3xl font-sans text-[clamp(2.2rem,5.5vw,4.6rem)] font-medium leading-[1.0] tracking-[-0.03em] text-white">
          Every pixel is a decision.
          <br />
          <span className="text-white/40">I make them on purpose.</span>
        </h2>
        <p className="mt-6 max-w-md text-base leading-relaxed text-white/50">
          If your team is building something hard, dense, and worth getting
          right, I would like to hear about it.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white px-5 py-3 font-sans text-[13px] font-medium text-[#030303] transition-opacity hover:opacity-85"
          >
            Start a Conversation <span aria-hidden>&rarr;</span>
          </Link>
        </div>
        <p className="mt-20 border-t border-white/10 pt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
          &copy; 2026 Priya Singh &middot; Pixels by Purpose &middot; Bangalore,
          India
        </p>
      </section>
    </div>
  );
}
