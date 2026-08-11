# FedRAMP 20x Learning Experience Gap Analysis

Reviewed: 2026-08-11

Evidence used: the deployed and local application at commit `2593f99`; desktop and mobile Chromium captures; the source, renderer, styles, tests, README, and validation record; the binding UI/UX baseline; and the three design references indexed in `UI_UX_REFERENCE_INDEX.md`. This is an expert heuristic and implementation audit, not user research.

## 1) What Looks Off

### The first screen exposes the implementation before the learning promise

- **Issue:** Twelve scene buttons, four global tools, briefing tabs, an activity surface, a seek bar, and six transport actions appear immediately. There is no dominant start action.
- **Why it stands out:** A novice must interpret the interface before receiving a meaningful outcome. This conflicts with fast activation, strong defaults, and progressive disclosure.
- **Evidence:** The 1440px render exposes at least 24 visible buttons before the current activity. The rendered body begins with route and tool labels rather than a plain-language description of what FedRAMP 20x accomplishes.
- **Confidence:** Supported by context.
- **Resolution status:** Implemented. The welcome state now has one dominant **Start guided tour** action, secondary module exploration, and conditional local resume.

### The route mirrors source scenes instead of a novice mental model

- **Issue:** Twelve peers are presented as the top-level information architecture.
- **Why it stands out:** A first-time learner needs a small conceptual map before detailed deterministic stages.
- **Evidence:** `SCENES` correctly encodes twelve deterministic stages, while `.scene-rail` renders all twelve as equal navigation items. No higher-level grouping is present.
- **Confidence:** Supported by context.
- **Resolution status:** Implemented. Five top-level modules preserve all twelve scenes, deterministic order, scene deep links, and new module deep links.

### Terminology leads with internal and official labels

- **Issue:** Labels such as “Normative console,” “Outcome explorer,” “Cadence board,” “PAIN,” and “C / I” appear before plain-language meaning.
- **Why it stands out:** The learner must recall or infer terminology to understand an action.
- **Evidence:** These strings are activity headings in `src/main.js`; the initial role board assumes that “certifies reusable assurance” is already meaningful.
- **Confidence:** Supported by context.
- **Resolution status:** Implemented. Every scene now leads with a practical question and plain-English meaning; 21 durable definitions and **Official details** introduce exact terminology progressively.

### The visual world restarts instead of telling one story

- **Issue:** Every scene creates a separate SVG graph and a generic courier with no retained state.
- **Why it stands out:** The “Operations Park” metaphor promises an operational system, but the learner sees twelve disconnected diagrams.
- **Evidence:** `renderWorld(scene)` rebuilds nodes and routes entirely from each scene; `state` has no persistent service or evidence ledger.
- **Confidence:** Supported by context.
- **Resolution status:** Implemented. Northstar Cloud and its evidence ledger persist across one campus and accumulate profile, proof, finding, reporting, incident, change, and monitoring state.

### Important visual objects are not inspectable

- **Issue:** Buildings and the courier look interactive but are SVG groups without button semantics or click behavior.
- **Why it stands out:** This is a false signifier and prevents contextual exploration.
- **Evidence:** `.world-node` elements have no `tabindex`, role, or event path. The activity beneath the world is state-separate.
- **Confidence:** Supported by context.
- **Resolution status:** Implemented. Five landmarks, twelve stops, and the tracked service are keyboard/pointer inspectable in a native focus-managed dialog that becomes a mobile bottom sheet.

### Exercises often return data without showing causality

- **Issue:** Calculators and selectors update adjacent text, but the world rarely changes in response.
- **Why it stands out:** The learner sees an answer but not why the operational path changed.
- **Evidence:** `renderActivity()` is rerun after selector clicks; the world is not rerendered with the resulting class, finding, clock, incident, or change state.
- **Confidence:** Supported by context.
- **Resolution status:** Implemented. Profile, evidence, detection, evaluation, response, reporting, incident, change, and monitoring choices update visible service/campus state and plain-language feedback.

### Transport offers overlapping concepts and fixed pacing

- **Issue:** Play, Pause, and Hold overlap; each scene uses one fixed duration; the seek bar exposes implementation progress rather than reading status.
- **Why it stands out:** Control labels require interpretation, and fourteen seconds does not reflect explanation length.
- **Evidence:** Separate `play`, `pause`, and `hold` actions exist; playback increments by `delta / 14000`.
- **Confidence:** Supported by context.
- **Resolution status:** Implemented. One Play/Pause toggle, step controls, length-based first-visit dwell, faster replay, manual reading, three pacing defaults, and visible reading/overall progress replace the old transport.

### Retrieval practice arrives too late

- **Issue:** The only explicit quiz is in the final scene.
- **Why it stands out:** Earlier modules remain predominantly exposure and reference lookup.
- **Evidence:** `state.quiz` is rendered only by `activityRecap()`.
- **Confidence:** Supported by context.
- **Resolution status:** Implemented. Each module has an explanatory understood/review check, and a three-decision service scenario connects response, incident communication, and ongoing trust with immediate retry.

