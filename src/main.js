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
import './styles.css';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const escapeHtml = (value = '') => String(value).replace(/[&<>"]/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;',
})[character]);

const systemReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const state = {
  sceneIndex: 0,
  progress: 0,
  playback: 'held',
  lastFrame: 0,
  frameRequest: 0,
  beatIndex: -1,
  reducedMotion: systemReduced.matches,
  profileClass: 'C',
  calcClass: 'C',
  calcPain: 'N4',
  calcLane: 'internet',
  calcKev: false,
  incidentClass: 'C',
  incidentPain: 'N4',
  impactData: 'yes',
  changeScenario: 'patch',
  ksiFamily: 'CNA',
  libraryTab: 'rulesets',
  librarySearch: '',
  quiz: {},
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
  hold: '<rect x="5" y="5" width="14" height="14" rx="2"/>',
  previous: '<path d="m15 18-6-6 6-6"/>',
  next: '<path d="m9 18 6-6-6-6"/>',
  restart: '<path d="M4 12a8 8 0 1 0 2.35-5.65L4 9M4 4v5h5"/>',
  overview: '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/>',
  library: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v17H6.5A2.5 2.5 0 0 0 4 22zM20 5.5A2.5 2.5 0 0 0 17.5 3H13v17h4.5A2.5 2.5 0 0 1 20 22z"/>',
  sources: '<path d="M7 7h10v10H7z"/><path d="M4 14v6h6M20 10V4h-6"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>',
  sound: '<path d="M5 10v4h3l4 4V6L8 10zM16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/>',
};

function icon(name, label = '') {
  const aria = label ? `aria-label="${escapeHtml(label)}"` : 'aria-hidden="true"';
  return `<svg class="icon" viewBox="0 0 24 24" ${aria} fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${icons[name]}</svg>`;
}

function renderShell() {
  $('#app').innerHTML = `
    <div class="app-shell" data-motion="${state.reducedMotion ? 'reduced' : 'full'}">
      <header class="topbar">
        <a href="#" class="brand" data-action="home" aria-label="FedRAMP 20x Operations Park — restart">
          <span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span>
          <span><strong>Operations Park</strong><small>FedRAMP 20x learning simulation</small></span>
        </a>
        <div class="top-actions" aria-label="Experience tools">
          <button class="button subtle" data-action="open-overview" aria-label="Overview">${icon('overview')}<span>Overview</span></button>
          <button class="button subtle" data-action="open-library" aria-label="Library">${icon('library')}<span>Library</span></button>
          <button class="button subtle sources-button" data-action="open-sources" aria-label="Sources">${icon('sources')}<span>Sources</span></button>
          <button class="motion-button" data-action="toggle-motion" aria-label="Toggle motion" aria-pressed="${state.reducedMotion}" title="Toggle reduced motion">
            <span class="motion-dot"></span><span>${state.reducedMotion ? 'Reduced motion' : 'Full motion'}</span>
          </button>
        </div>
      </header>

      <main class="experience" id="learning-stage">
        <nav class="scene-rail" aria-label="Learning scenes">
          <div class="rail-heading">
            <span>Learning route</span>
            <strong><span id="completed-count">0</span> / ${SCENES.length}</strong>
          </div>
          <div class="rail-list">
            ${SCENES.map((scene, index) => `
              <button class="rail-scene" data-scene="${index}" aria-label="Scene ${index + 1}: ${escapeHtml(scene.title)}">
                <span class="rail-number">${scene.number}</span>
                <span class="rail-copy"><small>${escapeHtml(scene.chapter)}</small><strong>${escapeHtml(scene.shortTitle)}</strong></span>
                <span class="rail-state" aria-hidden="true"></span>
              </button>
            `).join('')}
          </div>
          <div class="rail-legend">
            <span><i class="legend-dot current"></i> Current</span>
            <span><i class="legend-dot visited"></i> Visited</span>
          </div>
        </nav>

        <section class="stage-column">
          <div class="scene-heading" id="scene-heading"></div>
          <div class="simulation-grid">
            <section class="world-panel" aria-labelledby="world-title">
              <div class="world-toolbar">
                <div><span class="eyebrow">Isometric operations view</span><strong id="world-title">System state</strong></div>
                <span class="status-pill" id="playback-status"><i></i>Held</span>
              </div>
              <div class="world-wrap" id="world-wrap"></div>
              <div class="narration" aria-live="polite">
                <span class="beat-number" id="beat-number">01</span>
                <div><strong id="beat-title"></strong><p id="beat-text"></p></div>
              </div>
            </section>

            <aside class="briefing-panel" aria-label="Scene briefing">
              <div class="briefing-tabs" role="tablist" aria-label="Scene information">
                <button role="tab" aria-selected="true" data-briefing="brief">Brief</button>
                <button role="tab" aria-selected="false" data-briefing="rules">Rule map</button>
              </div>
              <div id="briefing-content"></div>
            </aside>
          </div>

          <section class="activity-panel" id="activity-panel" aria-label="Scene activity"></section>

          <section class="playback-console" aria-label="Playback controls">
            <div class="control-cluster primary-controls">
              <button class="control" data-action="previous" aria-label="Previous" title="Previous scene (Left arrow)">${icon('previous')}<span>Previous</span></button>
              <button class="control accent" data-action="play" aria-label="Play" title="Play or resume (Space)">${icon('play')}<span>Play</span></button>
              <button class="control" data-action="pause" aria-label="Pause" title="Pause (Space)">${icon('pause')}<span>Pause</span></button>
              <button class="control" data-action="hold" aria-label="Hold" title="Hold the current flow (H)">${icon('hold')}<span>Hold</span></button>
              <button class="control" data-action="restart" aria-label="Restart" title="Restart the experience (R)">${icon('restart')}<span>Restart</span></button>
              <button class="control" data-action="next" aria-label="Next" title="Next scene (Right arrow)"><span>Next</span>${icon('next')}</button>
            </div>
            <div class="seek-block">
              <div class="seek-label"><span id="seek-label">Scene 1 of ${SCENES.length}</span><strong id="overall-percent">0%</strong></div>
              <input id="sequence-seek" type="range" min="0" max="${SCENES.length * 100 - 1}" value="0" aria-label="Seek through the complete learning sequence" />
              <div class="seek-markers" aria-hidden="true">${SCENES.map(() => '<i></i>').join('')}</div>
            </div>
            <button class="control overview-control" data-action="open-overview" aria-label="Scene index">${icon('overview')}<span>Scene index</span></button>
          </section>

          <footer class="scene-footer" id="scene-footer"></footer>
        </section>
      </main>

      <div class="sr-only" id="announcer" aria-live="assertive"></div>
      <dialog class="modal" id="overview-dialog" aria-labelledby="overview-title"></dialog>
      <dialog class="modal library-modal" id="library-dialog" aria-labelledby="library-title"></dialog>
      <dialog class="modal sources-modal" id="sources-dialog" aria-labelledby="sources-title"></dialog>
    </div>
  `;

  bindStaticEvents();
  setScene(0, { announce: false });
}

