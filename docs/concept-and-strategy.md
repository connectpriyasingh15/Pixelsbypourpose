# Concept & Content Strategy — Pixels by Purpose

The guide for every build decision. House style: no em-dashes in prose.

## The Concept — "A film about focus"

The site is a short film, shot in the dark, about a designer who makes
complicated things feel calm. Four words carry it, with curiosity as the current
running underneath:

> Curiosity asks the question.
> Purpose decides which questions deserve an answer.
> Pixels do the quiet work.
> And perfection is the direction you walk in, never the place you arrive.

That is the spine. Everything else serves it.

### Cinematic devices
- **The cinema house is dark.** Content emerges from black, the way an image
  resolves on a screen. Attention has nowhere else to go.
- **Title cards.** Each act opens on one enormous line of Fraunces, held in
  silence. Big type is the establishing shot.
- **Black is pacing.** Whitespace is the pause between lines of dialogue. The
  scroll is the edit.
- **The pixel field is film grain.** It lives in the dark and pulls focus toward
  the cursor: the frame sharpening where you look. Pixels finding their purpose.
- **One light.** Forest green is the only color in the room: the projector beam,
  the exit sign, the thing the eye follows.
- **Curiosity interstitials.** Between acts, the screen goes fully black and asks
  one question Priya is chasing (see `interstitials` in content.ts). They make
  the site cinematic and broadcast a point of view at the same time.

### The three acts (mapping to the 8 movements)
- **Act I — Belief.** Hero, Manifesto. The title card and the thesis.
- **Act II — Person, mind, proof.** The Journey, How I Think, Featured Work.
- **Act III — Range and invitation.** Toolbox, Playground & Notes, Contact.

## Content Strategy — written for the people who hire

Audience: VP Design, Director of Design, Design Manager, CTO, CEO, Product Head.
None are recruiters keyword-scanning. They hire for judgment, outcomes, and a
point of view. The site answers each reader's private question fast.

| Reader | The question in their head | Where the site answers it |
|---|---|---|
| VP / Director, Design | Does she have taste and a point of view? | Manifesto, How I Think, the craft of the site itself |
| Design Manager | How does she work, and will she grow? | The Journey (in the open), curiosity interstitials |
| CTO | Will she reduce engineering waste? | Work (design systems, ↓40% handoff, scales to 40k), Toolbox |
| CEO | Does design move the business? | Metrics-forward outcomes, Manifesto, the brand experience |
| Product Head | Product thinking or pixel-pushing? | The Insight beat, discovery, outcomes over output |

### The five strategic moves
1. **Lead with the decision and the result, never the screens.** Every case
   study opens on the reframe (the Insight beat) and the outcome. Screens are
   evidence, shown late. This is the senior signal.
2. **Speak their language, not portfolio language.** MTTR, adoption, error
   reduction, handoff time, "scales past 40,000 devices." That vocabulary reads
   as product and business, making design legible as leverage.
3. **The point of view is the product.** The Manifesto and How I Think exist for
   the VP/Director. A designer with a clear, defensible philosophy is hireable.
4. **The site is the live craft interview.** For a design leader, a bespoke,
   cinematic, hand-built experience says more than any single case study. Every
   interaction should feel intended.
5. **Curiosity is the growth signal.** Interstitials, Playground, and Design
   Notes together say "still learning, has range." Leaders hire for trajectory.

### Voice rules
Confident, first-person, evidence-led. Poetic in the interstitials and
Manifesto; precise in the case studies. No buzzwords, no "passionate designer,"
no em-dashes. Peer-to-peer, never pleading. Contact reads "let's build something
meaningful," not "please hire me."

### What we cut (junior tells that lose this audience)
Process for its own sake, tool logos as skill bars, feature tours, adjectives
without proof, and too many projects. Hence 3 to 4 heroes, the rest in the
archive.

## Related references
- `docs/portfolio-benchmark.md` — how top senior/lead designers present themselves.
- `lib/content.ts` — the source of truth for all copy, the 8-movement `sections`
  structure, and the curiosity `interstitials`.
