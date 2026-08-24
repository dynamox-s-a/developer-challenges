---
name: visual-validation
description: Visually validates the dashboard and records evidence. Use after changes to the interface, charts, theme, responsiveness, or visual accessibility.
paths:
  - "src/**/*.tsx"
  - "src/theme/**"
  - ".storybook/**"
  - "cypress/**"
---

# Visual validation

## Preparation

1. Reuse existing servers; if none are running, start `pnpm dev`.
2. Open `/data` and confirm that the API request completes without errors.
3. Preserve the viewport and state when comparing before and after.

## Scenarios

Validate:

- desktop, tablet, and mobile;
- loading, success, error, and empty states;
- the machine summary and all three charts;
- horizontal overflow, spacing, and resize behavior;
- synchronized tooltip and crosshair;
- visible focus and keyboard navigation;
- console and network activity without unexpected errors.

Use Storybook for isolated states and the application for integration. Do not replace Cypress tests
or update snapshots to hide regressions.

## Evidence

Capture representative screenshots with descriptive names. Report the viewport, route, state,
result, observed differences, and console or network errors. Separate objective defects from visual
preferences, and do not modify code during a validation-only request.
