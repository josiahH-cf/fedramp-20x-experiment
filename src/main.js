import sourceData from './data/source-data.json';
import {
  CADENCES,
  CHANGE_SCENARIOS,
  FORCE_WORDS,
  INCIDENT_CLOCKS,
  KSI_CORRECTIONS,
  REMEDIATION,
  SCENES,
  SOURCES,
  VERIFIED_ON,
  sourcesFor,
} from './content.js';
import {
  CAPSTONE,
  GLOSSARY,
  MODULES,
  PROFILE_COMMITMENTS,
  SCENE_LEARNING,
  moduleForScene,
  readingDurationMs,
  sceneIndexForId,
} from './learning.js';
import {
  clearProgress,
  createDefaultProgress,
  loadProgress,
  saveProgress,
} from './progress.js';
import {
  WORLD_VIEW,
  followCamera,
  inspectorForModule,
  inspectorForScene,
  inspectorForService,
  renderCampus,
  servicePosition,
  updateCarrier,
} from './world.js';
import './styles.css';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const escapeHtml = (value = '') => String(value).replace(/[&<>"]/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;',
})[character]);

const systemReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
let learner = loadProgress(window.localStorage, systemReduced.matches);

const state = {
  screen: 'welcome',
  mode: 'guided',
  sceneIndex: 0,
  beatIndex: 0,
  beatProgress: 0,
  playback: 'paused',
  timer: 0,
  lastTick: 0,
  camera: { ...WORLD_VIEW },
  drag: null,
  activeBrief: 'plain',
  referenceTab: 'glossary',
  referenceSearch: '',
  referenceClass: 'C',
  resetArmed: false,
  roleChoice: '',
  evidenceFeedback: '',
  calcClass: learner.service.profileClass || 'A',
  calcLane: 'internet',
  calcPain: 'N4',
  calcKev: false,
  evaluationRevealed: false,
  reportParts: [],
  incidentClass: 'C',
  incidentPain: 'N4',
  impactData: '',
  changeScenario: 'patch',
  monitorSteps: [],
  exerciseFeedback: {},
};

const explicitRules = () => [
  ...sourceData.vdr_cso,
  ...sourceData.ver.eva_rules,
  ...sourceData.rpt.rules,
  ...sourceData.incidents.rules,
  ...sourceData.scn,
  ...sourceData.share.ccm,
  ...sourceData.share.cds,
  ...sourceData.frc,
];

const correctedKsi = sourceData.ksi.map((family) => ({
  ...family,
  indicators: family.indicators.map((indicator) => {
    const correction = KSI_CORRECTIONS.find((item) => item.id === indicator.id);
    return correction ? { ...indicator, text: correction.outcome, corrected: true } : indicator;
  }),
}));

const icons = {
  play: '<path d="M8 5v14l11-7z"/>',
  pause: '<path d="M7 5h4v14H7zM14 5h4v14h-4z"/>',
  previous: '<path d="m15 18-6-6 6-6"/>',
  next: '<path d="m9 18 6-6-6-6"/>',
  journey: '<path d="M5 5h5v5H5zM14 5h5v5h-5zM5 14h5v5H5zM14 14h5v5h-5z"/>',
  reference: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v17H6.5A2.5 2.5 0 0 0 4 22zM20 5.5A2.5 2.5 0 0 0 17.5 3H13v17h4.5A2.5 2.5 0 0 1 20 22z"/>',
  settings: '<path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM4.9 7.5 3.5 5.2l1.7-1.7 2.3 1.4a8 8 0 0 1 2-.8L10 1.5h4l.5 2.6a8 8 0 0 1 2 .8l2.3-1.4 1.7 1.7-1.4 2.3a8 8 0 0 1 .8 2l2.6.5v4l-2.6.5a8 8 0 0 1-.8 2l1.4 2.3-1.7 1.7-2.3-1.4a8 8 0 0 1-2 .8l-.5 2.6h-4l-.5-2.6a8 8 0 0 1-2-.8l-2.3 1.4-1.7-1.7 1.4-2.3a8 8 0 0 1-.8-2L1.5 14v-4l2.6-.5a8 8 0 0 1 .8-2z"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  fit: '<path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"/>',
  follow: '<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
  reset: '<path d="M4 12a8 8 0 1 0 2.35-5.65L4 9M4 4v5h5"/>',
};

