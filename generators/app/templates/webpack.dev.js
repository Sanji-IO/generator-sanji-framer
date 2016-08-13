'use strict';

var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var bourbon = require('node-bourbon').includePaths;
var config = require('./webpack.config.js');

config.ip = 'localhost';
config.port = 8080;
config.debug = true;
config.devtool = 'eval';
config.entry = {
  'sanji-ui': [
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://' + config.ip + ':' + config.port,
    './app.js'
  ]
};
config.module.loaders = [
  {test: /\.scss/, loader: 'style!css!postcss!sass?includePaths[]=' + bourbon},
  {test: /\.css$/, loader: 'style!css!postcss?browsers=last 2 versions'}
].concat(config.module.loaders);

config.module.postLoaders = [
  {test: /\.js$/, loader: 'ng-annotate', exclude: /(node_modules)/}
];
config.postcss = [ autoprefixer({ browsers: ['last 2 versions'] }) ];

config.plugins.push(
  new webpack.HotModuleReplacementPlugin(),
  new HtmlWebpackPlugin({
    template: 'index.html',
    hash: true
  })
);

module.exports = config;