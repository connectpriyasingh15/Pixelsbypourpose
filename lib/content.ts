// ─────────────────────────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH — content + structure for Pixels by Purpose.
// Every section reads from this file. No visuals here, only content + IA.
// House style: no em-dashes in prose. Use commas, colons, periods, parentheses.
//
// Flags:
//   ⚠ needsConfirm / needsVoice — inferred or drafted; awaits Priya's confirmation.
//   ⚠ PLACEHOLDER — must be replaced before launch.
// ─────────────────────────────────────────────────────────────────────────────

export const meta = {
  name: "Priya Singh",
  title: "Pixels by Purpose",
  tagline: "Designing intelligent products that simplify complexity.",
  belief: "Pixel by pixel. Question by question. Until complexity becomes clarity.",
  positioning:
    "Curious enough to question every assumption. Purposeful enough to justify every pixel.",
  role: "Advanced User Experience Designer at Honeywell",
  hero:
    "Behind every seamless experience are hundreds of intentional decisions. I combine curiosity, systems thinking, and product strategy to turn complexity into intuitive enterprise products people trust and enjoy using.",
  location: "Bangalore, India",
  email: "connect.priyasingh15@gmail.com",
  linkedin: "https://linkedin.com/in/priyathedesigner",
  dribbble: "https://dribbble.com/Priyathedesigner",
  behance: "https://behance.net/priyasingh91",
  resume: "/Priya_Singh_Resume.pdf",
};

// ── The 8-movement structure (IA). Order, ids, and nav labels the build reads.
export const sections = [
  { id: "top", index: "01", label: "Hero", nav: null },
  { id: "manifesto", index: "02", label: "Manifesto", nav: "Manifesto" },
  { id: "journey", index: "03", label: "The Journey", nav: "About" },
  { id: "thinking", index: "04", label: "How I Think", nav: "Thinking" },
  { id: "work", index: "05", label: "Featured Work", nav: "Work" },
  { id: "toolbox", index: "06", label: "Toolbox", nav: "Toolbox" },
  { id: "playground", index: "07", label: "Playground", nav: "Playground" },
  { id: "contact", index: "08", label: "Contact", nav: "Contact" },
];

// ── Primary navigation — one independent page each.
export const nav = [
  { label: "About", href: "/about" },
  { label: "Work", href: "/work" },
  { label: "Contact", href: "/contact" },
];

// ── Curiosity interstitials ───────────────────────────────────────────────────
// Cinematic full-black "title cards" between acts: one open question Priya is
// chasing. Each doubles as pacing and as a point-of-view signal for design
// leaders. `after` = the section id the interstitial follows.
export const interstitials = [
  { after: "manifesto", question: "What does calm feel like at 40,000 devices?" },
  { after: "thinking", question: "Can an interface earn trust the way a person does?" },
  { after: "work", question: "When should AI decide, and when should it just ask?" },
  { after: "playground", question: "How little can a dashboard say and still be understood?" },
];

// ── 02 · Manifesto ───────────────────────────────────────────────────────────
export const manifesto = {
  eyebrow: "The Idea",
  title: "Pixels by Purpose",
  lead: "Curiosity discovers. Purpose decides. Pixels communicate.",
  body: [
    "Every pixel is a decision, and every decision has a purpose. Great products aren't built by decorating interfaces. They're built through thousands of intentional decisions, each balancing user needs, business goals, technology, and simplicity.",
    "Most people see a pixel as the smallest unit of an interface. I see it as the smallest unit of a decision: to simplify, guide, clarify, reassure, or delight. But purposeful decisions don't begin in Figma. They begin with curiosity.",
    "Curiosity is what stops me accepting the first solution. It questions assumptions, uncovers hidden problems, and reveals opportunities others miss. Purpose gives those discoveries direction. That combination is rare.",
    "Perfection isn't measured by visual polish. It's measured by how little a person has to think. The best interfaces don't demand attention. They disappear.",
  ],
  principles: [
    "Every pixel is a decision.",
    "Purpose answers why. Curiosity asks what if.",
    "Pixels are communication, not decoration.",
    "The best interfaces don't demand attention. They disappear.",
  ],
  // The philosophy as a flow: pixels are the result, not the starting point.
  flow: [
    "Curiosity",
    "Discovery",
    "Understanding",
    "Systems Thinking",
    "Purpose",
    "Pixel",
    "Experience",
    "Business Impact",
  ],
  flowCaption:
    "Pixels are the result, not the starting point. That's how senior designers think.",
};

