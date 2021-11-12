module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true
  },
  ignorePatterns: ['src/polyfills.ts'],
  overrides: [
    {
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:rxjs/recommended',
        'prettier'
      ],
      files: ['**/*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
        ecmaVersion: 2020,
        sourceType: 'module'
      },
      plugins: [
        '@typescript-eslint',
        '@angular-eslint',
        'rxjs',
        'rxjs-angular'
      ],
      rules: {
        ...require('./.eslint/eslint.rules'),
        ...require('./.eslint/typescript-eslint.rules'),
        ...require('./.eslint/angular-eslint.rules'),
        ...require('./.eslint/rxjs-eslint.rules'),
        ...require('./.eslint/rxjs-angular-eslint.rules')
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
        ...require('./.eslint/jest-eslint.rules')
      }
    },
    {
      files: ['*.html'],
      parser: '@angular-eslint/template-parser',
      plugins: ['@angular-eslint/template'],
      rules: {
        ...require('./.eslint/angular-template-eslint.rules')
      }
    }
  ]
};
