// Work: a crisp index. No atmosphere, no scatter: an aligned grid of
// short wide thumbnails (screens exported from Figma, auto-detected
// from public/work/<slug>.webp with a quiet pending panel until they
// land), tight meta rows, the insight as the one line of voice, and
// measured outcomes. The archive is a compact ledger.

import type { Metadata } from "next";
import { existsSync } from "fs";
import path from "path";
import Link from "next/link";
import { caseStudies, archiveWork } from "@/lib/content";
import InViewRise from "@/components/sections/InViewRise";

export const metadata: Metadata = { title: "Work" };

const V = "?v=2";

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-10 inline-flex items-center gap-3 bg-mist/[0.06] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.24em] text-mist/60">
      {children}
    </p>
  );
}

function Thumb({ slug, name }: { slug: string; name: string }) {
  const file = `/work/${slug}.webp`;
  const has = existsSync(path.join(process.cwd(), "public", "work", `${slug}.webp`));
  return (
    <div className="group relative aspect-[21/9] w-full overflow-hidden border border-mist/10 bg-mist/[0.02]">
      {has ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={file + V}
          alt={name + " screens"}
          className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-mist/35">
            Screens &middot; Figma export pending
          </p>
        </div>
      )}
    </div>
  );
}

export default function WorkPage() {
  return (
    <main>
      {/* index header */}
      <section className="px-6 pt-32 md:px-14 md:pt-40">
        <Chip>Selected work</Chip>
        <h1 className="max-w-3xl font-sans text-[clamp(2.2rem,5vw,4rem)] font-medium leading-[1.0] tracking-[-0.03em]">
          Measured, not claimed.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-mist/60">
          Two systems in production, chosen for judgment over volume. Every
          number below was measured, not estimated.
        </p>
      </section>

      {/* featured case studies */}
      <section className="space-y-24 px-6 py-24 md:px-14 md:py-32">
        {caseStudies.map((cs) => (
          <InViewRise key={cs.slug}>
            <article className="border-t border-mist/10 pt-10">
              <div className="mb-6 flex flex-wrap items-baseline gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.2em] text-mist/45">
                <span className="text-mist/70">{cs.index}</span>
                <span>{cs.category}</span>
                <span>{cs.year}</span>
                <span className="hidden md:inline">{cs.timeframe}</span>
              </div>

              <Link href={`/work/${cs.slug}`} aria-label={cs.name + " case study"}>
                <Thumb slug={cs.slug} name={cs.name} />
              </Link>

              <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-12">
                <div className="md:col-span-5">
                  <h2 className="font-sans text-3xl font-medium tracking-[-0.02em] text-mist">
                    <Link href={`/work/${cs.slug}`} className="transition-colors hover:text-white">
                      {cs.name}
                    </Link>
                  </h2>
                  <p className="mt-3 text-lg leading-relaxed text-mist/60">
                    {cs.premise}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
                    <Link
                      href={`/work/${cs.slug}`}
                      className="inline-flex items-center gap-2 font-sans text-[14px] font-medium text-mist underline-offset-8 transition-colors hover:underline"
                    >
                      View case study <span aria-hidden>&rarr;</span>
                    </Link>
                    <a
                      href={cs.figma}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 font-sans text-[14px] font-medium text-mist/60 underline-offset-8 transition-colors hover:text-mist hover:underline"
                    >
                      Open in Figma <span aria-hidden>&#8599;</span>
                    </a>
                  </div>
                </div>
                <div className="md:col-span-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-mist/40">
                    The insight
                  </p>
                  <p className="mt-3 leading-relaxed text-mist/75">{cs.insight}</p>
                </div>
                <div className="space-y-5 md:col-span-3">
                  {cs.outcomes.map((o) => (
                    <div key={o.label} className="border-l border-mist/15 pl-4">
                      <p className="font-sans text-2xl font-medium tracking-[-0.02em] text-mist">
                        {o.value}
                      </p>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-mist/40">
                        {o.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </InViewRise>
        ))}
      </section>

      {/* archive ledger */}
      <section className="px-6 pb-28 md:px-14 md:pb-40">
        <Chip>Archive &middot; range</Chip>
        <div>
          {archiveWork.map((a) => (
            <a
              key={a.code}
              href={a.figma}
              target="_blank"
              rel="noreferrer"
              className="group grid grid-cols-12 items-baseline gap-4 border-t border-mist/10 py-5 transition-colors hover:bg-mist/[0.03]"
            >
              <span className="col-span-2 font-mono text-[10px] uppercase tracking-[0.2em] text-mist/40 md:col-span-1">
                {a.code}
              </span>
              <span className="col-span-10 font-sans text-lg font-medium tracking-[-0.01em] text-mist md:col-span-3">
                {a.name}
              </span>
              <span className="col-span-2 hidden font-mono text-[10px] uppercase tracking-[0.16em] text-mist/40 md:block md:col-span-3">
                {a.category}
              </span>
              <span className="col-span-10 col-start-3 text-sm text-mist/55 md:col-span-4 md:col-start-auto">
                {a.premise}
              </span>
              <span className="col-span-1 hidden text-right text-mist/40 transition-colors group-hover:text-mist md:block">
                &#8599;
              </span>
            </a>
          ))}
          <div className="border-t border-mist/10" />
        </div>
      </section>
    </main>
  );
}
