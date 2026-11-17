import { interstitials } from "@/lib/content";

export function Eyebrow({
  index,
  children,
}: {
  index?: string;
  children: React.ReactNode;
}) {
  return (
    <p className="mb-8 inline-flex items-center gap-3 bg-mist/[0.06] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.24em] text-mist/60">
      {index && <span className="text-mist/45">{index}</span>}
      {children}
    </p>
  );
}

export function Section({
  id,
  first,
  children,
}: {
  id?: string;
  first?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={`px-6 py-24 md:px-14 md:py-32 ${
        first ? "pt-32 md:pt-40" : "border-t border-mist/10"
      }`}
    >
      <div className="max-w-5xl">{children}</div>
    </section>
  );
}

// Cinematic curiosity title card between scenes.
export function Curiosity({ after }: { after: string }) {
  const item = interstitials.find((i) => i.after === after);
  if (!item) return null;
  return (
    <section className="flex min-h-[60svh] items-center justify-center px-6 py-24 text-center md:px-10">
      <div className="mx-auto max-w-4xl">
        <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.24em] text-mist/50">
          Curiosity
        </p>
        <p className="font-sans text-[clamp(1.8rem,4.5vw,3.6rem)] font-medium leading-tight tracking-[-0.03em] text-mist/85">
          {item.question}
        </p>
      </div>
    </section>
  );
}
