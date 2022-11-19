/* eslint-disable import/no-extraneous-dependencies */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const path = require('path');

module.exports = {
  entry: {
    main: path.resolve(__dirname, 'src', 'scripts', 'main.js'),
    'content-script': path.resolve(__dirname, 'src', 'scripts', 'content-script.js'),
  },
  resolve: {
    extensions: ['.js'],
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
  },
  experiments: {
    topLevelAwait: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/popup.html',
      filename: 'popup.html',
      chunks: ['main'],
      cache: true,
    }),
    new CopyPlugin({
      patterns: [
        { from: path.resolve(__dirname, 'manifest.json'), to: path.resolve(__dirname, 'dist') },
        {
          from: path.resolve(__dirname, 'src', 'icons'),
          to: path.resolve(__dirname, 'dist', 'icons'),
        },
      ],
    }),
    new CleanWebpackPlugin(),
  ],
};
