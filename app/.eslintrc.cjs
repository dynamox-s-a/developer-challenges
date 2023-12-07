module.exports = {
  root: true,
  env: {
    'commonjs': true,
    'es6': true,
    'node': true,
    'browser': true
  },
  parserOptions: {
    'ecmaVersion': 'latest',
    'sourceType': 'module',
    'jsx': true,
    'project': ['tsconfig.json', 'tsconfig.node.json']
  },
  settings: {
    'react': {
      'version': 'detect'
    }
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:react/recommended',
    'prettier',
    'plugin:prettier/recommended'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: [
    'react-refresh',
    'react',
    '@typescript-eslint',
    'prettier',
    'import',
    'react-hooks'
  ],
  rules: {
    'react/jsx-uses-react': 'off',
    'react/jsx-filename-extension': [1, { 'extensions': ['.js', '.jsx', '.ts', '.tsx'] }],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    'react/no-array-index-key': 'off',
    'indent': [
      'error',
      2,
      {
        'SwitchCase': 1
      }
    ],
    'react/react-in-jsx-scope': 'off',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        'argsIgnorePattern': '^_'
      }
    ],
    'prettier/prettier': ['warn'],
    'spaced-comment': 'off',
    'prefer-destructuring': 'off',
    'prefer-promise-reject-errors': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-indent': ['error', 2],
    'react/jsx-indent-props': ['error', 2],
    'react/display-name': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-curly-newline': 'off',
    'react/prop-types': 'off',
    'react/jsx-wrap-multilines': 'off',
    'no-continue': 'off',
    'camelcase': 'off',
    'no-use-before-define': [
      'error',
      {
        'functions': true,
        'classes': true,
        'variables': true,
        'allowNamedExports': false
      }
    ],
    'no-case-declarations': 'off',
    'no-await-in-loop': 'off',
    'no-console': 'off',
    'no-labels': 'off',
    'no-plusplus': 'off',
    'no-unused-expressions': 'off',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': [
      'warn',
      {
        'ignoreTypeValueShadow': true
      }
    ],
    'no-restricted-syntax': 'off',
    'no-param-reassign': [
      'warn',
      {
        'props': false
      }
    ],
    'no-underscore-dangle': 'off',
    'no-noninteractive-element-to-interactive-role': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    'import/order': 'error',
    'class-methods-use-this': 'off',
    'no-useless-constructor': 'off',
    'react/require-default-props': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'consistent-return': 'off'
  },
}
