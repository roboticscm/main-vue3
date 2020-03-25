module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true
  },
  extends: ['eslint:recommended', 'plugin:vue/essential', 'plugin:@typescript-eslint/eslint-recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018,
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: ['vue', '@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': 'warn',
    'no-unused-vars': 'warn',
    'no-console': 'warn',
    quotes: ['warn', 'single']
  }
};
