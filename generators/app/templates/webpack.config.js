'use strict';

var path = require('path');
var webpack = require('webpack');
var NODE_ENV = process.env.NODE_ENV;
var DEV_BASE_PATH = process.env.BASE_PATH;
var nodeRoot = path.join(__dirname, 'node_modules');
var appRoot = path.join(__dirname, 'app');
var config = {
  context: appRoot,
  output: {
    path: path.resolve(__dirname, '<%= uuid %>'),
    filename: '<%= appname %>.js'
  },
  resolve: {
    root: [nodeRoot],
    // npm-linked packages can locate missing dependencies in app's node_modules
    fallback: nodeRoot,
    alias: {
      'angular-material.css': nodeRoot + '/angular-material/angular-material.css',
      'angular-material-icons.css': nodeRoot + '/angular-material-icons/angular-material-icons.css',
      'angular-material-data-table.css': nodeRoot + '/angular-material-data-table/dist/md-data-table.css',
      'angular-sanji-window.css': nodeRoot + '/angular-sanji-window/dist/angular-sanji-window.css',
      'toastr.css': nodeRoot + '/toastr/build/toastr.css'
    },
    extensions: ['', '.js', '.json', 'html', 'scss', 'css']
  },
  module: {
    preLoaders: [
      {test: /\.js$/, loader: 'eslint', exclude: /(node_modules)/}
    ],
    loaders: [
      { test: /\.js$/, loader: 'babel?cacheDirectory', exclude: /(node_modules)/ },
      { test: /\.json$/, loader: 'json', exclude: /node_modules/ }
    ],
    noParse: []
  },
  plugins: [
    new webpack.NoErrorsPlugin()
  ]
};

module.exports = config;