### Advanced reference material competes with the novice path

- **Issue:** Overview, Library, Sources, rule counts, rule tabs, IDs, matrices, and schemas are prominent throughout.
- **Why it stands out:** Valuable expert material consumes the same visual level as the first learning action.
- **Evidence:** Three top-level reference buttons, a scene rule count, “Rule map” tab, and activity-specific technical boards are visible from the start.
- **Confidence:** Supported by context.
- **Resolution status:** Implemented. Exact rules, 75 terms, 46 KSI outcomes, matrices, eight schemas, corrections, and official sources remain searchable in contextual **Official details** and the consolidated **Reference** layer.

### Readability and mobile composition are below the baseline

- **Issue:** Essential copy is frequently below normal body size, and mobile crops a translated desktop SVG.
- **Why it stands out:** The content is harder to read and the world is not genuinely adaptive.
- **Evidence:** Computed visible minimums are approximately 8.96px desktop and 8.64px mobile. CSS sets common instructional sizes from `.52rem` to `.7rem`; mobile sets `.world { min-width: 610px; transform: translateX(...) }`.
- **Confidence:** Supported by context.
- **Resolution status:** Implemented. Instructional copy uses normal body sizing, primary controls meet touch sizing, the SVG has no translated minimum width, and 320px/mobile bottom-sheet behavior is covered by browser tests.

### Progress exists only in the current runtime

- **Issue:** A return visit cannot resume, preserve completed checks, or remember pacing preferences.
- **Why it stands out:** A twelve-step learning experience needs continuity, especially when explanations are intentionally readable.
- **Evidence:** Application state is initialized in memory and no storage API is used.
- **Confidence:** Supported by context.
- **Resolution status:** Implemented. Versioned browser-local state persists the last step, visits, completions, checks, capstone, service state, and motion/pacing/follow preferences with explicit resume and reset.

### Accuracy disclosure is expert-facing

- **Issue:** The source dialog documents corrections but does not explain representational boundaries in learner language.
- **Why it stands out:** A novice cannot readily tell what is directly modeled, simplified, or merely illustrative.
- **Evidence:** `openSources()` lists corrections and links but lacks the four required representation categories.
- **Confidence:** Supported by context.
- **Resolution status:** Implemented. The searchable accuracy surface uses all five required categories, retains material corrections and official links, and states the dated/non-guaranteed verification boundary.

### First-principles pass

- **Novice comprehension and retention, not maximum feature exposure:** The current factual coverage is strong, but its simultaneous visibility delays activation. The premise holds; the first surface should be reduced.
- **A visual metaphor must reduce cognitive load:** Twelve reset diagrams add decoration without a stable memory structure. The premise holds; one persistent campus is preferable.
- **Interaction must reveal causal relationships:** Adjacent calculator output is useful but incomplete. The premise holds; choices should change the system route and state.
- **Official rules remain the source of truth:** Existing deterministic extraction and validation are a product strength. The premise holds; analogies must never replace exact details.
- **The learner controls pace and direction:** Current direct scene access is strong, while overlapping transport labels and fixed pacing weaken control. The premise holds; simplify without locking modules.
- **A coherent journey beats disconnected reference screens:** The deterministic order already forms a story but the interface does not expose it at the right level. The premise holds; five modules should frame the twelve steps.

## 2) What May Be Different Than Expected

The product name and low-poly premise suggest a guided operations simulation. The artifact is currently closer to a polished interactive compliance reference: technically rich, source-faithful, and deterministic, but more static and fragmented than a learner may expect. Its scene rail foregrounds implementation structure; its generic courier does not retain meaning; and several “activities” are data displays rather than decisions with consequences. This is not a factual failure. It is a mismatch between the strongest implementation capability and the intended novice experience.

## 3) Hidden Assumptions or Unasked Questions

- The learner already knows the difference among a cloud service provider, assessor, FedRAMP, and agency.
- Terms such as authorization, certification, evidence, KSI, SDR, PAIN, mitigation, remediation, and significant change are recognizable.
- The learner can infer arrows and buildings without inspecting them.
- Fourteen seconds is enough for every explanation and every learner.
- A wide desktop is the primary environment; a translated 610px map is acceptable on mobile.
- The learner prefers passive playback or reference lookup over prediction and application.
- Remembering prior scene content is acceptable when making a later decision.
- Advanced rule material should always remain visible because an experienced user may need it.
- A color change alone is sufficient feedback for some answer states.
- One final quiz adequately supports retention across the whole journey.

## 4) Decisions That Should Be Made Explicit

- **Information architecture:** five learner-facing modules contain twelve deterministic scenes.
- **Audience layers:** plain-language learning is the default; exact rules and source data remain one action away.
- **Terminology:** everyday meaning appears first; official terms and acronyms follow with durable inline definitions.
- **Interaction model:** one tracked service, one persistent campus, and immediate causal feedback connect every module.
- **Simulation continuity:** service state accumulates across scenes but never changes the underlying deterministic facts.
- **Assessment:** one explanatory check per module plus a realistic capstone; no score competition or locking.
- **Pacing:** reading-length dwell on first visit, faster replay, manual mode, and one Play/Pause concept.
- **Persistence:** versioned local storage only, with visible resume and reset.
- **Responsive behavior:** desktop inspector becomes a mobile bottom sheet; the world recomposes rather than scales beyond its container.
- **Source-of-truth boundary:** preserved rules and validated corrections control all factual output; the campus is explicitly illustrative.