// ── 02b · Vision ──────────────────────────────────────────────────────────────
// ⚠ needsVoice — aspiration-led draft in Priya's voice. Confirm the ambition.
export const vision = {
  eyebrow: "The Vision",
  title: "Design that makes complex systems feel calm.",
  lead: "I want to be the designer teams trust with their hardest problems.",
  body: [
    "The most important software in the world is also the most intimidating: the systems that run buildings, networks, operations, and now AI. It is dense, high-stakes, and usually punishing to use. I believe that is exactly where design matters most, and where it is most often missing.",
    "My aim is to sit where the hard decisions get made, with product and engineering, early, while the problem is still ambiguous. Not to decorate the result, but to shape it. Design as judgment, not a service at the end of the line.",
    "As intelligence moves into these systems, the work becomes about trust: knowing when the machine should decide and when it should simply ask. I want to build interfaces that make that intelligence feel invisible, and leave the person more capable and more certain than before.",
  ],
  closing:
    "Perfection is the direction, never the destination. I intend to keep walking toward it.",
};

// ── 03 · The Journey (first-person narrative + timeline) ──────────────────────
export const journey = {
  eyebrow: "The Journey",
  lead: "I want the hardest software to feel effortless.",
  // ⚠ needsVoice — aspiration-led draft in Priya's voice. Refine the ambition and
  // the personal conviction so it sounds exactly like her.
  story: [
    "I'm drawn to the problems most designers avoid: dense, technical, high-stakes systems where a wrong decision costs real money or real trust. Enterprise, operations, AI. The work is unglamorous and genuinely hard, and that is exactly why I want it. Making something complicated feel simple is the most valuable thing design can do, and it's the thing I want to be great at.",
    "Curiosity is what keeps me moving. I don't want to accept the first answer, or the way something has always been done. I want to keep asking what a person is really trying to decide, and whether there is a better way to help them do it. The good design usually hides inside the questions.",
    "My ambition is to design where design is a strategic force, not a service. To sit with product and engineering on the ambiguous, early, important decisions, on products used by thousands of people. I'm growing toward the kind of teams that treat design as thinking, and I intend to earn my place there.",
    "Underneath all of it is one belief: the best products help people make better decisions with less effort. That is the standard I hold my work to, and the reason I keep going deeper into the complexity instead of away from it.",
  ],
  timeline: [
    {
      org: "Honeywell",
      role: "Advanced User Experience Designer",
      period: "2026 — Present",
      place: "Bangalore",
      note: "Owning product design strategy for autonomous building management and AI-enabled operations.",
    },
    {
      org: "Cambium Networks",
      role: "Senior Product Designer",
      period: "2024 — 2025",
      place: "Bangalore",
      note: "Led the end-to-end redesign of cnMaestro and built a modular design system across the ecosystem.",
    },
    {
      org: "Glynk",
      role: "Product Designer, then Senior Product Designer",
      period: "2022 — 2024",
      place: "Bangalore",
      note: "Grew from product to senior designer on a consumer community platform.",
    },
    {
      org: "Before design",
      role: "Financial Operations",
      period: "2019 — 2022",
      place: "",
      note: "Ran financial operations for key accounts, where I learned that every design decision is a business decision.",
    },
  ],
};

