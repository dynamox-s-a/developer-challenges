// DOM matchers such as toBeInTheDocument, for every test file.
import '@testing-library/jest-dom/vitest';
import { configure } from '@testing-library/react';

// A screen may take longer than the default 1 s to appear when the machine is busy, as on
// a CI runner building other projects at the same time. 5 s absorbs that without hiding
// a screen that never appears.
configure({ asyncUtilTimeout: 5000 });
