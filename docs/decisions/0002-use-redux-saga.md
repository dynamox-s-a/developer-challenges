# ADR 0002 — Use Redux Saga for asynchronous effects

## Status

Accepted.

## Context

Redux and Redux Saga are explicit challenge requirements. Loading must represent loading, success,
error, and retry states without mixing HTTP access with presentation components.

## Decision

Centralize loading in `measurementsSaga`.

`DataPage` dispatches `measurementsRequested`; the saga uses `takeLatest`, calls
`measurementsService.getAll`, applies `mapMeasurements`, and publishes success or failure. The slice
keeps only serializable state, and selectors derive series by metric.

## Alternatives considered

### Direct request in the component

This would be smaller, but would violate the required separation, duplicate asynchronous handling,
and make effect testing harder.

### `createAsyncThunk`

It is suitable for simple flows, but does not satisfy the explicit Redux Saga requirement.

### Store all interaction in Redux

Tooltip, crosshair, and chart instances are not business state. Putting them in the store would
cause high-frequency updates and add non-serializable values.

## Consequences

Positive:

- isolated, testable effects;
- components focused on dispatch and rendering;
- explicit state transitions;
- `takeLatest` prevents publishing a stale response after a new retry;
- the mapper remains at the domain boundary.

Negative:

- adds concepts and a dependency for a single flow;
- requires generator-specific tests;
- requires discipline to avoid moving local or imperative state into Redux.
