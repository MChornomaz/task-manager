module.exports = {
  root: true,
  env: {
    browser: true,
  },
  extends: [
    'react-app',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
};
