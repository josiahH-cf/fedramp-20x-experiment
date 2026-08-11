import { LEARNING_VERSION, MODULES } from './learning.js';

export const PROGRESS_STORAGE_KEY = 'fedramp-20x-learning-progress';

export function createDefaultProgress(prefersReducedMotion = false) {
  return {
    version: LEARNING_VERSION,
    introComplete: false,
    lastSceneId: 'arrival',
    visitedScenes: [],
    completedScenes: [],
    completedModules: [],
    moduleChecks: {},
    capstone: {},
    preferences: {
      reducedMotion: Boolean(prefersReducedMotion),
      manualReading: false,
      speed: 1,
      followService: true,
    },
    service: {
      profileClass: 'A',
      evidenceChain: [],
      ksiFamily: 'CNA',
      findingStatus: 'clear',
      reportStatus: 'not-started',
      incidentStatus: 'clear',
      changeStatus: 'routine',
      monitoringStatus: 'ready',
    },
  };
}

export function normalizeProgress(value, prefersReducedMotion = false) {
  const defaults = createDefaultProgress(prefersReducedMotion);
  if (!value || typeof value !== 'object' || value.version !== LEARNING_VERSION) return defaults;
  const validModuleIds = new Set(MODULES.map((module) => module.id));
  return {
    ...defaults,
    ...value,
    visitedScenes: Array.isArray(value.visitedScenes) ? [...new Set(value.visitedScenes.filter((id) => typeof id === 'string'))] : [],
    completedScenes: Array.isArray(value.completedScenes) ? [...new Set(value.completedScenes.filter((id) => typeof id === 'string'))] : [],
    completedModules: Array.isArray(value.completedModules) ? [...new Set(value.completedModules.filter((id) => validModuleIds.has(id)))] : [],
    moduleChecks: value.moduleChecks && typeof value.moduleChecks === 'object' ? value.moduleChecks : {},
    capstone: value.capstone && typeof value.capstone === 'object' ? value.capstone : {},
    preferences: { ...defaults.preferences, ...(value.preferences || {}) },
    service: { ...defaults.service, ...(value.service || {}) },
  };
}

export function loadProgress(storage, prefersReducedMotion = false) {
  try {
    const raw = storage?.getItem(PROGRESS_STORAGE_KEY);
    return normalizeProgress(raw ? JSON.parse(raw) : null, prefersReducedMotion);
  } catch {
    return createDefaultProgress(prefersReducedMotion);
  }
}

export function saveProgress(storage, progress) {
  try {
    storage?.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    return true;
  } catch {
    return false;
  }
}

export function clearProgress(storage) {
  try {
    storage?.removeItem(PROGRESS_STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}
