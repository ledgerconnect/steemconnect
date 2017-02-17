// Use DefinePlugin (Webpack) or loose-envify (Browserify)
// together with Uglify to strip the dev branch in prod build.
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./index.prod'); // eslint-disable-line global-require
} else {
  module.exports = require('./index.dev'); // eslint-disable-line global-require
}
