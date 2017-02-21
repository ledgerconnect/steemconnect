module.exports = {
  "extends": [
    "eslint-config-kyt"
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
    "global-require": ["warn"],
    "max-len": ["warn", { "ignoreComments": true, code: 120 }],

    "react/jsx-indent": "warn",

    "import/prefer-default-export": "off",
    "object-curly-spacing": "off",
    "no-use-before-define": "off",
    "no-confusing-arrow": "off",
    "keyword-spacing": "off",
    "comment-dangle": "off",
    "block-spacing": "off",
    "arrow-parens": "off",
    "comma-dangle": "off",
    "func-names": "off",
    "no-continue": "off",
    "no-console": "off",
    "no-empty": "off",
    "curly": "off",
    "semi": "off",
  },
}
