import globals from 'globals';

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      ecmaVersion: 2022,
      globals: {
        ...globals.node,
        ...globals.jest,
        process: true
      }
    },
    rules: {
      // Error Prevention
      'no-undef': 'error',
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ],
      'no-var': 'error',
      'prefer-const': 'error',

      // Style & Formatting
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      indent: ['error', 2],
      'comma-dangle': ['error', 'never'],
      'no-multiple-empty-lines': ['error', { max: 1 }],
      eqeqeq: ['error', 'always'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'comma-spacing': ['error', { before: false, after: true }],
      'key-spacing': ['error', { beforeColon: false, afterColon: true }],

      // Best Practices
      //'no-console': ['warn', { allow: ['error', 'warn'] }],
      'no-duplicate-imports': 'error',
      'no-template-curly-in-string': 'error',
      'require-await': 'error',
      'no-return-await': 'error',

      // Node.js
      'handle-callback-err': 'error'
    }
  }
];
