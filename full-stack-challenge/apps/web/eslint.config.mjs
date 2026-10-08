import nx from '@nx/eslint-plugin';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import baseConfig from '../../eslint.config.mjs';

export default [
  ...nx.configs['flat/react'],
  ...baseConfig,
  {
    // Nx's react preset enables only a subset of jsx-a11y rules, as warnings.
    // Accessibility is a requirement here, so the full recommended set errors.
    files: ['**/*.tsx', '**/*.jsx'],
    rules: jsxA11y.flatConfigs.recommended.rules,
  },
];
