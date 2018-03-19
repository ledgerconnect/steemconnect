const ExtractTextPlugin = require('extract-text-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const Visualizer = require('webpack-visualizer-plugin');
const defaults = require('lodash/defaults');
const path = require('path');
const webpack = require('webpack');
const availableLocales = require('../helpers/locales.json');

const localeRegex = new RegExp(Object.keys(availableLocales).join('|'));

const DEFAULTS = {
  isDevelopment: process.env.NODE_ENV !== 'production',
  baseDir: path.join(__dirname, '..'),
};

function makePlugins(options) {
  const isDevelopment = options.isDevelopment;

  let plugins = [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        // This has effect on the react lib size
        NODE_ENV: isDevelopment ? JSON.stringify('development') : JSON.stringify('production'),
        ENABLE_LOGGER: JSON.stringify(process.env.ENABLE_LOGGER),
        SENTRY_PUBLIC_DSN: isDevelopment ? null : JSON.stringify(process.env.SENTRY_PUBLIC_DSN),
        STEEMJS_URL: JSON.stringify(process.env.STEEMJS_URL || 'https://api.steemit.com'),
        IS_BROWSER: JSON.stringify(true),
      },
    }),
    new LodashModuleReplacementPlugin({ collections: true, paths: true }),
    new webpack.ContextReplacementPlugin(
      /react-intl[/\\]locale-data$/,
      localeRegex,
    ),
    new Visualizer({
      filename: './statistics.html',
    }),
  ];

  if (isDevelopment) {
    plugins = plugins.concat([
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
    ]);
  } else {
    plugins = plugins.concat([
      new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        minimize: true,
        compress: {
          warnings: false,
        },
      }),
      new webpack.optimize.AggressiveMergingPlugin(),
      new ExtractTextPlugin('../css/base.css'),
    ]);
  }

  return plugins;
}

function makeStyleLoaders(options) {
  if (options.isDevelopment) {
    return [
      {
        test: /\.less$/,
        loaders: [
          'style-loader',
          'css-loader?sourceMap?importLoaders=1',
          'postcss-loader?browsers=last 2 version',
          'less-loader',
        ],
      },
    ];
  }

  return [
    {
      test: /\.less$/,
      loader: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'css-loader?importLoaders=1!postcss-loader?browsers=last 2 version!less-loader',
      }),
    },
  ];
}

function makeConfig(options) {
  // eslint-disable-next-line no-param-reassign
  if (!options) options = {};
  defaults(options, DEFAULTS);

  const isDevelopment = options.isDevelopment;

  return {
    devtool: isDevelopment ? 'cheap-eval-source-map' : 'source-map',
    entry: (isDevelopment ? [
      'webpack-hot-middleware/client?reload=true',
      path.join(options.baseDir, 'node_modules/es6-shim/es6-shim.js'),
      path.join(options.baseDir, 'node_modules/intl/dist/Intl.js'),
    ] : [
      path.join(options.baseDir, 'node_modules/es6-shim/es6-shim.js'),
      path.join(options.baseDir, 'node_modules/intl/dist/Intl.js'),
    ]).concat([
      path.join(options.baseDir, 'src/index.js'),
    ]),
    output: {
      path: path.join(options.baseDir, '/public/js'),
      filename: 'app.min.js',
      publicPath: '/js/',
    },
    plugins: makePlugins(options),
    module: {
      rules: [
        {
          test: /\.js?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          test: /\.json?$/,
          loader: 'json-loader',
        },
        {
          loader: 'file-loader?name=[name].[hash].[ext]&limit=1',
          test: /\.(eot|ttf|woff|woff2)(\?.+)?$/,
        },
      ].concat(makeStyleLoaders(options)),
    },
  };
}

if (!module.parent) {
  console.log(makeConfig({
    isDevelopment: process.env.NODE_ENV !== 'production',
  }));
}

exports = module.exports = makeConfig;
exports.DEFAULTS = DEFAULTS;