function icon(name) {
  return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${icons[name]}</svg>`;
}

function persist() {
  saveProgress(window.localStorage, learner);
}

function currentScene() {
  return SCENES[state.sceneIndex];
}

function currentModule() {
  return moduleForScene(currentScene().id);
}

function markSceneVisited() {
  const id = currentScene().id;
  if (!learner.visitedScenes.includes(id)) learner.visitedScenes.push(id);
  learner.lastSceneId = id;
  persist();
}

function completionLabel(module) {
  const result = learner.moduleChecks[module.id];
  if (result?.correct) return 'Understood';
  if (result) return 'Review';
  if (module.sceneIds.some((id) => learner.visitedScenes.includes(id))) return 'In progress';
  return 'Not started';
}

function overallPercent() {
  const completed = learner.completedScenes.length;
  const within = (state.beatIndex + state.beatProgress) / currentScene().beats.length;
  return clamp(Math.round(((completed + (learner.completedScenes.includes(currentScene().id) ? 0 : within)) / SCENES.length) * 100), 0, 100);
}

function statusLabel() {
  if (state.playback === 'complete') return 'Complete';
  if (learner.preferences.manualReading) return state.playback === 'playing' ? 'Guided tour · manual' : 'Paused · manual';
  if (state.playback === 'playing') return 'Reading';
  if (state.mode === 'explore') return 'Exploring';
  return 'Paused';
}

function renderHeader() {
  const showTools = state.screen === 'workspace';
  return `<header class="app-header">
    <a class="brand" href="#" data-action="home" aria-label="FedRAMP 20x, Explained — home">
      <span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span>
      <span><strong>FedRAMP 20x, Explained</strong><small>Operations Park</small></span>
    </a>
    <nav aria-label="Product tools">
      ${showTools ? `<button class="header-action" data-action="open-journey">${icon('journey')}<span>Journey</span></button>` : ''}
      <button class="header-action" data-action="open-reference">${icon('reference')}<span>Reference</span></button>
      ${showTools ? `<button class="header-action" data-action="open-settings">${icon('settings')}<span>Settings</span></button>` : ''}
    </nav>
  </header>`;
}

function renderApp() {
  stopTimer();
  const app = $('#app');
  app.innerHTML = `<div class="app-shell" data-motion="${learner.preferences.reducedMotion ? 'reduced' : 'full'}">
    ${renderHeader()}
    <main id="learning-stage">${state.screen === 'welcome' ? renderWelcome() : renderWorkspace()}</main>
    <div class="sr-only" id="announcer" aria-live="assertive"></div>
    <dialog class="modal journey-dialog" id="journey-dialog" aria-labelledby="journey-title"></dialog>
    <dialog class="modal reference-dialog" id="reference-dialog" aria-labelledby="reference-title"></dialog>
    <dialog class="modal settings-dialog" id="settings-dialog" aria-labelledby="settings-title"></dialog>
    <dialog class="modal inspector-dialog" id="inspector-dialog" aria-labelledby="inspector-title"></dialog>
  </div>`;
  if (state.screen === 'workspace') {
    markSceneVisited();
    updateTransport();
    if (state.playback === 'playing' && !learner.preferences.manualReading) startTimer();
  }
}

function renderWelcome() {
  const canResume = learner.introComplete && learner.visitedScenes.length > 0;
  const welcomeCampus = renderCampus({
    scenes: SCENES,
    sceneIndex: 0,
    progress: 0.08,
    visitedScenes: learner.visitedScenes,
    service: learner.service,
    camera: { ...WORLD_VIEW },
  });
  return `<section class="welcome" aria-labelledby="welcome-title">
    <div class="welcome-copy">
      <span class="welcome-kicker">Interactive guide · about 25 minutes</span>
      <h1 id="welcome-title">Follow one cloud service through FedRAMP 20x.</h1>
      <p class="welcome-lede">Learn how security claims become evidence, how findings and incidents move through response, and how ongoing reporting keeps agency trust current.</p>
      <div class="welcome-actions">
        ${canResume ? `<button class="primary-action" data-action="resume-learning">Resume learning${icon('next')}</button>` : `<button class="primary-action" data-action="start-tour">Start guided tour${icon('next')}</button>`}
        ${canResume ? '<button class="secondary-action" data-action="start-tour">Start guided tour</button>' : ''}
        <button class="secondary-action" data-action="explore-modules">Explore modules</button>
      </div>
      <div class="learning-promise" aria-label="What you will understand">
        <strong>By the end, you can explain:</strong>
        <ul>
          <li>the provider, assessor, FedRAMP, and agency roles;</li>
          <li>how profiles, evidence, and Key Security Indicators fit together;</li>
          <li>what changes when a vulnerability, incident, or major change occurs;</li>
          <li>why certification evidence must stay current.</li>
        </ul>
      </div>
      <p class="welcome-note">Educational simulation. The preserved rules and current official guidance remain authoritative.</p>
    </div>
    <div class="welcome-world" aria-label="Preview of the five-module assurance campus">
      <div class="welcome-world-label"><span>One service</span><strong>Five connected modules</strong></div>
      ${welcomeCampus}
      <div class="welcome-route">${MODULES.map((module) => `<span><i style="--module-color:${module.color}"></i>${module.shortTitle}</span>`).join('')}</div>
    </div>
  </section>`;
}

function renderWorkspace() {
  const scene = currentScene();
  const module = currentModule();
  const learning = SCENE_LEARNING[scene.id];
  return `<div class="workspace">
    ${renderModuleRoute(module)}
    <section class="lesson-stage" aria-labelledby="scene-title">
      <div class="learner-status" aria-label="Learning status">
        <button class="mobile-route-button" data-action="open-journey">${icon('journey')}<span>Module ${module.number} · ${escapeHtml(module.shortTitle)}</span></button>
        <div class="status-copy"><span id="learning-status">${escapeHtml(statusLabel())}</span><strong>Module ${module.number} · Step ${module.sceneIds.indexOf(scene.id) + 1} of ${module.sceneIds.length}</strong></div>
        <div class="overall-progress"><span><b id="overall-progress-value">${overallPercent()}</b>% overall</span><div role="progressbar" aria-label="Overall learning progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${overallPercent()}"><i id="overall-progress-bar" style="width:${overallPercent()}%"></i></div></div>
      </div>

      <header class="lesson-heading">
        <div><span class="module-label" style="--module-color:${module.color}">Module ${module.number} · ${escapeHtml(module.title)}</span><h1 id="scene-title">${escapeHtml(learning.plainTitle)}</h1><p>${escapeHtml(learning.question)}</p></div>
        <span class="step-count">${scene.number} / ${SCENES.length}</span>
      </header>

      <div class="learning-layout">
        <section class="world-card" aria-labelledby="campus-title">
          ${renderWorldPanel()}
        </section>
        <article class="explanation-card" aria-label="Step explanation">
          ${renderExplanation()}
        </article>
      </div>

      <section class="practice-card" aria-labelledby="practice-title">
        <div class="section-heading"><span>Try it</span><div><h2 id="practice-title">${escapeHtml(learning.tryTitle)}</h2><p>Your choice changes the tracked service and produces immediate feedback.</p></div></div>
        <div id="activity-root">${renderActivity()}</div>
        ${isModuleFinalScene(scene.id) ? `<div id="module-check-root">${renderModuleCheck(module)}</div>` : ''}
      </section>

      ${renderOfficialDetails(scene)}
      ${renderTransport()}
    </section>
  </div>`;
}

function renderModuleRoute(activeModule) {
  return `<aside class="module-route" aria-label="Five learning modules">
    <div class="route-intro"><span>Your journey</span><strong>Five modules</strong><p>Choose any module. Nothing is locked.</p></div>
    <nav>${MODULES.map((module) => {
      const active = module.id === activeModule.id;
      const status = completionLabel(module);
      return `<div class="module-route-group${active ? ' active' : ''}">
        <button class="module-route-button" data-module="${module.id}" aria-expanded="${active}" ${active ? 'aria-current="step"' : ''}>
          <span class="module-number" style="--module-color:${module.color}">${module.number}</span>
          <span><strong>${escapeHtml(module.shortTitle)}</strong><small>${escapeHtml(status)}</small></span>
          ${status === 'Understood' ? icon('check') : icon('chevron')}
        </button>
        ${active ? `<div class="scene-subroute">${module.sceneIds.map((sceneId) => {
          const scene = SCENES.find((item) => item.id === sceneId);
          const current = scene.id === currentScene().id;
          const complete = learner.completedScenes.includes(scene.id);
          return `<button data-scene="${scene.id}" class="${current ? 'current' : ''}" ${current ? 'aria-current="step"' : ''}><i>${complete ? icon('check') : scene.number}</i><span>${escapeHtml(SCENE_LEARNING[scene.id].plainTitle)}</span></button>`;
        }).join('')}</div>` : ''}
      </div>`;
    }).join('')}</nav>
    <button class="route-reference" data-action="open-reference">${icon('reference')}<span><strong>Official reference</strong><small>Rules, terms, matrices, schemas</small></span></button>
  </aside>`;
}

function renderWorldPanel() {
  const sceneProgress = (state.beatIndex + state.beatProgress) / currentScene().beats.length;
  const position = servicePosition(SCENES, state.sceneIndex, sceneProgress);
  const camera = learner.preferences.followService ? followCamera(position) : state.camera;
  const campus = renderCampus({
    scenes: SCENES,
    sceneIndex: state.sceneIndex,
    progress: sceneProgress,
    visitedScenes: learner.visitedScenes,
    service: learner.service,
    camera,
  });
  return `<div class="world-card-header">
    <div><span>See it happen</span><h2 id="campus-title">The assurance campus</h2></div>
    <span class="illustrative-label">Illustrative metaphor</span>
  </div>
  <div class="world-viewport" data-world-viewport>
    ${campus}
    <div class="camera-controls" aria-label="Map view controls">
      <button data-camera="zoom-in" aria-label="Zoom in">${icon('plus')}</button>
      <button data-camera="zoom-out" aria-label="Zoom out">${icon('minus')}</button>
      <button data-camera="fit" aria-label="Fit whole campus">${icon('fit')}</button>
      <button data-camera="follow" aria-label="Follow the tracked service" aria-pressed="${learner.preferences.followService}">${icon('follow')}</button>
    </div>
  </div>
  <div class="service-ledger" id="service-ledger">${renderServiceLedger()}</div>`;
}

function renderServiceLedger() {
  const service = learner.service;
  const items = [
    ['Profile', `20x · Program · Class ${service.profileClass}`],
    ['Proof', service.evidenceChain.length >= 5 ? 'Evidence chain assembled' : `${service.evidenceChain.length} of 5 parts`],
    ['Finding', service.findingStatus.replaceAll('-', ' ')],
    ['Reporting', service.reportStatus.replaceAll('-', ' ')],
    ['Incident', service.incidentStatus.replaceAll('-', ' ')],
    ['Change', service.changeStatus],
    ['Ongoing trust', service.monitoringStatus],
  ];
  return `<div class="ledger-heading"><span>Northstar Cloud</span><strong>Service evidence ledger</strong><button data-inspect-service aria-label="Inspect tracked service details">${icon('info')}</button></div>
    <div class="ledger-items">${items.map(([label, value]) => `<span><small>${escapeHtml(label)}</small><strong>${escapeHtml(value)}</strong></span>`).join('')}</div>`;
}

function renderExplanation() {
  const scene = currentScene();
  const learning = SCENE_LEARNING[scene.id];
  const beat = scene.beats[state.beatIndex];
  const terms = learning.terms.map((id) => ({ id, ...GLOSSARY[id] })).filter((term) => term.term);
  return `<section class="explanation-section">
      <span class="section-label">In plain English</span>
      <h2>${escapeHtml(learning.plainTitle)}</h2>
      <p>${escapeHtml(learning.plainEnglish)}</p>
    </section>
    <section class="explanation-section why-section">
      <span class="section-label">Why it matters</span>
      <p>${escapeHtml(scene.why)}</p>
    </section>
    <section class="beat-card" aria-live="polite">
      <div class="beat-heading"><span>See it happen · ${state.beatIndex + 1} of ${scene.beats.length}</span><strong>${escapeHtml(beat.title)}</strong></div>
      <p>${escapeHtml(beat.text)}</p>
      <div class="reading-progress"><span><b id="reading-progress-value">${Math.round(state.beatProgress * 100)}</b>% of this explanation</span><div role="progressbar" aria-label="Reading progress for this explanation" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(state.beatProgress * 100)}"><i id="reading-progress-bar" style="width:${Math.round(state.beatProgress * 100)}%"></i></div></div>
    </section>
    <div class="term-list" aria-label="Terms introduced in this step">${terms.map((term) => `<details class="term-definition"><summary>${escapeHtml(term.term)}</summary><p>${escapeHtml(term.short)}</p></details>`).join('')}</div>`;
}

function renderOfficialDetails(scene) {
  return `<details class="official-details" data-pause-details>
    <summary><span>${icon('reference')}<strong>Official details</strong><small>Exact terms, rule anchors, takeaways, and sources</small></span>${icon('chevron')}</summary>
    <div class="official-details-grid">
      <section><span>Rule anchors</span><div class="rule-tokens">${scene.rules.map((rule) => `<code>${escapeHtml(rule)}</code>`).join('')}</div><button class="text-action" data-action="open-reference" data-reference-target="rules">Search exact rules</button></section>
      <section><span>What to retain</span><ul>${scene.takeaways.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></section>
      <section><span>Where to verify</span>${sourcesFor(scene).map((source) => `<a href="${source.url}" target="_blank" rel="noreferrer"><strong>${escapeHtml(source.agency)}</strong>${escapeHtml(source.title)}</a>`).join('')}</section>
    </div>
  </details>`;
}

function renderTransport() {
  const playLabel = state.playback === 'playing' ? 'Pause' : 'Play';
  const next = nextStepLabel();
  return `<section class="transport" aria-label="Guided tour controls">
    <button class="transport-button" data-action="previous-step" aria-label="Previous step" ${state.sceneIndex === 0 && state.beatIndex === 0 ? 'disabled' : ''}>${icon('previous')}<span>Previous</span></button>
    <button class="transport-button primary" data-action="toggle-play" aria-label="${playLabel}" aria-pressed="${state.playback === 'playing'}">${icon(state.playback === 'playing' ? 'pause' : 'play')}<span>${playLabel}</span></button>
    <div class="transport-status"><span id="transport-status">${escapeHtml(statusLabel())}</span><strong id="next-action">${escapeHtml(next)}</strong><small><kbd>Space</kbd> play/pause · <kbd>←</kbd><kbd>→</kbd> step</small></div>
    <button class="transport-button next" data-action="next-step" aria-label="Next step"><span>Next step</span>${icon('next')}</button>
  </section>`;
}

function nextStepLabel() {
  const scene = currentScene();
  if (state.beatIndex < scene.beats.length - 1) return `Next: ${scene.beats[state.beatIndex + 1].title}`;
  if (state.sceneIndex < SCENES.length - 1) return `Next: ${SCENE_LEARNING[SCENES[state.sceneIndex + 1].id].plainTitle}`;
  return 'Next: complete the journey';
}

function isModuleFinalScene(sceneId) {
  const module = moduleForScene(sceneId);
  return module.sceneIds.at(-1) === sceneId;
}

function activityHeader(question, hint = '') {
  return `<div class="activity-prompt"><strong>${escapeHtml(question)}</strong>${hint ? `<p>${escapeHtml(hint)}</p>` : ''}</div>`;
}

function choiceButtons(items, selected, attribute, label = 'Choices') {
  return `<div class="choice-group" role="group" aria-label="${escapeHtml(label)}">${items.map((item) => {
    const value = typeof item === 'string' ? item : item.value;
    const text = typeof item === 'string' ? item : item.label;
    return `<button data-${attribute}="${escapeHtml(value)}" class="${selected === value ? 'selected' : ''}" aria-pressed="${selected === value}">${escapeHtml(text)}</button>`;
  }).join('')}</div>`;
}

function feedbackCard(kind, title, text, reviewScene = '') {
  return `<div class="feedback-card" data-feedback="${kind}" id="activity-feedback" aria-live="polite"><span>${kind === 'correct' ? icon('check') : icon('info')}</span><div><strong>${escapeHtml(title)}</strong><p>${escapeHtml(text)}</p>${reviewScene ? `<button class="text-action" data-scene="${reviewScene}">Review the relevant step</button>` : ''}</div></div>`;
}

function renderActivity() {
  return ({
    arrival: activityArrival,
    profile: activityProfile,
    evidence: activityEvidence,
    ksi: activityKsi,
    detect: activityDetect,
    evaluate: activityEvaluate,
    respond: activityRespond,
    report: activityReport,
    incident: activityIncident,
    change: activityChange,
    monitor: activityMonitor,
    recap: activityRecap,
  })[currentScene().id]();
}

function activityArrival() {
  const roles = [
    { value: 'provider', label: 'Cloud provider' },
    { value: 'assessor', label: 'Independent assessor' },
    { value: 'fedramp', label: 'FedRAMP' },
    { value: 'agency', label: 'Federal agency' },
  ];
  const feedback = {
    provider: ['Try another handoff', 'The provider creates and maintains the evidence, but independent checking belongs to the assessor.'],
    assessor: ['Evidence routed correctly', 'The independent assessor verifies and validates the provider’s evidence before FedRAMP uses it in certification.'],
    fedramp: ['One step later', 'FedRAMP reviews the reusable certification package. Independent evidence checking comes first.'],
    agency: ['The agency decides later', 'The agency uses reusable assurance in its own authorization decision after the evidence has been assessed and certified.'],
  };
  const selected = feedback[state.roleChoice];
  return `${activityHeader('The provider has prepared an evidence packet. Who should independently check it next?', 'Choose a role, then follow the handoff explanation.')}
    ${choiceButtons(roles, state.roleChoice, 'role-choice', 'Evidence recipient')}
    ${selected ? feedbackCard(state.roleChoice === 'assessor' ? 'correct' : 'review', selected[0], selected[1], state.roleChoice === 'assessor' ? '' : 'arrival') : ''}`;
}

function activityProfile() {
  const selected = PROFILE_COMMITMENTS[learner.service.profileClass];
  return `${activityHeader('Compare certification commitments', 'Class changes disclosure, assessment, maintenance, and reporting commitments. It is not a security score.')}
    <div class="profile-sentence"><span>Northstar Cloud uses</span><strong>20x</strong><i>×</i><strong>Program path</strong><i>×</i>${choiceButtons(['A', 'B', 'C', 'D'], learner.service.profileClass, 'profile-class', 'Certification class')}</div>
    <div class="commitment-board ${learner.service.profileClass === 'D' ? 'future' : ''}">
      <div><span>Status</span><strong>${escapeHtml(selected.availability)}</strong></div>
      <div><span>Information sharing</span><strong>${escapeHtml(selected.sharing)}</strong></div>
      <div><span>Assessment</span><strong>${escapeHtml(selected.assessment)}</strong></div>
      <div><span>Maintenance</span><strong>${escapeHtml(selected.maintenance)}</strong></div>
      <div><span>Reporting</span><strong>${escapeHtml(selected.reporting)}</strong></div>
    </div>
    ${feedbackCard('info', `Class ${learner.service.profileClass} applied to the service`, learner.service.profileClass === 'D' ? 'The supplied Class D clocks remain available as planning context, but Class D is a future phase and is not presented as currently obtainable.' : 'The service ledger now shows this class. Higher letters do not imply a more secure service.')}`;
}

const EVIDENCE_STEPS = [
  ['decision', 'Explain the security decision'],
  ['measure', 'Define a measure and operating cycle'],
  ['evidence', 'Collect objective evidence'],
  ['verify', 'Verify that the requirement was fulfilled'],
  ['validate', 'Validate that it works and is fit for use'],
];

function activityEvidence() {
  const chain = learner.service.evidenceChain;
  const next = EVIDENCE_STEPS[chain.length];
  return `${activityHeader('Assemble the evidence chain in order', next ? `Next question: what must happen after “${chain.length ? EVIDENCE_STEPS[chain.length - 1][1] : 'a security claim'}”?` : 'The complete claim-to-proof chain is assembled.')}
    <div class="evidence-chain">${EVIDENCE_STEPS.map(([id, label], index) => `<div class="${chain.includes(id) ? 'complete' : index === chain.length ? 'next' : ''}"><i>${chain.includes(id) ? icon('check') : index + 1}</i><span>${escapeHtml(label)}</span></div>`).join('<b aria-hidden="true">→</b>')}</div>
    <div class="evidence-actions">${EVIDENCE_STEPS.filter(([id]) => !chain.includes(id)).map(([id, label]) => `<button data-evidence-step="${id}">${escapeHtml(label)}</button>`).join('')}</div>
    ${state.evidenceFeedback ? feedbackCard(state.evidenceFeedback === 'correct' ? 'correct' : 'review', state.evidenceFeedback === 'correct' ? (chain.length === EVIDENCE_STEPS.length ? 'Claim became reviewable proof' : 'Correct next step') : 'That step comes later', state.evidenceFeedback === 'correct' ? (chain.length === EVIDENCE_STEPS.length ? 'The service now carries a complete decision, measure, evidence, verification, and validation chain.' : 'Continue assembling the chain; each part answers a different assurance question.') : `Choose “${next?.[1] || 'the next available step'}” next.`) : ''}
    ${chain.length ? '<button class="text-action" data-action="reset-evidence">Reset this chain</button>' : ''}`;
}

function activityKsi() {
  const family = correctedKsi.find((item) => item.id === learner.service.ksiFamily) || correctedKsi[0];
  return `${activityHeader('Explore what good security should look like', 'Choose a family by its human-readable outcome. Exact indicator IDs stay in Official details and Reference.')}
    <div class="ksi-learning">
      <div class="ksi-family-buttons">${correctedKsi.map((item) => `<button data-ksi-family="${item.id}" class="${item.id === family.id ? 'selected' : ''}" aria-pressed="${item.id === family.id}"><strong>${escapeHtml(item.name)}</strong><span>${item.indicators.length} outcomes</span></button>`).join('')}</div>
      <div class="ksi-human-outcomes"><span>Selected family</span><h3>${escapeHtml(family.name)}</h3>${family.indicators.slice(0, 4).map((indicator) => `<article><strong>${escapeHtml(indicator.name)}</strong><p>${escapeHtml(indicator.text || 'The supplied source did not include this outcome text; see the marked official restoration in Reference.')}</p></article>`).join('')}<button class="text-action" data-action="open-reference" data-reference-target="ksi">See all ${family.indicators.length} outcomes and IDs</button></div>
    </div>`;
}

function activityDetect() {
  const classValue = state.calcClass;
  return `${activityHeader('Set a detection cadence, then send a signal to the queue', 'Different resource types and certification classes can require different cycles. Detection is broader than scanning.')}
    <div class="inline-builder"><div class="field-group"><span>Certification class</span>${choiceButtons(['A', 'B', 'C', 'D'], classValue, 'detect-class', 'Detection class')}</div><button class="primary-inline" data-action="start-finding">Detect a service weakness</button></div>
    <div class="cadence-cards">${CADENCES.map((row) => `<article><span>${escapeHtml(row.force)}</span><strong>${escapeHtml(row.label.replace(' — ', ': '))}</strong><p>${escapeHtml(row[classValue])}</p><details><summary>Official ID</summary><code>${row.id}</code></details></article>`).join('')}</div>
    ${learner.service.findingStatus === 'detected' ? feedbackCard('correct', 'Finding V-204 entered the shared queue', 'The same tracked finding now moves into reachability, exploitability, and Potential Agency Impact evaluation.') : ''}`;
}

function evaluationTarget(certClass) {
  return ({ A: '14 days', B: '7 days', C: '5 days', D: '2 days' })[certClass];
}

function activityEvaluate() {
  const deadline = REMEDIATION[state.calcClass][state.calcLane][state.calcPain];
  return `${activityHeader('Predict how quickly risk must be reduced', 'Build the finding profile first. Reveal the deterministic result only when you are ready.')}
    <div class="decision-builder">
      <div class="field-group"><span>Class</span>${choiceButtons(['A', 'B', 'C', 'D'], state.calcClass, 'calc-class', 'Evaluation class')}</div>
      <div class="field-group"><span>Can a likely threat reach and exploit it?</span>${choiceButtons([{ value: 'internet', label: 'From the internet' }, { value: 'internal', label: 'Only from inside' }, { value: 'unlikely', label: 'Not likely' }], state.calcLane, 'calc-lane', 'Finding reachability')}</div>
      <div class="field-group"><span>Potential Agency Impact</span>${choiceButtons(['N1', 'N2', 'N3', 'N4', 'N5'], state.calcPain, 'calc-pain', 'Potential Agency Impact')}</div>
      <button class="primary-inline" data-action="reveal-evaluation">Reveal the response path</button>
    </div>
    ${state.evaluationRevealed ? `<div class="causal-result"><div><span>Evaluate after detection</span><strong>${evaluationTarget(state.calcClass)}</strong><small>SHOULD</small></div><i>${icon('next')}</i><div><span>Then reduce risk</span><strong>${escapeHtml(deadline)}</strong><small>from completed evaluation</small></div></div>${feedbackCard('info', `${state.calcClass} · ${state.calcLane.replace('internet', 'internet reachable').replace('internal', 'internal reachable').replace('unlikely', 'not likely exploitable')} · ${state.calcPain}`, 'Class, reachability/exploitability, and PAIN select this ordinary path. A CISA Known Exploited Vulnerability due date overrides the matrix.')}` : ''}
    <div class="pain-plain"><span><b>N1</b> minimal</span><span><b>N3</b> disruptive to one agency</span><span><b>N5</b> debilitating across agencies</span></div>`;
}

function activityRespond() {
  const status = learner.service.findingStatus;
  const regular = REMEDIATION[state.calcClass][state.calcLane][state.calcPain];
  const target = state.calcKev ? 'CISA KEV catalog due date' : regular;
  return `${activityHeader('Move the same finding through risk reduction and closure', 'Mitigation changes risk. Remediation changes whether the vulnerable condition still exists.')}
    <div class="response-clock"><div><span>Current target</span><strong>${escapeHtml(target)}</strong></div><button data-action="toggle-kev" aria-pressed="${state.calcKev}" class="${state.calcKev ? 'selected' : ''}">Known Exploited Vulnerability override</button></div>
    <div class="finding-track">${[
      ['detected', 'Detected', 'The weakness is present and evaluated.'],
      ['partially-mitigated', 'Partially mitigated', 'Risk is lower; the finding remains open.'],
      ['fully-mitigated', 'Fully mitigated', 'Risk is negligible; the finding still remains open.'],
      ['remediated', 'Remediated', 'The condition is neutralized or eliminated and no longer detected.'],
    ].map(([id, label, copy], index) => `<button data-response-state="${id}" class="${status === id ? 'current' : ''}" aria-pressed="${status === id}"><i>${index + 1}</i><strong>${label}</strong><span>${copy}</span></button>`).join('')}</div>
    ${status !== 'clear' ? feedbackCard(status === 'remediated' ? 'correct' : 'info', status === 'remediated' ? 'Finding closed by remediation' : 'Finding remains visibly open', status === 'remediated' ? 'The vulnerable condition is no longer detected. Its activity history remains available for reporting.' : 'Mitigation reduced risk, but it did not remove the vulnerable condition. Continue tracking and reporting it.') : ''}`;
}

function activityReport() {
  const parts = [
    ['change', 'What changed and when'],
    ['impact', 'Agency-relevant impact and current state'],
    ['next', 'Next risk-reduction action and target'],
    ['safe', 'Enough detail for a decision without exploit-enabling secrets'],
    ['json', 'A valid machine-readable record'],
  ];
  const ready = parts.every(([id]) => state.reportParts.includes(id));
  return `${activityHeader('Assemble a safe, reusable activity report', 'Select every part decision-makers need. The machine-readable contract must remain valid.')}
    <div class="report-builder">${parts.map(([id, label]) => `<button data-report-part="${id}" class="${state.reportParts.includes(id) ? 'selected' : ''}" aria-pressed="${state.reportParts.includes(id)}">${state.reportParts.includes(id) ? icon('check') : '<i></i>'}<span>${escapeHtml(label)}</span></button>`).join('')}</div>
    <button class="primary-inline" data-action="publish-report" ${ready ? '' : 'disabled'}>Publish to the trust center</button>
    ${learner.service.reportStatus === 'published' ? feedbackCard('correct', 'Human and machine-readable trail published', 'The tracked service now carries a current response trail. Necessary parties can use it without receiving details likely to enable exploitation.') : ready ? feedbackCard('info', 'Report is ready', 'Publish it to make the response trail part of reusable certification evidence.') : feedbackCard('info', `${state.reportParts.length} of ${parts.length} report parts selected`, 'A useful report explains the change, impact, current state, next action, safe disclosure boundary, and machine-readable record.')}`;
}

function activityIncident() {
  const reportable = state.impactData === 'yes';
  const initial = INCIDENT_CLOCKS.initial[state.incidentClass][state.incidentPain];
  const ongoing = INCIDENT_CLOCKS.ongoing[state.incidentClass][state.incidentPain];
  const final = INCIDENT_CLOCKS.final[state.incidentClass][state.incidentPain];
  return `${activityHeader('Triage the signal before revealing the clocks', 'A reportable event affects—or is likely to affect—the confidentiality or integrity of federal customer data.')}
    <div class="incident-controls">
      <div class="field-group"><span>Federal customer data confidentiality or integrity affected or likely?</span>${choiceButtons([{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }], state.impactData, 'impact-data', 'Data impact')}</div>
      <div class="field-group"><span>Class</span>${choiceButtons(['A', 'B', 'C', 'D'], state.incidentClass, 'incident-class', 'Incident class')}</div>
      <div class="field-group"><span>Incident PAIN</span>${choiceButtons(['N1', 'N2', 'N3', 'N4', 'N5'], state.incidentPain, 'incident-pain', 'Incident impact')}</div>
    </div>
    ${state.impactData ? (reportable ? `<div class="parallel-clocks"><article><span>Initial report</span><strong>${initial}</strong><small>${INCIDENT_CLOCKS.initial[state.incidentClass].force}</small></article><article><span>Ongoing repeat</span><strong>${ongoing}</strong><small>${INCIDENT_CLOCKS.ongoing[state.incidentClass].force}</small></article><article><span>Final after recovery</span><strong>${final}</strong><small>MUST</small></article></div>${feedbackCard('correct', 'Incident communication runs in parallel', 'Until promptly rated, treat the incident as PAIN N5. Vulnerability response and recovery continue while all three communication clocks operate.')}` : feedbackCard('info', 'This supplied reportability test does not start', 'An availability-only effect does not satisfy the supplied confidentiality/integrity test. Continue normal incident handling and reassess if evidence changes.')) : ''}`;
}

function activityChange() {
  const scenario = CHANGE_SCENARIOS.find((item) => item.id === state.changeScenario);
  const routes = { patch: 'routine', region: 'adaptive', identity: 'transformative', emergency: 'emergency' };
  return `${activityHeader('Classify the operational effect of the proposed change', 'The path follows what the change does to security and privacy posture—not the project name.')}
    <div class="change-scenarios">${CHANGE_SCENARIOS.map((item) => `<button data-change-scenario="${item.id}" class="${item.id === scenario.id ? 'selected' : ''}" aria-pressed="${item.id === scenario.id}"><strong>${escapeHtml(item.label)}</strong><span>${escapeHtml(item.detail)}</span></button>`).join('')}</div>
    <div class="change-route-result"><span>Selected path</span><strong>${escapeHtml(scenario.result)}</strong><p>${escapeHtml(scenario.timing)}</p><div class="change-route-map"><i class="${routes[state.changeScenario] === 'routine' ? 'active' : ''}">Routine</i><i class="${routes[state.changeScenario] === 'adaptive' ? 'active' : ''}">Adaptive</i><i class="${routes[state.changeScenario] === 'transformative' ? 'active' : ''}">Transformative</i><i class="${routes[state.changeScenario] === 'emergency' ? 'active' : ''}">Emergency</i></div></div>`;
}

const MONITOR_STEPS = [
  ['ocr', 'Release the Ongoing Certification Report'],
  ['review', 'Hold the Quarterly Review 3–10 business days later'],
  ['access', 'Keep trust-center and feedback access open'],
  ['repeat', 'Begin the next three-month cycle'],
];

function activityMonitor() {
  const next = MONITOR_STEPS[state.monitorSteps.length];
  return `${activityHeader('Assemble one ongoing assurance cycle', next ? `Choose the next action after “${state.monitorSteps.length ? MONITOR_STEPS[state.monitorSteps.length - 1][1] : 'current certification data'}.”` : 'The ongoing-review loop is assembled and ready to repeat.')}
    <div class="monitor-cycle">${MONITOR_STEPS.map(([id, label], index) => `<div class="${state.monitorSteps.includes(id) ? 'complete' : index === state.monitorSteps.length ? 'next' : ''}"><i>${state.monitorSteps.includes(id) ? icon('check') : index + 1}</i><span>${escapeHtml(label)}</span></div>`).join('')}</div>
    <div class="monitor-actions">${MONITOR_STEPS.filter(([id]) => !state.monitorSteps.includes(id)).map(([id, label]) => `<button data-monitor-step="${id}">${escapeHtml(label)}</button>`).join('')}</div>
    ${state.exerciseFeedback.monitor ? feedbackCard(state.exerciseFeedback.monitor, state.exerciseFeedback.monitor === 'correct' ? (state.monitorSteps.length === MONITOR_STEPS.length ? 'Ongoing trust loop assembled' : 'Correct next action') : 'That action belongs later in the cycle', state.exerciseFeedback.monitor === 'correct' ? 'Each cycle refreshes reusable evidence and gives agencies a predictable review and feedback path.' : `Choose “${next?.[1] || 'the next available action'}” next.`) : ''}
    ${state.monitorSteps.length ? '<button class="text-action" data-action="reset-monitor">Reset this cycle</button>' : ''}`;
}

function activityRecap() {
  const correctCount = CAPSTONE.filter((item) => learner.capstone[item.id]?.correct).length;
  return `${activityHeader('Route a realistic event through the full operating loop', 'Work through the scenario in order. Every incorrect choice explains the misconception and can be retried immediately.')}
    <div class="capstone-intro"><span>Scenario</span><strong>Northstar Cloud finds a public weakness while preparing its quarterly evidence update.</strong><p>The same service, evidence trail, finding, communications, and review loop stay visible throughout.</p></div>
    <div class="capstone-steps">${CAPSTONE.map((item, index) => {
      const answer = learner.capstone[item.id];
      const unlocked = index === 0 || learner.capstone[CAPSTONE[index - 1].id]?.correct;
      return `<article class="${answer?.correct ? 'complete' : ''}"><span>${index + 1}</span><div><strong>${escapeHtml(item.prompt)}</strong>${unlocked ? `<div class="capstone-options">${item.options.map((option) => `<button data-capstone="${item.id}" data-answer="${option.id}" class="${answer?.answer === option.id ? (answer.correct ? 'correct' : 'review') : ''}" aria-pressed="${answer?.answer === option.id}">${escapeHtml(option.label)}</button>`).join('')}</div>${answer ? feedbackCard(answer.correct ? 'correct' : 'review', answer.correct ? 'Correct route' : 'Try again', item.options.find((option) => option.id === answer.answer)?.feedback || '', answer.correct ? '' : item.reviewScene) : ''}` : '<p>Complete the previous decision to reveal this part of the scenario.</p>'}</div></article>`;
    }).join('')}</div>
    <div class="capstone-result"><span>Process synthesis</span><strong>${correctCount} of ${CAPSTONE.length} decisions understood</strong><p>${correctCount === CAPSTONE.length ? 'You connected profile, evidence, vulnerability handling, incident communication, reporting, and ongoing monitoring into one operational story.' : 'This is a learning state, not a competitive score. Review any explanation and retry when ready.'}</p></div>`;
}

function renderModuleCheck(module) {
  const result = learner.moduleChecks[module.id];
  return `<section class="module-check" aria-labelledby="module-check-title">
    <div class="section-heading compact"><span>Check</span><div><h2 id="module-check-title">One idea worth retaining</h2><p>Choose an answer. Feedback is immediate and retries are always available.</p></div></div>
    <strong class="check-question">${escapeHtml(module.check.question)}</strong>
    <div class="check-options">${module.check.options.map((option) => `<button data-module-answer="${module.id}" data-answer="${option.id}" class="${result?.answer === option.id ? (result.correct ? 'correct' : 'review') : ''}" aria-pressed="${result?.answer === option.id}">${escapeHtml(option.label)}</button>`).join('')}</div>
    ${result ? feedbackCard(result.correct ? 'correct' : 'review', result.correct ? 'Understood' : 'Review this idea and retry', module.check.options.find((option) => option.id === result.answer)?.feedback || '', result.correct ? '' : module.check.reviewScene) : ''}
    ${result?.correct ? `<div class="module-summary"><span>${icon('check')} Module ${module.number} complete</span><strong>${escapeHtml(module.promise)}</strong></div>` : ''}
  </section>`;
}

function renderActivityAndWorld() {
  const activityRoot = $('#activity-root');
  if (activityRoot) activityRoot.innerHTML = renderActivity();
  const checkRoot = $('#module-check-root');
  if (checkRoot) checkRoot.innerHTML = renderModuleCheck(currentModule());
  const ledger = $('#service-ledger');
  if (ledger) ledger.innerHTML = renderServiceLedger();
  const viewport = $('[data-world-viewport]');
  if (viewport) {
    const cameraControls = $('.camera-controls', viewport)?.outerHTML || '';
    const sceneProgress = (state.beatIndex + state.beatProgress) / currentScene().beats.length;
    const position = servicePosition(SCENES, state.sceneIndex, sceneProgress);
    const camera = learner.preferences.followService ? followCamera(position) : state.camera;
    viewport.innerHTML = `${renderCampus({ scenes: SCENES, sceneIndex: state.sceneIndex, progress: sceneProgress, visitedScenes: learner.visitedScenes, service: learner.service, camera })}${cameraControls}`;
  }
  persist();
}

function modalHeader(id, eyebrow, title, copy = '') {
  return `<header class="modal-header"><div><span>${escapeHtml(eyebrow)}</span><h2 id="${id}">${escapeHtml(title)}</h2>${copy ? `<p>${escapeHtml(copy)}</p>` : ''}</div><button class="modal-close" data-action="close-dialog" aria-label="Close">${icon('close')}</button></header>`;
}

function openJourney() {
  pausePlayback('paused');
  const dialog = $('#journey-dialog');
  dialog.innerHTML = `${modalHeader('journey-title', 'The complete route', 'Five modules, one operating story', 'Enter anywhere. Detailed scenes appear inside each module and nothing is locked.')}
    <div class="journey-grid">${MODULES.map((module) => `<button data-module="${module.id}"><span class="journey-number" style="--module-color:${module.color}">${module.number}</span><div><small>${escapeHtml(completionLabel(module))}</small><strong>${escapeHtml(module.title)}</strong><p>${escapeHtml(module.promise)}</p><i>${module.sceneIds.length} steps</i></div>${icon('chevron')}</button>`).join('')}</div>`;
  dialog.showModal();
}

function openReference(target = state.referenceTab) {
  pausePlayback('paused');
  state.referenceTab = target;
  renderReferenceDialog();
  const dialog = $('#reference-dialog');
  if (!dialog.open) dialog.showModal();
}

function renderReferenceDialog() {
  const dialog = $('#reference-dialog');
  const tabs = [
    ['glossary', `Glossary · ${sourceData.glossary.length}`],
    ['rules', `Rules · ${explicitRules().length}`],
    ['ksi', 'KSI outcomes · 46'],
    ['data', 'Matrices & schemas'],
    ['accuracy', 'Sources & accuracy'],
  ];
  dialog.innerHTML = `${modalHeader('reference-title', 'Official reference', 'Exact detail without crowding the tour', 'Search the preserved source extraction, deterministic values, and authoritative validation record.')}
    <div class="reference-tools"><div role="tablist" aria-label="Reference sections">${tabs.map(([id, label]) => `<button role="tab" data-reference-tab="${id}" aria-selected="${state.referenceTab === id}">${escapeHtml(label)}</button>`).join('')}</div><label><span class="sr-only">Search reference</span><input type="search" data-reference-search placeholder="Search this section" value="${escapeHtml(state.referenceSearch)}" /></label></div>
    <div class="reference-content" id="reference-content">${renderReferenceContent()}</div>`;
}

function matchesReference(...values) {
  const query = state.referenceSearch.trim().toLowerCase();
  return !query || values.some((value) => String(value || '').toLowerCase().includes(query));
}

function renderReferenceContent() {
  if (state.referenceTab === 'glossary') {
    const terms = sourceData.glossary.filter((item) => matchesReference(item.term, item.def, item.tag, item.id));
    return `<div class="reference-grid">${terms.map((item) => `<article><span>${escapeHtml(item.tag)}</span><h3>${escapeHtml(item.term)}</h3><p>${escapeHtml(item.def)}</p>${item.note ? `<small>${escapeHtml(item.note)}</small>` : ''}</article>`).join('')}</div>`;
  }
  if (state.referenceTab === 'rules') {
    const rulesets = sourceData.rulesets.filter((item) => matchesReference(item.id, item.name, item.purpose));
    const rules = explicitRules().filter((item) => matchesReference(item.id, item.name, item.force, item.statement));
    return `<div class="force-language"><div><span>Normative language</span><h3>What MUST, SHOULD, and MAY mean</h3></div>${FORCE_WORDS.map((item) => `<article data-tone="${item.tone}"><strong>${item.word}</strong><p>${escapeHtml(item.meaning)}</p></article>`).join('')}</div>
      <div class="reference-summary"><strong>${rulesets.length} of 17 rulesets</strong><span>${rules.length} of 60 supplied explicit statements</span><small>The supplied source declares 225 rules but embeds 60 explicit statements. No missing statement is invented here.</small></div>
      <div class="ruleset-strip">${rulesets.map((item) => `<span><code>${item.id}</code><strong>${escapeHtml(item.name)}</strong><i>${item.rulecount}</i></span>`).join('')}</div>
      <div class="reference-list">${rules.map((item) => `<details><summary><code>${item.id}</code><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.force)}</span></summary><p>${escapeHtml(item.statement)}</p>${item.danger ? `<aside>${escapeHtml(item.danger)}</aside>` : ''}</details>`).join('')}</div>`;
  }
  if (state.referenceTab === 'ksi') {
    const families = correctedKsi.map((family) => ({ ...family, indicators: family.indicators.filter((item) => matchesReference(family.id, family.name, item.id, item.name, item.text)) })).filter((family) => family.indicators.length);
    return `<div class="reference-list">${families.map((family) => `<details open><summary><code>KSI-${family.id}</code><strong>${escapeHtml(family.name)}</strong><span>${family.indicators.length} outcomes</span></summary><div class="indicator-grid">${family.indicators.map((item) => `<article><div><code>${item.id}</code>${item.corrected ? '<span>official outcome restored</span>' : ''}</div><strong>${escapeHtml(item.name)}</strong><p>${escapeHtml(item.text || 'Not specified in the supplied source.')}</p></article>`).join('')}</div></details>`).join('')}</div>`;
  }
  if (state.referenceTab === 'data') return renderDataReference();
  return renderAccuracyReference();
}

function renderDataReference() {
  const certClass = state.referenceClass;
  const schemas = sourceData.schemas.filter((item) => matchesReference(item.file, item.title, item.description, ...(item.required || [])));
  return `<div class="data-reference-controls"><span>Inspect class values</span>${choiceButtons(['A', 'B', 'C', 'D'], certClass, 'reference-class', 'Reference class')}</div>
    <section class="matrix-section"><h3>Vulnerability risk-reduction matrix · Class ${certClass}</h3><div class="matrix-table" role="table" aria-label="Class ${certClass} vulnerability risk-reduction matrix"><div role="row" class="matrix-head"><span>PAIN</span><span>Internet + likely</span><span>Internal + likely</span><span>Not likely</span></div>${['N5', 'N4', 'N3', 'N2', 'N1'].map((pain) => `<div role="row"><strong>${pain}</strong><span>${REMEDIATION[certClass].internet[pain]}</span><span>${REMEDIATION[certClass].internal[pain]}</span><span>${REMEDIATION[certClass].unlikely[pain]}</span></div>`).join('')}</div></section>
    <section class="matrix-section"><h3>Incident communication · Class ${certClass}</h3><div class="matrix-table incident" role="table" aria-label="Class ${certClass} incident communication matrix"><div role="row" class="matrix-head"><span>PAIN</span><span>Initial</span><span>Ongoing</span><span>Final</span></div>${['N5', 'N4', 'N3', 'N2', 'N1'].map((pain) => `<div role="row"><strong>${pain}</strong><span>${INCIDENT_CLOCKS.initial[certClass][pain]}</span><span>${INCIDENT_CLOCKS.ongoing[certClass][pain]}</span><span>${INCIDENT_CLOCKS.final[certClass][pain]}</span></div>`).join('')}</div></section>
    <section class="matrix-section"><h3>Eight supplied JSON schemas</h3><div class="schema-reference-grid">${schemas.map((schema) => `<article><span>JSON</span><strong>${escapeHtml(schema.title || schema.file)}</strong><code>${escapeHtml(schema.file)}</code><p>${escapeHtml(schema.description || '')}</p><small>Required: ${(schema.required || []).map(escapeHtml).join(' · ') || 'See source schema'}</small></article>`).join('')}</div></section>`;
}

function renderAccuracyReference() {
  const sources = SOURCES.filter((source) => matchesReference(source.agency, source.title, source.note));
  return `<section class="accuracy-surface" aria-labelledby="accuracy-title">
    <div class="accuracy-intro"><span>About</span><h3 id="accuracy-title">About this simulation and its accuracy</h3><p>This is an educational aid. Current official FedRAMP guidance and each agency’s risk decisions remain authoritative.</p></div>
    <div class="accuracy-categories">
      <article><h4>Directly represented from the rules</h4><p>Scene order, force words, applicability logic, class values, detection and response clocks, incident matrices, significant-change paths, KSI registry, rule statements, and schema metadata come from the preserved sources and documented corrections.</p></article>
      <article><h4>Simplified for learning</h4><p>The five-module grouping, Northstar Cloud scenario, short explanations, exercises, and state ledger compress real organizational work so a novice can see the relationships. They do not replace complete rule text.</p></article>
      <article><h4>Illustrative visual metaphor</h4><p>The campus, buildings, roads, carrier, gates, clocks, and handoffs are original visual memory aids. They are not FedRAMP system architecture, workflow software, or proof of compliance.</p></article>
      <article><h4>Where to verify the official requirement</h4><p>Open a source below or use the exact rule IDs in the Rules tab. The repository validation record documents material interpretations and conflicts.</p><a href="https://github.com/josiahH-cf/fedramp-20x-experiment/blob/main/docs/CONTENT_VALIDATION.md" target="_blank" rel="noreferrer">Read the content-validation record</a></article>
      <article><h4>Last content verification date</h4><p><strong>${VERIFIED_ON}</strong></p><p>Verification is dated rather than presented as a guarantee that no future rule or interpretation can change.</p></article>
    </div>
    <div class="accuracy-corrections"><article><strong>Class is not a security score</strong><p>Class changes information-sharing and ongoing commitments.</p></article><article><strong>Class D remains future</strong><p>Supplied D values are planning context, not current availability.</p></article><article><strong>Five KSI outcomes restored</strong><p>Missing supplied text is visibly marked and populated from current official pages.</p></article></div>
    <div class="source-reference-list">${sources.map((source) => `<a href="${source.url}" target="_blank" rel="noreferrer"><span>${escapeHtml(source.agency)}</span><div><strong>${escapeHtml(source.title)}</strong><p>${escapeHtml(source.note)}</p></div></a>`).join('')}</div>
  </section>`;
}

function openSettings() {
  pausePlayback('paused');
  state.resetArmed = false;
  renderSettingsDialog();
  $('#settings-dialog').showModal();
}

function renderSettingsDialog() {
  const dialog = $('#settings-dialog');
  dialog.innerHTML = `${modalHeader('settings-title', 'Preferences', 'Control pace, motion, and progress', 'These choices and learning progress stay only in this browser. No account, analytics, tracker, or backend is used.')}
    <div class="settings-list">
      <section><div><strong>Manual reading mode</strong><p>Never advance without the Next step button or right-arrow key.</p></div><button data-action="toggle-manual" class="switch-button" aria-label="Manual reading mode" aria-pressed="${learner.preferences.manualReading}">${learner.preferences.manualReading ? 'On' : 'Off'}</button></section>
      <section><div><strong>Reduced motion</strong><p>Keep all reading time and content while minimizing visual movement.</p></div><button data-action="toggle-motion" class="switch-button" aria-label="Reduced motion" aria-pressed="${learner.preferences.reducedMotion}">${learner.preferences.reducedMotion ? 'On' : 'Off'}</button></section>
      <section><div><strong>Follow the service</strong><p>Keep Northstar Cloud near the center while the guided tour moves.</p></div><button data-action="toggle-follow" class="switch-button" aria-label="Follow the service" aria-pressed="${learner.preferences.followService}">${learner.preferences.followService ? 'On' : 'Off'}</button></section>
      <section><div><strong>Guided-tour speed</strong><p>Changes reading dwell only. Manual mode never advances automatically.</p></div>${choiceButtons([{ value: '0.75', label: 'Calm' }, { value: '1', label: 'Standard' }, { value: '1.5', label: 'Brisk' }], String(learner.preferences.speed), 'speed', 'Tour speed')}</section>
    </div>
    <div class="settings-actions"><button data-action="restart-tour">${icon('reset')}Restart guided tour</button><button data-action="reset-progress" class="danger-action">${state.resetArmed ? 'Confirm reset progress' : 'Reset progress'}</button></div>`;
}

function openInspector(content) {
  pausePlayback('paused');
  const dialog = $('#inspector-dialog');
  dialog.innerHTML = `${modalHeader('inspector-title', content.eyebrow, content.title)}<div class="inspector-content"><p>${escapeHtml(content.body)}</p><strong>${escapeHtml(content.detail)}</strong></div>`;
  dialog.showModal();
}

function announce(message) {
  const root = $('#announcer');
  if (!root) return;
  root.textContent = '';
  window.setTimeout(() => { root.textContent = message; }, 20);
}

function startTour({ resume = false } = {}) {
  learner.introComplete = true;
  state.screen = 'workspace';
  state.mode = 'guided';
  state.sceneIndex = resume ? sceneIndexForId(learner.lastSceneId) : 0;
  state.beatIndex = 0;
  state.beatProgress = 0;
  state.playback = 'playing';
  state.camera = { ...WORLD_VIEW };
  persist();
  setHash(currentScene().id);
  renderApp();
  announce(resume ? `Resumed at ${SCENE_LEARNING[currentScene().id].plainTitle}` : 'Guided tour started');
}

function exploreModules() {
  learner.introComplete = true;
  state.screen = 'workspace';
  state.mode = 'explore';
  state.sceneIndex = sceneIndexForId(learner.lastSceneId);
  state.beatIndex = 0;
  state.beatProgress = 0;
  state.playback = 'paused';
  persist();
  setHash(`module-${currentModule().id}`);
  renderApp();
  openJourney();
}

function goToScene(sceneId, { mode = 'explore', updateHash = true } = {}) {
  const index = SCENES.findIndex((scene) => scene.id === sceneId);
  if (index < 0) return;
  pausePlayback('paused');
  state.screen = 'workspace';
  state.mode = mode;
  state.sceneIndex = index;
  state.beatIndex = 0;
  state.beatProgress = 0;
  state.camera = { ...WORLD_VIEW };
  if (updateHash) setHash(sceneId);
  renderApp();
  announce(`${SCENE_LEARNING[sceneId].plainTitle}. ${currentScene().objective}`);
}

function goToModule(moduleId) {
  const module = MODULES.find((item) => item.id === moduleId);
  if (!module) return;
  const dialog = $('dialog[open]');
  if (dialog) dialog.close();
  goToScene(module.sceneIds[0], { updateHash: false });
  setHash(`module-${module.id}`);
}

function setHash(value) {
  window.history.replaceState(null, '', `#${value}`);
}

