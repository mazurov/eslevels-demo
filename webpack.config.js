var path = require('path');
var webpack = require('webpack');

var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: './src/scripts/app.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'scripts/bundle.js'
  },
  devtool: 'inline-source-map',
  module: {
    loaders: [
      { test: /\.json$/, loader: "json" },
      { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },
      { test: /\.css$/, loader: ExtractTextPlugin.extract("css-loader")},
      {
        test: path.join(__dirname, 'src/scripts'),
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
        new ExtractTextPlugin("styles/[name].css", { allChunks: true}),
        new webpack.optimize.UglifyJsPlugin({minimize: true})
    ]
};
