const ExtractTextPlugin = require('extract-text-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const Visualizer = require('webpack-visualizer-plugin');
const _ = require('lodash');
const path = require('path');
const webpack = require('webpack');

const DEFAULTS = {
  isDevelopment: process.env.NODE_ENV !== 'production',
  baseDir: path.join(__dirname, '..'),
};

function makePlugins(options) {
  const isDevelopment = options.isDevelopment;

  let plugins = [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        // This has effect on the react lib size
        NODE_ENV: isDevelopment ? JSON.stringify('development') : JSON.stringify('production'),
        ENABLE_LOGGER: JSON.stringify(process.env.ENABLE_LOGGER),
        SENTRY_PUBLIC_DSN: isDevelopment ? null : JSON.stringify(process.env.SENTRY_PUBLIC_DSN),
        STEEMJS_URL: JSON.stringify(process.env.STEEMJS_URL || 'wss://steemd.steemit.com'),
        IS_BROWSER: JSON.stringify(true),
      },
    }),
    new LodashModuleReplacementPlugin({ collections: true, paths: true }),
    new Visualizer({
      filename: './statistics.html',
    }),
  ];

  if (isDevelopment) {
    plugins = plugins.concat([
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
    ]);
  } else {
    plugins = plugins.concat([
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
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
        test: /\.s[ac]ss|.less$/,
        loaders: [
          'style',
          'css?sourceMap?importLoaders=1',
          'postcss-loader?browsers=last 2 version',
          'less-loader',
        ],
      },
    ];
  }

  return [
    {
      test: /\.s[ac]ss|.less$/,
      loader: ExtractTextPlugin.extract(
        'style-loader',
        'css?importLoaders=1!postcss-loader?browsers=last 2 version!sass!less'
      ),
    },
  ];
}

function makeConfig(options) {
  if (!options) options = {};
  _.defaults(options, DEFAULTS);

  const isDevelopment = options.isDevelopment;

  return {
    devtool: isDevelopment ? 'cheap-eval-source-map' : 'source-map',
    entry: (isDevelopment ? [
      'webpack-hot-middleware/client?reload=true',
    ] : []).concat([
      path.join(options.baseDir, 'src/index.js'),
    ]),
    output: {
      path: path.join(options.baseDir, '/public/js'),
      filename: 'app.min.js',
      publicPath: '/js/',
    },
    plugins: makePlugins(options),
    module: {
      loaders: [
        {
          test: /\.js?$/,
          exclude: /node_modules/,
          loader: 'babel',
        },
        {
          test: /\.json?$/,
          loader: 'json',
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
