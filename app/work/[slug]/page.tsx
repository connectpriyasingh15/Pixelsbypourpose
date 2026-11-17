// Full case study: the crisp Work language carried into depth. Each
// study walks the Double Diamond (Discover / Define / Develop /
// Deliver: diverge on the problem, converge on the insight, diverge
// on solutions, converge on the shipped system), then lands on the
// tracked numbers. Phase narratives are composed strictly from the
// facts in lib/content; the numbers grid carries every measurement.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { existsSync } from "fs";
import path from "path";
import { caseStudies } from "@/lib/content";
import InViewRise from "@/components/sections/InViewRise";

const V = "?v=2";

type Phase = { name: string; motion: string; body: string };
type Point = { title: string; body: string };
type Extra = {
  phases: Phase[];
  tracked: { value: string; label: string }[];
  pains: Point[];
  a11y: { intro: string; items: Point[] };
};

// The Double Diamond, per study: composed from the study's own facts.
const DIAMOND: Record<string, Extra> = {
  cnmaestro: {
    phases: [
      {
        name: "Discover",
        motion: "Diverge on the problem",
        body: "42 user interviews across the roles that live in the platform: NOC operators, admins, field engineers. Journey maps of the fire-fighting loop, and moderated usability sessions that put numbers on the pain: 78% of users struggled to locate critical alerts, firmware tasks averaged 6.4 minutes, 60% of field users abandoned the mobile view mid-task, and NPS sat at 3.7.",
      },
      {
        name: "Define",
        motion: "Converge on the insight",
        body: "The synthesis pointed away from the obvious diagnosis. The dashboard was not too dense; it was undifferentiated. Every role saw everything, so no one could see what mattered. The problem was redefined: give each operator only the decisions they own.",
      },
      {
        name: "Develop",
        motion: "Diverge on solutions",
        body: "Explorations restructured the information architecture around roles rather than features: distinct Admin, NOC, and Field views, Network Health Cards that surface uptime and alerts up front, and the AI-driven Assurance Score promoted to the Level-1 metric. Each round went back through usability testing with 24 participants across 6 roles.",
      },
      {
        name: "Deliver",
        motion: "Converge on the system",
        body: "Shipped as role-based dashboards with one-click bulk actions for firmware and provisioning, an optimized mobile UI with offline caching, a dark theme for round-the-clock operators, and a modular design system holding it together, on an architecture that scales past 40,000 devices.",
      },
    ],
    tracked: [
      { value: "~80%", label: "faster fault diagnosis (MTTR)" },
      { value: "52 → 78%", label: "task success rate" },
      { value: "↓29%", label: "task completion time (6.4 to 4.5 min)" },
      { value: "51 → 77", label: "SUS score" },
      { value: "↓34%", label: "errors per task" },
      { value: "~27%", label: "avg improvement across usability measures" },
      { value: "40,000+", label: "devices the architecture scales to" },
      { value: "5–8 → 1–3", label: "clicks to diagnose a fault" },
    ],
    pains: [
      {
        title: "Six seconds before anything",
        body: "The dashboard took ~6 seconds to load. For a NOC operator mid-incident, that is six seconds of a network misbehaving invisibly, on every single check. Slow first paint trained operators to keep stale tabs open, which meant decisions made on stale data.",
      },
      {
        title: "Critical alerts, buried alive",
        body: "Years of accumulated features stacked redundant layers over the information that mattered. 78% of users could not locate critical alerts quickly: the alert existed, the path to it did not. Escalations happened because finding the fault took longer than the fault itself.",
      },
      {
        title: "One interface, every role",
        body: "Admins, NOC operators, and field engineers all saw the same overloaded screen. Every role scanned past the other roles' data to find its own, so the density punished everyone equally. The result was decision paralysis: seeing everything, owning nothing.",
      },
      {
        title: "The field gave up on mobile",
        body: "60% of field users abandoned the mobile view mid-task. On a rooftop with one hand on a ladder, deep menus and small targets are not an inconvenience, they are a dead end. Field work fell back to phone calls into the NOC, doubling the load on both sides.",
      },
    ],
    a11y: {
      intro: "A tool used in 24/7 shifts, in server rooms and on rooftops, by people under pressure: accessibility here is operational safety, not compliance paperwork.",
      items: [
        {
          title: "Status never relies on color alone",
          body: "Every alert severity pairs its color with an icon shape and a text label, so red-green color blindness never hides a critical fault. Health states read identically in the dark theme, the light theme, and monochrome.",
        },
        {
          title: "Contrast built for tired eyes",
          body: "The dark theme was designed to WCAG 2.1 AA contrast targets, tuned for operators deep into night shifts. Chart palettes were checked against common color-vision deficiencies before they shipped.",
        },
        {
          title: "Keyboard-first operations",
          body: "The NOC lives on keyboards. Alert triage, fault drill-down, and bulk firmware flows are fully keyboard-navigable with a visible focus order that follows the reading order of the layout.",
        },
        {
          title: "Field-sized targets",
          body: "The mobile UI uses enlarged touch targets and high-contrast controls that survive sunlight and gloves, with offline caching so a dropped connection never strands a task half-done.",
        },
      ],
    },
  },
  "honeywell-campus-management": {
    phases: [
      {
        name: "Discover",
        motion: "Diverge on the problem",
        body: "Discovery with the operators who run live buildings. The signal collection was never the hard part: occupancy, air quality, indoor climate, people flow, and power draw all stream in across floors and campuses. The hard part was the glance: knowing in seconds which of five floors runs hot, where air quality is slipping, and which spaces are over- or under-used.",
      },
      {
        name: "Define",
        motion: "Converge on the insight",
        body: "When a building starts making its own decisions, the design problem is not automation. It is trust. Operators do not need the system to decide for them; they need to understand it and override it at a glance. That reframe set the bar for every screen.",
      },
      {
        name: "Develop",
        motion: "Diverge on solutions",
        body: "The dashboard was built around the five things operators actually watch: People Occupancy, Air Quality (CAQI), Indoor Temperature by floor, People Flow, and Power Usage, each module stating its own trend so status is read, not calculated. A 2D/3D floor plan ties every signal to place, with alert pills pinned to the exact workspace they refer to, and occupancy and environmental heatmaps layered over the plan.",
      },
      {
        name: "Deliver",
        motion: "Converge on the system",
        body: "Delivered discovery through handoff as one continuous thread, backed by a cross-platform design system that keeps the growing Honeywell suite speaking one language: a live building an operator can read in seconds and trust to act on.",
      },
    ],
    tracked: [
      { value: "20–25%", label: "reduction in task-completion time" },
      { value: "37–40%", label: "fewer operator errors" },
      { value: "~40%", label: "faster design-to-dev handoff" },
      { value: "5", label: "signals unified into one operating picture" },
    ],
    pains: [
      {
        title: "Telemetry is not insight",
        body: "The platform already collected everything: occupancy, CAQI, temperature per floor, people flow, power draw. But five floors of raw numbers ask the operator to become the algorithm, scanning grids to guess which space needs them. The data was complete and the picture was absent.",
      },
      {
        title: "Sensor IDs instead of rooms",
        body: "Alerts arrived as list entries tied to sensor identifiers, not places. An operator thinks spatially, the way they walk the building; translating 'sensor 4F-A12' into 'the northwest meeting room' was manual work performed dozens of times a shift.",
      },
      {
        title: "Automation without trust",
        body: "As the building began making its own decisions, operators had no window into why. An autonomous action you cannot inspect is an action you learn to distrust, and distrusted automation gets switched off. The system's intelligence was only as useful as its explainability.",
      },
      {
        title: "A suite speaking different languages",
        body: "Each app in the growing enterprise suite had drifted toward its own patterns. Every context switch between apps carried a small relearning cost, multiplied across an operator's day.",
      },
    ],
    a11y: {
      intro: "Building operators work long shifts across control rooms, tablets, and walls of screens. The dashboard treats accessibility as part of legibility: the same decisions that help an operator at 3 a.m. help every user.",
      items: [
        {
          title: "Heatmaps with a second channel",
          body: "Occupancy and climate heatmaps never encode meaning in hue alone: value labels and threshold markers ride the gradient, so the pattern survives color-vision deficiency and grayscale wall displays.",
        },
        {
          title: "Alert pills that say it in words",
          body: "The floor-plan pills pair color with explicit text ('Temperature: High', 'Air Quality: Low') pinned to the named space, so an alert is readable by screen reader, by colorblind operators, and at a distance.",
        },
        {
          title: "One glance, stated trends",
          body: "Each module states its trend in words (rising, declining) beside the number, designed to WCAG 2.1 AA contrast on the light UI, so status is read, not decoded.",
        },
        {
          title: "Consistency as accessibility",
          body: "The cross-platform design system keeps controls, focus behavior, and terminology identical across the suite: the fewer patterns an operator must hold in memory, the more attention is left for the building.",
        },
      ],
    },
  },
};

