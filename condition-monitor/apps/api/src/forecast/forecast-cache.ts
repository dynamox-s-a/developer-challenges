/**
 * Keeps the last forecast of each series for as long as its data stays the same.
 *
 * A forecast depends only on the readings of its series, and computing it costs a query
 * over a month of readings and a fit on the thread that serves every request
 * (docs/performance.md). The signature says whether the data changed: the caller builds
 * it from the count of readings and the instant of the latest one, so any reading added
 * or removed gives another signature and the forecast is computed again.
 *
 * The cache lives in the memory of one process. Another process computes its own copy
 * from the same data and reaches the same forecast, so nothing has to be shared.
 */
export class ForecastCache<T> {
  private readonly entries = new Map<string, { signature: string; value: Promise<T> }>();

  constructor(private readonly capacity = 1_000) {}

  /**
   * The value kept for the key while the signature matches, otherwise the one `compute`
   * gives, kept from then on. Requests arriving while it is being computed wait for the
   * same computation instead of starting another.
   */
  get(key: string, signature: string, compute: () => Promise<T>): Promise<T> {
    const kept = this.entries.get(key);
    if (kept?.signature === signature) return kept.value;

    const value = compute();
    // Deleting first moves the key to the end: the map then drops the least recently
    // computed entry when it is full.
    this.entries.delete(key);
    this.entries.set(key, { signature, value });
    if (this.entries.size > this.capacity) {
      this.entries.delete(this.entries.keys().next().value as string);
    }
    // A failure is not an answer to keep: the next request tries again.
    value.catch(() => {
      if (this.entries.get(key)?.value === value) this.entries.delete(key);
    });
    return value;
  }
}
