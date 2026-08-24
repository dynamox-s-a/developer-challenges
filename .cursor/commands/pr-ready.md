Prepare the current changes for review without creating a commit, push, or pull request.

Compare against `origin/leonardo-jacomussi` to capture everything that will be sent to the remote.

1. Review the entire branch diff, including staged, unstaged, and untracked files.
2. Identify bugs, regressions, out-of-scope changes, and missing tests.
3. Check for credentials, `.env`, `.vercel`, generated artifacts, and accidentally included
   personal files.
4. Run validations proportional to the risk; for a final delivery, use the
   `frontend-quality-gate` skill.
5. Confirm consistency among `README.md`, the blueprint, roadmap, architecture, tests, ADRs, and
   contribution guidelines.
6. Report any blocker without silently bypassing it.

At the end, provide:

- a summary of the changes;
- risks and pending items;
- validations run and their results;
- a test plan for the PR;
- suggested semantic commits grouped by scope.
