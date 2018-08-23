const { resolve, join } = require('path');
const webpack = require('webpack'); // eslint-disable-line
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

const mode = process.env.NODE_ENV;
const isDev = mode === 'development';

module.exports = {
  mode,
  devtool: 'source-map',
  context: resolve(__dirname, 'src'),
  entry: {
    main: ['./index.js']
  },
  output: {
    path: resolve(__dirname, './docs'),
    publicPath: '',
    filename: '[name].js'
  },
  optimization: {
    nodeEnv: mode
  },
  resolve: {
    extensions: ['.js', '.json', '.css', '.less'],
    alias: {
      Components: resolve(__dirname, 'src/components/'),
      Pages: resolve(__dirname, 'src/pages/'),
      Styles: resolve(__dirname, 'src/static/css/'),
      Config: resolve(__dirname, 'src/config.js')
    }
  },
  watch: isDev,
  watchOptions: {
    aggregateTimeout: 100,
    poll: 1000
  },
  target: 'web',
  devServer: {
    contentBase: join(__dirname, 'docs'),
    compress: true,
    historyApiFallback: true,
    port: 3000,
    open: true,
    stats: 'normal'
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /(node_modules|bower_components)/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: {
            loader: 'css-loader',
            options: {
              minimize: !isDev
            }
          }
        })
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: !isDev
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: () =>
                  autoprefixer({
                    browsers: ['last 2 versions']
                  })
              }
            },
            'less-loader'
          ]
        })
      },
      {
        test: /\.html$/,
        loader: ['raw-loader']
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('[name].css', {
      allChunks: true,
      disable: isDev
    }),
    new HtmlWebpackPlugin({
      title: 'Testing task',
      template: 'index.html',
      filename: 'index.html',
      hash: true
    }),
    new webpack.WatchIgnorePlugin([join(__dirname, 'node_modules')])
  ]
};
