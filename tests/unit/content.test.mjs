import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CHANGE_SCENARIOS,
  INCIDENT_CLOCKS,
  KSI_CORRECTIONS,
  REMEDIATION,
  SCENES,
  SOURCES,
} from '../../src/content.js';
import {
  CAPSTONE,
  GLOSSARY,
  MODULES,
  SCENE_LEARNING,
  readingDurationMs,
} from '../../src/learning.js';
import {
  PROGRESS_STORAGE_KEY,
  createDefaultProgress,
  loadProgress,
  normalizeProgress,
  saveProgress,
} from '../../src/progress.js';
import { servicePosition } from '../../src/world.js';

test('the guided experience follows the deterministic operating order', () => {
  assert.deepEqual(SCENES.map((scene) => scene.id), [
    'arrival', 'profile', 'evidence', 'ksi', 'detect', 'evaluate',
    'respond', 'report', 'incident', 'change', 'monitor', 'recap',
  ]);
});

test('every scene is independently understandable when animation is paused', () => {
  for (const scene of SCENES) {
    assert.ok(scene.objective.length > 20);
    assert.ok(scene.summary.length > 60);
    assert.ok(scene.takeaways.length >= 3);
    assert.ok(scene.rules.length >= 1);
    assert.ok(scene.sourceIds.length >= 1);
  }
});

test('remediation matrix retains critical boundary values', () => {
  assert.equal(REMEDIATION.A.internet.N5, '4 days');
  assert.equal(REMEDIATION.C.internal.N2, '128 days');
  assert.equal(REMEDIATION.D.internet.N5, '12 hours');
  assert.equal(REMEDIATION.D.unlikely.N2, '192 days');
  assert.equal(REMEDIATION.B.internet.N1, 'No matrix deadline');
});

test('incident matrices retain initial, ongoing, and final distinctions', () => {
  assert.equal(INCIDENT_CLOCKS.initial.D.N5, '15 minutes');
  assert.equal(INCIDENT_CLOCKS.ongoing.C.N4, '6 hours');
  assert.equal(INCIDENT_CLOCKS.final.A.N2, '3 business days');
  assert.equal(INCIDENT_CLOCKS.initial.A.force, 'SHOULD');
  assert.equal(INCIDENT_CLOCKS.final.D.force, 'MUST');
});

test('the five supplied KSI gaps have current official outcomes', () => {
  assert.deepEqual(KSI_CORRECTIONS.map((item) => item.id), [
    'KSI-CNA-EIS', 'KSI-MLA-ALA', 'KSI-SVC-PRR', 'KSI-SVC-RUD', 'KSI-SVC-VCM',
  ]);
  assert.ok(KSI_CORRECTIONS.every((item) => item.outcome.length > 50));
});

test('all factual references are authoritative government sources', () => {
  assert.ok(SOURCES.length >= 12);
  assert.ok(SOURCES.every((source) => /fedramp\.gov|cisa\.gov|whitehouse\.gov|nist\.gov|uscode\.house\.gov/.test(source.url)));
});

test('five novice modules preserve every deterministic scene exactly once', () => {
  assert.equal(MODULES.length, 5);
  assert.deepEqual(MODULES.flatMap((module) => module.sceneIds), SCENES.map((scene) => scene.id));
  assert.equal(new Set(MODULES.flatMap((module) => module.sceneIds)).size, SCENES.length);
  assert.ok(MODULES.every((module) => module.check.options.some((option) => option.id === module.check.correct)));
});

test('every scene has plain-language learning layers and durable term definitions', () => {
  for (const scene of SCENES) {
    const learning = SCENE_LEARNING[scene.id];
    assert.ok(learning.plainTitle.length > 10);
    assert.ok(learning.plainEnglish.length > 100);
    assert.ok(learning.terms.every((id) => GLOSSARY[id]?.short.length > 30));
  }
});

test('reading dwell reflects explanation length and accelerates completed explanations', () => {
  const short = readingDurationMs('A short explanation.');
  const long = readingDurationMs('This longer explanation contains enough words to demonstrate that the learner receives more reading time when the visible explanation needs additional attention and comprehension.');
  assert.ok(short >= 9000);
  assert.ok(long >= short);
  assert.ok(readingDurationMs('A short explanation.', { replay: true }) < short);
  assert.ok(long <= 26000);
});

test('versioned local progress normalizes, persists, and rejects stale data', () => {
  const values = new Map();
  const storage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: (key) => values.delete(key) };
  const progress = createDefaultProgress(true);
  progress.introComplete = true;
  progress.visitedScenes = ['arrival', 'arrival'];
  progress.completedModules = ['purpose', 'unknown'];
  assert.equal(saveProgress(storage, progress), true);
  const loaded = loadProgress(storage);
  assert.deepEqual(loaded.visitedScenes, ['arrival']);
  assert.deepEqual(loaded.completedModules, ['purpose']);
  assert.equal(loaded.preferences.reducedMotion, true);
  assert.ok(values.has(PROGRESS_STORAGE_KEY));
  assert.equal(normalizeProgress({ version: -1, introComplete: true }).introComplete, false);
});

test('the persistent carrier follows one ordered route without leaving the campus', () => {
  const start = servicePosition(SCENES, 0, 0);
  const towardProfile = servicePosition(SCENES, 0, 1);
  const profile = servicePosition(SCENES, 1, 0);
  assert.deepEqual(towardProfile, profile);
  assert.notDeepEqual(start, profile);
  for (let index = 0; index < SCENES.length; index += 1) {
    const point = servicePosition(SCENES, index, 0.5);
    assert.ok(point.x >= 0 && point.x <= 1000);
    assert.ok(point.y >= 0 && point.y <= 620);
  }
});

test('the capstone is a connected application scenario, not an isolated definition score', () => {
  assert.equal(CAPSTONE.length, 3);
  assert.deepEqual(CAPSTONE.map((item) => item.reviewScene), ['evaluate', 'incident', 'monitor']);
  assert.ok(CAPSTONE.every((item) => item.options.some((option) => option.id === item.correct)));
});

test('significant-change practice includes the emergency execute-then-complete path', () => {
  const emergency = CHANGE_SCENARIOS.find((scenario) => scenario.id === 'emergency');
  assert.equal(emergency.result, 'Emergency');
  assert.match(emergency.timing, /MAY execute first/);
  assert.match(emergency.timing, /MUST/);
});