function bindStaticEvents() {
  const app = $('#app');
  app.addEventListener('click', handleClick);
  app.addEventListener('change', handleChange);
  $('#sequence-seek').addEventListener('input', handleSeek);

  for (const dialog of $$('dialog')) {
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
  }

  window.addEventListener('keydown', handleKeyboard);
  systemReduced.addEventListener('change', (event) => {
    state.reducedMotion = event.matches;
    applyMotionPreference();
  });
  window.addEventListener('hashchange', () => {
    const id = window.location.hash.replace('#', '');
    const index = SCENES.findIndex((scene) => scene.id === id);
    if (index >= 0 && index !== state.sceneIndex) setScene(index);
  });
}

function handleClick(event) {
  const button = event.target.closest('button, a[data-action]');
  if (!button) return;

  if (button.dataset.scene !== undefined) {
    setScene(Number(button.dataset.scene));
    const dialog = button.closest('dialog');
    if (dialog?.open) dialog.close();
    return;
  }

  if (button.dataset.briefing) {
    renderBriefing(button.dataset.briefing);
    return;
  }

  if (button.dataset.class) {
    const context = button.dataset.context;
    if (context === 'profile') state.profileClass = button.dataset.class;
    if (context === 'cadence') state.calcClass = button.dataset.class;
    renderActivity();
    return;
  }

  if (button.dataset.lane) {
    state.calcLane = button.dataset.lane;
    renderActivity();
    return;
  }

  if (button.dataset.pain) {
    if (button.dataset.context === 'incident') state.incidentPain = button.dataset.pain;
    else state.calcPain = button.dataset.pain;
    renderActivity();
    return;
  }

  if (button.dataset.incidentClass) {
    state.incidentClass = button.dataset.incidentClass;
    renderActivity();
    return;
  }

  if (button.dataset.dataImpact) {
    state.impactData = button.dataset.dataImpact;
    renderActivity();
    return;
  }

  if (button.dataset.changeScenario) {
    state.changeScenario = button.dataset.changeScenario;
    renderActivity();
    return;
  }

  if (button.dataset.ksiFamily) {
    state.ksiFamily = button.dataset.ksiFamily;
    renderActivity();
    return;
  }

  if (button.dataset.libraryTab) {
    state.libraryTab = button.dataset.libraryTab;
    renderLibrary();
    return;
  }

  if (button.dataset.quiz) {
    state.quiz[button.dataset.quiz] = button.dataset.answer;
    renderActivity();
    return;
  }

  switch (button.dataset.action) {
    case 'home':
      event.preventDefault();
      restartExperience();
      break;
    case 'play': play(); break;
    case 'pause': pause(); break;
    case 'hold': hold(); break;
    case 'restart': restartExperience(); break;
    case 'previous': previousScene(); break;
    case 'next': nextScene(); break;
    case 'open-overview': openOverview(); break;
    case 'open-library': openLibrary(); break;
    case 'open-sources': openSources(); break;
    case 'toggle-motion':
      state.reducedMotion = !state.reducedMotion;
      applyMotionPreference();
      break;
    case 'close-dialog':
      button.closest('dialog').close();
      break;
    case 'toggle-kev':
      state.calcKev = !state.calcKev;
      renderActivity();
      break;
    default: break;
  }
}

function handleChange(event) {
  if (event.target.matches('[data-library-search]')) {
    state.librarySearch = event.target.value;
    renderLibraryResults();
  }
}

function handleKeyboard(event) {
  if (event.target.matches('input, select, textarea, button, a') || $$('dialog[open]').length) return;
  if (event.code === 'Space') {
    event.preventDefault();
    state.playback === 'playing' ? pause() : play();
  } else if (event.key === 'ArrowLeft') previousScene();
  else if (event.key === 'ArrowRight') nextScene();
  else if (event.key.toLowerCase() === 'r') restartExperience();
  else if (event.key.toLowerCase() === 'h') hold();
  else if (event.key.toLowerCase() === 'o') openOverview();
  else if (event.key === 'Home') setScene(0);
  else if (event.key === 'End') setScene(SCENES.length - 1);
}

function handleSeek(event) {
  const raw = Number(event.target.value);
  const nextIndex = clamp(Math.floor(raw / 100), 0, SCENES.length - 1);
  const nextProgress = (raw % 100) / 100;
  const changedScene = nextIndex !== state.sceneIndex;
  state.sceneIndex = nextIndex;
  state.progress = nextProgress;
  state.playback = 'paused';
  stopPlaybackTimer();
  if (changedScene) renderScene();
  updateTimeline(true);
  updateControls();
}

function setScene(index, options = {}) {
  const next = clamp(index, 0, SCENES.length - 1);
  state.sceneIndex = next;
  state.progress = 0;
  state.beatIndex = -1;
  if (options.keepPlaying !== true) {
    state.playback = 'held';
    stopPlaybackTimer();
  }
  renderScene();
  updateTimeline(true);
  updateControls();
  if (options.announce !== false) announce(`Scene ${next + 1}: ${SCENES[next].title}`);
  window.history.replaceState(null, '', `#${SCENES[next].id}`);
  window.scrollTo({ top: 0, behavior: state.reducedMotion ? 'auto' : 'smooth' });
}

function renderScene() {
  const scene = SCENES[state.sceneIndex];
  $('#scene-heading').innerHTML = `
    <div class="scene-kicker"><span>${scene.number}</span>${escapeHtml(scene.chapter)} · ${state.sceneIndex + 1} of ${SCENES.length}</div>
    <div class="scene-title-row">
      <div><h1>${escapeHtml(scene.title)}</h1><p>${escapeHtml(scene.objective)}</p></div>
      <div class="scene-rule-count"><strong>${scene.rules.length}</strong><span>rule anchors</span></div>
    </div>
  `;
  $('#world-wrap').innerHTML = renderWorld(scene);
  renderBriefing('brief');
  renderActivity();
  renderFooter(scene);
  updateRail();
}

