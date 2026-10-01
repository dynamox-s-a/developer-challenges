import { ForecastCache } from './forecast-cache';

describe('ForecastCache', () => {
  it('computes once while the signature stays the same', async () => {
    const cache = new ForecastCache<number>();
    const compute = jest.fn(async () => 42);

    expect(await cache.get('series', '10|a', compute)).toBe(42);
    expect(await cache.get('series', '10|a', compute)).toBe(42);

    expect(compute).toHaveBeenCalledTimes(1);
  });

  it('computes again when the data of the series changed', async () => {
    const cache = new ForecastCache<number>();
    await cache.get('series', '10|a', async () => 1);

    expect(await cache.get('series', '11|b', async () => 2)).toBe(2);
    // The old answer is gone: going back to the old signature computes too.
    expect(await cache.get('series', '10|a', async () => 3)).toBe(3);
  });

  it('gives requests that arrive together the same computation', async () => {
    const cache = new ForecastCache<number>();
    let finish!: (value: number) => void;
    const compute = jest.fn(() => new Promise<number>((resolve) => (finish = resolve)));

    const first = cache.get('series', '10|a', compute);
    const second = cache.get('series', '10|a', compute);
    finish(7);

    expect(await Promise.all([first, second])).toEqual([7, 7]);
    expect(compute).toHaveBeenCalledTimes(1);
  });

  it('does not keep a failure', async () => {
    const cache = new ForecastCache<number>();
    await expect(
      cache.get('series', '10|a', async () => Promise.reject(new Error('down'))),
    ).rejects.toThrow('down');

    expect(await cache.get('series', '10|a', async () => 5)).toBe(5);
  });

  it('holds at most its capacity, dropping the entry computed longest ago', async () => {
    const cache = new ForecastCache<string>(2);
    await cache.get('a', '1', async () => 'a');
    await cache.get('b', '1', async () => 'b');
    await cache.get('c', '1', async () => 'c');
    const again = jest.fn(async () => 'a again');

    expect(await cache.get('a', '1', again)).toBe('a again');
    expect(await cache.get('c', '1', async () => 'not computed')).toBe('c');
  });
});