## 5) Questions for Me

No blocking questions remain. The supplied requirements resolve the consequential choices: novice comprehension is primary, the five modules are fixed, deterministic coverage must remain, local-only persistence is sufficient, the current stack should remain, and accounts, analytics, audio, localization, a CMS, and heavy 3D are deferred.

The main future research question is whether real first-time learners can accurately explain the actor roles and vulnerability path after one session. That requires observed usability testing and does not block this evidence-bound redesign.

## 6) Recommendations

### Reframe the product around one learner outcome

- **Recommendation:** Title the product **FedRAMP 20x, Explained**, with Operations Park as the visual theme, and add an embedded first-run state.
- **Why:** It makes purpose and first action self-evident.
- **Other viable options:** Keep the current title and add a large hero; launch directly into module one.
- **What changes depending on the choice:** Keeping the title requires more explanatory copy; direct launch sacrifices explicit consent over pacing.

### Use five modules over one deterministic scene sequence

- **Recommendation:** Show five modules at the top level and reveal their ordered scenes on entry or expansion.
- **Why:** It preserves factual order while reducing twelve peer choices to a memorable model.
- **Other viable options:** Keep twelve scenes with stronger chapter headings; use a linear wizard.
- **What changes depending on the choice:** A flat list remains reference-oriented; a wizard would violate open exploration.

### Build one persistent assurance campus

- **Recommendation:** Carry a cloud service and evidence ledger through stable module landmarks and scene stops.
- **Why:** The learner can attach profile, proof, findings, decisions, reports, incidents, changes, and monitoring to one object.
- **Other viable options:** Improve each scene-local diagram; use a non-spatial process timeline.
- **What changes depending on the choice:** Separate diagrams cannot accumulate state; a timeline is simpler but loses the established visual-world strength.

### Simplify transport and make it reading-aware

- **Recommendation:** One Play/Pause toggle, previous/next step, manual mode, optional speed, computed dwell, and faster replay.
- **Why:** It matches familiar media controls while preserving learner pace.
- **Other viable options:** Manual-only cards; retain global seeking.
- **What changes depending on the choice:** Manual-only reduces animation value; a prominent seek control reintroduces implementation complexity.

### Couple decisions to visual and explanatory feedback

- **Recommendation:** Every module gets a practical decision that updates the service, route, gate, clock, or ledger.
- **Why:** Immediate visible causality supports understanding better than static output.
- **Other viable options:** Keep calculators as expert tools; add standalone mini-games.
- **What changes depending on the choice:** Expert-only calculators do not close the novice gap; standalone games fragment the coherent story.

### Preserve depth behind deliberate disclosure

- **Recommendation:** Consolidate source data into **Official details** and **Reference**, with human-facing accuracy disclosure.
- **Why:** Novices start cleanly while experienced users retain every rule, matrix, term, schema, and correction.
- **Other viable options:** Separate novice/expert modes; separate reference route.
- **What changes depending on the choice:** Modes add preference burden; a separate route weakens contextual links.

### Treat mobile as a distinct composition

- **Recommendation:** Collapse route navigation, use an intrinsic responsive SVG, stack the learning loop, and open inspection as a bottom sheet.
- **Why:** It preserves content and action size without making desktop miniature.
- **Other viable options:** Hide the world; use horizontal scrolling.
- **What changes depending on the choice:** Hiding loses the core metaphor; horizontal scrolling violates the baseline and acceptance criteria.

## 7) Priority Order

### Must resolve now

- First-run promise and obvious start.
- Five-module route and plain-language copy.
- Persistent story object and causal module interaction.
- Reading-aware transport and visible state.
- Readable adaptive mobile layout.
- Progressive disclosure and accessibility behavior.
- Existing deterministic factual validation.

### Should resolve soon

- Landmark/object inspection and camera controls.
- Versioned progress, resume, and reset.
- Module checks, respectful retry, and capstone.
- Accuracy/simplification disclosure.
- Renderer modularity and focused automated coverage.

### Can defer

- Accounts, server sync, analytics, social scoring, audio narration, localization, CMS, and heavy 3D.
- Formal user-research claims until representative novices are observed.

## 8) Bottom Line

The principal tension is between comprehensive deterministic reference depth and fast novice understanding. The selected direction keeps the source model intact but changes the default experience from “inspect twelve compliance scenes” to “follow one cloud service through five operational modules.” One campus, one tracked service, plain-language layers, reading-aware pacing, meaningful decisions, and progressive disclosure make the existing accuracy useful to a first-time learner. The result should be judged as a substantially improved evidence-bound learning product—not as proof of usability without subsequent user research.
