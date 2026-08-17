# ADR 0003 — Use Highcharts for synchronized time series

## Status

Accepted.

## Context

The dashboard must display seven series grouped into three metrics and synchronize the tooltip and
crosshair across charts at the equivalent instant. The library must support time series, axes,
multiple series, and an API for coordinated interaction.

## Decision

Use Highcharts with `highcharts-react-official`.

Options are generated from the internal model. Synchronization uses a local adapter over the
library's imperative API, allowing point lookup and coordination to be tested without coupling all
logic to concrete Highcharts types.

Instances, tooltip, and crosshair remain in refs and are updated directly, outside Redux.

## Alternatives considered

### Recharts

It offers declarative React integration, but would require building more of the synchronization and
shared tooltip behavior.

### Chart.js

It supports time-series charts, but integration across multiple instances would also require
specific plugins and adapters.

### D3

It provides complete control, but would significantly increase implementation, accessibility,
maintenance, and testing effort for a time-constrained challenge.

## Consequences

Positive:

- mature support for time series and multiple axes;
- tooltip, pointer, and crosshair API suited to the requirement;
- an official example close to the requested behavior;
- imperative updates without a React render on every `mousemove`;
- isolated, testable synchronization logic.

Negative:

- a significant bundle dependency;
- imperative APIs require careful cleanup;
- JSDOM does not reproduce SVG layout, shifting part of the validation to Cypress;
- version changes may require reviewing the adapter and options.