// ── About page — long-form editorial ─────────────────────────────────────────
// Audience: VP / Director of Design, Design Managers. Finance origin omitted by
// direction. Voice: first-person, evidence-led, peer-to-peer. No em-dashes.
export const about = {
  eyebrow: "About",
  lead: "I want the hardest software to feel effortless.",
  whoIAm: {
    eyebrow: "Who I am",
    paragraphs: [
      "I design backward from a decision. Before Figma, I want to know what the person is trying to figure out, and what getting it wrong costs them. I start from that question, not from a feature list.",
      "I trust evidence over taste. Interviews, usability tests, the way people actually move: that is where I settle arguments. Opinion starts a conversation. It should not end one.",
      "I work close to product and engineering, early, while the decisions are still open. The complexity is real, so I keep it in the architecture instead of handing it to the person. The interface stays quiet. The system does the hard part.",
    ],
  },
  why: {
    eyebrow: "Why Pixels by Purpose",
    paragraphs: [
      "The name is a small argument with my own industry.",
      "Most people see a pixel as the smallest unit of an interface. I see it as the smallest unit of a decision: to clarify, guide, reassure, remove. Nothing on a screen is neutral. Every pixel is either earning its place or getting in the way.",
      "Purpose gives a pixel the right to exist. Curiosity earns the right answer: it stops me accepting the first solution, and keeps asking what if until the real problem shows itself.",
      "Curiosity discovers. Purpose decides. Pixels communicate. Craft is the patience to keep going after the idea already works, because the last ten percent is where trust is won.",
      "I chose the densest corner of software on purpose: enterprise, operations, AI. It is where intentional design matters most, and where it is most often missing.",
    ],
  },
  skills: {
    eyebrow: "Skills",
    title: "Organized as ways of thinking, not tools.",
    items: [
      {
        title: "Design Leadership",
        note: "Raising the quality of the decisions around me, not only making my own.",
      },
      {
        title: "Systems Thinking",
        note: "I design the model underneath, not the screen in front of me. Get the system honest and the screens follow.",
      },
      {
        title: "Design Systems",
        note: "A shared language, not a component library: one product, one voice, each decision made once, at enterprise scale.",
      },
      {
        title: "Interaction Design",
        note: "Motion and state that answer you rather than decorate. When it is right, you stop noticing it.",
      },
      {
        title: "AI-Augmented Design",
        note: "Intelligence as a material, not a feature. Built to reduce what a person has to think, and honest about when to decide and when to ask.",
      },
      {
        title: "Design Engineering",
        note: "I prototype in code and read engineering constraints as design material. This site is hand-built, not assembled.",
      },
    ],
  },
  curiosity: {
    eyebrow: "Curiosity",
    paragraphs: [
      "Curiosity is not something I do after work. It is the engine.",
      "Away from client work I keep a small lab running: creative coding, WebGL, motion, interface experiments that exist to answer one question, what happens if. Most fail. The ones that do not show up later in real work, as an instinct I did not have before.",
      "I read widely and take things apart to see the decisions inside them, drawn to the edges where design meets code and intelligence. It is not a side project. It is how I make sure next year's work is better than today's.",
    ],
  },
  closing: {
    eyebrow: "Closing",
    lead: "Everything I believe fits in one line.",
    line: "Every pixel is a decision. I make them on purpose.",
    body: "If your team is working on something hard, dense, and worth getting right, I would like to hear about it.",
    cta: { label: "Start a conversation", href: "/contact" },
  },
};

// ── 04 · How I Think ──────────────────────────────────────────────────────────
export const thinking = {
  eyebrow: "How I Think",
  title: "Systems before screens.",
  principles: [
    {
      title: "Start from the decision, not the feature",
      body: "An MBA taught me to lead with the business question: what is this person trying to decide, and what is it worth? I design backward from that decision, not forward from a feature list.",
    },
    {
      title: "Decide with evidence, not opinion",
      body: "I start in discovery: interviews, journey maps, usability tests. Design is an argument, and I'd rather win it with what people actually do than with taste. Opinion starts the conversation; evidence ends it.",
    },
    {
      title: "Put the complexity in the system",
      body: "The hard systems I work on are genuinely complex. My job is to hold that complexity inside the architecture so the interface can stay calm. The person should never inherit the mess.",
    },
    {
      title: "Design in the open",
      body: "I work close to product and engineering. Discovery, critique, and handoff aren't paperwork around design. They are design. I'd rather ship the smaller right thing than the bigger guessed one.",
    },
    {
      title: "Treat AI as a material",
      body: "I use AI to move faster through research, exploration, and prototyping, and I design it into products so it reduces a person's thinking instead of adding to it. The best intelligence should feel invisible.",
    },
  ],
};

