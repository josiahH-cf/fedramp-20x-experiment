import { MODULES, SCENE_LEARNING, moduleForScene } from './learning.js';

export const WORLD_VIEW = Object.freeze({ x: 0, y: 0, width: 1000, height: 620 });

export const WORLD_STOPS = Object.freeze({
  arrival: { x: 118, y: 418 },
  profile: { x: 222, y: 332 },
  evidence: { x: 340, y: 238 },
  ksi: { x: 458, y: 162 },
  detect: { x: 590, y: 178 },
  evaluate: { x: 718, y: 238 },
  respond: { x: 824, y: 336 },
  report: { x: 748, y: 452 },
  incident: { x: 612, y: 508 },
  change: { x: 478, y: 498 },
  monitor: { x: 330, y: 506 },
  recap: { x: 182, y: 494 },
});

const LANDMARKS = {
  purpose: { x: 170, y: 318, kind: 'gate', label: 'Decision Gate' },
  proof: { x: 408, y: 205, kind: 'foundry', label: 'Evidence Works' },
  vulnerability: { x: 710, y: 294, kind: 'tower', label: 'Response Loop' },
  escalation: { x: 548, y: 462, kind: 'beacon', label: 'Escalation Yard' },
  continuity: { x: 280, y: 464, kind: 'archive', label: 'Trust Exchange' },
};

const MODULE_TONES = {
  purpose: ['#1f7a74', '#155b57', '#72b9ae'],
  proof: ['#4c7ba8', '#315e87', '#91b7d6'],
  vulnerability: ['#b8783e', '#8d5228', '#e3ad6e'],
  escalation: ['#93668f', '#704b6e', '#c29abf'],
  continuity: ['#66884d', '#496736', '#9fbc82'],
};

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[character]);
}

function isoBuilding(module, landmark) {
  const [front, side, roof] = MODULE_TONES[module.id];
  const { x, y, label, kind } = landmark;
  const height = kind === 'tower' ? 108 : kind === 'beacon' ? 82 : 72;
  const width = kind === 'archive' ? 58 : 48;
  const ornament = {
    gate: `<path d="M-${width - 8} -${height + 8}v-30h${(width - 8) * 2}v30M-${width - 8} -${height + 25}h${(width - 8) * 2}"/>`,
    foundry: `<path d="M-26 -${height + 2}v-24l18 12 18-12 18 12v24"/><circle cx="-8" cy="-${height + 25}" r="7"/>`,
    tower: `<path d="M0 -${height + 22}v-34m-10 10L0 -${height + 62}l10 18"/><circle cx="0" cy="-${height + 62}" r="6"/>`,
    beacon: `<path d="M-24 -${height + 5} 0 -${height + 48} 24 -${height + 5}z"/><circle cx="0" cy="-${height + 51}" r="7"/>`,
    archive: `<path d="M-${width - 6} -${height + 2}h${(width - 6) * 2}v-31h-${(width - 6) * 2}zM-18 -${height + 18}h36"/>`,
  }[kind];
  return `<g class="campus-landmark" data-module-id="${module.id}" role="button" tabindex="0" aria-label="Inspect module ${module.number}: ${escapeHtml(module.title)}" transform="translate(${x} ${y})" style="--front:${front};--side:${side};--roof:${roof}">
    <ellipse class="landmark-shadow" cx="0" cy="18" rx="${width + 20}" ry="24"/>
    <path class="building-front" d="M-${width} -42 0 -14 0 ${height - 42} -${width} ${height - 70}z"/>
    <path class="building-side" d="M${width} -42 0 -14 0 ${height - 42} ${width} ${height - 70}z"/>
    <path class="building-roof" d="M0 -70 ${width} -42 0 -14 -${width} -42z"/>
    <g class="building-ornament">${ornament}</g>
    <rect class="landmark-label-bg" x="-${Math.max(55, label.length * 4.3)}" y="${height - 27}" width="${Math.max(110, label.length * 8.6)}" height="28" rx="8"/>
    <text class="landmark-label" x="0" y="${height - 9}" text-anchor="middle">${escapeHtml(label)}</text>
  </g>`;
}