function markCurrentSceneComplete() {
  const id = currentScene().id;
  if (!learner.completedScenes.includes(id)) learner.completedScenes.push(id);
  persist();
}

function advanceStep({ automatic = false } = {}) {
  const wasPlaying = state.playback === 'playing';
  const scene = currentScene();
  if (state.beatIndex < scene.beats.length - 1) {
    state.beatIndex += 1;
    state.beatProgress = 0;
  } else {
    markCurrentSceneComplete();
    if (state.sceneIndex < SCENES.length - 1) {
      state.sceneIndex += 1;
      state.beatIndex = 0;
      state.beatProgress = 0;
      learner.lastSceneId = currentScene().id;
      setHash(currentScene().id);
    } else {
      state.beatProgress = 1;
      state.playback = 'complete';
      stopTimer();
      renderApp();
      announce('The complete FedRAMP 20x operating journey is ready for review.');
      return;
    }
  }
  state.playback = automatic && wasPlaying ? 'playing' : 'paused';
  renderApp();
}

function previousStep() {
  pausePlayback('paused');
  if (state.beatIndex > 0) {
    state.beatIndex -= 1;
    state.beatProgress = 0;
  } else if (state.sceneIndex > 0) {
    state.sceneIndex -= 1;
    state.beatIndex = currentScene().beats.length - 1;
    state.beatProgress = 0;
    setHash(currentScene().id);
  }
  renderApp();
}

