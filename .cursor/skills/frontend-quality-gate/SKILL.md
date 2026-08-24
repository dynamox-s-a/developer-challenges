---
name: frontend-quality-gate
description: Runs and consolidates all front-end validations. Use when finalizing a delivery, preparing a review, or confirming that the branch is ready for a PR.
---

# Front-end quality gate

## Execution

Run the following commands from the repository root, in order:

1. `pnpm format:check`
2. `pnpm lint`
3. `pnpm exec tsc -b`
4. `pnpm typecheck:e2e`
5. `pnpm test:coverage`
6. `pnpm build`
7. `pnpm build-storybook`
8. `pnpm e2e:ci`

Run `pnpm install --frozen-lockfile` first when dependencies are missing or the lockfile has changed.

## Rules

- Stop at the first failure that invalidates subsequent steps.
- Preserve enough logs to identify the command, file, and cause.
- Do not disable tests, lint, or TypeScript to obtain a passing result.
- Do not modify code during a validation-only request.
- If e2e depends on a missing local binary, run `pnpm exec cypress install` and retry once.
- Distinguish among a project failure, a local limitation, and a step that was not run.

## Report

List each step as passed, failed, or not run. Include duration when useful, the root cause of
failures, and the smallest next step. Declare the quality gate green only when every step passes.
