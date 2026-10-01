# 0009. Chart.js for time-series charts

- Status: accepted
- Date: 2026-09-29

## Context

The monitoring point screen charts a quantity with one line per axis. At the default
10-minute interval, one month of one series is about 4,300 points, so a chart of three
axes draws about 13,000 points (an estimate from the interval, not a measurement).

## Decision

Chart.js through `react-chartjs-2`, with a time axis and its built-in data decimation.

## Alternatives considered

- **Recharts.** React-friendly, but it renders SVG with one element per point, which
  slows down at this volume.
- **D3.js.** Full control, at the cost of building axes, zoom and tooltips by hand.

## Consequences

- Charts render on canvas, which stays responsive at tens of thousands of points.
- Chart.js is configured imperatively through options objects rather than React
  components.
- Longer periods are condensed on the server: above the number of points a chart asks
  for, the API answers buckets of minimum and maximum instead of every reading, so the
  browser never receives the 50,000 readings a full series may hold, and peaks survive
  the condensing (API contract, "Time-series"; assumption E4).
- Chart.js, its date adapter and `date-fns` add about 224 KB to the web bundle, 72 KB
  compressed with gzip (measured with `vite build` before and after, then `gzip -c`).
