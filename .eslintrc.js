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
    "camelcase": "off", //steem api includes underscore format
    "jsx-a11y/href-no-hash": "warn",
    "jsx-a11y/no-static-element-interactions": "warn",
  },
  "plugins": [
    "react",
    "jsx-a11y",
    "import",
  ]
};