function renderWorld(scene) {
  const connections = scene.links.map(([fromId, toId]) => {
    const from = scene.nodes.find((item) => item.id === fromId);
    const to = scene.nodes.find((item) => item.id === toId);
    return `<line class="world-link" data-link="${fromId}:${toId}" x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" />`;
  }).join('');

  return `
    <svg class="world" viewBox="0 0 800 520" role="img" aria-label="${escapeHtml(scene.title)} operations diagram">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#dbeee8"/><stop offset="1" stop-color="#b8d8da"/></linearGradient>
        <pattern id="grid" width="34" height="20" patternUnits="userSpaceOnUse"><path d="M0 10 17 0l17 10-17 10z" fill="none" stroke="rgba(31,77,83,.11)" stroke-width=".7"/></pattern>
        <filter id="shadow" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="#14383c" flood-opacity=".2"/></filter>
      </defs>
      <rect width="800" height="520" rx="24" fill="url(#sky)"/>
      <path class="cloud cloud-a" d="M80 90c20-28 58-18 64 10 26-10 53 8 50 31H54c-5-20 7-38 26-41z"/>
      <path class="cloud cloud-b" d="M640 84c15-22 47-16 54 7 22-8 44 8 41 27H620c-4-16 5-29 20-34z"/>
      <path d="M400 95 756 300 400 505 44 300z" fill="#95c3ad" stroke="#659b8c" stroke-width="2"/>
      <path d="M400 116 720 300 400 484 80 300z" fill="url(#grid)" opacity=".9"/>
      <g class="world-links">${connections}</g>
      <g class="park-details" aria-hidden="true">
        <g transform="translate(82 380)"><path d="m0 0 22-13 22 13-22 13z" fill="#5f9d7f"/><path d="M18-12h8v-18h-8z" fill="#795d4b"/><circle cx="22" cy="-37" r="15" fill="#3f7d62"/></g>
        <g transform="translate(700 215)"><path d="m0 0 18-10 18 10-18 10z" fill="#5f9d7f"/><path d="M15-10h6v-16h-6z" fill="#795d4b"/><circle cx="18" cy="-31" r="12" fill="#3f7d62"/></g>
      </g>
      <g class="world-nodes">${scene.nodes.map(renderIsoNode).join('')}</g>
      <g id="courier" class="courier" aria-hidden="true">
        <ellipse cx="0" cy="12" rx="20" ry="8" fill="rgba(16,45,48,.18)"/>
        <path d="M-18 0 0-10 18 0 0 10z" fill="#f6c85f"/>
        <path d="M-18 0v9L0 19v-9z" fill="#c99031"/>
        <path d="M18 0v9L0 19v-9z" fill="#e6ac40"/>
        <circle cx="-9" cy="12" r="3" fill="#163b43"/><circle cx="10" cy="12" r="3" fill="#163b43"/>
      </g>
    </svg>
    <div class="mobile-node-strip" aria-label="Actors and capabilities in this scene">
      ${scene.nodes.map((item) => `<span data-mobile-node="${item.id}">${escapeHtml(item.label)}</span>`).join('')}
    </div>
    <div class="world-legend" aria-label="Diagram legend">
      <span><i class="swatch active"></i>Current beat</span><span><i class="swatch route"></i>Information flow</span><span><i class="swatch actor"></i>Actor or capability</span>
    </div>
  `;
}

function renderIsoNode(item) {
  const width = item.kind === 'tower' ? 42 : 52;
  const height = item.kind === 'tower' ? 78 : item.kind === 'hall' ? 46 : 58;
  const roof = {
    tower: '<path class="node-accent" d="M0-82v-32M-8-107 0-119l8 12"/><circle class="signal" cy="-119" r="5"/>',
    dome: '<path class="node-roof" d="M-30-54Q0-94 30-54Z"/>',
    gear: '<circle class="node-roof" cy="-70" r="18"/><path class="node-accent" d="M0-80v20M-10-70h20"/>',
    lens: '<circle class="node-roof" cy="-69" r="20"/><circle class="node-window" cy="-69" r="10"/>',
    beacon: '<path class="node-roof" d="M-20-54 0-91l20 37z"/><circle class="signal" cy="-93" r="6"/>',
    clock: '<circle class="node-roof" cy="-69" r="21"/><path class="node-accent" d="M0-69v-12M0-69l10 6"/>',
    meter: '<path class="node-roof" d="M-25-54a25 25 0 0 1 50 0z"/><path class="node-accent" d="M0-54 12-75"/>',
    gate: '<path class="node-accent" d="M-28-56v-36h56v36M-20-82h40"/>',
    switch: '<path class="node-accent" d="M-25-70h50M0-70l15-18"/>',
    shield: '<path class="node-roof" d="M0-96 25-84v21c0 19-11 31-25 39-14-8-25-20-25-39v-21z"/>',
    document: '<path class="node-roof" d="M-18-94h27l13 13v30h-40z"/><path class="node-accent" d="M-9-74H12M-9-64H8"/>',
    code: '<path class="node-roof" d="M-28-91h56v38h-56z"/><path class="node-accent" d="m-12-80-8 8 8 8M12-80l8 8-8 8"/>',
    archive: '<path class="node-roof" d="M-32-86h64v34h-64z"/><path class="node-accent" d="M-12-71h24"/>',
    terminal: '<path class="node-roof" d="M-30-91h60v38h-60z"/><path class="node-accent" d="m-17-79 8 7-8 7M-3-65H14"/>',
    workshop: '<path class="node-roof" d="M-34-54v-28l17 12 17-12 17 12 17-12v28z"/>',
    hall: '<path class="node-roof" d="M-38-56 0-92l38 36z"/><path class="node-accent" d="M-22-55v-20M0-55v-20M22-55v-20"/>',
    crate: '<path class="node-accent" d="M-24-81 0-67l24-14M0-67v28"/>',
  }[item.kind] || '';

  return `
    <g class="world-node" data-node="${item.id}" data-tone="${item.tone}" transform="translate(${item.x} ${item.y})" filter="url(#shadow)">
      <ellipse class="node-shadow" cx="0" cy="15" rx="${width + 12}" ry="20" />
      <path class="node-left" d="M-${width} -42 0 -12 0 ${height - 12} -${width} ${height - 42}z"/>
      <path class="node-right" d="M${width} -42 0 -12 0 ${height - 12} ${width} ${height - 42}z"/>
      <path class="node-top" d="M0 -72 ${width} -42 0 -12 -${width} -42z"/>
      ${roof}
      <foreignObject x="-72" y="${height - 2}" width="144" height="46">
        <div xmlns="http://www.w3.org/1999/xhtml" class="node-label">${escapeHtml(item.label)}</div>
      </foreignObject>
    </g>
  `;
}

