/**
 * Mock dataset for the UX Heuristics Audit Tool.
 *
 * The app operates entirely on this local dataset in development.
 * In production, `dataService.js` will swap this out for a real API by
 * pointing at `VITE_API_BASE_URL` and using the same function contract.
 *
 * ---------------------------------------------------------------------
 * Data shape (documented as JSDoc typedefs for editor hints; there is no
 * runtime schema library).
 * ---------------------------------------------------------------------
 *
 * @typedef {'pass' | 'warning' | 'critical'} Severity
 *   Rating outcome for an individual heuristic on an audit.
 *
 * @typedef {'ios' | 'android' | 'web' | 'desktop'} Platform
 *   Platform under evaluation.
 *
 * @typedef {'draft' | 'in-progress' | 'complete'} AuditStatus
 *
 * @typedef {Object} Heuristic
 * @property {string} id       — Stable identifier, e.g. "n1".
 * @property {string} name     — Short human name.
 * @property {string} category — Grouping label surfaced in the UI.
 * @property {string} summary  — One-sentence description shown to evaluators.
 *
 * @typedef {Object} HeuristicFramework
 * @property {string}      id
 * @property {string}      name
 * @property {string}      description
 * @property {Heuristic[]} heuristics
 *
 * @typedef {Object} Rating
 * @property {string}    heuristicId
 * @property {Severity}  severity
 * @property {string}    [note]        — Optional free-text observation.
 * @property {string}    [screenshot]  — Optional URL to attached evidence.
 *
 * @typedef {Object} Audit
 * @property {string}      id
 * @property {string}      productName
 * @property {Platform}    platform
 * @property {string}      frameworkId  — References HeuristicFramework.id.
 * @property {AuditStatus} status
 * @property {string}      createdAt    — ISO 8601.
 * @property {string}      updatedAt    — ISO 8601.
 * @property {Rating[]}    ratings
 */

/** @type {HeuristicFramework[]} */
export const frameworks = [
  {
    id: 'nielsen-10',
    name: "Nielsen's 10 Usability Heuristics",
    description:
      'The classic Jakob Nielsen framework — the industry default for rapid usability inspection.',
    heuristics: [
      {
        id: 'n1',
        name: 'Visibility of system status',
        category: 'Feedback',
        summary: 'The system should always keep users informed about what is going on.',
      },
      {
        id: 'n2',
        name: 'Match between system and the real world',
        category: 'Language',
        summary: 'Speak the users’ language with familiar words, phrases and concepts.',
      },
      {
        id: 'n3',
        name: 'User control and freedom',
        category: 'Control',
        summary: 'Provide clearly marked emergency exits and support undo/redo.',
      },
      {
        id: 'n4',
        name: 'Consistency and standards',
        category: 'Consistency',
        summary: 'Follow platform and industry conventions.',
      },
      {
        id: 'n5',
        name: 'Error prevention',
        category: 'Errors',
        summary: 'Prevent problems before they occur through careful design.',
      },
      {
        id: 'n6',
        name: 'Recognition rather than recall',
        category: 'Memory',
        summary: 'Minimise memory load by making elements, actions and options visible.',
      },
      {
        id: 'n7',
        name: 'Flexibility and efficiency of use',
        category: 'Efficiency',
        summary: 'Allow both novices and experts to tailor frequent actions.',
      },
      {
        id: 'n8',
        name: 'Aesthetic and minimalist design',
        category: 'Aesthetics',
        summary: 'Only surface information that is relevant and necessary.',
      },
      {
        id: 'n9',
        name: 'Help users recognise, diagnose and recover from errors',
        category: 'Errors',
        summary: 'Speak plainly, point out problems and suggest a fix.',
      },
      {
        id: 'n10',
        name: 'Help and documentation',
        category: 'Support',
        summary: 'Provide easily searchable, task-focused help material.',
      },
    ],
  },
]

/** @type {Audit[]} */
export const audits = [
  {
    id: 'a-001',
    productName: 'Acme Banking · Mobile',
    platform: 'ios',
    frameworkId: 'nielsen-10',
    status: 'in-progress',
    createdAt: '2026-07-18T09:14:00.000Z',
    updatedAt: '2026-07-23T16:02:00.000Z',
    ratings: [
      { heuristicId: 'n1', severity: 'pass', note: 'Loading states are clear on every screen.' },
      { heuristicId: 'n2', severity: 'pass' },
      { heuristicId: 'n3', severity: 'warning', note: 'No easy back path from KYC flow.' },
      { heuristicId: 'n4', severity: 'pass' },
      { heuristicId: 'n5', severity: 'critical', note: 'No confirmation before high-value transfers.' },
      { heuristicId: 'n6', severity: 'pass' },
      { heuristicId: 'n7', severity: 'warning', note: 'Frequent transfers not surfaced as shortcuts.' },
    ],
  },
  {
    id: 'a-002',
    productName: 'Contoso Storefront',
    platform: 'web',
    frameworkId: 'nielsen-10',
    status: 'complete',
    createdAt: '2026-06-04T11:00:00.000Z',
    updatedAt: '2026-06-11T18:22:00.000Z',
    ratings: [
      { heuristicId: 'n1', severity: 'pass' },
      { heuristicId: 'n2', severity: 'pass' },
      { heuristicId: 'n3', severity: 'pass' },
      { heuristicId: 'n4', severity: 'warning', note: 'Nav differs between category and product pages.' },
      { heuristicId: 'n5', severity: 'pass' },
      { heuristicId: 'n6', severity: 'pass' },
      { heuristicId: 'n7', severity: 'pass' },
      { heuristicId: 'n8', severity: 'warning', note: 'Homepage is visually dense on mobile.' },
      { heuristicId: 'n9', severity: 'pass' },
      { heuristicId: 'n10', severity: 'critical', note: 'No help centre link on checkout.' },
    ],
  },
  {
    id: 'a-003',
    productName: 'Northwind CRM',
    platform: 'web',
    frameworkId: 'nielsen-10',
    status: 'complete',
    createdAt: '2026-05-12T08:30:00.000Z',
    updatedAt: '2026-05-14T14:47:00.000Z',
    ratings: [
      { heuristicId: 'n1', severity: 'warning' },
      { heuristicId: 'n2', severity: 'pass' },
      { heuristicId: 'n3', severity: 'pass' },
      { heuristicId: 'n4', severity: 'pass' },
      { heuristicId: 'n5', severity: 'warning', note: 'Bulk-delete confirms only once, not per-item.' },
      { heuristicId: 'n6', severity: 'critical', note: 'Users must remember record IDs in report filters.' },
      { heuristicId: 'n7', severity: 'pass' },
      { heuristicId: 'n8', severity: 'pass' },
      { heuristicId: 'n9', severity: 'warning' },
      { heuristicId: 'n10', severity: 'pass' },
    ],
  },
  {
    id: 'a-004',
    productName: 'Fabrikam Fitness · Android',
    platform: 'android',
    frameworkId: 'nielsen-10',
    status: 'draft',
    createdAt: '2026-07-22T19:10:00.000Z',
    updatedAt: '2026-07-22T19:10:00.000Z',
    ratings: [],
  },
]
