module.exports = {
  "extends": [
    // "eslint-config-kyt"
  ],
  "parserOptions": {
    "ecmaVersion": 7,
    "sourceType": "module"
  },
  "env": {
    "browser": true,
    "node": true,
    "es6": true,
  },
  "plugins": [
  ],
  "rules": {
    "no-undef": ["error"],
    "no-const-assign": ["error"],
    "no-this-before-super": ["error"],
    "use-isnan": ["error"],
    "no-redeclare": ["error"], // A const could redeclare an import

    "prefer-const": ["warn"],
    "no-var": ["warn"],
    "no-unused-vars": ["warn"],
    "no-unreachable": ["warn"],
    "no-shadow": ["warn"],
    "no-constant-condition": ["warn"],
  },
}
