# FedRAMP 20x Operations Park

An interactive, animated learning simulation that turns the supplied FedRAMP 20x field guide and deterministic rule extraction into a progressive operating story. The experience uses an original low-poly isometric management-simulation visual language to make abstract certification, evidence, vulnerability, incident, change, and monitoring relationships concrete.

## Source files and precedence

The repository preserves the two original files:

- `fedramp-20x-field-guide.html` contains the field-guide presentation and embedded structured learning data.
- `fedramp-20x-deterministic-requirements-processes summarized.md` contains the deterministic sequence, force-word interpretation, timing matrices, decision algorithms, applicability, and known gaps.

The Markdown file controls sequencing and deterministic behavior. Factual meaning is checked against current authoritative U.S. government sources. Material interpretations and corrections are documented in [docs/CONTENT_VALIDATION.md](docs/CONTENT_VALIDATION.md).

## Learning experience

Twelve scenes move from the certification profile and evidence foundation through KSI outcomes, vulnerability detection/evaluation/response/reporting, incident escalation, significant change, and collaborative monitoring. Each scene includes:

- a clear learning objective, briefing, “why it matters,” takeaways, and source links;
- a progressive isometric system animation whose active actors and flows follow narration beats;
- relevant rule IDs with their original force;
- a scene-specific exercise or reference board; and
- complete sequence navigation.

Interactive workbenches cover certification-class status, force words, all 46 KSI outcomes, detection cadence, vulnerability evaluation, the full remediation matrix, KEV overrides, all eight source schemas, incident clocks, significant-change routing, and a recap knowledge check.

The searchable Library exposes all 17 rulesets, 60 explicit embedded rule statements, 46 KSI indicators, 75 defined terms, and eight schemas from the source HTML. It visibly marks five KSI outcome gaps restored from current official FedRAMP pages.

## Playback and navigation

The interface provides Play, Pause, Hold, Resume (Play after pause/hold), Restart, Previous, Next, complete-sequence seeking, a scene rail, and an Overview index. Current scene, topic, beat, playback state, and overall progress remain visible.

Keyboard controls:

- `Space`: play or pause
- `←` / `→`: previous or next scene
- `H`: hold the current flow
- `R`: restart the experience
- `O`: open the scene overview
- `Home` / `End`: first or last scene

## Project structure

```text
index.html                         Application shell
src/content.js                    Validated scene, timing, source, and correction model
src/data/source-data.json         Deterministic extraction of the original HTML DATA object
src/main.js                       Playback state machine, renderers, interactions, and library
src/styles.css                    Isometric visual system, animation, responsive, and reduced-motion styles
scripts/extract-source-data.mjs   Source extraction utility
scripts/validate-content.mjs      Source/model/rule/matrix validation
tests/unit/                       Content and deterministic matrix tests
tests/e2e/                        Desktop, tablet, mobile, controls, keyboard, and interaction tests
docs/CONTENT_VALIDATION.md        Dated factual review, corrections, sources, and limitations
.github/workflows/pages.yml       GitHub Pages build and deployment
```

Content and sequence updates are made in `src/content.js`; the animation and UI render from that model. Run the extractor only when the original HTML source is intentionally updated.

## Local development

Requirements: Node.js 20 or newer and npm.

```bash
npm install
npm run dev
```

Vite prints the local URL. The application has no runtime services or secrets.

## Production build

```bash
npm run lint
npm test
npm run build
```

The static output is written to `dist/`. Vite uses `base: './'`, so assets resolve under a GitHub Pages repository subpath and also work when the build is served from another static directory.

To run browser tests after installing Chromium:

```bash
npx playwright install chromium
npm run test:e2e
```

`npm run test:all` runs syntax checks, content/unit validation, the production build, and all browser projects.

## Content validation

Every production build reparses the preserved original HTML and confirms that `src/data/source-data.json` is an exact extraction. It verifies:

- 17 rulesets / 225 declared rules / 60 embedded explicit statements;
- 10 KSI families / 46 indicators;
- 75 terms / eight schemas;
- deterministic scene order and valid scene graph connections;
- complete remediation and incident matrices against the original values;
- the five current official KSI corrections; and
- first-party government source domains.

Authoritative source categories are FedRAMP/GSA, CISA, OMB/White House, NIST, and the official U.S. Code. See the validation record for the complete source list and dated conflict resolutions.

## Accessibility and responsive behavior

- Semantic headings, landmarks, labels, dialogs, live playback announcements, and a skip link support assistive technology.
- Every control works with keyboard and pointer input; touch targets are preserved on small screens.
- Native focus indicators and high-contrast text are retained throughout the visual theme.
- `prefers-reduced-motion` is honored automatically and can be overridden with the motion control. The full briefing, beat text, takeaways, and activity content remain available while held or paused.
- Desktop uses a two-column simulation/briefing layout; tablet stacks the briefing below the world; mobile reframes the world, converts the scene rail to a horizontal route, stacks exercises, and keeps playback controls sticky.
- No learning interaction depends on hover alone.

## GitHub Pages deployment

The workflow in `.github/workflows/pages.yml` builds and deploys `dist/` whenever `main` is pushed. It can also be started manually from the Actions tab.

Repository Pages settings must use **GitHub Actions** as the source. If the API cannot enable that setting automatically, open **Settings → Pages → Build and deployment → Source**, choose **GitHub Actions**, and rerun the `Deploy GitHub Pages` workflow.

## Asset and security notes

The experience uses only original HTML, CSS, and SVG geometry created for this project. It loads no third-party art, fonts, scripts, trackers, audio, or proprietary game assets. No credentials, tokens, personal paths, or secrets are required or committed.

This is an educational aid. Current official FedRAMP rules and agency-specific risk decisions remain authoritative.
