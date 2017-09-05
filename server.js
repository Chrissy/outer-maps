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
        CROSS JOIN trail
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
          SELECT ST_Area(geog) as area, id, ST_Simplify(geog::geometry, 0.05) as geom
          FROM boundaries
          WHERE id = ${request.params.id}
        ), raster AS (
          SELECT ST_Clip(ST_Union(rast), ${box}) AS rast FROM elevation
          WHERE ST_Intersects(rast, ${box})
        ), park_trails AS (
          SELECT trails.name, trails.id, trails.type, ST_Length(trails.geog) as length FROM boundary LEFT OUTER JOIN trails
          ON ST_Length(ST_Simplify(trails.geog::geometry, 1)::geography) > 1600 
          AND ST_Intersects(ST_Envelope(boundary.geom), trails.geog) 
          AND ST_Intersects(ST_Simplify(boundary.geom, 0.005), trails.geog) ORDER BY length DESC LIMIT 1000
        )
        SELECT boundary.area, boundary.id, to_json(ST_DumpValues(rast)) as dump,
        to_json(array_agg(park_trails)) as trails
        FROM boundary, raster, park_trails GROUP BY rast, area, boundary.id;
      `;
              
  query(sql, pool, ({rows: [row]}) => {
    const vertices = row.dump.valarray;
    const flatVertices = _.flatten(vertices);
    const trails = (row.trails[0].id == null) ? [] : row.trails;
            
    return response.json({
      area: parseInt(row.area),
      id: row.id,
      trailsCount: trails.length,
      trails: trails.slice(0, 8),
      trailTypes: {
        hike: trails.filter(t => t.type == "hike").length || 0,
        bike: trails.filter(t => t.type == "bike").length || 0,
        horse: trails.filter(t => t.type == "horse").length || 0,
        ohv: trails.filter(t => t.type == "atv" || t.type == "motorcycle").length || 0
      },
      trailLengths: [
        ["1-3", trails.filter(t => t.length <= 4828).length || 0],
        ["3-7", trails.filter(t => t.length > 4828 && t.length <= 11265).length || 0],
        ["7-15", trails.filter(t => t.length > 11265 && t.length <= 24140).length || 0],
        ["15-25", trails.filter(t => t.length > 24140 && t.length <= 32186).length || 0],
        ["25+", trails.filter(t => t.length >= 40233).length || 0]
      ],
      dump: {width: vertices.length, height: vertices[0].length, vertices: flatVertices},
      maxElevation: Math.max(...flatVertices)
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
