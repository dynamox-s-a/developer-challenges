import { render, screen, within } from '@testing-library/react';
import { formatDateTime } from '../utils/format';
import { MetricsCards } from './MetricsCards';

const metrics = {
  count: 1288,
  min: -1.5,
  max: 12.3456,
  avg: 4.2,
  firstTimestamp: '2026-10-01T12:00:00.000Z',
  lastTimestamp: '2026-10-02T12:00:00.000Z',
};

/** Pairs each dt with the dd that follows it. */
function readTiles() {
  const list = screen.getByLabelText('Series metrics');
  const terms = within(list).getAllByRole('term');
  return Object.fromEntries(
    terms.map((term) => [
      term.textContent,
      term.nextElementSibling?.textContent,
    ]),
  );
}

describe('MetricsCards', () => {
  it('shows every aggregate with its label', () => {
    render(<MetricsCards metrics={metrics} />);
    expect(readTiles()).toEqual({
      Readings: (1288).toLocaleString(),
      Minimum: (-1.5).toLocaleString(),
      Maximum: (12.346).toLocaleString(),
      Average: (4.2).toLocaleString(),
      'First reading': formatDateTime(metrics.firstTimestamp),
      'Last reading': formatDateTime(metrics.lastTimestamp),
    });
  });

  it('says "No data" instead of inventing zeros for an empty series', () => {
    render(
      <MetricsCards
        metrics={{
          count: 0,
          min: null,
          max: null,
          avg: null,
          firstTimestamp: null,
          lastTimestamp: null,
        }}
      />,
    );
    const tiles = readTiles();
    expect(tiles['Readings']).toBe('0');
    expect(tiles['Average']).toBe('No data');
    expect(tiles['Last reading']).toBe('No data');
  });

  it('marks itself busy while new values load', () => {
    render(<MetricsCards metrics={metrics} loading />);
    expect(
      screen.getByLabelText('Series metrics').getAttribute('aria-busy'),
    ).toBe('true');
  });
});
