const optional = require("optional");
const http = require('http');
const fs = require('fs');
const path = require('path').normalize;
const pg = require('pg');
const express = require('express');

const webpackMiddleware = optional("webpack-dev-middleware");
const webpackConfig = optional('./webpack.dev.config.js')
const webpack = optional('webpack');
const tilelive = optional('@mapbox/tilelive');
const mbtiles = optional('@mapbox/mbtiles');

const query = require('./modules/genericQuery').query;
const createPool = require('./modules/genericQuery').pool;

const getTrail = require('./modules/getTrail');
const getBoundary = require('./modules/getBoundary');
const getTerrain = require('./modules/getTerrain');

const app = express();
const pool = createPool();

app.get('/api/trail/:id', async function(request, response){
  const trail = await getTrail(request.params.id, pool);
  return response.json(trail);
});

app.get('/api/boundary/:id', async function(request, response){
  const boundary = await getBoundary(request.params.id, pool);
  return response.json(boundary);
});

app.get('/api/terrain/:x/:y/:zoom', async function(request, response){
  const terrain = await getTerrain(request.params, pool);
  return response.redirect(terrain.url);
});

if (process.env.NODE_ENV == 'production') {
  app.get('/dist/bundle.js', (request, response) => {
    response.redirect('https://s3-us-west-2.amazonaws.com/chrissy-gunk/bundle.js');
  });
}

if (process.env.NODE_ENV !== 'production') {
  mbtiles.registerProtocols(tilelive);

  app.use(webpackMiddleware(webpack(webpackConfig), {
    publicPath: webpackConfig.output.publicPath
  }));

  tilelive.load('mbtiles://./tiles/local.mbtiles', function(err, source) {
    if (err) throw err;
    app.get('/tiles/:z/:x/:y.*', function(request, response) {
      source.getTile(request.params.z, request.params.x, request.params.y, function(err, tile, headers) {
        response.setHeader('Content-Encoding', 'gzip');
        response.send(tile);
      });
    });
  });
}

app.use(express.static('public'));

app.listen(process.env.PORT || 5000, function () {
  console.log('listening on port 5000');
});
