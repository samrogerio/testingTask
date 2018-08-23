const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const common = require('./webpack.config.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: false,
  stats: {
    colors: false,
    hash: true,
    timings: true,
    assets: true,
    chunks: true,
    chunkModules: true,
    modules: true,
    children: true
  },
  optimization: {
    minimize: true,
    minimizer: [
      new UglifyJSPlugin({
        sourceMap: true,
        uglifyOptions: {
          cache: true,
          parallel: true,
          mangle: {
            keep_fnames: true
          },
          output: {
            comments: false,
            beautify: false
          },
          compress: {
            inline: false,
            if_return: true,
            dead_code: true,
            drop_console: true,
            conditionals: true,
            join_vars: true,
            loops: true,
            unused: true,
            sequences: true,
            booleans: true
          }
        }
      })
    ]
  },
  plugins: [
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        'process.env.NODE_ENV': JSON.stringify('production')
      }
    })
  ]
});
