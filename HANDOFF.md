# Karst Insights Homepage — Language and Outcomes Handoff

## Snapshot

- **Repository:** `/Users/kevinbice/Code/Anyra/karstinsights`
- **GitHub:** `anyra27/karstinsights`
- **Branch:** `codex/operating-kit-diagram`
- **Current implementation checkpoint:** `b08dcb2`
- **Local review URL:** `http://127.0.0.1:8898/`
- **Production branch:** `main`
- **Production boundary:** the review branch is pushed, but it has not been merged into `main`.
  Do not deploy or merge without Kevin's explicit approval.

The current branch already contains the cinematic formation hero, the revised problem-to-solution
page order, current district-leader attributions, adaptive glass navigation, the District AI
Operating Kit section, the black Fieldwork chapters, the outcomes area, and the
Workshops / Fieldwork / Learning Platforms close.

## Why this pass is needed

The visual system is now much stronger than the writing. The copy has become too abstract,
framework-heavy, and repetitive. It overuses words such as `capability`, `priority`, `operating`,
`system`, `one`, and `build` without always making the experience concrete.

The most important correction from Kevin is:

> People do not all arrive to work on one shared priority. Each person brings work from their own
> role. Karst gives the group the time, guidance, methods, and environment to learn and build
> together.

The common experience is the practice, not a single project. A communications leader may build a
presentation workflow, a data leader may build a dashboard, and an IT or operations leader may
build an application. Their work can differ while the group develops a shared way of working.

## What the homepage needs to communicate

By the end of the homepage, a superintendent, cabinet member, or district team member should
understand:

1. Karst is an applied AI partnership for school districts.
2. District staff bring the real work already on their plates.
3. Karst creates protected time and works alongside them as they learn and build.
4. People create useful outputs such as data dashboards, presentations, and applications.
5. The work is organized so it is easy to find, use, update, repeat, and hand to another person.
6. The district is left more capable and less dependent on outside help.

This must be understandable without first learning Karst's internal offer architecture.

## Approved strategic frame

Preserve the commercial sequence:

**Workshops → Fieldwork → District AI Operating Kit → Basin / Learning Platforms**

However, do not force every public sentence to carry that vocabulary. The homepage should lead with
the experience and outcomes. Product names can clarify the path after visitors understand what Karst
actually helps people do.

- **Workshops:** focused applied sessions for people bringing real district work. Do not frame the
  entire workshop around one universal priority.
- **Fieldwork:** sustained protected build time and expert partnership across a school year.
- **District AI Operating Kit:** the organized, usable body of work the district can continue with.
- **Learning Platforms:** role-specific practice that extends the work to more people.
- **Basin:** governed continuity behind the artifacts; do not make it the opening sales story.

## Copy problems to correct

### 1. Remove the repeated “one priority” premise

Current instances:

- `src/components/hero/CinematicHomeHero.tsx`
  - `Capability starts with one person.`
  - `One leader turns real work into a system they can run.`
  - `Build one live priority.`
- `src/components/sections/FieldworkMethod.tsx`
  - `A selected cross-functional team builds on a live priority...`
- `src/pages/Landing.tsx`
  - Workshops: `Start with one real priority.`
  - Closing CTA: `Bring one district priority worth changing.`

Rewrite these around **many roles, varied work, shared practice**. It is fine for a single working
session to have focus, but the site should not imply that every person or the full engagement is
organized around one artifact.

Do not simply replace `one` with `many`. Write natural, concrete sentences.

### 2. Rebuild “What Teams Make” into a major proof moment

Current source:

- `src/pages/Landing.tsx`
- `src/components/art/CapabilityVignettes.tsx`

The current four-cell section is visually quiet and its language is generic:

- `See what matters.`
- `One source. Every audience.`
- `Use the right intelligence.`
- `Build what the work needs.`

Kevin wants this area to explicitly highlight:

- **building data dashboards**
- **building presentations**
- **building applications**

These are not minor examples. They are some of the clearest evidence of what becomes possible in a
Karst partnership. Make this an earlier, higher-impact chapter rather than a low-impact card grid.

Use the existing Fieldwork page as the best nearby reference:

- `public/cohort/index.html`
- Relevant chapter begins around the `District AI Operating Kit` introduction.
- The interactive work tabs begin near the `01 · Dashboards` tab.
- Existing visual systems are already present for:
  - dashboard examples
  - forms and applications
  - board-ready presentations

Useful source landmarks in that file:

- dashboard styling near the `/* the detailed dashboard */` comment
- application styling near `/* forms & apps mock */`
- presentation styling near `/* presentation mock */`
- chapter copy and tabs around the `work__tabs` markup

Do not copy the whole Fieldwork page into the homepage. Translate its strongest idea into a
homepage-scale feature: three distinct, concrete outcomes with enough visual evidence to feel real.
Prefer one cinematic or interactive composition over another conventional card row.

### 3. Explain the Operating Kit through ease, not recordkeeping

Current copy in `src/pages/Landing.tsx`:

> Built in the work. Kept by the district.

> Each cycle adds a working system, operating instructions, and clear ownership to one
> district-held record.

The current wording feels abstract and administrative. The section should explain the practical
benefit: everything works together and is easy for the district to continue using.

The next version should make clear that the work is:

- organized in one understandable place;
- documented in plain language;
- easy to find and run again;
- easy to update as needs change;
- transferable when roles or staff change; and
- maintained with Karst during the engagement.

Keep district ownership as an important proof point, but do not make legalistic ownership language
do all of the emotional work. The visitor should picture a useful operating environment, not a
folder or compliance record.