// ── 05 · Featured Work — hero case studies (deep) ─────────────────────────────
export type CaseStudy = {
  slug: string;
  index: string;
  name: string;
  category: string;
  year: string;
  premise: string;
  role: string;
  timeframe: string;
  context: { label: string; value: string }[];
  challenge: string;
  insight: string; // the turning-point reframe (senior signal)
  approach: { title: string; body: string }[];
  outcomes: { value: string; label: string }[];
  impact: string;
  designPOV: {
    title: string;
    before: string;
    after: string;
    note: string;
  };
  figma: string;
  accent?: boolean;
  placeholder?: boolean;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "cnmaestro",
    index: "01",
    name: "cnMaestro",
    category: "Enterprise SaaS · Network Management",
    year: "2024–25",
    premise: "Turning a reactive monitoring tool into a proactive command center.",
    role: "Senior Product Designer (Individual Contributor), end-to-end UX revamp",
    timeframe: "Cambium Networks · 8 sprints (~4 months)",
    context: [
      { label: "Role", value: "Senior Product Designer (IC)" },
      { label: "Company", value: "Cambium Networks" },
      { label: "Timeframe", value: "8 sprints (~4 months)" },
      { label: "Scope", value: "Research, IA, UI, design system" },
    ],
    challenge:
      "cnMaestro is Cambium Networks' flagship platform for provisioning, monitoring, and maintaining thousands of wired and wireless devices across global deployments, and it's mission-critical for NOC teams and Managed Service Providers. Years of accumulated features had left it dense: ~6-second dashboard loads, critical alerts buried under redundant layers, key actions hidden in deep menus, and one overloaded interface for every role. The result was decision paralysis. 78% of users struggled to locate critical alerts, firmware tasks averaged 6.4 minutes, 60% of field users abandoned the mobile view mid-task, and NPS sat at 3.7.",
    insight:
      "The dashboard wasn't too dense. It was undifferentiated. Every role saw everything, so no one could see what mattered. The unlock wasn't removing data. It was giving each operator only the decisions they own.",
    approach: [
      {
        title: "Role-based dashboards",
        body: "Grounded in 42 user interviews, I split the one overloaded interface into distinct views for Admin, NOC, and Field, so each operator sees only the decisions they own. Restructuring the information architecture also let the system scale toward 40,000+ devices.",
      },
      {
        title: "Status at a glance, prevention over fire-fighting",
        body: "Network Health Cards surface uptime and alerts up front, and I promoted the AI-driven Assurance Score to the Level-1 metric. That shifted operators from reactive fire-fighting to proactive prevention, and cut fault-diagnosis flows from 5–8 clicks to 1–3.",
      },
      {
        title: "Built for scale and 24/7 use",
        body: "One-click bulk actions for firmware upgrades and provisioning, an optimized mobile UI with larger controls and offline caching, and a dark theme to reduce eye strain for round-the-clock operators, all held together by a modular design system.",
      },
    ],
    outcomes: [
      { value: "~80%", label: "faster fault diagnosis (MTTR)" },
      { value: "52 → 78%", label: "task success rate" },
      { value: "↓29%", label: "task completion time (6.4 to 4.5 min)" },
    ],
    impact:
      "A dense monitoring tool rebuilt into a proactive command center, with an average ~27% improvement across every usability measure. Task success rose 52% to 78%, SUS climbed 51 to 77, errors per task fell 34%, and NPS more than recovered, on an architecture that scales past 40,000 devices.",
    designPOV: {
      title: "Complexity is the enemy of uptime.",
      before:
        "One overloaded interface served every role (Admin, NOC, and Field alike), burying critical alerts under redundant layers behind ~6-second loads.",
      after:
        "Role-based dashboards show each operator only the decisions they own, with health cards and an AI Assurance Score surfacing what needs attention first.",
      note: "From the cnMaestro UX revamp: 8 sprints, 42 interviews, and moderated usability testing with 24 participants across 6 roles.",
    },
    figma:
      "https://www.figma.com/design/sVn95Tp6T7gA8zzlTkQY08/cnMastro-Casestudy?node-id=243-23525",
    accent: true,
  },
  {
    slug: "honeywell-campus-management",
    index: "02",
    name: "Honeywell Campus Management",
    category: "Enterprise AI · Building Operations",
    year: "2026",
    premise: "Autonomous buildings an operator can actually trust.",
    role: "Advanced UX Designer, discovery through delivery",
    timeframe: "Honeywell · 2026–present",
    context: [
      { label: "Role", value: "Advanced UX Designer" },
      { label: "Company", value: "Honeywell" },
      { label: "Timeframe", value: "2026 — present" },
      { label: "Scope", value: "Discovery to delivery, cross-platform system" },
    ],
    challenge:
      "Honeywell Campus Management turns a live building into a single operating picture: occupancy, air quality, indoor climate, people flow, and power draw, across floors and campuses. Collecting the signal is the easy part. The hard part is that an operator opening the dashboard has to know, in one glance, which of five floors is running hot, where air quality is slipping, and which spaces are over- or under-used, then act before a comfort issue becomes a complaint or a cost.",
    insight:
      "When a building starts making its own decisions, the design problem isn't automation. It's trust. Operators don't need the system to decide for them. They need to understand and override it at a glance.",
    approach: [
      {
        title: "One operating picture, five honest signals",
        body: "Grounded in discovery with operators, I built the dashboard around the five things they actually watch: People Occupancy, Air Quality (CAQI), Indoor Temperature by floor, People Flow, and Power Usage. Each module states its own trend (declining, rising) so status is read, not calculated, and an out-of-range floor flags itself.",
      },
      {
        title: "Alerts that live where they happen",
        body: "A 2D/3D floor plan ties every signal to place. A 'Temperature: High' or 'Air Quality: Low' pill sits on the exact workspace, meeting room, or breakout it refers to, so operators reason about the building spatially, the way they walk it, not as a list of sensor IDs.",
      },
      {
        title: "Heatmaps for the question behind the number",
        body: "I layered occupancy and environmental heatmaps over the plan so a manager sees density and climate as a gradient across the whole floor. That turns 'is 28°C a problem?' into 'this entire wing is hot,' backed by a cross-platform design system so every Honeywell app reads the same.",
      },
    ],
    outcomes: [
      { value: "20–25%", label: "reduction in task-completion time" },
      { value: "37–40%", label: "fewer operator errors" },
      { value: "~40%", label: "faster design-to-dev handoff" },
    ],
    impact:
      "A live building an operator can read in seconds and trust to act on, with fewer errors and faster decisions, backed by a cross-platform design system that keeps a growing enterprise suite speaking one language.",
    designPOV: {
      title: "Technology should feel invisible.",
      before:
        "Five floors of raw telemetry ask the operator to become the algorithm, scanning numbers to guess which space needs them.",
      after:
        "A calm operating picture does the reasoning first: status per module, alerts pinned to the room, and heatmaps for the pattern, leaving the human the judgment, not the math.",
      note: "Frames from the live dashboard, spatial floor plan, and heatmap overlays. Honeywell Campus Management.",
    },
    figma:
      "https://www.figma.com/design/gZwNqtTyBG3l6crmbhZsFB/Honeywell-Campus-Management?node-id=21-981",
  },
  // ⚠ Maino.Ai — recommended 3rd hero (enterprise AI analytics, light + dark).
  //   Awaiting an accurate deep read (PDF export) before writing the full study.
];

