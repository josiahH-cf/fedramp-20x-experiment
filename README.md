# FedRAMP 20x, Explained

**Operations Park** is an interactive learning simulation for people encountering FedRAMP 20x for the first time. The learner follows one fictional cloud service—Northstar Cloud—through a persistent assurance campus and sees how its profile, evidence, findings, reports, incidents, changes, and ongoing-review state accumulate.

The application remains a deterministic technical reference. The plain-language tour is the default; exact rule IDs, force words, matrices, all 46 Key Security Indicator outcomes, 75 source terms, eight schemas, validation corrections, and official sources remain one action away.

## Source roles and precedence

The repository preserves the two original source files unchanged:

- `fedramp-20x-field-guide.html` contains the original field-guide presentation and embedded structured data.
- `fedramp-20x-deterministic-requirements-processes summarized.md` controls sequencing, force-word interpretation, timing matrices, decision algorithms, applicability, and known gaps.

The Markdown rules control deterministic behavior. Factual meaning is checked against the authoritative government sources listed in [docs/CONTENT_VALIDATION.md](docs/CONTENT_VALIDATION.md). Material corrections remain visible in the application and validation record.

Design decisions are documented separately:

- [docs/UI_UX_REFERENCE_INDEX.md](docs/UI_UX_REFERENCE_INDEX.md) records useful learning and interaction patterns from the named references and explicit non-copying boundaries.
- [docs/UI_UX_GAP_ANALYSIS.md](docs/UI_UX_GAP_ANALYSIS.md) records the evidence-bound baseline audit, first-principles pass, decisions, priorities, and implementation resolution status.

The external simulations are design references only. They are not sources for FedRAMP facts, and no external code, copy, artwork, layout, trade dress, or assets are used.

## Five-module learning architecture

The twelve deterministic scenes are grouped into five novice-facing modules without changing their order:

1. **Why FedRAMP 20x exists** — actors, reusable assurance, agency authorization, and certification profile.
2. **How a security claim becomes proof** — decisions, measures, evidence, verification, validation, and KSI outcomes.
3. **What happens when a vulnerability appears** — detection, evaluation, risk reduction, reporting, and closure.
4. **When an incident or major change occurs** — parallel incident communication and significant-change paths.
5. **How trust stays current** — ongoing reporting, quarterly review, feedback, access, and synthesis.

Every step follows the same learning rhythm: **In plain English**, **Why it matters**, **See it happen**, **Try it**, and **Official details**. Each module adds a short explanatory check, and the final capstone routes one realistic service event through the connected operating system. Incorrect choices explain the misconception and permit immediate retry; nothing is locked.

## Simulation and interaction model

- One persistent assurance campus replaces twelve disconnected diagrams.
- Northstar Cloud travels the deterministic route and carries a visible service evidence ledger.
- Five module landmarks, twelve scene stops, and the tracked service are inspectable with pointer, touch, keyboard, and assistive-technology semantics.
- Pan, zoom, fit-to-view, and optional service follow are available without making the lesson depend on camera navigation.
- Profile, evidence-chain, detection, vulnerability, reporting, incident, change, and monitoring choices visibly update the service and explain why the system reacted.
- Visual buildings, roads, carrier, gates, and clocks are original illustrative metaphors rather than FedRAMP architecture or compliance proof.

## Playback and learning control

The simplified transport includes one Play/Pause toggle, Previous step, and Next step. First-time explanations receive a reading dwell computed from their actual length; completed explanations replay faster. A visible bar reports reading progress.

Settings provide:

- manual reading mode that never auto-advances;
- Calm, Standard, and Brisk pacing;
- reduced motion without reducing reading time or content;
- optional service-follow camera behavior;
- restart and a two-step local-progress reset.

Opening a dialog, an expanded definition/detail, or an exercise pauses automatic advancement. Keyboard shortcuts are `Space` for Play/Pause, `←`/`→` for steps, `S` to step forward, and `F` to toggle service follow.

## Local progress and privacy

Progress is versioned and stored only in browser `localStorage`. It includes:

- the last scene and visited/completed scenes;
- completed modules and understood/review check states;
- capstone state;
- the accumulated service ledger;
- motion, pacing, manual-reading, and camera-follow preferences;
- whether the guided introduction was completed.

