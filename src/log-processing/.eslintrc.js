module.exports = {
  env: {
    browser: false,
    es6: true
  },
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint'
  ],
  rules: {
    // "object-curly-newline": ["error", "always"],
    'max-len': ['error', { code: 120, tabWidth: 2 }],
    indent: ['error', 2],
    'import/no-unresolved': 0,
    'import/extensions': ['error', 'never'],
    'implicit-arrow-linebreak': ['error', 'below'],
    '@typescript-eslint/member-delimiter-style': ['error', {
      multiline: {
        delimiter: 'none',
        requireLast: false
      }
    }],
    '@typescript-eslint/camelcase': 0,
    'class-methods-use-this': 0,
    semi: ['error', 'never'],
    'comma-dangle': ['error', 'never'],
    quotes: [2, 'single', 'avoid-escape']
  }
}
