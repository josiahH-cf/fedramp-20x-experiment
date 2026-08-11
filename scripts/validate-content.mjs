import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  CHANGE_SCENARIOS,
  INCIDENT_CLOCKS,
  KSI_CORRECTIONS,
  REMEDIATION,
  SCENES,
  SOURCES,
  VERIFIED_ON,
} from '../src/content.js';
import {
  CAPSTONE,
  GLOSSARY,
  MODULES,
  SCENE_LEARNING,
  moduleForScene,
  readingDurationMs,
} from '../src/learning.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function extractData(source) {
  const marker = 'const DATA = ';
  const markerIndex = source.indexOf(marker);
  assert.notEqual(markerIndex, -1, 'Original HTML must retain its embedded DATA object.');
  const start = markerIndex + marker.length;
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = start; index < source.length; index += 1) {
    const character = source[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (character === '\\') escaped = true;
      else if (character === '"') inString = false;
      continue;
    }
    if (character === '"') inString = true;
    else if (character === '{') depth += 1;
    else if (character === '}' && --depth === 0) return JSON.parse(source.slice(start, index + 1));
  }
  throw new Error('Embedded DATA object is incomplete.');
}

const [html, generatedRaw, deterministicRules] = await Promise.all([
  readFile(resolve(root, 'fedramp-20x-field-guide.html'), 'utf8'),
  readFile(resolve(root, 'src/data/source-data.json'), 'utf8'),
  readFile(resolve(root, 'fedramp-20x-deterministic-requirements-processes summarized.md'), 'utf8'),
]);

const source = extractData(html);
const generated = JSON.parse(generatedRaw);
assert.deepEqual(generated, source, 'Generated source model must exactly match the preserved HTML DATA object.');

const explicitRules = [
  ...source.vdr_cso,
  ...source.ver.eva_rules,
  ...source.rpt.rules,
  ...source.incidents.rules,
  ...source.scn,
  ...source.share.ccm,
  ...source.share.cds,
  ...source.frc,
];

assert.equal(source.rulesets.length, 17, 'Expected all 17 supplied rulesets.');
assert.equal(source.rulesets.reduce((sum, ruleset) => sum + ruleset.rulecount, 0), 225, 'Expected 225 declared rules.');
assert.equal(explicitRules.length, 60, 'Expected all 60 embedded explicit rule statements.');
assert.equal(source.ksi.length, 10, 'Expected 10 KSI families.');
assert.equal(source.ksi.reduce((sum, family) => sum + family.indicators.length, 0), 46, 'Expected 46 KSI indicators.');
assert.equal(source.glossary.length, 75, 'Expected 75 supplied defined terms.');
assert.equal(source.schemas.length, 8, 'Expected eight supplied JSON schemas.');

for (const correction of KSI_CORRECTIONS) {
  const supplied = source.ksi.flatMap((family) => family.indicators).find((item) => item.id === correction.id);
  assert.ok(supplied, `${correction.id} must exist in the supplied KSI registry.`);
  assert.equal(supplied.text, '', `${correction.id} should remain visibly traceable to a supplied source gap.`);
  assert.ok(correction.outcome.length > 30, `${correction.id} must have a substantive official correction.`);
}

const expectedSceneOrder = ['arrival', 'profile', 'evidence', 'ksi', 'detect', 'evaluate', 'respond', 'report', 'incident', 'change', 'monitor', 'recap'];
assert.deepEqual(SCENES.map((scene) => scene.id), expectedSceneOrder, 'Scene order must follow the deterministic operating sequence.');
assert.equal(new Set(SCENES.map((scene) => scene.id)).size, SCENES.length, 'Scene IDs must be unique.');

for (const scene of SCENES) {
  assert.ok(scene.objective && scene.summary && scene.why, `${scene.id} needs a complete learning purpose.`);
  assert.ok(scene.beats.length >= 4, `${scene.id} needs progressive animation beats.`);
  assert.equal(scene.beats[0].at, 0, `${scene.id} must begin at timeline zero.`);
  assert.deepEqual([...scene.beats].sort((a, b) => a.at - b.at), scene.beats, `${scene.id} beats must be ordered.`);
  assert.ok(scene.nodes.length >= 4, `${scene.id} needs a meaningful visual system.`);
  const nodeIds = new Set(scene.nodes.map((node) => node.id));
  for (const [from, to] of scene.links) {
    assert.ok(nodeIds.has(from) && nodeIds.has(to), `${scene.id} has an invalid link ${from} → ${to}.`);
  }
  for (const id of scene.route) assert.ok(nodeIds.has(id), `${scene.id} route refers to missing node ${id}.`);
  for (const sourceId of scene.sourceIds) assert.ok(SOURCES.some((item) => item.id === sourceId), `${scene.id} has unknown source ${sourceId}.`);
}

