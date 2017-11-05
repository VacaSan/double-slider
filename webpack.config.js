const webpack = require('webpack');
const path = require('path');

const libConfig = {
  entry: './src/double-slider.js',
  output: {
    filename: 'double-slider.js',
    path: path.resolve(__dirname, './lib')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader'
      }
    ]
  }
}

const docsConfig = {
  entry: './src/index.js',
  output: {
    filename: 'double-slider.js',
    path: path.resolve(__dirname, './docs')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader'
      }
    ]
  }
}

module.exports = [
  libConfig, docsConfig
]