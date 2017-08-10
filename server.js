const http = require('http');
const fs = require('fs');
const path = require('path').normalize;
const pg = require('pg');
const express = require('express');
const _ = require('underscore');
const env = require('./environment/development');
const accessToken =  'pk.eyJ1IjoiZml2ZWZvdXJ0aHMiLCJhIjoiY2lvMXM5MG45MWFhenUybTNkYzB1bzJ0MiJ9._5Rx_YN9mGwR8dwEB9D2mg';
const statUtils = require('./modules/statUtils');
const query = require('./modules/genericQuery').query;
const createPool = require('./modules/genericQuery').pool;
const tilelive = require('tilelive');
require('mbtiles').registerProtocols(tilelive);

const app = express();

app.use(express.static('public'));

const pool = createPool();

app.get('/api/elevation/:id', function(request, response){

  const sql = `
    WITH trail AS (
        SELECT ST_SimplifyVW(geog::geometry, 0.00000001) AS path
        FROM trails
        WHERE id = ${request.params.id}
      ),
      points AS (
        SELECT (ST_DumpPoints(path)).geom AS point
        FROM trail
      ), raster AS (
        SELECT ST_Union(rast) AS rast FROM elevation
        CROSS JOIN trail
        WHERE ST_Intersects(rast, path)
      )
    SELECT
      ST_Value(rast, point) as elevation,
      ST_X(point) as x,
      ST_Y(point) as y
    FROM raster
    CROSS JOIN points
  `;

  query(sql, pool, (result) => {
    const elevations = statUtils.rollingAverage(statUtils.glitchDetector(result.rows.map(r => r.elevation)), 15);
    response.json(elevations.map((r, i) => {
      return {
        elevation: r,
        coordinates: [result.rows[i].x, result.rows[i].y]
      };
    }));
  });
});

app.get('/api/elevation-dump/:x1/:y1/:x2/:y2', function(request, response){
  const cachedPath = path(__dirname + `/public/cache/elevation/elevation-${request.params.x1}-${request.params.y1}-${request.params.x2}-${request.params.y2}.json`);

  if (fs.existsSync(cachedPath)) return response.json(JSON.parse(fs.readFileSync(cachedPath)));

  const sql = `
    select to_json(ST_DumpValues(ST_Clip(ST_Union(rast),
      ST_MakeEnvelope(${request.params.x1}, ${request.params.y1}, ${request.params.x2}, ${request.params.y2}, 4326)
    )))
    from elevation_detailed where ST_Intersects(rast,
      ST_MakeEnvelope(${request.params.x1}, ${request.params.y1}, ${request.params.x2}, ${request.params.y2}, 4326)
    );
  `;

  query(sql, pool, (result) => {
    const vertices = result.rows[0].to_json.valarray
    const json = {length: vertices.length, height: vertices[0].length, vertices: _.flatten(vertices)}
    fs.writeFileSync(cachedPath, JSON.stringify(json));
    response.json(json);
  });
});

app.get('/api/terrain/:x/:y/:zoom', function(request, response){
  const params = request.params;
  const cachedImagePath = `/cache/terrain/terrain-${params.x}-${params.y}-${params.zoom}.jpg`;
  const localImagePath = path(`${__dirname}/public/${cachedImagePath}`);

  if (fs.existsSync(localImagePath)) return response.json({url: cachedImagePath});

  http.get({
    host: 'api.mapbox.com',
    path: `/v4/mapbox.satellite/${params.x},${params.y},${params.zoom}/1024x1024.jpg70?access_token=${accessToken}`
  }, function(r){
    let body = [];
    r.on('data', (chunk) => body.push(chunk)).on('end', () => {
      fs.writeFileSync(localImagePath, Buffer.concat(body));
      response.json({url: cachedImagePath})
    })
  })
});

tilelive.load('mbtiles://./tiles/local.mbtiles', function(err, source) {
  if (err) throw err;
  app.get('/tiles/:z/:x/:y.*', function(request, response) {
    source.getTile(request.params.z, request.params.x, request.params.y, function(err, tile, headers) {
      response.setHeader('Content-Encoding', 'gzip');
      response.send(tile);
    });
  });
});

if (process.env.NODE_ENV != 'production') {
  const webpackMiddleware = require("webpack-dev-middleware");
  const webpackConfig = require('./webpack.dev.config.js')
  const webpack = require('webpack');

  app.use(webpackMiddleware(webpack(webpackConfig), {
    publicPath: webpackConfig.output.publicPath
  }));

  app.get('/dist/bundle-production.js', (request, response) => response.send(''));
}

app.listen(5000, function () {
  console.log('listening on port 5000');
});