assert.equal(MODULES.length, 5, 'The novice journey must expose exactly five top-level modules.');
assert.deepEqual(MODULES.flatMap((module) => module.sceneIds), expectedSceneOrder, 'Five-module grouping must preserve deterministic scene order exactly.');
assert.equal(new Set(MODULES.flatMap((module) => module.sceneIds)).size, SCENES.length, 'Every deterministic scene must belong to exactly one module.');
for (const module of MODULES) {
  assert.ok(module.title && module.objective && module.promise, `${module.id} needs a complete novice-facing purpose.`);
  assert.ok(module.sceneIds.length >= 2, `${module.id} needs a meaningful sequence.`);
  assert.equal(module.check.options.filter((option) => option.id === module.check.correct).length, 1, `${module.id} needs one valid check answer.`);
}
for (const scene of SCENES) {
  const learning = SCENE_LEARNING[scene.id];
  assert.ok(learning?.question && learning?.plainTitle && learning?.plainEnglish && learning?.tryTitle, `${scene.id} needs the complete novice learning pattern.`);
  assert.ok(learning.terms.every((id) => GLOSSARY[id]), `${scene.id} refers to an unknown first-use definition.`);
  assert.ok(moduleForScene(scene.id), `${scene.id} needs a parent module.`);
}
assert.equal(CAPSTONE.length, 3, 'The synthesis scenario must connect three realistic decisions.');
assert.ok(CAPSTONE.every((item) => item.options.some((option) => option.id === item.correct)), 'Every capstone decision needs one valid answer.');
assert.ok(readingDurationMs('A concise explanation for a new learner.') >= 9000, 'First-visit reading dwell must not be too short.');
assert.ok(readingDurationMs('A concise explanation for a returning learner.', { replay: true }) < readingDurationMs('A concise explanation for a returning learner.'), 'Completed explanations must replay faster.');

assert.deepEqual(CHANGE_SCENARIOS.map((scenario) => scenario.id), ['patch', 'region', 'identity', 'emergency'], 'Practice must cover every significant-change path, including emergency work.');
const emergencyChange = CHANGE_SCENARIOS.find((scenario) => scenario.id === 'emergency');
assert.match(emergencyChange.timing, /MAY execute first/);
assert.match(emergencyChange.timing, /MUST/);

const laneMap = { internet: 'irv_lev', internal: 'nirv_lev', unlikely: 'nlev' };
const unitMap = { hours: 'hours', days: 'days', bizdays: 'business days', months: 'months' };
const formatTime = ({ num, type }) => `${num} ${num === 1 ? unitMap[type].replace(/s$/, '') : unitMap[type]}`;

for (const certClass of ['A', 'B', 'C', 'D']) {
  const sourceClass = source.remediation[certClass.toLowerCase()];
  for (const pain of ['N2', 'N3', 'N4', 'N5']) {
    for (const lane of Object.keys(laneMap)) {
      const sourceCell = sourceClass.pain[pain.slice(1)][laneMap[lane]];
      assert.equal(REMEDIATION[certClass][lane][pain], formatTime(sourceCell), `Remediation mismatch at ${certClass}/${pain}/${lane}.`);
    }
  }
  assert.equal(REMEDIATION[certClass].internet.N1, 'No matrix deadline');
}

const incidentMap = { initial: 'iir', ongoing: 'oir', final: 'fir' };
for (const [phase, sourceKey] of Object.entries(incidentMap)) {
  for (const certClass of ['A', 'B', 'C', 'D']) {
    const sourceClass = source.incidents[sourceKey][certClass.toLowerCase()];
    assert.equal(INCIDENT_CLOCKS[phase][certClass].force, sourceClass.force);
    for (const pain of ['N1', 'N2', 'N3', 'N4', 'N5']) {
      const sourceCell = sourceClass.cells[pain.slice(1)];
      let expected = formatTime(sourceCell);
      if (sourceCell.type === 'hours' && sourceCell.num === 0.25) expected = '0.25 hours';
      const actual = INCIDENT_CLOCKS[phase][certClass][pain];
      const normalizedActual = actual === '15 minutes' ? '0.25 hours' : actual;
      assert.equal(normalizedActual, expected, `Incident mismatch at ${phase}/${certClass}/${pain}.`);
    }
  }
}

assert.match(deterministicRules, /## 16\. Deterministic End-to-End Vulnerability Algorithm/);
assert.match(deterministicRules, /## 17\. Deterministic End-to-End Incident Algorithm/);
assert.match(deterministicRules, /## 18\. Deterministic End-to-End Significant Change Algorithm/);
assert.equal(VERIFIED_ON, '2026-08-11');
assert.ok(SOURCES.every((sourceItem) => /^https:\/\//.test(sourceItem.url)), 'Every source must be an accessible HTTPS reference.');
assert.ok(SOURCES.every((sourceItem) => /fedramp\.gov|cisa\.gov|whitehouse\.gov|nist\.gov|uscode\.house\.gov/.test(sourceItem.url)), 'Only authoritative government source domains are allowed.');

console.log('Content validation passed:');
console.log(`  ${source.rulesets.length} rulesets / ${explicitRules.length} explicit statements / ${source.glossary.length} terms`);
console.log(`  ${source.ksi.length} KSI families / ${source.ksi.reduce((sum, family) => sum + family.indicators.length, 0)} indicators / ${source.schemas.length} schemas`);
console.log(`  ${SCENES.length} ordered scenes with deterministic matrices verified against the preserved source`);
console.log(`  ${MODULES.length} novice modules / ${Object.keys(GLOSSARY).length} inline definitions / ${CAPSTONE.length} capstone decisions`);
