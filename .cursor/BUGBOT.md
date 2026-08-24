# Review criteria

Prioritize actionable bugs introduced by the diff. Each finding MUST state the severity, file,
evidence, observable impact, and minimum fix.

## Check for

- regressions in `/data` requirements, states, or routing;
- missing or duplicate requests, especially under React StrictMode;
- listeners, timers, and references without cleanup;
- timestamp handling or formatting that changes timezone or series association;
- inconsistencies among the API contract, mapper, selectors, and charts;
- unsafe HTML, credentials, tokens, or sensitive data;
- broken semantics, keyboard support, focus, contrast, or accessible names;
- inconsistent overflow, resize behavior, or interaction across breakpoints;
- a failure without a regression test or a critical scenario without coverage;
- abstractions and dependencies whose cost exceeds the problem they solve;
- changes that bypass CI, lint, TypeScript, or tests.

## Avoid

- style-only comments already covered by Biome;
- preferences without functional impact or a documented standard;
- requiring production architecture beyond the challenge scope;
- repeating the same issue across multiple files without identifying the common cause;
- claiming an error without a reproducible path or evidence in the diff.

Classify a finding as blocking only when there is a concrete risk to functionality, security,
accessibility, data, or deployment.
