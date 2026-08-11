import { SCENES } from './content.js';

export const LEARNING_VERSION = 2;

export const MODULES = [
  {
    id: 'purpose',
    number: '01',
    title: 'Why FedRAMP 20x exists',
    shortTitle: 'Purpose',
    objective: 'Understand the shared assurance model, the four actors, and the certification profile that selects applicable commitments.',
    promise: 'See how reusable evidence supports agency decisions without turning certification into a one-time paperwork gate.',
    sceneIds: ['arrival', 'profile'],
    color: '#1f7a74',
    check: {
      id: 'purpose-owner',
      question: 'FedRAMP certifies a reusable package. Who still decides whether an agency may use the service?',
      options: [
        { id: 'agency', label: 'The federal agency', feedback: 'Correct. Each agency applies its own risk context and makes the authorization decision.' },
        { id: 'fedramp', label: 'FedRAMP', feedback: 'FedRAMP certifies reusable assurance, but it does not take over the agency’s authorization decision.' },
        { id: 'assessor', label: 'The independent assessor', feedback: 'The assessor verifies and validates evidence. It does not authorize agency use.' },
      ],
      correct: 'agency',
      reviewScene: 'arrival',
    },
  },
  {
    id: 'proof',
    number: '02',
    title: 'How a security claim becomes proof',
    shortTitle: 'Proof',
    objective: 'Build the chain from a security decision to a measure, evidence, verification, validation, and independent assessment.',
    promise: 'Turn “we do this securely” into something another party can review and reuse.',
    sceneIds: ['evidence', 'ksi'],
    color: '#416f9d',
    check: {
      id: 'proof-validation',
      question: 'A log shows that a check ran. What additional question does validation answer?',
      options: [
        { id: 'fitness', label: 'Is the capability accurate, working, and fit for its intended use?', feedback: 'Correct. Verification confirms fulfillment; validation tests whether the capability and evidence are suitable and work as intended.' },
        { id: 'existence', label: 'Does any log file exist?', feedback: 'Existence is not enough. Validation asks whether the capability and evidence are accurate, working, and suitable.' },
        { id: 'volume', label: 'How many pages are in the package?', feedback: 'Document volume is not the point. The model emphasizes measurable outcomes and fit-for-use evidence.' },
      ],
      correct: 'fitness',
      reviewScene: 'evidence',
    },
  },
  {
    id: 'vulnerability',
    number: '03',
    title: 'What happens when a vulnerability appears',
    shortTitle: 'Vulnerability',
    objective: 'Follow one finding from detection through evaluation, risk reduction, reporting, and closure.',
    promise: 'See why reachability, likely exploitation, and Potential Agency Impact determine the response path.',
    sceneIds: ['detect', 'evaluate', 'respond', 'report'],
    color: '#b06d32',
    check: {
      id: 'vulnerability-close',
      question: 'Risk has been reduced to a negligible level, but the vulnerable condition is still detected. What is its state?',
      options: [
        { id: 'mitigated', label: 'Mitigated and still open', feedback: 'Correct. Mitigation lowers likelihood or impact; remediation closes the finding only after the condition is neutralized or eliminated and no longer detected.' },
        { id: 'remediated', label: 'Remediated and closed', feedback: 'Not yet. A mitigated vulnerability remains present and visible until it is neutralized or eliminated and no longer detected.' },
        { id: 'ignored', label: 'No longer tracked', feedback: 'The remaining condition must stay in the activity history and reporting path. Risk reduction does not erase it.' },
      ],
      correct: 'mitigated',
      reviewScene: 'respond',
    },
  },
  {
    id: 'escalation',
    number: '04',
    title: 'When an incident or major change occurs',
    shortTitle: 'Escalation',
    objective: 'Recognize when parallel incident communications or significant-change notifications must begin.',
    promise: 'Route urgent events without replacing the underlying vulnerability, recovery, or change work.',
    sceneIds: ['incident', 'change'],
    color: '#8b5b87',
    check: {
      id: 'escalation-parallel',
      question: 'A vulnerability causes a reportable incident. What happens to the vulnerability workflow?',
      options: [
        { id: 'parallel', label: 'It continues in parallel with incident communication', feedback: 'Correct. Incident reporting adds a communication workflow; it does not replace evaluation, response, or recovery.' },
        { id: 'replaced', label: 'It stops when incident reporting begins', feedback: 'The workflows overlap. Incident communication does not replace vulnerability response or recovery.' },
        { id: 'wait', label: 'It waits until the final incident report', feedback: 'Response continues immediately. Reporting clocks and operational recovery run in parallel.' },
      ],
      correct: 'parallel',
      reviewScene: 'incident',
    },
  },
  {
    id: 'continuity',
    number: '05',
    title: 'How trust stays current',
    shortTitle: 'Continuity',
    objective: 'Assemble the reporting, review, access, and feedback loop that keeps reusable assurance current.',
    promise: 'Connect the full operating story and see why authorization evidence must keep moving after certification.',
    sceneIds: ['monitor', 'recap'],
    color: '#547a3d',
    check: {
      id: 'continuity-loop',
      question: 'What keeps a reusable certification useful after the initial review?',
      options: [
        { id: 'current', label: 'Current evidence, regular reporting, access, review, and feedback', feedback: 'Correct. Reuse depends on evidence and communication staying current throughout operations.' },
        { id: 'archive', label: 'Archiving the initial package without changes', feedback: 'A frozen package becomes stale. Ongoing evidence, reporting, access, and feedback keep assurance useful.' },
        { id: 'score', label: 'A permanent security score', feedback: 'FedRAMP 20x classes are not permanent security scores. Assurance stays useful through current evidence and ongoing commitments.' },
      ],
      correct: 'current',
      reviewScene: 'monitor',
    },
  },
];

