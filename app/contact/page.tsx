import type { Metadata } from "next";
import { contact } from "@/lib/content";
import { Eyebrow, Section } from "@/components/ui";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <main>
      <Section id="contact" first>
        <Eyebrow index="08">{contact.eyebrow}</Eyebrow>
        <h1 className="max-w-4xl font-sans text-[clamp(2.4rem,6vw,5rem)] font-medium leading-[1.0] tracking-[-0.03em]">
          {contact.title}
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-mist/60">
          {contact.body}
        </p>
        <p className="mt-4 font-mono text-[12px] uppercase tracking-[0.16em] text-mist/50">
          {contact.availability}
        </p>
        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
          {contact.links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="text-lg text-mist/80 underline-offset-4 hover:text-mist hover:underline"
            >
              {l.label}
            </a>
          ))}
        </div>
      </Section>
    </main>
  );
}
