const webpack = require('webpack');
const path = require('path');

const libraryName = 'double-slider';
const outputFile = libraryName + '.js';

const libConfig = {
  entry: './src/double-slider.js',
  output: {
    path: path.resolve(__dirname, './lib'),
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
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