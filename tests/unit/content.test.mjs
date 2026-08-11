import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INCIDENT_CLOCKS,
  KSI_CORRECTIONS,
  REMEDIATION,
  SCENES,
  SOURCES,
} from '../../src/content.js';

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
