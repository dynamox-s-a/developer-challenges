import {
  ingestReadingsSchema,
  MAX_READINGS_PER_SUBMISSION,
  readingSchema,
  readingTimestampSchema,
} from './reading-schemas.js';

const valid = {
  serialNumber: 'DX-0001',
  timestamp: '2026-09-29T10:00:00Z',
  quantity: 'velocity_rms',
  axis: 'H',
  value: 2.31,
};

function messagesOf(input: unknown): Record<string, string> {
  const result = readingSchema.safeParse(input);
  return result.success
    ? {}
    : Object.fromEntries(result.error.issues.map((issue) => [issue.path.join('.'), issue.message]));
}

describe('readingTimestampSchema', () => {
  it('turns every offset into the same instant in UTC, with milliseconds', () => {
    expect(readingTimestampSchema.parse('2026-09-29T10:00:00Z')).toBe('2026-09-29T10:00:00.000Z');
    expect(readingTimestampSchema.parse('2026-09-29T07:00:00-03:00')).toBe(
      '2026-09-29T10:00:00.000Z',
    );
    expect(readingTimestampSchema.parse('2026-09-29T10:00:00.123+00:00')).toBe(
      '2026-09-29T10:00:00.123Z',
    );
  });

  it('refuses a time without an offset, which is ambiguous (C12)', () => {
    expect(readingTimestampSchema.safeParse('2026-09-29T10:00:00').success).toBe(false);
  });

  it('accepts milliseconds and refuses finer precision, which would be lost', () => {
    expect(readingTimestampSchema.safeParse('2026-09-29T10:00:00.999Z').success).toBe(true);
    expect(readingTimestampSchema.safeParse('2026-09-29T10:00:00.9999Z').success).toBe(false);
  });

  it('accepts 29 February in a leap year and refuses dates that do not exist', () => {
    expect(readingTimestampSchema.safeParse('2028-02-29T00:00:00Z').success).toBe(true);
    for (const date of ['2026-02-29T00:00:00Z', '2026-04-31T00:00:00Z', '2026-13-01T00:00:00Z']) {
      expect(readingTimestampSchema.safeParse(date).success).toBe(false);
    }
  });
});

describe('readingSchema', () => {
  it('accepts vibration with an axis and temperature without one', () => {
    expect(readingSchema.parse(valid)).toEqual({
      ...valid,
      timestamp: '2026-09-29T10:00:00.000Z',
    });
    expect(
      readingSchema.safeParse({ ...valid, quantity: 'temperature', axis: null, value: 48.2 })
        .success,
    ).toBe(true);
  });

  it('normalizes the serial number as the sensor label prints it (B4)', () => {
    expect(readingSchema.parse({ ...valid, serialNumber: ' dx-0001 ' }).serialNumber).toBe(
      'DX-0001',
    );
  });

  it('refuses vibration without an axis and temperature with one (C10)', () => {
    expect(messagesOf({ ...valid, axis: null })).toEqual({
      axis: 'velocity_rms needs an axis: H, V, A.',
    });
    expect(messagesOf({ ...valid, quantity: 'temperature' })).toEqual({
      axis: 'temperature has no axis; send null.',
    });
  });

  it('refuses a quantity outside the list instead of dropping it (C10)', () => {
    expect(messagesOf({ ...valid, quantity: 'displacement' })).toEqual({
      quantity: 'Must be one of: acceleration_rms, velocity_rms, temperature.',
    });
  });

  it('accepts zero and negatives, and refuses a missing axis or a value that is text', () => {
    expect(readingSchema.safeParse({ ...valid, value: 0 }).success).toBe(true);
    expect(readingSchema.safeParse({ ...valid, value: -1.5 }).success).toBe(true);

    const { axis: _axis, ...withoutAxis } = valid;
    expect(Object.keys(messagesOf(withoutAxis))).toEqual(['axis']);
    expect(messagesOf({ ...valid, value: '2.31' })).toEqual({ value: 'Must be a number.' });
  });
});

describe('ingestReadingsSchema', () => {
  it(`accepts ${MAX_READINGS_PER_SUBMISSION} readings and refuses one more (C8)`, () => {
    const readings = Array.from({ length: MAX_READINGS_PER_SUBMISSION }, () => valid);

    expect(ingestReadingsSchema.safeParse({ readings }).success).toBe(true);
    const result = ingestReadingsSchema.safeParse({ readings: [...readings, valid] });
    expect(result.error?.issues.map((issue) => issue.message)).toEqual([
      'At most 2,000 readings per submission.',
    ]);
  });

  it('refuses an empty submission', () => {
    expect(ingestReadingsSchema.safeParse({ readings: [] }).error?.issues[0].message).toBe(
      'Send at least one reading.',
    );
  });
});
