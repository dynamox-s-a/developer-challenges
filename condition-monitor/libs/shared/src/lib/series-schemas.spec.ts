import { readingsQuerySchema, timeRangeQuerySchema } from './series-schemas.js';

describe('timeRangeQuerySchema', () => {
  it('accepts no bounds, one bound, or equal bounds, normalized to UTC', () => {
    expect(timeRangeQuerySchema.parse({})).toEqual({});
    expect(timeRangeQuerySchema.parse({ from: '2026-09-29T07:00:00-03:00' })).toEqual({
      from: '2026-09-29T10:00:00.000Z',
    });
    expect(
      timeRangeQuerySchema.safeParse({ from: '2026-09-29T10:00:00Z', to: '2026-09-29T10:00:00Z' })
        .success,
    ).toBe(true);
  });

  it('refuses an interval that ends before it starts, comparing instants, not text', () => {
    const result = timeRangeQuerySchema.safeParse({
      from: '2026-09-29T10:00:00Z',
      // 09:59 in UTC, although the text sorts after the start.
      to: '2026-09-29T11:59:00+02:00',
    });

    expect(result.error?.issues).toEqual([
      expect.objectContaining({ path: ['to'], message: 'Must not be before from.' }),
    ]);
  });
});

describe('readingsQuerySchema', () => {
  it('reads maxPoints from the URL text, from 2 to 5,000', () => {
    expect(readingsQuerySchema.parse({ maxPoints: '2' }).maxPoints).toBe(2);
    expect(readingsQuerySchema.parse({ maxPoints: '5000' }).maxPoints).toBe(5000);
    for (const maxPoints of ['1', '5001', '10.5', 'many']) {
      expect(readingsQuerySchema.safeParse({ maxPoints }).success).toBe(false);
    }
  });
});
