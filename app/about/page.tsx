// About, in the noomo layout grammar translated to the night theme:
// a one-word-per-line display stack that crosses the hero image's
// edge onto the bare canvas (typographic collage), a giant ghost word
// running behind the Why section, manifesto copy set uppercase like
// small display, outlined pill labels, and blocks that rise into view
// as the reader scrolls. Content unchanged from lib/content.

import type { Metadata } from "next";
import Link from "next/link";
import { about, meta } from "@/lib/content";
import ZoomImage from "@/components/sections/ZoomImage";
import InViewRise from "@/components/sections/InViewRise";

export const metadata: Metadata = { title: "About" };

const V = "?v=2";
const SHADOW = { textShadow: "0 2px 28px rgba(3,3,3,0.75)" };

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-10 inline-flex items-center gap-3 bg-mist/[0.06] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.24em] text-mist/60">
      {children}
    </p>
  );
}


export default function AboutPage() {
  return (
    <main className="overflow-hidden">
      {/* A · the scene */}
      <section className="relative flex min-h-[92svh] items-end overflow-hidden">
        <ZoomImage src={"/varanasi/about-hero.webp" + V} video={"/varanasi/motion/about-hero.mp4" + V} from={1.28} to={1.04} mode="hero" lean />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(3,3,3,0.85) 0%, rgba(3,3,3,0.35) 40%, rgba(3,3,3,0.1) 65%, rgba(3,3,3,0.35) 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 85% 80% at 50% 50%, rgba(3,3,3,0) 55%, rgba(3,3,3,0.55) 100%)",
          }}
        />
        <div className="relative z-10 px-6 pb-[14svh] pt-40 md:px-14">
          <Chip>01 &middot; About</Chip>
          <h1
            className="font-sans text-[clamp(2.6rem,7.5vw,6.5rem)] font-medium leading-[0.96] tracking-[-0.04em] text-white"
            style={SHADOW}
          >
            <span className="block">I want the hardest</span>
            <span className="block ml-[0.8em]">software to feel</span>
            <span className="block ml-[1.8em]">effortless.</span>
          </h1>
          <p
            className="mt-6 max-w-sm text-sm leading-snug text-mist/65 md:ml-[0.5em] md:text-[15px]"
            style={SHADOW}
          >
            {meta.positioning}
          </p>
        </div>
      </section>

      {/* 02 · who I am: manifesto set as small display */}
      <section className="border-t border-mist/10 px-6 py-24 md:px-14 md:py-36">
        <InViewRise>
          <Chip>02 &middot; {about.whoIAm.eyebrow}</Chip>
        </InViewRise>
        <div className="space-y-14">
          <InViewRise>
            <p className="max-w-3xl font-sans text-[clamp(1.5rem,3vw,2.4rem)] font-medium leading-snug tracking-[-0.02em] text-mist/95">
              {about.whoIAm.paragraphs[0]}
            </p>
          </InViewRise>
          <InViewRise delay={0.08}>
            <p className="ml-auto max-w-xl text-lg leading-relaxed text-mist/65 md:mr-[6%]">
              {about.whoIAm.paragraphs[1]}
            </p>
          </InViewRise>
          <InViewRise delay={0.05}>
            <p className="max-w-xl border-l border-mist/15 pl-6 text-lg leading-relaxed text-mist/65 md:ml-[14%]">
              {about.whoIAm.paragraphs[2]}
            </p>
          </InViewRise>
        </div>
      </section>

      {/* 03 · why: the argument, under a giant ghost word */}
      <section className="relative border-t border-mist/10 px-6 py-24 md:px-14 md:py-36">
        <span
          aria-hidden
          className="pointer-events-none absolute -top-8 right-0 select-none font-sans text-[17vw] font-medium leading-none tracking-[-0.04em] text-mist/[0.02]"
        >
          Purpose
        </span>
        <div className="relative">
          <InViewRise>
            <Chip>03 &middot; {about.why.eyebrow}</Chip>
          </InViewRise>
          <div className="gap-16 md:flex md:items-start">
            <div className="min-w-0 flex-1 space-y-10">
              <InViewRise>
                <p className="max-w-3xl font-sans text-[clamp(1.8rem,3.6vw,3rem)] font-medium leading-[1.05] tracking-[-0.03em] text-white">
                  {about.why.paragraphs[0]}
                </p>
              </InViewRise>
              <InViewRise>
                <p className="max-w-xl text-lg leading-relaxed text-mist/65">
                  {about.why.paragraphs[1]}
                </p>
              </InViewRise>
              <InViewRise delay={0.06}>
                <p className="max-w-xl text-lg leading-relaxed text-mist/65 md:ml-[10%]">
                  {about.why.paragraphs[2]}
                </p>
              </InViewRise>
              <InViewRise>
                <p className="max-w-2xl font-sans text-xl font-medium leading-snug tracking-[-0.01em] text-mist/90 md:ml-[4%]">
                  {about.why.paragraphs[3]}
                </p>
              </InViewRise>
              <InViewRise>
                <p className="max-w-xl text-lg leading-relaxed text-mist/65">
                  {about.why.paragraphs[4]}
                </p>
              </InViewRise>
            </div>
            <InViewRise delay={0.1} className="mt-14 w-[300px] shrink-0 md:mt-4">
              <figure className="rotate-[-2.5deg] border border-mist/15 bg-mist/[0.03] p-3 transition-transform duration-500 ease-out hover:rotate-0 hover:scale-[1.03]">
                <img src={"/varanasi/scene-08.webp" + V} alt="" className="w-full" />
                <figcaption className="mt-3 font-mono text-[9px] uppercase tracking-[0.22em] text-mist/45">
                  Field notes &middot; thinking on paper
                </figcaption>
              </figure>
            </InViewRise>
          </div>
        </div>
      </section>

      {/* 04 · skills: an indexed ledger */}
      <section className="border-t border-mist/10 px-6 py-24 md:px-14 md:py-36">
        <InViewRise>
          <Chip>04 &middot; {about.skills.eyebrow}</Chip>
        </InViewRise>
        <InViewRise>
          <h2 className="mb-16 max-w-2xl font-sans text-[clamp(1.6rem,3vw,2.4rem)] font-medium leading-tight tracking-[-0.02em] text-mist/90">
            {about.skills.title}
          </h2>
        </InViewRise>
        <div className="grid grid-cols-1 gap-x-16 gap-y-12 md:grid-cols-2">
          {about.skills.items.map((s, i) => (
            <InViewRise key={s.title} delay={(i % 2) * 0.07}>
              <div className="group flex gap-6 border-t border-mist/10 pt-6 transition-colors duration-300 hover:border-mist/40">
                <span className="font-mono text-[11px] leading-6 text-mist/35 transition-colors duration-300 group-hover:text-mist">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="transition-transform duration-300 group-hover:translate-x-1.5">
                  <h3 className="font-sans text-lg font-medium tracking-[-0.01em] text-mist">
                    {s.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-mist/55 transition-colors duration-300 group-hover:text-mist/75">{s.note}</p>
                </div>
              </div>
            </InViewRise>
          ))}
        </div>
      </section>

      {/* 05 · curiosity: a full-bleed band from the film */}
      <section className="group relative overflow-hidden border-t border-mist/10 px-6 py-32 md:px-14 md:py-44">
        <ZoomImage src={"/varanasi/scene-07.webp" + V} from={1.3} to={1.02} mode="band" />
        <div className="absolute inset-0 bg-[#030303]/80 transition-colors duration-700 group-hover:bg-[#030303]/60" />
        <div className="relative z-10">
          <InViewRise>
            <Chip>05 &middot; {about.curiosity.eyebrow}</Chip>
          </InViewRise>
          <InViewRise>
            <p className="max-w-4xl font-sans text-[clamp(1.7rem,3.6vw,3rem)] font-medium leading-[1.05] tracking-[-0.03em] text-white">
              {about.curiosity.paragraphs[0]}
            </p>
          </InViewRise>
          <div className="mt-10 gap-12 md:flex">
            <InViewRise>
              <p className="max-w-md text-base leading-relaxed text-mist/70">
                {about.curiosity.paragraphs[1]}
              </p>
            </InViewRise>
            <InViewRise delay={0.08}>
              <p className="mt-6 max-w-md text-base leading-relaxed text-mist/70 md:mt-10">
                {about.curiosity.paragraphs[2]}
              </p>
            </InViewRise>
          </div>
        </div>
      </section>

      {/* 06 · closing */}
      <section className="border-t border-mist/10 px-6 py-28 md:px-14 md:py-40">
        <InViewRise>
          <Chip>06 &middot; {about.closing.eyebrow}</Chip>
        </InViewRise>
        <InViewRise>
          <p className="text-lg text-mist/55">{about.closing.lead}</p>
          <h2 className="mt-5 font-sans text-[clamp(2.6rem,7.5vw,6.5rem)] font-medium leading-[0.96] tracking-[-0.04em] text-white">
            <span className="block">Every pixel</span>
            <span className="block ml-[0.8em]">is a decision.</span>
            <span className="block ml-[1.8em]">I make them on purpose.</span>
          </h2>
        </InViewRise>
        <InViewRise delay={0.08}>
          <p className="mt-8 max-w-md text-base leading-relaxed text-mist/60">
            {about.closing.body}
          </p>
          <div className="mt-10">
            <Link
              href={about.closing.cta.href}
              className="inline-flex items-center gap-2 bg-white px-5 py-3 font-sans text-[13px] font-medium text-[#030303] transition-opacity hover:opacity-85"
            >
              {about.closing.cta.label} <span aria-hidden>&rarr;</span>
            </Link>
          </div>
        </InViewRise>
      </section>
    </main>
  );
}
