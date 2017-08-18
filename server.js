const optional = require("optional");
const http = require('http');
const fs = require('fs');
const path = require('path').normalize;
const pg = require('pg');
const express = require('express');
const _ = require('underscore');
const accessToken =  'pk.eyJ1IjoiZml2ZWZvdXJ0aHMiLCJhIjoiY2lvMXM5MG45MWFhenUybTNkYzB1bzJ0MiJ9._5Rx_YN9mGwR8dwEB9D2mg';
const statUtils = require('./modules/statUtils');
const query = require('./modules/genericQuery').query;
const createPool = require('./modules/genericQuery').pool;
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const webpackMiddleware = optional("webpack-dev-middleware");
const webpackConfig = optional('./webpack.dev.config.js')
const webpack = optional('webpack');
const tilelive = optional('@mapbox/tilelive');
const mbtiles = optional('@mapbox/mbtiles');

const app = express();

if (!process.env.NPM_CONFIG_PRODUCTION) {
  const env = optional('./environment/development');
  process.env = {...process.env, ...env};
}

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
  const cachedImageKey = `terrain-${params.x}-${params.y}-${params.zoom}.jpg`;
  const cachedImagePath = `https://s3-us-west-2.amazonaws.com/chrissy-gunk/${cachedImageKey}`;

  s3.headObject({Bucket: 'chrissy-gunk', Key: cachedImageKey}, (err, metadata) => {
    if (err && err.code == 'NotFound') {
      http.get({
        host: 'api.mapbox.com',
        path: `/v4/mapbox.satellite/${params.x},${params.y},${params.zoom}/1024x1024.jpg70?access_token=${accessToken}`
      }, function(r){
        let body = [];
        r.on('data', (chunk) => body.push(chunk)).on('end', () => {
          s3.putObject({Bucket: 'chrissy-gunk', Key: cachedImageKey, Body: Buffer.concat(body), ACL:'public-read'}, function(err, data) {
            response.json({url: cachedImagePath})
          });
        });
      });
    } else {
      response.json({url: cachedImagePath})
    }
  })
});

if (!process.env.NPM_CONFIG_PRODUCTION) {
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

app.listen(5000, function () {
  console.log('listening on port 5000');
});