export const SCENE_LEARNING = {
  arrival: {
    question: 'Who does what in a FedRAMP 20x decision?',
    plainTitle: 'Meet the four actors',
    plainEnglish: 'A cloud service provider runs the service and maintains its evidence. An independent assessor checks that evidence. FedRAMP certifies a reusable assurance package. A federal agency still decides whether using the service fits its own risk.',
    tryTitle: 'Route an evidence packet to the right decision maker',
    terms: ['cloud-service-provider', 'assessor', 'certification', 'authorization'],
  },
  profile: {
    question: 'Which commitments apply to this service?',
    plainTitle: 'Choose the service’s certification profile',
    plainEnglish: 'The profile selects which requirements, evidence, assessment, maintenance, and reporting commitments apply. For this 20x simulation, the type and path are fixed; you can compare classes without treating them as security scores.',
    tryTitle: 'Compare certification-class commitments',
    terms: ['certification-profile', 'certification-class'],
  },
  evidence: {
    question: 'How does a security claim become reviewable proof?',
    plainTitle: 'Build an evidence chain',
    plainEnglish: 'Start with a clear security decision. Define a measure and how often it runs. Collect objective evidence. Then verify that the requirement was fulfilled and validate that the capability and evidence are accurate, working, and fit for use.',
    tryTitle: 'Assemble the chain in the right order',
    terms: ['evidence', 'security-decision-record', 'verification', 'validation'],
  },
  ksi: {
    question: 'What should good security look like?',
    plainTitle: 'Explore measurable security outcomes',
    plainEnglish: 'Key Security Indicators describe outcomes across ten security families. A provider chooses measures that demonstrate each applicable outcome and keeps the supporting evidence current.',
    tryTitle: 'Choose an outcome family to inspect',
    terms: ['key-security-indicator'],
  },
  detect: {
    question: 'How does the service notice a vulnerability?',
    plainTitle: 'Watch more than scanner output',
    plainEnglish: 'Detection includes scanners, assessments, tests, disclosures, threat intelligence, supply-chain signals, incidents, and checks that security practices themselves still work. Every detected problem enters one trackable queue.',
    tryTitle: 'Change the detection cadence and watch the queue',
    terms: ['vulnerability'],
  },
  evaluate: {
    question: 'What makes this finding urgent?',
    plainTitle: 'Prioritize the finding in service context',
    plainEnglish: 'The response path depends on whether the vulnerable resource is reachable from the internet, whether a likely threat actor can exploit it, and the cumulative effect that exploitation could have on agencies.',
    tryTitle: 'Predict the risk-reduction clock',
    terms: ['potential-agency-impact', 'reachability', 'exploitability'],
  },
  respond: {
    question: 'How fast must risk be reduced—and when is the finding closed?',
    plainTitle: 'Reduce risk without hiding what remains',
    plainEnglish: 'Mitigation lowers the likelihood or impact while the vulnerable condition remains. Remediation neutralizes or eliminates that condition so it is no longer detected. A mitigated finding stays visibly open.',
    tryTitle: 'Move the finding through mitigation and remediation',
    terms: ['mitigation', 'remediation'],
  },
  report: {
    question: 'How does response work become reusable evidence?',
    plainTitle: 'Publish a safe, reviewable activity trail',
    plainEnglish: 'The provider reports what changed, why it matters, the current state, and the next action in both human-readable and valid machine-readable forms. Sensitive details that would enable exploitation stay protected.',
    tryTitle: 'Choose what belongs in the shared report',
    terms: ['trust-center'],
  },
  incident: {
    question: 'When does incident reporting start?',
    plainTitle: 'Start communication clocks when federal customer data is at risk',
    plainEnglish: 'When an event affects—or is likely to affect—the confidentiality or integrity of federal customer data, the FedRAMP incident workflow begins. Initial, ongoing, and final reporting run alongside response and recovery.',
    tryTitle: 'Triage the signal and reveal its three clocks',
    terms: ['incident', 'potential-agency-impact'],
  },
  change: {
    question: 'Does this change need a formal notification path?',
    plainTitle: 'Route routine, adaptive, transformative, or emergency work',
    plainEnglish: 'The operational effect of a change determines its path. Recurring work differs from an adaptive extension, a transformative architecture change, or emergency work that must be documented after immediate action.',
    tryTitle: 'Classify a proposed service change',
    terms: ['significant-change'],
  },
  monitor: {
    question: 'How does assurance stay current?',
    plainTitle: 'Keep the evidence and conversation moving',
    plainEnglish: 'The provider publishes an Ongoing Certification Report every three months, supports a Quarterly Review, keeps trust-center access available, and provides a way for agencies to ask questions between reviews.',
    tryTitle: 'Assemble one ongoing-review cycle',
    terms: ['ongoing-certification-report'],
  },
  recap: {
    question: 'Can you route one realistic service event through the whole system?',
    plainTitle: 'Put the full process together',
    plainEnglish: 'A current profile selects commitments. Evidence demonstrates outcomes. Operations detect and evaluate change. Teams reduce risk, communicate incidents or major changes, report what happened, and refresh evidence for the next decision.',
    tryTitle: 'Complete the service handoff scenario',
    terms: ['authorization', 'evidence', 'mitigation', 'remediation'],
  },
};

