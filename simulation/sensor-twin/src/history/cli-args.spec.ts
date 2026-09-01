import { defaultWorkers, parseHistoryArgs } from './cli-args';

describe('flags do plant history', () => {
  it('defaults sensatos', () => {
    const o = parseHistoryArgs([], 12);
    expect(o).toMatchObject({ days: 30, everyMinutes: 15, untilOffsetHours: 4, concurrency: 6, workers: 8, retries: 3, dryRun: false });
    expect(o.sensors).toHaveLength(12);
    expect(defaultWorkers(4)).toBe(2);
    expect(defaultWorkers(1)).toBe(1);
  });

  it('aceita a forma completa', () => {
    const o = parseHistoryArgs(['--days', '7', '--every', '30', '--sensors', 'SIM-HF-003,SIM-HF-004', '--workers', '2', '--concurrency', '4', '--dry-run', '--report', 'x.json', '--epoch', '2026-08-01T00:00:00Z', '--limit', '50', '--since', '2026-08-02T10:00:00Z']);
    expect(o).toMatchObject({ days: 7, everyMinutes: 30, sensors: ['SIM-HF-003', 'SIM-HF-004'], workers: 2, concurrency: 4, dryRun: true, reportPath: 'x.json', limit: 50 });
    expect(o.epochIso).toBe('2026-08-01T00:00:00.000Z');
    expect(o.sinceIso).toBe('2026-08-02T10:00:00.000Z');
  });

  it('rejeita o que quebraria as garantias', () => {
    expect(() => parseHistoryArgs(['--bogus'])).toThrow(/desconhecido/);
    expect(() => parseHistoryArgs(['--every', '7'])).toThrow(/60/);
    expect(() => parseHistoryArgs(['--until-offset', '2'])).toThrow(/≥ 4/);
    expect(() => parseHistoryArgs(['--sensors', 'SIM-X'])).toThrow(/desconhecidos/);
    expect(() => parseHistoryArgs(['--epoch', '2026-08-01T10:00:00Z'])).toThrow(/meia-noite/);
    expect(() => parseHistoryArgs(['--days', '0'])).toThrow(/days/);
  });
});
