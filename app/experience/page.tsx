import type { Metadata } from "next";
import { thinking, toolbox, playground, designNotes } from "@/lib/content";
import { Eyebrow, Section, Curiosity } from "@/components/ui";

export const metadata: Metadata = { title: "Experience" };

export default function ExperiencePage() {
  return (
    <main>
      {/* How I Think */}
      <Section id="thinking" first>
        <Eyebrow index="04">{thinking.eyebrow}</Eyebrow>
        <h1 className="font-sans text-[clamp(2.2rem,5vw,4rem)] font-medium leading-[1.0] tracking-[-0.03em]">
          {thinking.title}
        </h1>
        <ol className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2">
          {thinking.principles.map((p, i) => (
            <li key={i} className="border-t border-mist/10 pt-6">
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-sm text-mist/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-sans text-2xl font-medium tracking-[-0.02em]">
                    {p.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-mist/60">{p.body}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Curiosity after="thinking" />

      {/* Toolbox */}
      <Section id="toolbox">
        <Eyebrow index="06">{toolbox.eyebrow}</Eyebrow>
        <h2 className="font-sans text-[clamp(2rem,4.5vw,3.6rem)] font-medium leading-[1.02] tracking-[-0.03em]">
          {toolbox.title}
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2">
          {toolbox.disciplines.map((d) => (
            <div key={d.side}>
              <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.16em] text-mist/50">
                {d.side}
              </p>
              <ul className="space-y-5">
                {d.items.map((c) => (
                  <li key={c.title} className="border-t border-mist/10 pt-4">
                    <p className="font-sans text-xl font-medium tracking-[-0.01em]">{c.title}</p>
                    <p className="mt-1 text-sm text-mist/55">{c.note}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 grid grid-cols-1 gap-8 border-t border-mist/10 pt-10 md:grid-cols-4">
          {toolbox.tools.map((t) => (
            <div key={t.group}>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-mist/50">
                {t.group}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-mist/70">
                {t.items.join(" · ")}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Playground & Design Notes */}
      <Section id="playground">
        <Eyebrow index="07">{playground.eyebrow}</Eyebrow>
        <h2 className="font-sans text-[clamp(2rem,4.5vw,3.6rem)] font-medium leading-[1.02] tracking-[-0.03em]">
          {playground.title}
        </h2>
        <p className="mt-4 max-w-md text-mist/55">{playground.note}</p>
        <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
          {playground.items.map((p) => (
            <div key={p.title} className="border-t border-mist/10 pt-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-mist/50">
                {p.tag}
              </p>
              <p className="mt-2 font-sans text-lg font-medium tracking-[-0.01em]">{p.title}</p>
              <p className="mt-1 text-sm text-mist/50">{p.note}</p>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-mist/45">
            {designNotes.eyebrow} · {designNotes.title}
          </p>
          <ul className="mt-6 divide-y divide-mist/10 border-y border-mist/10">
            {designNotes.items.map((w) => (
              <li
                key={w.title}
                className="flex items-center justify-between gap-6 py-5"
              >
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-mist/50">
                    {w.tag}
                  </span>
                  <p className="mt-1 font-sans text-lg font-medium tracking-[-0.01em] text-mist/80">
                    {w.title}
                  </p>
                </div>
                <span className="rounded-full border border-mist/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-mist/50">
                  {w.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </main>
  );
}