function togglePlayback() {
  if (state.playback === 'playing') pausePlayback('paused');
  else play();
}

function play() {
  if (state.playback === 'complete') {
    state.sceneIndex = 0;
    state.beatIndex = 0;
    state.beatProgress = 0;
    setHash('arrival');
  }
  state.playback = 'playing';
  state.mode = 'guided';
  state.lastTick = performance.now();
  updateTransport();
  if (!learner.preferences.manualReading) startTimer();
  announce(learner.preferences.manualReading ? 'Manual reading mode. Use Next step to advance.' : 'Guided playback started');
}

function pausePlayback(nextState = 'paused') {
  if (state.screen !== 'workspace') return;
  state.playback = nextState;
  stopTimer();
  updateTransport();
}

function startTimer() {
  stopTimer();
  state.lastTick = performance.now();
  state.timer = window.setInterval(() => tick(performance.now()), 50);
}

function stopTimer() {
  window.clearInterval(state.timer);
  state.timer = 0;
}

function tick(now) {
  if (state.playback !== 'playing' || learner.preferences.manualReading) return;
  const delta = Math.min(250, now - state.lastTick);
  state.lastTick = now;
  const scene = currentScene();
  const beat = scene.beats[state.beatIndex];
  const replay = learner.completedScenes.includes(scene.id);
  const duration = readingDurationMs(`${beat.title} ${beat.text}`, { replay }) / Number(learner.preferences.speed || 1);
  state.beatProgress = clamp(state.beatProgress + delta / duration, 0, 1);
  updateLiveProgress();
  if (state.beatProgress >= 1) advanceStep({ automatic: true });
}