// ── 05 · Featured Work — Selected Work archive (compact "range" pieces) ────────
// Shown at the END of the Work section, not as deep case studies.
export type ArchiveWork = {
  code: string;
  slug: string;
  name: string;
  category: string;
  premise: string;
  challenge: string;
  approach: string[];
  demonstrates: string;
  figma: string;
  needsConfirm?: boolean;
};

export const archiveWork: ArchiveWork[] = [
  {
    code: "A01",
    slug: "cessna-pet-app",
    name: "Cessna Pet App",
    category: "Consumer · Mobile",
    premise: "One calm home for everything a pet owner juggles.",
    challenge:
      "A pet-care super-app (shopping across brands, grooming and vet services, health check-ups, a pharmacy, live shopping, and content) that had to hold all of it on one home screen without collapsing into a cluttered marketplace.",
    approach: [
      "Pet-first, not catalog-first. Browsing starts with the animal, and one search spans product and service.",
      "Commerce and care on one surface, so buying food and booking a vet are the same effortless motion.",
      "Warm and trustworthy: soft imagery, a persistent care and pharmacy and consult nav, and always-visible 24/7 support.",
    ],
    demonstrates:
      "Consumer mobile, information architecture under feature pressure, emotional craft.",
    figma:
      "https://www.figma.com/design/r8SzJeJrSzAJRYjvyzgpCM/Cessna-Pet-App?node-id=135-411",
    needsConfirm: true,
  },
  {
    code: "A02",
    slug: "nuweb",
    name: "Nuweb",
    category: "Fintech · Marketing Web",
    premise: "Making the case for an investment, cinematically.",
    challenge:
      "Turn a skeptical visitor into an investor: explain a complex financial opportunity and earn trust for a high-stakes decision, on a single persuasive page.",
    approach: [
      "Story, not prospectus. A dark, cinematic 'investment journey' that leads the reader step by step, with green as the growth and capital accent.",
      "Problem-first framing that opens with the investor's pain before the pitch, so the product reads as the answer.",
      "Trust scaffolding: testimonials, a clear 'what we change', and an FAQ to defuse risk.",
    ],
    demonstrates:
      "Narrative and marketing web design, persuasion architecture, dark visual craft.",
    figma:
      "https://www.figma.com/design/EDAcE09CrF0vk8JfYC8C7v/Nuweb?node-id=563-38760",
    needsConfirm: true,
  },
  {
    code: "A03",
    slug: "gdf",
    name: "GDF",
    category: "Brand · Marketing Web",
    premise: "Making everyday fine shopping feel effortless.",
    challenge:
      "A premium daily-shopping brand needed a marketing site that felt elevated yet approachable, communicating 'hassle-free fine shopping' across Landing, Services, and About while converting browsers into customers.",
    approach: [
      "Editorial retail layout: a clean multi-page system with strong imagery and a warm accent for appetite and energy.",
      "Proof through people and numbers: partners, real team faces, and headline stats to build credibility fast.",
      "Clear service articulation: the offering broken down plainly, with a consistent 'Get in touch' path.",
    ],
    demonstrates:
      "Brand and marketing web design, visual systems, range beyond enterprise.",
    figma:
      "https://www.figma.com/design/Dxhx1NjC7taHSEJG2fhKhH/GDF?node-id=344-1143",
    needsConfirm: true,
  },
  // ⚠ To slot (⭐⭐ — hero or archive, Priya's call): DUGLS (real-estate CRM
  //   dashboard, data-dense) · Predica (AI resume-builder SaaS).
];

