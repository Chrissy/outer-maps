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

const pool = createPool();

app.get('/api/elevation/:id/:x1/:y1/:x2/:y2', function(request, response){
  const box = `ST_MakeEnvelope(${request.params.x1}, ${request.params.y1}, ${request.params.x2}, ${request.params.y2}, 4326)`;

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
        SELECT ST_Clip(ST_Union(rast), ST_Envelope(${box})) AS rast FROM elevation
        WHERE ST_Intersects(rast, ${box}) GROUP BY path
      ), elevations as (
        SELECT
          ST_Value(rast, point) as elevation,
          ST_X(point) as x,
          ST_Y(point) as y
        FROM raster, trail
        CROSS JOIN points
      )
      SELECT to_json(ST_DumpValues(rast)) as dump,
      to_json(array_agg(elevations)) as points from trail, raster, elevations GROUP BY rast;
  `;

  query(sql, pool, ({rows}) => {
    const points = rows[0].points;
    const elevations = statUtils.rollingAverage(statUtils.glitchDetector(points.map(r => r.elevation)), 15);
    const vertices = rows[0].dump.valarray
    return response.json({
      elevations: elevations.map((r, i) => {
        return {
          elevation: r,
          coordinates: [points[i].x, points[i].y]
        };
      }),
      dump: {length: vertices.length, height: vertices[0].length, vertices: _.flatten(vertices)}
    });
  });
});

app.get('/api/boundaries/:id/:x1/:y1/:x2/:y2', function(request, response){
  const box = `ST_MakeEnvelope(${request.params.x1}, ${request.params.y1}, ${request.params.x2}, ${request.params.y2}, 4326)`;

  const sql = `
    WITH boundary AS (
        SELECT ST_Area(geog) as area, id
        FROM boundaries
        WHERE id = ${request.params.id}
      ), raster AS (
        SELECT ST_Clip(ST_Union(rast), ST_Envelope(${box})) AS rast FROM elevation
        WHERE ST_Intersects(rast, ${box})
      )
      SELECT to_json(ST_DumpValues(rast)) as dump,
      area, id from boundary, raster GROUP BY rast, area, id;
  `;

  query(sql, pool, ({rows: [row]}) => {
    const vertices = row.dump.valarray
    return response.json({
      area: parseInt(row.area),
      id: row.id,
      dump: {length: vertices.length, height: vertices[0].length, vertices: _.flatten(vertices)}
    });
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

if (process.env.NODE_ENV == 'production') {
  app.get('/dist/bundle.js', (request, response) => {
    response.redirect('https://s3-us-west-2.amazonaws.com/chrissy-gunk/bundle.js')
  })
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
