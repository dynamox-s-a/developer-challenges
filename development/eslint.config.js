const nx = require('@nx/eslint-plugin');
const eslintConfigPrettier = require('eslint-config-prettier/flat');

module.exports = [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?js$'],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {
      'no-console': 'warn',
      'no-inline-comments': 'warn',
      'no-warning-comments': 'warn',
      complexity: 'warn',
      indent: 'warn',
      'max-len': 'warn',
    },
  },
  eslintConfigPrettier,
];