// ── 06 · Toolbox ──────────────────────────────────────────────────────────────
export const toolbox = {
  eyebrow: "Toolbox",
  title: "Both sides of the craft.",
  disciplines: [
    {
      side: "UX & Strategy",
      items: [
        { title: "Product & UX Strategy", note: "Framing the business question before the screen." },
        { title: "Product Discovery", note: "Finding the real problem worth solving." },
        { title: "User Research", note: "Interviews, usability, synthesis. Evidence over opinion." },
        { title: "Information Architecture", note: "Ordering complexity so it can be read." },
        { title: "Complex Workflow Design", note: "Dense, high-stakes operations made calm." },
        { title: "Systems Thinking", note: "Designing the system, not just the surface." },
      ],
    },
    {
      side: "UI & Craft",
      items: [
        { title: "Interaction Design", note: "Motion and state that guide, never decorate." },
        { title: "Visual Design", note: "Hierarchy, type, and restraint." },
        { title: "Design Systems", note: "Reusable components, patterns, governance at scale." },
        { title: "Motion Design", note: "Rive and Lottie, timed to the story." },
        { title: "Prototyping", note: "Low-fi to high-fidelity, AI-accelerated." },
        { title: "AI Experience Design", note: "Intelligence that reduces a person's thinking." },
      ],
    },
  ],
  tools: [
    { group: "Design & Prototyping", items: ["Figma (incl. Figma AI)", "Adobe XD", "Photoshop", "Illustrator", "Sketch"] },
    { group: "Motion & Advanced Prototyping", items: ["Rive", "Lottie", "Framer", "Spline"] },
    { group: "Research & Handoff", items: ["Maze", "Hotjar", "Zeplin"] },
    { group: "AI-Augmented Workflow", items: ["Figma AI", "ChatGPT / Claude", "Midjourney"] },
  ],
};

