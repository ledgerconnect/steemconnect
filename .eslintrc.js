module.exports = {
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaVersion": 7,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true,
      "experimentalObjectRestSpread": true,
    },
  },
  "extends": "airbnb",
  "rules": {
    "jsx-a11y/href-no-hash": 0,
    "max-len": ["error", 150],
    "no-func-assign": 0,
    "no-class-assign": 0,
    "no-mixed-operators": ["error", {"allowSamePrecedence": true}],
    "react/jsx-filename-extension": 0,
    "react/prefer-stateless-function": [2, { "ignorePureComponents": true }],
    "react/require-extension": "off",
    "react/sort-comp": 0,
    "react/prop-types": 0,
  },
  "plugins": [
    "react",
    "jsx-a11y",
    "import"
  ],
  "globals": {
    "document": true,
    "Headers": true,
    "localStorage": true,
    "window": true
  }
};