function updateLiveProgress() {
  const value = Math.round(state.beatProgress * 100);
  const bar = $('#reading-progress-bar');
  const label = $('#reading-progress-value');
  const progressbar = bar?.parentElement;
  if (bar) bar.style.width = `${value}%`;
  if (label) label.textContent = String(value);
  if (progressbar) progressbar.setAttribute('aria-valuenow', String(value));
  const overall = overallPercent();
  const overallBar = $('#overall-progress-bar');
  const overallValue = $('#overall-progress-value');
  if (overallBar) overallBar.style.width = `${overall}%`;
  if (overallValue) overallValue.textContent = String(overall);
  const sceneProgress = (state.beatIndex + state.beatProgress) / currentScene().beats.length;
  updateCarrier(SCENES, state.sceneIndex, sceneProgress);
  if (learner.preferences.followService) updateFollowView();
}

function updateTransport() {
  const status = statusLabel();
  const values = ['#learning-status', '#transport-status'];
  values.forEach((selector) => { const element = $(selector); if (element) element.textContent = status; });
  const next = $('#next-action');
  if (next) next.textContent = nextStepLabel();
  const toggle = $('[data-action="toggle-play"]');
  if (toggle) {
    const playing = state.playback === 'playing';
    toggle.setAttribute('aria-label', playing ? 'Pause' : 'Play');
    toggle.setAttribute('aria-pressed', String(playing));
    toggle.innerHTML = `${icon(playing ? 'pause' : 'play')}<span>${playing ? 'Pause' : 'Play'}</span>`;
  }
}