function renderBriefing(tab = 'brief') {
  const scene = SCENES[state.sceneIndex];
  $$('[data-briefing]').forEach((button) => button.setAttribute('aria-selected', String(button.dataset.briefing === tab)));
  const content = $('#briefing-content');

  if (tab === 'rules') {
    content.innerHTML = `
      <div class="briefing-section">
        <span class="eyebrow">Deterministic anchors</span>
        <div class="rule-stack">${scene.rules.map((rule) => `<button class="rule-token" data-action="open-library"><code>${escapeHtml(rule)}</code>${icon('chevron')}</button>`).join('')}</div>
      </div>
      <div class="briefing-section source-mini">
        <span class="eyebrow">Authoritative references</span>
        ${sourcesFor(scene).map((source) => `<a href="${source.url}" target="_blank" rel="noreferrer"><span>${escapeHtml(source.agency)}</span>${escapeHtml(source.title)}${icon('sources')}</a>`).join('')}
      </div>
    `;
    return;
  }

  content.innerHTML = `
    <div class="briefing-section">
      <span class="eyebrow">What is happening</span>
      <p class="brief-summary">${escapeHtml(scene.summary)}</p>
    </div>
    <div class="briefing-section why-block">
      <span class="eyebrow">Why it matters</span>
      <p>${escapeHtml(scene.why)}</p>
    </div>
    <div class="briefing-section">
      <span class="eyebrow">Leave with this</span>
      <ul class="takeaway-list">${scene.takeaways.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
    </div>
  `;
}

function segmented(items, selected, dataAttribute, context = '') {
  return `<div class="segmented">${items.map((item) => {
    const value = typeof item === 'string' ? item : item.value;
    const label = typeof item === 'string' ? item : item.label;
    return `<button class="${selected === value ? 'selected' : ''}" data-${dataAttribute}="${value}" ${context ? `data-context="${context}"` : ''}>${escapeHtml(label)}</button>`;
  }).join('')}</div>`;
}

function renderActivity() {
  const scene = SCENES[state.sceneIndex];
  const panel = $('#activity-panel');
  const renderers = {
    orientation: activityOrientation,
    profile: activityProfile,
    evidence: activityEvidence,
    ksi: activityKsi,
    cadence: activityCadence,
    evaluate: activityEvaluate,
    deadline: activityDeadline,
    report: activityReport,
    incident: activityIncident,
    change: activityChange,
    monitor: activityMonitor,
    recap: activityRecap,
  };
  panel.innerHTML = renderers[scene.activity]();
}

function activityHeader(kicker, title, copy) {
  return `<div class="activity-heading"><div><span class="eyebrow">${escapeHtml(kicker)}</span><h2>${escapeHtml(title)}</h2></div><p>${escapeHtml(copy)}</p></div>`;
}

function activityOrientation() {
  const roles = [
    ['Provider', 'Operates the offering and owns package accuracy.'],
    ['Assessor', 'Independently verifies and validates within the required scope.'],
    ['FedRAMP', 'Certifies reusable assurance and maintains program rules.'],
    ['Agency', 'Makes its own authorization and ongoing risk decisions.'],
  ];
  return `${activityHeader('Role board', 'Who owns which decision?', 'Use the arrows in the park view to follow evidence from operations to reuse.')}
    <div class="role-grid">${roles.map(([role, text], index) => `<article><span>0${index + 1}</span><h3>${role}</h3><p>${text}</p></article>`).join('')}</div>`;
}

function activityProfile() {
  const profiles = {
    A: ['Available now', 'Entry class built on a recent approved alternative framework; smaller initial and ongoing FedRAMP commitments.'],
    B: ['Pipeline opens Aug 31', 'More information, annual independent assessment, and stronger ongoing maintenance commitments.'],
    C: ['Pipeline opens Aug 31', 'Common enterprise-service class with considerable information and ongoing reporting.'],
    D: ['Future — Phase 4', 'Planning context only. 20x Class D is not currently available; future pilot work will set final expectations.'],
  };
  const selected = profiles[state.profileClass];
  return `${activityHeader('Profile configurator', 'Build a valid 20x profile', 'Type and path are fixed for this simulation. Select a class to inspect its current status.')}
    <div class="profile-builder">
      <div class="profile-fixed"><span>Type</span><strong>20x</strong><small>Measured outcomes</small></div>
      <span class="plus">×</span>
      <div class="profile-fixed"><span>Path</span><strong>Program</strong><small>Direct FedRAMP path</small></div>
      <span class="plus">×</span>
      <div class="profile-choice"><span>Class</span>${segmented(['A', 'B', 'C', 'D'], state.profileClass, 'class', 'profile')}</div>
      <div class="profile-result ${state.profileClass === 'D' ? 'future' : ''}"><span>${selected[0]}</span><strong>20x · Program · Class ${state.profileClass}</strong><p>${selected[1]}</p></div>
    </div>
    <div class="accuracy-note"><strong>Accuracy correction</strong><p>A higher class means greater disclosure, assessment, maintenance, and reporting commitments. Official FedRAMP guidance says class does not determine how secure the provider is.</p></div>`;
}

function activityEvidence() {
  return `${activityHeader('Normative console', 'Read force words without drift', 'These meanings control every rule chip in the simulation and the Library.')}
    <div class="force-grid">${FORCE_WORDS.map((item) => `<article data-tone="${item.tone}"><span>${item.word}</span><p>${item.meaning}</p></article>`).join('')}</div>
    <div class="evidence-flow" aria-label="Evidence sequence">
      ${['Explain decision', 'Define measure + cycle', 'Verify fulfillment', 'Validate fitness', 'Independently assess'].map((label, index) => `<div><i>${index + 1}</i><span>${label}</span></div>`).join('<b aria-hidden="true">→</b>')}
    </div>`;
}

function activityKsi() {
  const family = correctedKsi.find((item) => item.id === state.ksiFamily) || correctedKsi[0];
  return `${activityHeader('Outcome explorer', 'Ten KSI families · 46 indicators', 'Select a district to inspect its published security outcomes.')}
    <div class="ksi-explorer">
      <div class="ksi-family-list">${correctedKsi.map((item) => `<button class="${item.id === family.id ? 'selected' : ''}" data-ksi-family="${item.id}"><span>KSI-${item.id}</span><strong>${escapeHtml(item.name)}</strong><i>${item.indicators.length}</i></button>`).join('')}</div>
      <div class="ksi-outcomes"><div class="outcome-heading"><span>KSI-${family.id}</span><h3>${escapeHtml(family.name)}</h3><small>${family.indicators.length} outcome${family.indicators.length === 1 ? '' : 's'}</small></div>
        ${family.indicators.map((indicator) => `<article><div><code>${indicator.id}</code>${indicator.corrected ? '<span class="verified-badge">official outcome restored</span>' : ''}</div><strong>${escapeHtml(indicator.name)}</strong><p>${escapeHtml(indicator.text || 'Not specified in the supplied source.')}</p></article>`).join('')}
      </div>
    </div>`;
}