function sceneStop(scene, index, currentSceneId, visitedScenes) {
  const point = WORLD_STOPS[scene.id];
  const module = moduleForScene(scene.id);
  const current = scene.id === currentSceneId;
  const visited = visitedScenes.includes(scene.id);
  return `<g class="campus-stop${current ? ' current' : ''}${visited ? ' visited' : ''}" data-scene-id="${scene.id}" role="button" tabindex="0" aria-label="Inspect step ${index + 1}: ${escapeHtml(SCENE_LEARNING[scene.id].plainTitle)}" transform="translate(${point.x} ${point.y})">
    <circle class="stop-halo" r="24"/>
    <path class="stop-base" d="M-18 0 0-10 18 0 0 10z"/>
    <text class="stop-number" x="0" y="4" text-anchor="middle">${String(index + 1).padStart(2, '0')}</text>
  </g>`;
}

export function servicePosition(scenes, sceneIndex, progress) {
  const current = WORLD_STOPS[scenes[sceneIndex].id];
  const next = WORLD_STOPS[scenes[Math.min(sceneIndex + 1, scenes.length - 1)].id];
  const eased = 0.5 - Math.cos(Math.max(0, Math.min(1, progress)) * Math.PI) / 2;
  return { x: current.x + (next.x - current.x) * eased, y: current.y + (next.y - current.y) * eased };
}

export function followCamera(position) {
  const compact = typeof window !== 'undefined' && window.innerWidth <= 720;
  const width = compact ? 500 : 660;
  const height = 410;
  const scaledHeight = compact ? 360 : height;
  return {
    x: Math.max(0, Math.min(WORLD_VIEW.width - width, position.x - width / 2)),
    y: Math.max(0, Math.min(WORLD_VIEW.height - scaledHeight, position.y - scaledHeight / 2)),
    width,
    height: scaledHeight,
  };
}

