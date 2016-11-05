const  webpack = require('webpack');
const  autoprefixer = require('autoprefixer');
const  HtmlWebpackPlugin = require('html-webpack-plugin');
const  bourbon = require('node-bourbon').includePaths;
const  config = require('./webpack.config.js');

config.devtool = 'eval';
config.entry = {
  'sanji-ui': [
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://0.0.0.0:8080',
    './app.js'
  ]
};
config.module.loaders = [
  {test: /\.js$/, loader: 'ng-annotate', exclude: /(node_modules)/, enforce: 'post'},
  {test: /\.scss/, loader: 'style!css!postcss!sass?includePaths[]=' + bourbon},
  {test: /\.css$/, loader: 'style!css!postcss?browsers=last 2 versions'}
].concat(config.module.loaders);

config.plugins.push(
  new webpack.HotModuleReplacementPlugin(),
  new webpack.LoaderOptionsPlugin({
    debug: true,
    options: {
      postcss: [
        autoprefixer({ browsers: ['last 2 versions'] })
      ]
    }
  }),
  new HtmlWebpackPlugin({
    template: 'index.html',
    hash: true
  })
);

module.exports = config;