function activityCadence() {
  return `${activityHeader('Cadence board', 'How often does the grid check?', 'Select a class. Class D values are retained from the supplied matrix as future planning context.')}
    <div class="inline-control"><span>Certification class</span>${segmented(['A', 'B', 'C', 'D'], state.calcClass, 'class', 'cadence')}</div>
    <div class="cadence-grid">${CADENCES.map((row) => `<article><div><code>${row.id}</code><span>${row.force}</span></div><strong>${escapeHtml(row.label)}</strong><p>${escapeHtml(row[state.calcClass])}</p></article>`).join('')}</div>`;
}

function evaluationTarget(certClass) {
  return ({ A: '14 days', B: '7 days', C: '5 days', D: '2 days' })[certClass];
}

function activityEvaluate() {
  const deadline = REMEDIATION[state.calcClass][state.calcLane][state.calcPain];
  return `${activityHeader('Evaluation workbench', 'Build a response profile', 'Change the class, reachability/exploitability lane, and PAIN rating. The result is deterministic.')}
    <div class="calculator-layout">
      <div class="calculator-controls">
        <label><span>Class</span>${segmented(['A', 'B', 'C', 'D'], state.calcClass, 'class', 'cadence')}</label>
        <label><span>Finding profile</span>${segmented([{ value: 'internet', label: 'Internet + likely' }, { value: 'internal', label: 'Internal + likely' }, { value: 'unlikely', label: 'Not likely' }], state.calcLane, 'lane')}</label>
        <label><span>Potential Agency Impact</span>${segmented(['N1', 'N2', 'N3', 'N4', 'N5'], state.calcPain, 'pain')}</label>
      </div>
      <div class="calculator-result"><span>Evaluate within</span><strong>${evaluationTarget(state.calcClass)}</strong><small>SHOULD · from detection</small><hr/><span>Then reduce risk within</span><strong>${deadline}</strong><small>SHOULD · from completed evaluation</small></div>
    </div>
    <div class="pain-scale">${[
      ['N1', 'Minimal customer effects'], ['N2', 'Narrow customer effects'], ['N3', 'Disruptive effect on one agency'], ['N4', 'Debilitating one / disruptive multiple'], ['N5', 'Debilitating effect on multiple agencies'],
    ].map(([rating, text]) => `<div class="${rating === state.calcPain ? 'selected' : ''}"><strong>${rating}</strong><span>${text}</span></div>`).join('')}</div>`;
}

function activityDeadline() {
  const regular = REMEDIATION[state.calcClass][state.calcLane][state.calcPain];
  const result = state.calcKev ? 'CISA KEV due date' : regular;
  return `${activityHeader('Dispatch calculator', 'Select the correct response clock', 'The ordinary matrix is Class × PAIN × profile. KEV catalog dates override it—even after full mitigation.')}
    <div class="calculator-layout dispatch">
      <div class="calculator-controls">
        <label><span>Class</span>${segmented(['A', 'B', 'C', 'D'], state.calcClass, 'class', 'cadence')}</label>
        <label><span>Profile</span>${segmented([{ value: 'internet', label: 'IRV + LEV' }, { value: 'internal', label: 'NIRV + LEV' }, { value: 'unlikely', label: 'NLEV' }], state.calcLane, 'lane')}</label>
        <label><span>PAIN</span>${segmented(['N1', 'N2', 'N3', 'N4', 'N5'], state.calcPain, 'pain')}</label>
        <button class="kev-toggle ${state.calcKev ? 'selected' : ''}" data-action="toggle-kev" aria-pressed="${state.calcKev}"><i></i><span><strong>Known Exploited Vulnerability</strong><small>Use the catalog due date</small></span></button>
      </div>
      <div class="calculator-result dispatch-result"><span>Response target</span><strong>${result}</strong><small>${state.calcKev ? 'KEV override · VDR-TFR-KEV' : `${state.calcPain === 'N1' ? 'Routine operations still apply' : 'Mitigate or remediate'} · VDR-TFR-PVR`}</small></div>
    </div>
    <div class="state-track">${[
      ['Detected', 'Finding is present'], ['Partially mitigated', 'Risk is lower; finding remains'], ['Fully mitigated', 'Risk negligible; finding remains'], ['Remediated', 'Neutralized and no longer detected'],
    ].map(([label, text], index) => `<div><i>${index + 1}</i><strong>${label}</strong><span>${text}</span></div>`).join('')}</div>`;
}

function activityReport() {
  return `${activityHeader('Data contract board', 'Eight machine-readable contracts', 'The original page embeds these schema names and required top-level fields. Expand full rule text in the Library.')}
    <div class="schema-grid">${sourceData.schemas.map((schema, index) => `<article><span>0${index + 1}</span><div><strong>${escapeHtml(schema.title || schema.file)}</strong><code>${escapeHtml(schema.file)}</code><p>${escapeHtml(schema.description || '')}</p><small>Required: ${(schema.required || []).map(escapeHtml).join(' · ') || 'See source schema'}</small></div></article>`).join('')}</div>`;
}

