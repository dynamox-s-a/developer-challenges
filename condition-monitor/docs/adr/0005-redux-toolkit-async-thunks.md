# 0005. Redux Toolkit with createAsyncThunk

- Status: accepted
- Date: 2026-09-29

## Context

The challenge requires Redux for global state and either Redux Thunks or Redux Saga
for asynchronous side effects.

## Decision

Redux Toolkit, one slice per domain area (session, sectors, machines, monitoring
points, time-series, import), with every API call written as a `createAsyncThunk`.

## Alternatives considered

- **RTK Query.** Less code and built-in caching, and it uses thunks internally, but it
  hides them. The requirement asks for thunks, and explicit thunks make it visible.
- **Redux Saga.** Meets the requirement with generators and more code for the same
  request and response flows.

## Consequences

- Loading, success and error states are handled by hand in each slice, which is more
  code than RTK Query but keeps every step readable and testable.
- Cache invalidation, such as refreshing the list after a machine is edited, is
  explicit in the thunks rather than declared by tags.
