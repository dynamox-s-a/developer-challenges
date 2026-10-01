# 0004. Material UI pinned to version 5

- Status: accepted
- Date: 2026-09-29

## Context

The challenge makes Material UI 5 mandatory. Newer major versions of Material UI have
since been released, and a routine dependency update would move to them.

## Decision

`@mui/material` and its companion packages are pinned to major version 5 in
`package.json`, and the layout is responsive through Material UI's breakpoints.

## Alternatives considered

- **Latest Material UI.** It would not meet an explicit requirement of the challenge.

## Consequences

- Dependency updates must stay within version 5; this record explains why, so the pin
  is not taken for neglect.
- Some examples in current Material UI documentation target newer versions and do not
  apply as written.
