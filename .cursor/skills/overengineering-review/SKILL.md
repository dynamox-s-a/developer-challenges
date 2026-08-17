---
name: overengineering-review
description: Reviews changes for complexity disproportionate to the challenge. Use during refactoring, architectural reviews, or when a solution appears larger than the problem.
paths:
  - "src/**"
  - "api/**"
  - "package.json"
  - "vite.config.ts"
---

# Overengineering review

Analyze the diff and context before reaching a conclusion. Do not treat line count as sufficient
evidence on its own.

## Look for

- abstractions with a single consumer and no meaningful isolation;
- trivial wrappers and hooks that merely rename calls;
- global state for local interaction or duplicated derived data;
- memoization, caching, throttling, or virtualization without measurements;
- generics and types more complex than the domain;
- a design system parallel to Material UI;
- dependencies for trivial problems;
- infrastructure, patterns, or layers not required by the challenge.

## Classify

- **Remove now**: increases risk or maintenance without a current benefit.
- **Simplify later**: valid concern, but does not block delivery.
- **Justified complexity**: addresses reuse, testing, an external boundary, or a real requirement.

For each finding, cite the evidence, cost, and minimum alternative. Do not propose simplification
that reduces accessibility, testing, security, or clarity. Perform a read-only review unless a fix
is explicitly requested.
