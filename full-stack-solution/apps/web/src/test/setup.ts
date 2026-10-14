import "@testing-library/jest-dom/vitest";

/** Size the stub reports, so charts have a box to lay out in. */
const OBSERVED_WIDTH = 800;
const OBSERVED_HEIGHT = 320;

/**
 * jsdom implements neither `ResizeObserver` nor layout, so Recharts'
 * `ResponsiveContainer` measures its parent as 0 x 0 and renders nothing.
 *
 * The stub reports a fixed box instead, which is enough for the chart to
 * produce its axes, legend and path. Geometry assertions stay relative (a gap
 * being larger than another), never absolute pixel values — those would only
 * be asserting this constant back.
 */
class ResizeObserverStub implements ResizeObserver {
  constructor(private readonly callback: ResizeObserverCallback) {}

  observe(target: Element): void {
    const contentRect = {
      width: OBSERVED_WIDTH,
      height: OBSERVED_HEIGHT,
      top: 0,
      left: 0,
      right: OBSERVED_WIDTH,
      bottom: OBSERVED_HEIGHT,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRectReadOnly;

    this.callback(
      [{ target, contentRect } as unknown as ResizeObserverEntry],
      this,
    );
  }

  unobserve(): void {
    return undefined;
  }

  disconnect(): void {
    return undefined;
  }
}

globalThis.ResizeObserver ??= ResizeObserverStub;
