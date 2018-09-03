const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  devServer: {
    contentBase: './dist'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  // Added for compression!
  optimization: {   minimizer: [ new UglifyJsPlugin() ] },
  module: { rules: [   { test: /\.js$/, use: { loader: 'babel-loader' } } ] }
};