function activityIncident() {
  const initial = INCIDENT_CLOCKS.initial[state.incidentClass][state.incidentPain];
  const ongoing = INCIDENT_CLOCKS.ongoing[state.incidentClass][state.incidentPain];
  const final = INCIDENT_CLOCKS.final[state.incidentClass][state.incidentPain];
  const reportable = state.impactData === 'yes';
  return `${activityHeader('Incident clock desk', 'Does the communication workflow start?', 'Choose whether confidentiality or integrity of federal customer data is affected or likely affected, then inspect the clocks.')}
    <div class="incident-builder">
      <div class="incident-controls">
        <label><span>Federal customer data C / I affected or likely?</span>${segmented([{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }], state.impactData, 'data-impact')}</label>
        <label><span>Class</span>${segmented(['A', 'B', 'C', 'D'].map((value) => ({ value, label: value })), state.incidentClass, 'incident-class')}</label>
        <label><span>Incident PAIN</span>${segmented(['N1', 'N2', 'N3', 'N4', 'N5'], state.incidentPain, 'pain', 'incident')}</label>
      </div>
      <div class="reportability ${reportable ? 'yes' : 'no'}"><span>${reportable ? 'FedRAMP-reportable' : 'Not reportable under IEC-CSO-EFR'}</span><strong>${reportable ? 'Start all three clocks' : 'Continue normal incident handling'}</strong><p>${reportable ? 'Until promptly rated, use PAIN N5. The selected rating below demonstrates the resulting timeline.' : 'Availability-only impact does not satisfy this supplied confidentiality/integrity test.'}</p></div>
    </div>
    ${reportable ? `<div class="clock-grid"><article><span>01 · Initial</span><strong>${initial}</strong><small>${INCIDENT_CLOCKS.initial[state.incidentClass].force}</small></article><article><span>02 · Ongoing repeat</span><strong>${ongoing}</strong><small>${INCIDENT_CLOCKS.ongoing[state.incidentClass].force}</small></article><article><span>03 · Final after recovery</span><strong>${final}</strong><small>MUST</small></article></div>` : ''}`;
}

function activityChange() {
  const current = CHANGE_SCENARIOS.find((scenario) => scenario.id === state.changeScenario);
  return `${activityHeader('Routing exercise', 'Classify a proposed change', 'Try each scenario. The operational shape—not the project name—determines the notification path.')}
    <div class="change-exercise">
      <div class="scenario-list">${CHANGE_SCENARIOS.map((scenario) => `<button class="${scenario.id === current.id ? 'selected' : ''}" data-change-scenario="${scenario.id}"><strong>${scenario.label}</strong><span>${scenario.detail}</span></button>`).join('')}</div>
      <div class="change-result"><span>Route</span><strong>${current.result}</strong><p>${current.timing}</p><small>All formal notifications and related audit records: human-readable + JSON. Retain 12 months.</small></div>
    </div>
    <div class="transform-timeline"><div><strong>−30</strong><span>Initial plans</span></div><i></i><div><strong>−10</strong><span>Final plans</span></div><i></i><div><strong>+5</strong><span>Completion</span></div><i></i><div><strong>+5</strong><span>Verification</span></div><i></i><div><strong>+30</strong><span>Docs updated</span></div></div>`;
}

function activityMonitor() {
  return `${activityHeader('Quarterly calendar', 'One monitoring cycle', 'The required OCR and related access patterns keep reusable evidence current after certification.')}
    <div class="quarter-cycle">
      <article><span>Day 0</span><strong>Release OCR</strong><p>Cover the entire period since the prior summary and publish the next target date.</p></article>
      <article><span>+3 to +10 business days</span><strong>Hold Quarterly Review</strong><p>Provide registration or a downloadable calendar file.</p></article>
      <article><span>Always open</span><strong>Feedback + trust center</strong><p>Asynchronous questions, uninterrupted data sharing, and programmatic access.</p></article>
      <article><span>3 months</span><strong>Repeat</strong><p>Begin the next Ongoing Certification Report cycle.</p></article>
    </div>`;
}

function activityRecap() {
  const questions = [
    { id: 'q1', text: 'What selects a vulnerability response clock?', options: [['class-only', 'Certification class alone'], ['profile', 'Class × PAIN × reachability/exploitability']], correct: 'profile' },
    { id: 'q2', text: 'When is a vulnerability remediated?', options: [['low-risk', 'Risk is negligible'], ['gone', 'Neutralized/eliminated and no longer detected']], correct: 'gone' },
    { id: 'q3', text: 'What does a higher certification class mean?', options: [['secure', 'The service is objectively more secure'], ['commitments', 'Greater information and ongoing commitments']], correct: 'commitments' },
  ];
  const answered = questions.filter((question) => state.quiz[question.id]).length;
  const correct = questions.filter((question) => state.quiz[question.id] === question.correct).length;
  return `${activityHeader('Commissioning check', 'Can you run the park?', 'Choose one answer for each prompt. The result stays local to this page.')}
    <div class="quiz-grid">${questions.map((question, index) => `<article><span>0${index + 1}</span><strong>${question.text}</strong><div>${question.options.map(([value, label]) => {
      const selected = state.quiz[question.id] === value;
      const status = selected ? (value === question.correct ? 'correct' : 'incorrect') : '';
      return `<button class="${status}" data-quiz="${question.id}" data-answer="${value}" aria-pressed="${selected}">${label}</button>`;
    }).join('')}</div></article>`).join('')}</div>
    <div class="quiz-score"><span>${answered === questions.length ? 'Commissioning result' : 'Check in progress'}</span><strong>${correct} / ${questions.length}</strong><p>${answered === questions.length && correct === questions.length ? 'The operating loop is ready. Use the Library or Overview to revisit any detail.' : 'Review the highlighted choices and replay any scene as needed.'}</p></div>`;
}

function renderFooter(scene) {
  const sources = sourcesFor(scene).slice(0, 3);
  $('#scene-footer').innerHTML = `
    <div><span class="eyebrow">Scene sources</span><div>${sources.map((source) => `<a href="${source.url}" target="_blank" rel="noreferrer">${escapeHtml(source.agency)} · ${escapeHtml(source.title)}${icon('sources')}</a>`).join('')}</div></div>
    <p>Content verified ${VERIFIED_ON}. Educational aid—not a substitute for the current official rules or agency-specific risk decisions.</p>
  `;
}

function updateTimeline(force = false) {
  const scene = SCENES[state.sceneIndex];
  const nextBeatIndex = scene.beats.reduce((current, item, index) => (state.progress >= item.at ? index : current), 0);
  if (force || nextBeatIndex !== state.beatIndex) {
    state.beatIndex = nextBeatIndex;
    const currentBeat = scene.beats[nextBeatIndex];
    $('#beat-number').textContent = String(nextBeatIndex + 1).padStart(2, '0');
    $('#beat-title').textContent = currentBeat.title;
    $('#beat-text').textContent = currentBeat.text;
    const active = new Set(currentBeat.activate);
    $$('.world-node').forEach((element) => element.classList.toggle('active', active.has(element.dataset.node)));
    $$('.world-link').forEach((element) => {
      const [from, to] = element.dataset.link.split(':');
      element.classList.toggle('active', active.has(from) && active.has(to));
    });
    $$('[data-mobile-node]').forEach((element) => element.classList.toggle('active', active.has(element.dataset.mobileNode)));
  }
  updateCourier(scene);
  updateControls();
}

