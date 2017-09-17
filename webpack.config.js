const path = require('path');
const webpack = require('webpack');

const ROOT_PATH = __dirname;
const DEMO_PATH = path.resolve(ROOT_PATH, 'demo');
const DIST_PATH = path.resolve(ROOT_PATH, 'dist');

module.exports = {
  entry: {
    vuact: path.join(ROOT_PATH, 'index.js'),
    demo: path.join(DEMO_PATH, 'demo.js')
  },
  output: {
    filename: '[name].js',
    path: DIST_PATH,
    publicPath: '/'
  },
  devServer: {
    contentBase: DEMO_PATH,
  },
  module: {
    rules: [
      {
        test: /\.js$|\.jsx$/,
        use: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  }
};