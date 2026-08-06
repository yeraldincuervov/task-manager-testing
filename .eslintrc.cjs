module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  plugins: ['jsx-a11y'],
  extends: ['plugin:jsx-a11y/recommended'],
  settings: {
    'jsx-a11y': {
      components: {
        Pressable: 'button',
        TextInput: 'input',
      },
      attributes: {
        'aria-label': ['accessibilityLabel'],
        role: ['accessibilityRole'],
      },
    },
  },
};
