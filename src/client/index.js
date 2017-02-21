process.env.BROWSER = true

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./index.prod'); // eslint-disable-line global-require
} else {
  module.exports = require('./index.dev'); // eslint-disable-line global-require
}