export function renderCampus({ scenes, sceneIndex, progress, visitedScenes, service, camera }) {
  const currentSceneId = scenes[sceneIndex].id;
  const position = servicePosition(scenes, sceneIndex, progress);
  const routePoints = scenes.map((scene) => `${WORLD_STOPS[scene.id].x},${WORLD_STOPS[scene.id].y}`).join(' ');
  const moduleGround = [
    ['purpose', '70,470 105,330 250,270 290,410 190,535'],
    ['proof', '245,305 350,115 510,100 540,245 410,330'],
    ['vulnerability', '500,115 690,105 900,290 875,470 690,505 560,310'],
    ['escalation', '420,390 585,400 690,505 550,585 395,540'],
    ['continuity', '110,430 300,365 440,455 395,570 175,570'],
  ].map(([id, points]) => `<polygon class="district district-${id}${moduleForScene(currentSceneId).id === id ? ' active' : ''}" points="${points}"/>`).join('');
  const badges = [service.profileClass ? `Class ${service.profileClass}` : '', service.evidenceChain.length ? 'Evidence' : '', service.findingStatus !== 'clear' ? 'Finding' : '', service.incidentStatus !== 'clear' ? 'Incident' : '', service.monitoringStatus === 'assembled' ? 'Current' : ''].filter(Boolean);

  return `<svg id="campus-world" class="campus-world" viewBox="${camera.x} ${camera.y} ${camera.width} ${camera.height}" role="img" aria-label="Illustrative assurance campus showing one cloud service moving through the FedRAMP 20x operating journey" data-finding="${service.findingStatus}" data-incident="${service.incidentStatus}" data-change="${service.changeStatus}">
    <defs>
      <linearGradient id="campus-sky" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d8edf0"/><stop offset="1" stop-color="#a9ccd1"/></linearGradient>
      <pattern id="campus-grid" width="38" height="22" patternUnits="userSpaceOnUse"><path d="M0 11 19 0l19 11-19 11z" fill="none" stroke="rgba(30,72,77,.12)" stroke-width="1"/></pattern>
      <filter id="campus-shadow" x="-40%" y="-40%" width="180%" height="190%"><feDropShadow dx="0" dy="10" stdDeviation="7" flood-color="#17383d" flood-opacity=".24"/></filter>
      <filter id="vehicle-shadow" x="-70%" y="-70%" width="240%" height="240%"><feDropShadow dx="0" dy="6" stdDeviation="4" flood-color="#102d32" flood-opacity=".35"/></filter>
    </defs>
    <rect width="1000" height="620" rx="28" fill="url(#campus-sky)"/>
    <path d="M500 26 970 302 505 596 34 318z" fill="#8fbea5" stroke="#5e9783" stroke-width="3"/>
    <path d="M500 48 930 302 505 570 74 318z" fill="url(#campus-grid)"/>
    ${moduleGround}
    <polyline class="campus-road-edge" points="${routePoints}"/>
    <polyline class="campus-road" points="${routePoints}"/>
    <polyline class="campus-road-center" points="${routePoints}"/>
    ${MODULES.map((module) => isoBuilding(module, LANDMARKS[module.id])).join('')}
    ${scenes.map((scene, index) => sceneStop(scene, index, currentSceneId, visitedScenes)).join('')}
    <g id="service-carrier" class="service-carrier" data-inspect-service role="button" tabindex="0" aria-label="Inspect the tracked cloud service and its accumulated evidence" transform="translate(${position.x} ${position.y - 24})" filter="url(#vehicle-shadow)">
      <ellipse class="carrier-shadow" cx="0" cy="18" rx="30" ry="10"/>
      <path class="carrier-top" d="M-28-5 0-20 30-5 2 10z"/>
      <path class="carrier-left" d="M-28-5 2 10 2 25-28 10z"/>
      <path class="carrier-right" d="M30-5 2 10 2 25 30 10z"/>
      <path class="carrier-cloud" d="M-11-24c3-10 17-10 20 0 9-3 16 3 15 10h-47c-2-7 5-13 12-10z"/>
      <circle cx="-16" cy="16" r="5"/><circle cx="18" cy="16" r="5"/>
      ${badges.slice(0, 4).map((badge, index) => `<g class="carrier-badge" transform="translate(${22 + index * 7} ${-25 - index * 8})"><rect x="-5" y="-5" width="10" height="10" rx="2"/><title>${escapeHtml(badge)}</title></g>`).join('')}
    </g>
    <g class="campus-compass" transform="translate(920 78)" aria-hidden="true"><path d="M0-26 8 0 0 26-8 0z"/><text y="-34" text-anchor="middle">N</text></g>
  </svg>`;
}

export function updateCarrier(scenes, sceneIndex, progress) {
  const carrier = document.querySelector('#service-carrier');
  if (!carrier) return;
  const position = servicePosition(scenes, sceneIndex, progress);
  carrier.setAttribute('transform', `translate(${position.x} ${position.y - 24})`);
}

export function inspectorForModule(moduleId) {
  const module = MODULES.find((item) => item.id === moduleId);
  if (!module) return null;
  return {
    eyebrow: `Module ${module.number} · ${module.shortTitle}`,
    title: LANDMARKS[module.id].label,
    body: module.promise,
    detail: module.objective,
  };
}

export function inspectorForScene(scene) {
  const learning = SCENE_LEARNING[scene.id];
  return {
    eyebrow: `Step ${scene.number}`,
    title: learning.plainTitle,
    body: learning.question,
    detail: scene.objective,
  };
}

export function inspectorForService(service) {
  const states = [
    `Certification profile: 20x · Program · Class ${service.profileClass}`,
    `Evidence chain: ${service.evidenceChain.length ? `${service.evidenceChain.length} parts assembled` : 'not assembled yet'}`,
    `Finding: ${service.findingStatus.replaceAll('-', ' ')}`,
    `Incident: ${service.incidentStatus.replaceAll('-', ' ')}`,
    `Change path: ${service.changeStatus}`,
    `Ongoing trust: ${service.monitoringStatus}`,
  ];
  return {
    eyebrow: 'Tracked service · Northstar Cloud',
    title: 'One service, one continuous evidence trail',
    body: 'This illustrative carrier keeps the same service visible while its profile, evidence, findings, reports, incidents, changes, and ongoing-review state accumulate.',
    detail: states.join(' · '),
  };
}
