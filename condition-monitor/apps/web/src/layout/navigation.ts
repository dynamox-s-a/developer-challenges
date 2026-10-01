/** The screens of the application (assumptions, E; API contract), in menu order. */
export const NAVIGATION = [
  { path: '/', label: 'Overview' },
  { path: '/sectors', label: 'Sectors' },
  { path: '/machines', label: 'Machines' },
  { path: '/monitoring-points', label: 'Monitoring points' },
  { path: '/import', label: 'CSV import' },
] as const;