// ── 07 · Playground & Design Notes ────────────────────────────────────────────
export const playground = {
  eyebrow: "Playground",
  title: "Off the clock.",
  note: "Experiments, motion studies, and half-formed ideas. Where craft stays sharp. Evolving.",
  items: [
    { title: "Motion Studies", note: "Micro-interactions and state transitions.", tag: "Rive · Lottie" },
    { title: "Design Explorations", note: "Systems and components, taken apart.", tag: "Figma" },
    { title: "AI Concepts", note: "Prompt-driven interfaces and ideas.", tag: "Concept" },
    { title: "Dribbble Shots", note: "Selected visual experiments.", tag: "Dribbble" },
  ],
};

export const designNotes = {
  eyebrow: "Design Notes",
  title: "Notes on the craft.",
  note: "Essays on enterprise UX, AI, and systems thinking. In progress.",
  items: [
    { title: "Making density legible in enterprise UX", tag: "Enterprise UX", status: "Soon" },
    { title: "Designing AI that reduces thinking", tag: "AI", status: "Soon" },
    { title: "Systems before screens", tag: "Design Systems", status: "Soon" },
  ],
};

// ── Social proof — placed near Work / Contact ─────────────────────────────────
// ⚠ PLACEHOLDER — replace with 1–2 real quotes (PM / engineer / manager) or omit.
export const testimonials = [
  {
    // ⚠ SAMPLE — replace with a real quote before launch.
    quote:
      "She turned a system nobody wanted to touch into the tool the team opens first. Every decision was backed by what users actually did, not by taste.",
    name: "⚠ Add a real name",
    role: "Product Manager · replace this quote",
  },
  {
    // ⚠ SAMPLE — replace with a real quote before launch.
    quote:
      "Rare to find a designer who argues in engineering terms. Handoffs got faster and the ambiguity got smaller every time she was in the room.",
    name: "⚠ Add a real name",
    role: "Engineering Lead · replace this quote",
  },
];

// ── 08 · Contact ──────────────────────────────────────────────────────────────
export const contact = {
  eyebrow: "Contact",
  title: "Let's build something meaningful.",
  body:
    "I'm drawn to hard, dense problems: enterprise, AI, and systems that others find intimidating. If that's the kind of work your team does, I'd love to talk.",
  availability: "Open to senior and lead product design roles.",
  links: [
    { label: "Email", href: "mailto:connect.priyasingh15@gmail.com" },
    { label: "LinkedIn", href: "https://linkedin.com/in/priyathedesigner" },
    { label: "Résumé", href: "/Priya_Singh_Resume.pdf" },
    { label: "Dribbble", href: "https://dribbble.com/Priyathedesigner" },
    { label: "Behance", href: "https://behance.net/priyasingh91" },
  ],
};
