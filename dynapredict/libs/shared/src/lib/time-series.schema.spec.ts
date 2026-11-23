import {
  MAX_TIME_SERIES_SAMPLES,
  timeSeriesSchema,
} from './time-series.schema.ts';

const series = {
  name: 'Temperatura',
  unit: '°C',
  samples: [
    { timestamp: '2026-11-22T10:00:00Z', value: 31.5 },
    { timestamp: '2026-11-22T10:10:00.250-03:00', value: -2 },
  ],
};

// count medições, uma por minuto a partir de 22/11/2026 00:00 (UTC)
function samples(count: number) {
  const start = Date.UTC(2026, 10, 22);
  return Array.from({ length: count }, (_, index) => ({
    timestamp: new Date(start + index * 60_000).toISOString(),
    value: index,
  }));
}

describe('timeSeriesSchema', () => {
  it('should accept a valid series and turn the timestamps into dates', () => {
    const parsed = timeSeriesSchema.parse(series);
    expect(parsed.samples).toEqual([
      { timestamp: new Date('2026-11-22T10:00:00Z'), value: 31.5 },
      { timestamp: new Date('2026-11-22T13:10:00.250Z'), value: -2 },
    ]);
  });

  it('should trim the name and the unit', () => {
    const parsed = timeSeriesSchema.parse({
      ...series,
      name: '  Temperatura  ',
      unit: '  °C  ',
    });
    expect(parsed.name).toBe('Temperatura');
    expect(parsed.unit).toBe('°C');
  });

  it('should turn a missing or blank unit into null', () => {
    const units = [undefined, null, '', '   '];
    for (const unit of units) {
      expect(timeSeriesSchema.parse({ ...series, unit }).unit).toBeNull();
    }
  });

  it('should reject an invalid name or unit', () => {
    const invalid = [
      { ...series, name: '   ' },
      { ...series, name: 'a'.repeat(101) },
      { ...series, unit: 'a'.repeat(21) },
    ];
    for (const data of invalid) {
      expect(timeSeriesSchema.safeParse(data).success).toBe(false);
    }
  });

  it('should reject a timestamp without time zone or in another format', () => {
    const timestamps = [
      '2026-11-22T10:00:00',
      '2026-11-22',
      '22/11/2026 10:00:00',
      '2026-02-30T10:00:00Z',
      1795341600000,
    ];
    for (const timestamp of timestamps) {
      const result = timeSeriesSchema.safeParse({
        ...series,
        samples: [{ timestamp, value: 1 }],
      });
      expect(result.success).toBe(false);
    }
  });

  it('should reject a value that is not a number', () => {
    const values = ['31.5', null, undefined];
    for (const value of values) {
      const result = timeSeriesSchema.safeParse({
        ...series,
        samples: [{ timestamp: '2026-11-22T10:00:00Z', value }],
      });
      expect(result.success).toBe(false);
    }
  });

  it('should accept from 1 up to the maximum number of samples', () => {
    for (const count of [1, MAX_TIME_SERIES_SAMPLES]) {
      const result = timeSeriesSchema.safeParse({
        ...series,
        samples: samples(count),
      });
      expect(result.success).toBe(true);
    }
  });

  it('should reject no samples or more than the maximum', () => {
    for (const count of [0, MAX_TIME_SERIES_SAMPLES + 1]) {
      const result = timeSeriesSchema.safeParse({
        ...series,
        samples: samples(count),
      });
      expect(result.success).toBe(false);
    }
  });

  it('should reject two samples at the same instant written differently', () => {
    const result = timeSeriesSchema.safeParse({
      ...series,
      samples: [
        { timestamp: '2026-11-22T10:00:00Z', value: 1 },
        { timestamp: '2026-11-22T10:01:00Z', value: 2 },
        { timestamp: '2026-11-22T07:00:00-03:00', value: 3 },
        { timestamp: '2026-11-22T10:01:00Z', value: 4 },
      ],
    });
    // Só a primeira repetição aparece
    expect(result.error?.issues).toEqual([
      expect.objectContaining({
        message: 'Há mais de uma medição no instante 2026-11-22T10:00:00.000Z',
        path: ['samples', 2, 'timestamp'],
      }),
    ]);
  });

  it('should show one message for an invalid timestamp, and not crash', () => {
    const result = timeSeriesSchema.safeParse({
      ...series,
      samples: [
        { timestamp: 'ontem', value: 1 },
        { timestamp: '2026-11-22T10:00:00Z', value: 2 },
      ],
    });
    expect(result.error?.issues).toEqual([
      expect.objectContaining({
        message: 'Use data e hora com fuso, ex.: 2026-11-22T10:00:00Z',
        path: ['samples', 0, 'timestamp'],
      }),
    ]);
  });
});