function updateFollowView() {
  const svg = $('#campus-world');
  if (!svg) return;
  const sceneProgress = (state.beatIndex + state.beatProgress) / currentScene().beats.length;
  const position = servicePosition(SCENES, state.sceneIndex, sceneProgress);
  const camera = followCamera(position);
  svg.setAttribute('viewBox', `${camera.x} ${camera.y} ${camera.width} ${camera.height}`);
}

function zoomCamera(multiplier, center = null) {
  syncCameraFromSvg();
  learner.preferences.followService = false;
  const current = state.camera;
  const nextWidth = clamp(current.width * multiplier, 420, WORLD_VIEW.width);
  const nextHeight = nextWidth * (WORLD_VIEW.height / WORLD_VIEW.width);
  const focusX = center?.x ?? current.x + current.width / 2;
  const focusY = center?.y ?? current.y + current.height / 2;
  state.camera = {
    x: clamp(focusX - nextWidth / 2, 0, WORLD_VIEW.width - nextWidth),
    y: clamp(focusY - nextHeight / 2, 0, WORLD_VIEW.height - nextHeight),
    width: nextWidth,
    height: nextHeight,
  };
  persist();
  applyCamera();
}

function syncCameraFromSvg() {
  const svg = $('#campus-world');
  const values = svg?.getAttribute('viewBox')?.split(/\s+/).map(Number);
  if (values?.length === 4 && values.every(Number.isFinite)) {
    state.camera = { x: values[0], y: values[1], width: values[2], height: values[3] };
  }
}