### 4. Rewrite the hero as a human story

Current hero source:

- `src/components/hero/CinematicHomeHero.tsx`

The particle sequence and camera choreography are approved enough to preserve for now. The language
inside it is not.

Avoid:

- negative slogan constructions such as `AI access is everywhere. Operating capability is not.`;
- repeated theory words without a concrete object;
- implying a single leader or single priority is the universal starting point; and
- turning every formation into a new piece of terminology.

The copy should move through a simple human truth:

1. district people already have consequential work;
2. their normal calendars leave little room to learn and build;
3. Karst creates that room and works beside them;
4. different people build different things;
5. the methods and outputs become easier to share and continue.

The hero may remain cinematic, but it should sound like Kevin explaining the partnership in a
meeting—not like a consulting framework.

### 5. Conduct a full visible-copy sweep

Do not limit the next pass to the four strings Kevin called out. Review every visible homepage
headline, subhead, label, card, and CTA for:

- abstract language;
- repeated `one`, `priority`, `capability`, `operating`, and `system`;
- slogan fragments that do not explain anything;
- statements that sound more rigid than the actual experience;
- copy that centers the Karst framework before the visitor's work;
- too many competing messages on one screen; and
- language that sounds generated rather than spoken.

Prefer:

- concrete nouns: dashboard, presentation, application, workflow, data, meeting, team;
- active descriptions of what people do;
- short sentences that Kevin could naturally say aloud;
- enough specificity that a cabinet member can explain Karst after one visit; and
- confidence without inflated claims.

## Recommended homepage story

The next pass should test this order:

1. **Hero:** Karst gives district people room and expert partnership to learn and build with the
   work already in front of them.
2. **Concrete outcomes:** dashboards, presentations, and applications—shown, not merely named.
3. **District proof:** current leader testimony and credible examples.
4. **How the partnership works:** varied roles and projects, protected time, guided practice,
   review, and iteration.
5. **Operating Kit:** the work becomes organized, understandable, and easy to continue.
6. **Live example:** the existing district dashboard showcase.
7. **Engagement paths:** Workshops, Fieldwork, and Learning Platforms.
8. **Contact:** an invitation to discuss the district's people and work, not to submit one priority.

This order is a hypothesis to validate in the browser. Preserve story momentum; do not add sections
just to satisfy the outline.

## Visual direction to preserve

- Premium, calm, editorial, and cinematic.
- Cinematic dark fields must be warm black, not navy.
- The hero owns the primary large-scale particle narrative.
- Secondary motion can echo the particle language, but it should explain something and must not
  wobble, breathe, or feel strange after settling.
- Strong imagery is welcome where it gives the page emotional range.
- Avoid conventional SaaS card grids when a section deserves a more authored composition.
- Maintain the adaptive blurred-glass navigation.
- Maintain accessibility, responsive behavior, reduced-motion handling, and the existing legal
  pages.

## Truth and production boundaries

- Do not invent district outcomes, metrics, quotes, applications, or client work.
- Keep testimonial wording and current attributions accurate.
- Preserve the distinction between examples, synthetic demonstrations, and live district work.
- Do not expose proprietary implementation details merely to explain the offer.
- Do not restore Firebase or a site database to the contact flow.
- Preserve the privacy and accessibility statements unless a functional change requires an update.
- Do not merge or deploy from this branch without Kevin's explicit approval.

## Primary file map

- Homepage composition and most visible copy:
  - `src/pages/Landing.tsx`
- Cinematic hero copy and stages:
  - `src/components/hero/CinematicHomeHero.tsx`
- Fieldwork method section:
  - `src/components/sections/FieldworkMethod.tsx`
- Current capability visuals:
  - `src/components/art/CapabilityVignettes.tsx`
- Operating Kit visual:
  - `src/components/art/OperatingKitDiagram.tsx`
- Existing dashboard proof:
  - `src/components/sections/DashboardShowcase.tsx`
- Engagement paths:
  - `src/components/sections/EngagementPaths.tsx`
- Current Fieldwork reference implementation:
  - `public/cohort/index.html`
- Global visual system:
  - `src/index.css`

## Acceptance criteria for the next pass

- A visitor can name at least three concrete things Karst helps teams build.
- The page clearly accommodates different people bringing different work.
- No major section implies the whole partnership revolves around one priority.
- The Operating Kit feels useful and easy to continue—not like a folder, abstract record, or legal
  ownership claim.
- The hero and homepage copy sound natural when read aloud.
- The visual treatment of dashboards, presentations, and applications has enough impact to compete
  with the hero without duplicating it.
- Desktop and 390px mobile retain zero horizontal overflow.
- Reduced-motion behavior remains calm and complete.
- Production build, focused lint, link checks, and the site compliance gate pass.
- `main` and production remain untouched until Kevin approves the review branch.

## Resume

```bash
cd /Users/kevinbice/Code/Anyra/karstinsights
git switch codex/operating-kit-diagram
npm run dev -- --host 127.0.0.1 --port 8898
```

Before editing, confirm the worktree is still clean and reread:

- `/Users/kevinbice/Code/Anyra/PRICING.md`
- `/Users/kevinbice/Code/Anyra/tasks/strategy.md`
- `/Users/kevinbice/Code/Anyra/.agent-state/status.md`
- `/Users/kevinbice/Code/Anyra/.agent-state/decisions.md`
- `/Users/kevinbice/Code/Anyra/.agent-state/handoffs.md`

