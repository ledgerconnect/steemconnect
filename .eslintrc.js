module.exports = {
  "parserOptions": {
    "ecmaVersion": 7,
    "sourceType": "module",
  },
  "env": {
    "browser": true,
    "node": true,
    "jasmine": true
  },
  "extends": "airbnb",
  "parser": "babel-eslint",
  "rules": {
    "react/jsx-filename-extension": "off",
    "jsx-a11y/href-no-hash": "off",
  },
  "plugins": [
    "react",
    "jsx-a11y",
    "import",
  ]
};
