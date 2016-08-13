'use strict';

var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var bourbon = require('node-bourbon').includePaths;
var config = require('./webpack.config.js');

config.devtool = 'source-map';
config.entry = {
  'sanji-ui': './component/index.js'
};
config.output.filename = '<%= appname %>.js';

config.module.postLoaders = [
  {test: /\.js$/, loader: 'ng-annotate', exclude: /(node_modules)/}
];
config.postcss = [ autoprefixer({ browsers: ['last 2 versions'] }) ];

config.plugins.push(
  new webpack.optimize.DedupePlugin(),
  new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false,
    quiet: true
  }),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      screw_ie8: true,
      warnings: false,
      dead_code: true
    }
  })
);
module.exports = config;