export function generateStaticParams() {
  return caseStudies.map((cs) => ({ slug: cs.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const cs = caseStudies.find((c) => c.slug === params.slug);
  return { title: cs ? cs.name : "Case study" };
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-10 inline-flex items-center gap-3 bg-mist/[0.06] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.24em] text-mist/60">
      {children}
    </p>
  );
}

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const cs = caseStudies.find((c) => c.slug === params.slug);
  const extra = DIAMOND[params.slug];
  if (!cs || !extra) notFound();

  const hasShot = existsSync(
    path.join(process.cwd(), "public", "work", `${cs.slug}.webp`)
  );
  const next =
    caseStudies[(caseStudies.findIndex((c) => c.slug === cs.slug) + 1) % caseStudies.length];

  return (
    <main>
      {/* header */}
      <section className="px-6 pt-32 md:px-14 md:pt-40">
        <Chip>
          Case study {cs.index} &middot; {cs.category} &middot; {cs.year}
        </Chip>
        <h1 className="max-w-4xl font-sans text-[clamp(2.4rem,6vw,5rem)] font-medium leading-[0.98] tracking-[-0.03em]">
          {cs.name}
        </h1>
        <p className="mt-6 max-w-2xl text-xl leading-relaxed text-mist/60">
          {cs.premise}
        </p>
        <dl className="mt-10 grid max-w-4xl grid-cols-2 gap-6 border-y border-mist/10 py-6 md:grid-cols-4">
          {cs.context.map((c) => (
            <div key={c.label}>
              <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-mist/40">
                {c.label}
              </dt>
              <dd className="mt-2 text-sm leading-snug text-mist/80">{c.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* the screens */}
      {hasShot && (
        <section className="px-6 pt-16 md:px-14">
          <InViewRise>
            <div className="overflow-hidden border border-mist/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/work/${cs.slug}.webp` + V}
                alt={cs.name + " screens"}
                className="w-full"
              />
            </div>
            <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.22em] text-mist/40">
              {cs.designPOV.note}
            </p>
          </InViewRise>
        </section>
      )}

      {/* the challenge */}
      <section className="px-6 py-24 md:px-14 md:py-32">
        <InViewRise>
          <Chip>The challenge</Chip>
          <p className="max-w-3xl text-lg leading-relaxed text-mist/70">
            {cs.challenge}
          </p>
        </InViewRise>
      </section>

      {/* the problem, up close */}
      <section className="border-t border-mist/10 px-6 py-24 md:px-14 md:py-32">
        <InViewRise>
          <Chip>The problem, up close</Chip>
        </InViewRise>
        <div className="grid grid-cols-1 gap-x-16 gap-y-12 md:grid-cols-2">
          {extra.pains.map((pt, i) => (
            <InViewRise key={pt.title} delay={(i % 2) * 0.07}>
              <div className="border-t border-mist/10 pt-6">
                <p className="font-mono text-[11px] text-mist/35">0{i + 1}</p>
                <h3 className="mt-2 font-sans text-xl font-medium tracking-[-0.01em] text-mist">
                  {pt.title}
                </h3>
                <p className="mt-3 leading-relaxed text-mist/60">{pt.body}</p>
              </div>
            </InViewRise>
          ))}
        </div>
      </section>

      {/* the double diamond */}
      <section className="border-t border-mist/10 px-6 py-24 md:px-14 md:py-32">
        <InViewRise>
          <Chip>Process &middot; the double diamond</Chip>
        </InViewRise>
        <div className="mb-12 hidden grid-cols-2 gap-px md:grid">
          <p className="border-b border-mist/15 pb-3 text-center font-mono text-[10px] uppercase tracking-[0.24em] text-mist/45">
            &#9671; Diamond one &middot; the right problem
          </p>
          <p className="border-b border-mist/15 pb-3 text-center font-mono text-[10px] uppercase tracking-[0.24em] text-mist/45">
            &#9671; Diamond two &middot; the right solution
          </p>
        </div>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {extra.phases.map((p, i) => (
            <InViewRise key={p.name} delay={i * 0.06}>
              <div className="border-t border-mist/10 pt-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-mist/40">
                  0{i + 1} &middot; {p.motion}
                </p>
                <h3 className="mt-3 font-sans text-2xl font-medium tracking-[-0.02em] text-mist">
                  {p.name}
                </h3>
                <p className="mt-4 text-[15px] leading-relaxed text-mist/60">
                  {p.body}
                </p>
              </div>
            </InViewRise>
          ))}
        </div>
      </section>

      {/* the insight */}
      <section className="border-t border-mist/10 px-6 py-24 md:px-14 md:py-32">
        <InViewRise>
          <Chip>The turning point</Chip>
          <p className="max-w-4xl font-sans text-[clamp(1.6rem,3.2vw,2.6rem)] font-medium leading-[1.15] tracking-[-0.02em] text-mist/95">
            {cs.insight}
          </p>
        </InViewRise>
      </section>

      {/* the work */}
      <section className="border-t border-mist/10 px-6 py-24 md:px-14 md:py-32">
        <InViewRise>
          <Chip>The work</Chip>
        </InViewRise>
        <div className="space-y-12">
          {cs.approach.map((a, i) => (
            <InViewRise key={a.title} delay={i * 0.05}>
              <div className="grid grid-cols-1 gap-4 border-t border-mist/10 pt-8 md:grid-cols-12">
                <span className="font-mono text-[11px] text-mist/35 md:col-span-1">
                  0{i + 1}
                </span>
                <h3 className="font-sans text-xl font-medium tracking-[-0.01em] text-mist md:col-span-4">
                  {a.title}
                </h3>
                <p className="leading-relaxed text-mist/60 md:col-span-7">{a.body}</p>
              </div>
            </InViewRise>
          ))}
        </div>
      </section>

      {/* accessibility */}
      <section className="border-t border-mist/10 px-6 py-24 md:px-14 md:py-32">
        <InViewRise>
          <Chip>Accessibility</Chip>
          <p className="max-w-2xl font-sans text-xl font-medium leading-snug tracking-[-0.01em] text-mist/90">
            {extra.a11y.intro}
          </p>
        </InViewRise>
        <div className="mt-14 grid grid-cols-1 gap-x-16 gap-y-12 md:grid-cols-2">
          {extra.a11y.items.map((it, i) => (
            <InViewRise key={it.title} delay={(i % 2) * 0.07}>
              <div className="flex gap-6 border-t border-mist/10 pt-6">
                <span className="font-mono text-[11px] leading-6 text-mist/35">
                  0{i + 1}
                </span>
                <div>
                  <h3 className="font-sans text-lg font-medium tracking-[-0.01em] text-mist">
                    {it.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-mist/60">{it.body}</p>
                </div>
              </div>
            </InViewRise>
          ))}
        </div>
      </section>

      {/* before / after */}
      <section className="border-t border-mist/10 px-6 py-24 md:px-14 md:py-32">
        <InViewRise>
          <Chip>{cs.designPOV.title}</Chip>
        </InViewRise>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <InViewRise>
            <div className="border-l border-mist/15 pl-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-mist/40">
                Before
              </p>
              <p className="mt-3 leading-relaxed text-mist/60">{cs.designPOV.before}</p>
            </div>
          </InViewRise>
          <InViewRise delay={0.08}>
            <div className="border-l border-mist/30 pl-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-mist/40">
                After
              </p>
              <p className="mt-3 leading-relaxed text-mist/85">{cs.designPOV.after}</p>
            </div>
          </InViewRise>
        </div>
      </section>

      {/* tracked outcomes */}
      <section className="border-t border-mist/10 px-6 py-24 md:px-14 md:py-32">
        <InViewRise>
          <Chip>Outcomes &middot; tracked</Chip>
          <h2 className="max-w-2xl font-sans text-[clamp(1.8rem,4vw,3.2rem)] font-medium leading-[1.02] tracking-[-0.03em] text-white">
            Measured, not claimed.
          </h2>
        </InViewRise>
        <div className="mt-14 grid grid-cols-2 gap-x-10 gap-y-12 md:grid-cols-4">
          {extra.tracked.map((t, i) => (
            <InViewRise key={t.label} delay={(i % 4) * 0.05}>
              <div className="border-t border-mist/15 pt-5">
                <p className="font-sans text-3xl font-medium tracking-[-0.02em] text-mist">
                  {t.value}
                </p>
                <p className="mt-2 font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] text-mist/45">
                  {t.label}
                </p>
              </div>
            </InViewRise>
          ))}
        </div>
        <InViewRise delay={0.1}>
          <p className="mt-16 max-w-2xl text-lg leading-relaxed text-mist/70">
            {cs.impact}
          </p>
        </InViewRise>
      </section>

      {/* footer nav */}
      <section className="border-t border-mist/10 px-6 py-16 md:px-14">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <Link
            href="/work"
            className="font-sans text-[14px] font-medium text-mist/70 transition-colors hover:text-mist"
          >
            &larr; All work
          </Link>
          <a
            href={cs.figma}
            target="_blank"
            rel="noreferrer"
            className="font-sans text-[14px] font-medium text-mist/70 underline-offset-8 transition-colors hover:text-mist hover:underline"
          >
            Open in Figma <span aria-hidden>&#8599;</span>
          </a>
          <Link
            href={`/work/${next.slug}`}
            className="font-sans text-[14px] font-medium text-mist/85 transition-colors hover:text-mist"
          >
            Next: {next.name} &rarr;
          </Link>
        </div>
      </section>
    </main>
  );
}
