const tsEslint = require('@typescript-eslint/eslint-plugin');
const cypress = require('eslint-plugin-cypress');

module.exports = [
  {
    files: ['cypress/**/*.ts'],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './cypress/tsconfig.json'
      }
    },
    plugins: {
      '@typescript-eslint': tsEslint,
      'cypress': cypress
    },
    rules: {
      ...tsEslint.configs.recommended.rules,
      ...cypress.configs.recommended.rules,
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error'],
      'no-console': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'cypress/no-unnecessary-waiting': 'warn',
      '@typescript-eslint/no-explicit-any': ['warn'],
      '@typescript-eslint/no-namespace': 'warn'
    }
  }
];