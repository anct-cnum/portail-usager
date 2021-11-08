module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true
  },
  ignorePatterns: ['src/**/*.html'],
  overrides: [
    {
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'prettier'
      ],
      files: ['**/*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json']
      },
      plugins: ['@typescript-eslint', 'jest'],
      rules: {
        ...require('./.eslint/eslint.rules'),
        ...require('./.eslint/typescript-eslint.rules')
      }
    },
    {
      env: {
        'jest/globals': true
      },
      extends: ['plugin:jest/recommended', 'plugin:jest/style'],
      files: ['**/*.spec.ts'],
      plugins: ['jest'],
      rules: {
        ...require('./.eslint/eslint-test.rules'),
        ...require('./.eslint/jest-eslint.rules'),
        '@typescript-eslint/explicit-function-return-type':
          'off',
        '@typescript-eslint/unbound-method': 'off',
        'jest/unbound-method': 'error',
        '@typescript-eslint/no-base-to-string': 'off',
        '@typescript-eslint/init-declaration': 'off'
      }
    }
  ]
};
