import { backfillCount, backfillTimes, latestGridTime, maxBackfillDays } from './grid';

const at = (hour: number, minute: number, second = 0) =>
  Date.UTC(2026, 8, 29, hour, minute, second);

describe('grid', () => {
  it('rounds down to a multiple of the interval, so two runs pick the same instants', () => {
    expect(latestGridTime(at(10, 17, 42), 10)).toBe(at(10, 10));
    expect(latestGridTime(at(10, 20), 10)).toBe(at(10, 20));
    expect(latestGridTime(at(10, 17, 42), 15)).toBe(at(10, 15));
  });

  it('lays a backfill out oldest first, one interval apart, ending at the latest instant', () => {
    const times = backfillTimes(at(10, 17, 42), 1, 10);

    expect(times).toHaveLength(144);
    expect(times[143]).toBe(at(10, 10));
    expect(times[0]).toBe(at(10, 10) - 143 * 600_000);
    expect(times.every((time, index) => index === 0 || time - times[index - 1] === 600_000)).toBe(
      true,
    );
  });

  it('keeps a backfill within the 50,000 readings of a series (C8)', () => {
    expect(maxBackfillDays(10)).toBe(347);
    expect(backfillCount(347, 10)).toBe(49_968);
    expect(backfillCount(348, 10)).toBe(50_112);
    expect(maxBackfillDays(15)).toBe(520);
  });
});