export const GLOSSARY = {
  'cloud-service-provider': { term: 'Cloud service provider', short: 'The organization that operates the cloud service offering and maintains its certification evidence.' },
  assessor: { term: 'Independent assessor', short: 'A qualified independent party that verifies and validates the provider’s implementation and evidence.' },
  authorization: { term: 'Authorization', short: 'An agency’s risk-based decision to permit use of a service in its own context.' },
  certification: { term: 'Certification', short: 'FedRAMP’s determination that a reusable assurance package meets the applicable program requirements.' },
  'certification-profile': { term: 'Certification profile', short: 'The type, path, and class combination used to resolve which FedRAMP requirements apply.' },
  'certification-class': { term: 'Certification class', short: 'A level of information-sharing, assessment, maintenance, and reporting commitments—not an overall security score.' },
  evidence: { term: 'Evidence', short: 'Objective information that shows a security measure exists, ran, and produced a reviewable result.' },
  'security-decision-record': { term: 'Security Decision Record (SDR)', short: 'The maintained record of security decisions, measures, evidence, verification, validation, and accountable acceptance.' },
  verification: { term: 'Verification', short: 'Checking objective evidence to confirm that a stated requirement or outcome was fulfilled.' },
  validation: { term: 'Validation', short: 'Confirming that a capability and its evidence are accurate, working, and suitable for the intended certification use.' },
  'key-security-indicator': { term: 'Key Security Indicator (KSI)', short: 'A stated security outcome that the provider demonstrates with appropriate measures and current evidence.' },
  vulnerability: { term: 'Vulnerability', short: 'A weakness or process failure that may create harm and must enter the evaluation and response lifecycle.' },
  reachability: { term: 'Internet reachability', short: 'Whether a payload originating on the public internet can reach and trigger the vulnerable resource, even indirectly.' },
  exploitability: { term: 'Likely exploitability', short: 'Whether a likely threat actor can reach the condition and is likely to cause harm.' },
  'potential-agency-impact': { term: 'Potential Agency Impact (PAIN)', short: 'The cumulative likely effect of exploitation on federal agencies, rated from N1 minimal through N5 debilitating across multiple agencies.' },
  mitigation: { term: 'Mitigation', short: 'A reduction in likelihood or impact while the vulnerability remains present.' },
  remediation: { term: 'Remediation', short: 'Neutralizing or eliminating the vulnerable condition so it is no longer detected.' },
  'trust-center': { term: 'Trust center', short: 'The provider’s FedRAMP-compatible channel for continuous human and programmatic access to certification data.' },
  incident: { term: 'Reportable incident', short: 'An event that affects—or is likely to affect—the confidentiality or integrity of federal customer data.' },
  'significant-change': { term: 'Significant change', short: 'A change likely to substantively affect the service’s security or privacy posture.' },
  'ongoing-certification-report': { term: 'Ongoing Certification Report (OCR)', short: 'The human-readable report supplied every three months for the period since the prior report.' },
};

