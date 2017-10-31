const webpack = require('webpack');
const path = require('path');

const libConfig = {
  entry: './src/range.js',
  output: {
    filename: 'range.js',
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
    filename: 'range.js',
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