function updateCourier(scene) {
  const route = scene.route.map((id) => scene.nodes.find((item) => item.id === id)).filter(Boolean);
  if (route.length < 2) return;
  const segmentProgress = state.progress * (route.length - 1);
  const segment = Math.min(Math.floor(segmentProgress), route.length - 2);
  const local = segmentProgress - segment;
  const from = route[segment];
  const to = route[segment + 1];
  const x = from.x + (to.x - from.x) * local;
  const y = from.y + (to.y - from.y) * local - 8;
  const courier = $('#courier');
  if (courier) courier.setAttribute('transform', `translate(${x} ${y})`);
}

function updateControls() {
  const globalProgress = (state.sceneIndex + state.progress) / SCENES.length;
  const percent = Math.round(globalProgress * 100);
  const seek = $('#sequence-seek');
  if (seek && document.activeElement !== seek) seek.value = String(state.sceneIndex * 100 + Math.round(state.progress * 99));
  $('#overall-percent').textContent = `${percent}%`;
  $('#seek-label').textContent = `Scene ${state.sceneIndex + 1} of ${SCENES.length} · ${SCENES[state.sceneIndex].shortTitle}`;
  const status = $('#playback-status');
  const labels = { playing: 'Playing', paused: 'Paused', held: 'Held', complete: 'Complete' };
  status.innerHTML = `<i></i>${labels[state.playback]}`;
  status.dataset.state = state.playback;
  $('[data-action="previous"]').disabled = state.sceneIndex === 0;
  $('[data-action="next"]').disabled = state.sceneIndex === SCENES.length - 1;
  $('[data-action="play"]').disabled = state.playback === 'playing';
  $('[data-action="pause"]').disabled = state.playback !== 'playing';
  updateRail();
}

function updateRail() {
  $$('.rail-scene').forEach((element, index) => {
    element.classList.toggle('current', index === state.sceneIndex);
    element.classList.toggle('visited', index < state.sceneIndex || (index === state.sceneIndex && state.progress >= 0.99));
    element.setAttribute('aria-current', index === state.sceneIndex ? 'step' : 'false');
  });
  $('#completed-count').textContent = String(state.sceneIndex + (state.progress >= 0.99 ? 1 : 0));
}

function play() {
  if (state.playback === 'complete') restartExperience();
  state.playback = 'playing';
  state.lastFrame = performance.now();
  stopPlaybackTimer();
  state.frameRequest = window.setInterval(() => tick(performance.now()), 50);
  updateControls();
  announce('Playback started');
}

function pause() {
  if (state.playback !== 'playing') return;
  state.playback = 'paused';
  stopPlaybackTimer();
  updateControls();
  announce('Playback paused');
}

function hold() {
  state.playback = 'held';
  stopPlaybackTimer();
  updateControls();
  announce('Flow held at the current position');
}

function tick(timestamp) {
  if (state.playback !== 'playing') return;
  const duration = state.reducedMotion ? 9000 : 14000;
  const elapsed = timestamp - state.lastFrame;
  state.lastFrame = timestamp;
  state.progress += elapsed / duration;

  if (state.progress >= 1) {
    state.progress = 1;
    updateTimeline(true);
    if (state.sceneIndex < SCENES.length - 1) {
      const nextIndex = state.sceneIndex + 1;
      state.sceneIndex = nextIndex;
      state.progress = 0;
      state.beatIndex = -1;
      renderScene();
      updateTimeline(true);
      announce(`Scene ${nextIndex + 1}: ${SCENES[nextIndex].title}`);
      window.history.replaceState(null, '', `#${SCENES[nextIndex].id}`);
    } else {
      state.playback = 'complete';
      stopPlaybackTimer();
      updateControls();
      announce('Learning sequence complete');
      return;
    }
  }

  updateTimeline();
}

function stopPlaybackTimer() {
  window.clearInterval(state.frameRequest);
  window.cancelAnimationFrame(state.frameRequest);
  state.frameRequest = 0;
}

function previousScene() {
  if (state.sceneIndex > 0) setScene(state.sceneIndex - 1);
}

function nextScene() {
  if (state.sceneIndex < SCENES.length - 1) setScene(state.sceneIndex + 1);
}

function restartExperience() {
  stopPlaybackTimer();
  state.quiz = {};
  setScene(0);
  announce('Experience restarted');
}

function applyMotionPreference() {
  $('.app-shell').dataset.motion = state.reducedMotion ? 'reduced' : 'full';
  const button = $('[data-action="toggle-motion"]');
  button.setAttribute('aria-pressed', String(state.reducedMotion));
  button.querySelector('span:last-child').textContent = state.reducedMotion ? 'Reduced motion' : 'Full motion';
  announce(`${state.reducedMotion ? 'Reduced' : 'Full'} motion enabled`);
}

function modalHeader(id, eyebrow, title, copy) {
  return `<div class="modal-header"><div><span class="eyebrow">${escapeHtml(eyebrow)}</span><h2 id="${id}">${escapeHtml(title)}</h2><p>${escapeHtml(copy)}</p></div><button class="modal-close" data-action="close-dialog" aria-label="Close">${icon('close')}</button></div>`;
}

function openOverview() {
  const dialog = $('#overview-dialog');
  dialog.innerHTML = `${modalHeader('overview-title', 'Scene index', 'The complete learning route', 'Jump anywhere. Each scene remains understandable when held or reduced-motion is enabled.')}
    <div class="overview-grid">${SCENES.map((scene, index) => `<button data-scene="${index}" class="${index === state.sceneIndex ? 'current' : ''}" aria-label="Scene ${index + 1}: ${escapeHtml(scene.title)}"><span>${scene.number}</span><div><small>${escapeHtml(scene.chapter)}</small><strong>${escapeHtml(scene.title)}</strong><p>${escapeHtml(scene.objective)}</p></div>${icon('chevron')}</button>`).join('')}</div>
    <div class="keyboard-card"><strong>Keyboard</strong><span><kbd>Space</kbd> Play / pause</span><span><kbd>←</kbd><kbd>→</kbd> Scenes</span><span><kbd>H</kbd> Hold</span><span><kbd>R</kbd> Restart</span><span><kbd>O</kbd> Overview</span></div>`;
  dialog.showModal();
}

function openLibrary() {
  state.librarySearch = '';
  renderLibrary();
  $('#library-dialog').showModal();
}