export const PROFILE_COMMITMENTS = {
  A: { availability: 'Available now', sharing: 'Core certification information', assessment: 'Approved alternative framework baseline', maintenance: 'Entry ongoing commitments', reporting: 'Required program reporting' },
  B: { availability: 'Pipeline opens Aug 31, 2026', sharing: 'More certification information', assessment: 'Annual independent assessment', maintenance: 'Stronger ongoing maintenance', reporting: 'Expanded reporting commitments' },
  C: { availability: 'Pipeline opens Aug 31, 2026', sharing: 'Considerable certification information', assessment: 'Independent review aligned to the class', maintenance: 'More frequent ongoing evidence', reporting: 'More frequent machine-readable history' },
  D: { availability: 'Future phase—planning context only', sharing: 'Future expectations not final', assessment: 'Future expectations not final', maintenance: 'Future expectations not final', reporting: 'Supplied clocks shown only as planning context' },
};

export const CAPSTONE = [
  {
    id: 'capstone-finding',
    prompt: 'A public, likely exploitable weakness could debilitate several agencies. What should happen first after detection?',
    options: [
      { id: 'evaluate', label: 'Evaluate reachability, exploitability, and PAIN, then start the selected clock', feedback: 'Correct. Evaluation establishes the response profile; a KEV due date would override the ordinary matrix.' },
      { id: 'close', label: 'Close it because the scanner already found it', feedback: 'Detection opens the lifecycle. The team still evaluates, reduces risk, reports activity, and closes only after remediation.' },
    ],
    correct: 'evaluate',
    reviewScene: 'evaluate',
  },
  {
    id: 'capstone-incident',
    prompt: 'Evidence now shows likely integrity impact to federal customer data. What additional route opens?',
    options: [
      { id: 'parallel', label: 'Run initial, ongoing, and final incident communication in parallel', feedback: 'Correct. Incident communication is added without replacing vulnerability response and recovery.' },
      { id: 'replace', label: 'Replace vulnerability response with a final incident report', feedback: 'The two workflows run in parallel. A final report cannot replace immediate response or ongoing communication.' },
    ],
    correct: 'parallel',
    reviewScene: 'incident',
  },
  {
    id: 'capstone-trust',
    prompt: 'After remediation and recovery, what keeps the result useful to future agency decisions?',
    options: [
      { id: 'refresh', label: 'Update evidence and reports, preserve the trail, and continue the review loop', feedback: 'Correct. Current reusable assurance depends on an ongoing evidence and communication loop.' },
      { id: 'freeze', label: 'Freeze the original certification package', feedback: 'A frozen package becomes stale. The service must keep certification data and ongoing communication current.' },
    ],
    correct: 'refresh',
    reviewScene: 'monitor',
  },
];

export function moduleForScene(sceneId) {
  return MODULES.find((module) => module.sceneIds.includes(sceneId));
}

export function sceneIndexForId(sceneId) {
  return Math.max(0, SCENES.findIndex((scene) => scene.id === sceneId));
}

export function readingDurationMs(text, { replay = false } = {}) {
  const words = String(text || '').trim().split(/\s+/).filter(Boolean).length;
  const firstVisit = Math.max(9000, Math.min(26000, Math.round((words / 145) * 60_000 + 3500)));
  return replay ? Math.max(4500, Math.round(firstVisit * 0.55)) : firstVisit;
}
