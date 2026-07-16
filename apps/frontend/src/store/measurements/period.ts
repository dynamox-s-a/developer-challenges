export const PERIODS = ['7d', '30d', 'all'] as const;

export type Period = (typeof PERIODS)[number];

export const PERIOD_LABELS: Record<Period, string> = {
  '7d': '7 dias',
  '30d': '30 dias',
  all: 'Tudo',
};

const DAYS_BY_PERIOD: Record<Exclude<Period, 'all'>, number> = { '7d': 7, '30d': 30 };

export const isPeriod = (value: unknown): value is Period => PERIODS.includes(value as Period);

export const periodToRange = (period: Period, lastReadingAt?: string): { from?: string; to?: string } => {
  if (period === 'all' || !lastReadingAt) return {};

  const anchor = new Date(lastReadingAt);

  if (Number.isNaN(anchor.getTime())) return {};

  const from = new Date(anchor);
  from.setUTCDate(from.getUTCDate() - DAYS_BY_PERIOD[period]);

  return { from: from.toISOString(), to: anchor.toISOString() };
};