function applyCamera() {
  const svg = $('#campus-world');
  if (!svg) return;
  const camera = learner.preferences.followService ? followCamera(servicePosition(SCENES, state.sceneIndex, (state.beatIndex + state.beatProgress) / currentScene().beats.length)) : state.camera;
  svg.setAttribute('viewBox', `${camera.x} ${camera.y} ${camera.width} ${camera.height}`);
  const follow = $('[data-camera="follow"]');
  if (follow) follow.setAttribute('aria-pressed', String(learner.preferences.followService));
}

function handleCamera(action) {
  if (action === 'zoom-in') zoomCamera(0.8);
  else if (action === 'zoom-out') zoomCamera(1.25);
  else if (action === 'fit') {
    learner.preferences.followService = false;
    state.camera = { ...WORLD_VIEW };
    persist();
    applyCamera();
  } else if (action === 'follow') {
    learner.preferences.followService = !learner.preferences.followService;
    persist();
    applyCamera();
  }
}

function pauseForInteraction() {
  if (state.playback === 'playing') pausePlayback('paused');
}

function handleActivityClick(button) {
  const activityKeys = [
    'roleChoice', 'profileClass', 'evidenceStep', 'ksiFamily', 'detectClass',
    'calcClass', 'calcLane', 'calcPain', 'responseState', 'reportPart',
    'impactData', 'incidentClass', 'incidentPain', 'changeScenario',
    'monitorStep', 'moduleAnswer', 'capstone',
  ];
  if (!activityKeys.some((key) => button.dataset[key] !== undefined)) return false;
  pauseForInteraction();
  if (button.dataset.roleChoice) {
    state.roleChoice = button.dataset.roleChoice;
    learner.service.roleStatus = state.roleChoice;
  } else if (button.dataset.profileClass) {
    learner.service.profileClass = button.dataset.profileClass;
    state.calcClass = button.dataset.profileClass;
  } else if (button.dataset.evidenceStep) {
    const expected = EVIDENCE_STEPS[learner.service.evidenceChain.length]?.[0];
    if (button.dataset.evidenceStep === expected) {
      learner.service.evidenceChain.push(expected);
      state.evidenceFeedback = 'correct';
    } else state.evidenceFeedback = 'review';
  } else if (button.dataset.ksiFamily) {
    learner.service.ksiFamily = button.dataset.ksiFamily;
  } else if (button.dataset.detectClass) {
    state.calcClass = button.dataset.detectClass;
  } else if (button.dataset.calcClass) {
    state.calcClass = button.dataset.calcClass;
    state.evaluationRevealed = false;
  } else if (button.dataset.calcLane) {
    state.calcLane = button.dataset.calcLane;
    state.evaluationRevealed = false;
  } else if (button.dataset.calcPain) {
    state.calcPain = button.dataset.calcPain;
    state.evaluationRevealed = false;
  } else if (button.dataset.responseState) {
    learner.service.findingStatus = button.dataset.responseState;
  } else if (button.dataset.reportPart) {
    const id = button.dataset.reportPart;
    state.reportParts = state.reportParts.includes(id) ? state.reportParts.filter((item) => item !== id) : [...state.reportParts, id];
  } else if (button.dataset.impactData) {
    state.impactData = button.dataset.impactData;
    learner.service.incidentStatus = state.impactData === 'yes' ? 'reportable' : 'not-reportable';
  } else if (button.dataset.incidentClass) {
    state.incidentClass = button.dataset.incidentClass;
  } else if (button.dataset.incidentPain) {
    state.incidentPain = button.dataset.incidentPain;
  } else if (button.dataset.changeScenario) {
    state.changeScenario = button.dataset.changeScenario;
    learner.service.changeStatus = CHANGE_SCENARIOS.find((item) => item.id === state.changeScenario)?.result.toLowerCase() || 'routine';
  } else if (button.dataset.monitorStep) {
    const expected = MONITOR_STEPS[state.monitorSteps.length]?.[0];
    if (button.dataset.monitorStep === expected) {
      state.monitorSteps.push(expected);
      state.exerciseFeedback.monitor = 'correct';
      if (state.monitorSteps.length === MONITOR_STEPS.length) learner.service.monitoringStatus = 'assembled';
    } else state.exerciseFeedback.monitor = 'review';
  } else if (button.dataset.moduleAnswer) {
    const module = MODULES.find((item) => item.id === button.dataset.moduleAnswer);
    const correct = button.dataset.answer === module.check.correct;
    learner.moduleChecks[module.id] = { answer: button.dataset.answer, correct };
    if (correct && !learner.completedModules.includes(module.id)) learner.completedModules.push(module.id);
  } else if (button.dataset.capstone) {
    const item = CAPSTONE.find((entry) => entry.id === button.dataset.capstone);
    learner.capstone[item.id] = { answer: button.dataset.answer, correct: button.dataset.answer === item.correct };
  }
  renderActivityAndWorld();
  return true;
}

