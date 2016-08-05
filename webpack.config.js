var path = require('path');

var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: './app/scripts/app.js',
  output: {
    path: path.join(__dirname, 'app'),
    filename: 'bundle.js'
  },
  devtool: 'inline-source-map',
  module: {
    loaders: [
      { test: /\.json$/, loader: "json" },
      { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },
      { test: /\.css$/, loader: ExtractTextPlugin.extract("css-loader")},
      {
        test: path.join(__dirname, 'app/scripts'),
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
        new ExtractTextPlugin("[name].css")
    ]
};