function renderLibrary() {
  const dialog = $('#library-dialog');
  const tabs = [
    ['rulesets', `Rulesets · ${sourceData.rulesets.length}`],
    ['rules', `Explicit rules · ${explicitRules().length}`],
    ['ksi', `KSI · ${correctedKsi.reduce((sum, family) => sum + family.indicators.length, 0)}`],
    ['terms', `Terms · ${sourceData.glossary.length}`],
    ['schemas', `Schemas · ${sourceData.schemas.length}`],
  ];
  dialog.innerHTML = `${modalHeader('library-title', 'Source library', 'Complete supplied learning material', 'Extracted directly from the preserved HTML. Current official corrections are visibly marked.')}
    <div class="library-tools"><div class="library-tabs" role="tablist">${tabs.map(([id, label]) => `<button role="tab" aria-selected="${state.libraryTab === id}" data-library-tab="${id}">${label}</button>`).join('')}</div><label class="library-search"><span class="sr-only">Search library</span><input data-library-search type="search" placeholder="Search this section…" value="${escapeHtml(state.librarySearch)}" /></label></div>
    <div class="library-results" id="library-results"></div>`;
  renderLibraryResults();
}

function renderLibraryResults() {
  const root = $('#library-results');
  if (!root) return;
  const query = state.librarySearch.trim().toLowerCase();
  const matches = (...values) => !query || values.some((value) => String(value || '').toLowerCase().includes(query));

  if (state.libraryTab === 'rulesets') {
    const items = sourceData.rulesets.filter((item) => matches(item.id, item.name, item.purpose));
    root.innerHTML = `<div class="library-card-grid">${items.map((item) => `<article><div><code>${item.id}</code><span>${item.status}</span><i>${item.rulecount} rules</i></div><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.purpose)}</p></article>`).join('')}</div>`;
  } else if (state.libraryTab === 'rules') {
    const items = explicitRules().filter((item) => matches(item.id, item.name, item.force, item.statement));
    root.innerHTML = `<div class="library-rule-list">${items.map((item) => `<details><summary><code>${item.id}</code><strong>${escapeHtml(item.name)}</strong><span data-force="${String(item.force).replaceAll(' ', '-').toLowerCase()}">${escapeHtml(item.force)}</span></summary><p>${escapeHtml(item.statement)}</p>${item.danger ? `<aside>${escapeHtml(item.danger)}</aside>` : ''}${item.fields?.length ? `<ul>${item.fields.map((field) => `<li>${escapeHtml(field)}</li>`).join('')}</ul>` : ''}</details>`).join('')}</div>`;
  } else if (state.libraryTab === 'ksi') {
    const families = correctedKsi.map((family) => ({ ...family, indicators: family.indicators.filter((item) => matches(family.id, family.name, item.id, item.name, item.text)) })).filter((family) => family.indicators.length);
    root.innerHTML = `<div class="library-rule-list">${families.map((family) => `<details><summary><code>KSI-${family.id}</code><strong>${escapeHtml(family.name)}</strong><span>${family.indicators.length} indicators</span></summary><div class="library-indicators">${family.indicators.map((item) => `<article><div><code>${item.id}</code>${item.corrected ? '<span class="verified-badge">official outcome restored</span>' : ''}</div><strong>${escapeHtml(item.name)}</strong><p>${escapeHtml(item.text || 'Not specified in the supplied source.')}</p></article>`).join('')}</div></details>`).join('')}</div>`;
  } else if (state.libraryTab === 'terms') {
    const items = sourceData.glossary.filter((item) => matches(item.id, item.term, item.tag, item.def, item.note));
    root.innerHTML = `<div class="term-grid">${items.map((item) => `<article><div><code>${item.id}</code><span>${escapeHtml(item.tag)}</span></div><h3>${escapeHtml(item.term)}</h3><p>${escapeHtml(item.def)}</p>${item.note ? `<small>${escapeHtml(item.note)}</small>` : ''}</article>`).join('')}</div>`;
  } else {
    const items = sourceData.schemas.filter((item) => matches(item.file, item.title, item.description, ...(item.required || [])));
    root.innerHTML = `<div class="library-card-grid">${items.map((item) => `<article><div><code>JSON</code><i>${item.required?.length || 0} required</i></div><h3>${escapeHtml(item.title || item.file)}</h3><p>${escapeHtml(item.description || '')}</p><small>${escapeHtml(item.file)}</small><ul>${(item.required || []).map((field) => `<li><code>${escapeHtml(field)}</code></li>`).join('')}</ul></article>`).join('')}</div>`;
  }

  if (!root.textContent.trim()) root.innerHTML = '<div class="empty-state">No source material matches that search.</div>';
}

function openSources() {
  const dialog = $('#sources-dialog');
  dialog.innerHTML = `${modalHeader('sources-title', `Verified ${VERIFIED_ON}`, 'Authoritative source room', 'Only official FedRAMP, CISA, OMB, NIST, and U.S. Code sources were used for factual validation.')}
    <div class="validation-banner"><div><span>15</span><small>authoritative references</small></div><div><span>3</span><small>material correction groups</small></div><div><span>0</span><small>unofficial factual sources</small></div></div>
    <div class="correction-list">
      <article><span>01 · Class meaning</span><strong>Commitment level, not a security score</strong><p>The supplied narrative describes rising “assurance.” Current official guidance says classes change information-sharing and ongoing commitments and do not determine overall provider security.</p></article>
      <article><span>02 · Availability</span><strong>20x Class D remains future</strong><p>The simulator retains supplied Class D clocks as planning context but does not present Class D as currently obtainable.</p></article>
      <article><span>03 · KSI source gaps</span><strong>Five current outcomes restored</strong><p>KSI-CNA-EIS, KSI-MLA-ALA, KSI-SVC-PRR, KSI-SVC-RUD, and KSI-SVC-VCM are populated from official 2026 pages and marked in the Library.</p></article>
    </div>
    <div class="source-list">${SOURCES.map((source) => `<a href="${source.url}" target="_blank" rel="noreferrer"><span>${escapeHtml(source.agency)}</span><div><strong>${escapeHtml(source.title)}</strong><p>${escapeHtml(source.note)}</p></div>${icon('sources')}</a>`).join('')}</div>
    <p class="source-disclaimer">The preserved source files remain the product specification. Where they conflict with current official guidance, the dated corrections above control the learning presentation. See <code>docs/CONTENT_VALIDATION.md</code> in the repository for the complete record.</p>`;
  dialog.showModal();
}

function announce(message) {
  const announcer = $('#announcer');
  announcer.textContent = '';
  window.setTimeout(() => { announcer.textContent = message; }, 20);
}

function loadInitialScene(id) {
  const index = SCENES.findIndex((scene) => scene.id === id);
  if (index > 0) setScene(index, { announce: false });
}

const initialSceneId = window.location.hash.replace('#', '');
renderShell();
loadInitialScene(initialSceneId);