function handleClick(event) {
  const inspectModule = event.target.closest('[data-module-id]');
  if (inspectModule) {
    openInspector(inspectorForModule(inspectModule.dataset.moduleId));
    return;
  }
  const inspectScene = event.target.closest('[data-scene-id]');
  if (inspectScene) {
    const scene = SCENES.find((item) => item.id === inspectScene.dataset.sceneId);
    openInspector(inspectorForScene(scene));
    return;
  }
  const inspectService = event.target.closest('[data-inspect-service]');
  if (inspectService) {
    openInspector(inspectorForService(learner.service));
    return;
  }
  const button = event.target.closest('button, a[data-action]');
  if (!button) return;
  if (handleActivityClick(button)) return;

  if (button.dataset.scene) {
    $('dialog[open]')?.close();
    goToScene(button.dataset.scene);
    return;
  }
  if (button.dataset.module) {
    goToModule(button.dataset.module);
    return;
  }
  if (button.dataset.camera) {
    handleCamera(button.dataset.camera);
    return;
  }
  if (button.dataset.referenceTab) {
    state.referenceTab = button.dataset.referenceTab;
    state.referenceSearch = '';
    renderReferenceDialog();
    return;
  }
  if (button.dataset.referenceClass) {
    state.referenceClass = button.dataset.referenceClass;
    $('#reference-content').innerHTML = renderReferenceContent();
    return;
  }
  if (button.dataset.speed) {
    learner.preferences.speed = Number(button.dataset.speed);
    persist();
    renderSettingsDialog();
    return;
  }

  const target = button.dataset.referenceTarget;
  switch (button.dataset.action) {
    case 'home':
      event.preventDefault();
      pausePlayback('paused');
      state.screen = 'welcome';
      window.history.replaceState(null, '', window.location.pathname);
      renderApp();
      break;
    case 'start-tour': startTour(); break;
    case 'resume-learning': startTour({ resume: true }); break;
    case 'explore-modules': exploreModules(); break;
    case 'open-journey': openJourney(); break;
    case 'open-reference': openReference(target || 'glossary'); break;
    case 'open-settings': openSettings(); break;
    case 'close-dialog': button.closest('dialog').close(); break;
    case 'toggle-play': togglePlayback(); break;
    case 'previous-step': previousStep(); break;
    case 'next-step': advanceStep(); break;
    case 'start-finding':
      pauseForInteraction();
      learner.service.findingStatus = 'detected';
      renderActivityAndWorld();
      break;
    case 'reveal-evaluation':
      pauseForInteraction();
      state.evaluationRevealed = true;
      learner.service.findingStatus = 'evaluated';
      renderActivityAndWorld();
      break;
    case 'toggle-kev':
      pauseForInteraction();
      state.calcKev = !state.calcKev;
      renderActivityAndWorld();
      break;
    case 'publish-report':
      pauseForInteraction();
      if (state.reportParts.length === 5) learner.service.reportStatus = 'published';
      renderActivityAndWorld();
      break;
    case 'reset-evidence':
      learner.service.evidenceChain = [];
      state.evidenceFeedback = '';
      renderActivityAndWorld();
      break;
    case 'reset-monitor':
      state.monitorSteps = [];
      state.exerciseFeedback.monitor = '';
      learner.service.monitoringStatus = 'ready';
      renderActivityAndWorld();
      break;
    case 'toggle-manual':
      learner.preferences.manualReading = !learner.preferences.manualReading;
      pausePlayback('paused');
      persist();
      renderSettingsDialog();
      break;
    case 'toggle-motion':
      learner.preferences.reducedMotion = !learner.preferences.reducedMotion;
      persist();
      $('.app-shell').dataset.motion = learner.preferences.reducedMotion ? 'reduced' : 'full';
      renderSettingsDialog();
      break;
    case 'toggle-follow':
      learner.preferences.followService = !learner.preferences.followService;
      persist();
      renderSettingsDialog();
      break;
    case 'restart-tour':
      $('#settings-dialog').close();
      state.sceneIndex = 0;
      state.beatIndex = 0;
      state.beatProgress = 0;
      state.playback = 'paused';
      setHash('arrival');
      renderApp();
      break;
    case 'reset-progress':
      if (!state.resetArmed) {
        state.resetArmed = true;
        renderSettingsDialog();
      } else {
        clearProgress(window.localStorage);
        learner = createDefaultProgress(systemReduced.matches);
        Object.assign(state, { sceneIndex: 0, beatIndex: 0, beatProgress: 0, playback: 'paused', screen: 'welcome', roleChoice: '', evidenceFeedback: '', reportParts: [], impactData: '', monitorSteps: [], exerciseFeedback: {} });
        $('#settings-dialog').close();
        window.history.replaceState(null, '', window.location.pathname);
        renderApp();
        announce('Local learning progress reset');
      }
      break;
    default: break;
  }
}

function handleInput(event) {
  if (event.target.matches('[data-reference-search]')) {
    state.referenceSearch = event.target.value;
    $('#reference-content').innerHTML = renderReferenceContent();
  }
}

function handleToggle(event) {
  if (event.target.matches('[data-pause-details]') && event.target.open) pausePlayback('paused');
}

function handleKeyboard(event) {
  const interactiveWorld = event.target.closest?.('[role="button"][data-module-id], [role="button"][data-scene-id], [role="button"][data-inspect-service]');
  if (interactiveWorld && (event.key === 'Enter' || event.code === 'Space')) {
    event.preventDefault();
    interactiveWorld.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    return;
  }
  if (state.screen !== 'workspace' || $('dialog[open]') || event.target.matches('input, select, textarea, button, a, summary')) return;
  if (event.code === 'Space') {
    event.preventDefault();
    togglePlayback();
  } else if (event.key === 'ArrowLeft') previousStep();
  else if (event.key === 'ArrowRight' || event.key.toLowerCase() === 's') advanceStep();
  else if (event.key.toLowerCase() === 'f') handleCamera('follow');
}

function handlePointerDown(event) {
  const viewport = event.target.closest?.('[data-world-viewport]');
  if (!viewport || event.target.closest('[role="button"], button')) return;
  const svg = $('#campus-world', viewport);
  if (!svg) return;
  syncCameraFromSvg();
  learner.preferences.followService = false;
  state.drag = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, camera: { ...state.camera }, width: svg.clientWidth, height: svg.clientHeight };
  viewport.setPointerCapture?.(event.pointerId);
  viewport.classList.add('dragging');
}

function handlePointerMove(event) {
  if (!state.drag || state.drag.pointerId !== event.pointerId) return;
  const dx = (event.clientX - state.drag.x) * (state.drag.camera.width / state.drag.width);
  const dy = (event.clientY - state.drag.y) * (state.drag.camera.height / state.drag.height);
  state.camera.x = clamp(state.drag.camera.x - dx, 0, WORLD_VIEW.width - state.camera.width);
  state.camera.y = clamp(state.drag.camera.y - dy, 0, WORLD_VIEW.height - state.camera.height);
  applyCamera();
}

function handlePointerUp(event) {
  if (!state.drag || state.drag.pointerId !== event.pointerId) return;
  state.drag = null;
  $('[data-world-viewport]')?.classList.remove('dragging');
  persist();
}

function handleWheel(event) {
  const viewport = event.target.closest?.('[data-world-viewport]');
  if (!viewport) return;
  event.preventDefault();
  const rect = viewport.getBoundingClientRect();
  const focus = {
    x: state.camera.x + ((event.clientX - rect.left) / rect.width) * state.camera.width,
    y: state.camera.y + ((event.clientY - rect.top) / rect.height) * state.camera.height,
  };
  zoomCamera(event.deltaY < 0 ? 0.88 : 1.14, focus);
}

function handleHashChange() {
  const hash = window.location.hash.slice(1);
  if (!hash) return;
  const moduleId = hash.startsWith('module-') ? hash.slice(7) : '';
  if (moduleId && MODULES.some((module) => module.id === moduleId)) {
    const module = MODULES.find((item) => item.id === moduleId);
    goToScene(module.sceneIds[0], { updateHash: false });
  } else if (SCENES.some((scene) => scene.id === hash)) goToScene(hash, { updateHash: false });
}

function initializeFromHash() {
  const hash = window.location.hash.slice(1);
  const moduleId = hash.startsWith('module-') ? hash.slice(7) : '';
  if (moduleId && MODULES.some((module) => module.id === moduleId)) {
    state.screen = 'workspace';
    state.mode = 'explore';
    state.sceneIndex = sceneIndexForId(MODULES.find((module) => module.id === moduleId).sceneIds[0]);
  } else if (SCENES.some((scene) => scene.id === hash)) {
    state.screen = 'workspace';
    state.mode = 'explore';
    state.sceneIndex = sceneIndexForId(hash);
  }
}

function bindEvents() {
  const app = $('#app');
  app.addEventListener('click', handleClick);
  app.addEventListener('input', handleInput);
  app.addEventListener('toggle', handleToggle, true);
  app.addEventListener('pointerdown', handlePointerDown);
  app.addEventListener('pointermove', handlePointerMove);
  app.addEventListener('pointerup', handlePointerUp);
  app.addEventListener('pointercancel', handlePointerUp);
  app.addEventListener('wheel', handleWheel, { passive: false });
  window.addEventListener('keydown', handleKeyboard);
  window.addEventListener('hashchange', handleHashChange);
  systemReduced.addEventListener('change', (event) => {
    learner.preferences.reducedMotion = event.matches;
    persist();
    const shell = $('.app-shell');
    if (shell) shell.dataset.motion = event.matches ? 'reduced' : 'full';
  });
}

initializeFromHash();
renderApp();
bindEvents();
