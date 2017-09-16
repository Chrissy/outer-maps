const path = require('path');
const production = require('./webpack.production.config.js');

module.exports = Object.assign({}, production, {
  output: {
    path: '/',
    publicPath: 'http://localhost/dist/',
    filename: '[name].js'
  }
});
