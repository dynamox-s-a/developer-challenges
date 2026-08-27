import { describe, expect, it } from 'vitest';
import { forecastLinear } from './forecast';

describe('forecastLinear', () => {
  it('projects a clear upward trend', () => {
    const history = [
      { timestampMs: 1_000, value: 1 },
      { timestampMs: 2_000, value: 2 },
      { timestampMs: 3_000, value: 3 },
    ];

    const predictions = forecastLinear(history, 2);

    expect(predictions).toHaveLength(2);
    expect(predictions[0].value).toBeCloseTo(4, 3);
    expect(predictions[1].value).toBeCloseTo(5, 3);
    expect(new Date(predictions[0].timestamp).getTime()).toBe(4_000);
  });

  it('requires at least two points', () => {
    expect(() => forecastLinear([{ timestampMs: 1, value: 1 }], 1)).toThrow(
      /At least 2 readings/
    );
  });
});