Return visits offer **Resume learning**, and Settings offers **Reset progress**. There are no accounts, analytics, trackers, cookies, runtime network services, or backend.

## Project structure

```text
index.html                         Application entry and metadata
src/content.js                    Validated factual scenes, timings, sources, and corrections
src/learning.js                   Five modules, novice copy, definitions, checks, and capstone
src/progress.js                   Versioned local-only progress normalization and persistence
src/world.js                      Persistent campus, tracked service, camera, and inspectors
src/main.js                       UI state machine, pacing, activities, reference, and events
src/styles.css                    Visual system, adaptive layouts, focus, and reduced motion
src/data/source-data.json         Exact extraction of the preserved HTML DATA object
scripts/extract-source-data.mjs   Deterministic source extraction utility
scripts/validate-content.mjs      Source, model, module, matrix, and learning validation
tests/unit/                       Content, module, progress, pacing, and route tests
tests/e2e/                        Desktop, tablet, mobile, interaction, and deployment tests
docs/CONTENT_VALIDATION.md        Dated factual review and authoritative source list
docs/UI_UX_REFERENCE_INDEX.md     Reference-pattern decisions and copying boundaries
docs/UI_UX_GAP_ANALYSIS.md        Evidence-bound UX audit and resolution checklist
.github/workflows/pages.yml       GitHub Pages validation, build, and deployment
```

Factual changes belong in `src/content.js` and must remain compatible with the preserved source validation. Novice presentation belongs in `src/learning.js`. Runtime state, persistence, and campus rendering remain separated so interaction changes do not silently change factual values.

## Development and build

Requirements: Node.js 20 or newer and npm.

```bash
npm install
npm run dev
```

Run the complete local verification:

```bash
npm run lint
npm test
npm run build
npm run test:e2e
```

`npm run test:all` runs every command above. The browser suite covers desktop, tablet, mobile, and a dedicated 320px composition check. Install Chromium with `npx playwright install chromium` if it is not already available.

The static output is written to `dist/`. Vite uses `base: './'`, so JavaScript, CSS, and source maps resolve under the GitHub Pages repository subpath without runtime dependencies.

## Deterministic validation

Every production build reparses the preserved HTML and proves that `src/data/source-data.json` is an exact extraction. Current validation covers:

- 17 rulesets / 225 declared rules / 60 embedded explicit statements;
- 10 KSI families / 46 indicators;
- 75 supplied terms / eight schemas;
- all remediation and incident matrix values;
- the five documented KSI outcome restorations;
- twelve scenes in exact deterministic order;
- five modules that contain every scene exactly once without reordering;
- complete novice copy, known glossary references, module checks, capstone answers, and bounded reading dwell;
- authoritative first-party government source domains.

The 165 declared-but-not-embedded rule statements are not invented. The application clearly identifies this source limitation and directs users to current official rules.

## Accessibility and responsive behavior

- Semantic headings, regions, controls, progress bars, native dialogs, live announcements, definitions, and a skip link support assistive technologies.
- All functions are available through keyboard and pointer/touch input; important feedback does not depend on color or hover alone.
- Visible focus treatment is retained throughout. Native modal focus containment is used, and the inspector becomes a focus-managed mobile bottom sheet.
- Instructional copy uses normal browser body sizing and generous line height. Essential text does not rely on SVG labels.
- The campus is intrinsically responsive; it has no translated desktop minimum width. Mobile hides the desktop rail in favor of a clear Journey control, stacks learning surfaces, and keeps transport reachable.
- `prefers-reduced-motion` is honored and can be overridden locally without reducing time available to understand content.

Automated and expert checks are not a formal WCAG conformance certification or a substitute for observed usability research with representative learners.

## Accuracy transparency

The in-product **About this simulation and its accuracy** surface distinguishes:

- directly represented rule logic;
- content simplified for learning;
- illustrative visual metaphor;
- where official requirements can be verified;
- the last content-verification date.

This is an educational aid. Current official FedRAMP rules and agency-specific risk decisions remain authoritative.

## GitHub Pages deployment

`.github/workflows/pages.yml` validates, tests, builds, and deploys `dist/` whenever `main` is pushed. Repository Pages settings use GitHub Actions as the deployment source. The workflow can also be dispatched manually from Actions.

The application uses only repository-local HTML, CSS, JavaScript, JSON, and original SVG geometry. No secrets or credentials are required or committed.
