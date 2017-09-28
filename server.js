const optional = require("optional");
const http = require('http');
const fs = require('fs');
const path = require('path').normalize;
const pg = require('pg');
const express = require('express');
const _ = require('underscore');
const accessToken =  'pk.eyJ1IjoiZml2ZWZvdXJ0aHMiLCJhIjoiY2lvMXM5MG45MWFhenUybTNkYzB1bzJ0MiJ9._5Rx_YN9mGwR8dwEB9D2mg';
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const terrain = require('./modules/terrain');
const statUtils = require('./modules/statUtils');
const query = require('./modules/genericQuery').query;
const createPool = require('./modules/genericQuery').pool;
const uploadImageToS3 = require('./modules/uploadImageToS3').upload;

const webpackMiddleware = optional("webpack-dev-middleware");
const webpackConfig = optional('./webpack.dev.config.js')
const webpack = optional('webpack');
const tilelive = optional('@mapbox/tilelive');
const mbtiles = optional('@mapbox/mbtiles');

const app = express();

const pool = createPool();

app.get('/api/trail/:id', function(request, response){

  const sql = `
    WITH trail AS (
        SELECT geog::geometry AS path
        FROM trails
        WHERE id = ${request.params.id}
      ),
      points AS (
        SELECT (ST_DumpPoints(path)).geom AS point
        FROM trail
      ), raster AS (
        SELECT ST_Resize(ST_Union(rast), 200, 200) AS rast FROM elevation
        CROSS JOIN trail
        WHERE ST_Intersects(rast, ST_Envelope(path)) GROUP BY path
      ), elevations as (
        SELECT
          ST_Value(rast, point) as elevation,
          ST_X(point) as x,
          ST_Y(point) as y
        FROM raster, trail
        CROSS JOIN points
      )
      SELECT to_json(array_agg(elevations)) as points from trail, raster, elevations GROUP BY rast;
  `;

  query(sql, pool, ({rows}) => {
    const points = rows[0].points;
    const elevations = statUtils.rollingAverage(statUtils.glitchDetector(points.map(r => r.elevation)), 50);
    return response.json({
      points: elevations.map((r, i) => {
        return {
          elevation: r,
          coordinates: [points[i].x, points[i].y]
        };
      })
    });
  });
});

app.get('/api/boundary/:id', function(request, response){

  const sql = `
      WITH boundary AS (
          SELECT ST_Area(geog) as area, id, ST_Simplify(geog::geometry, 0.05) as geom
          FROM boundaries
          WHERE id = ${request.params.id}
        ), raster AS (
          SELECT ST_Resize(ST_Clip(ST_Union(rast), ST_Envelope(geom)), 100, 100) AS rast FROM elevation, boundary
          WHERE ST_Intersects(rast, ST_Envelope(geom)) GROUP BY geom
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
      highPoint: Math.max(...flatVertices),
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
    });
  });
});

app.get('/api/terrain/:x/:y/:zoom', function(request, response){
  const {x, y, zoom} = request.params;
  const key = `terrain-${x}-${y}-${zoom}.jpg`;
  const cachedImagePath = `https://s3-us-west-2.amazonaws.com/chrissy-gunk/${key}`;
  const url = `https://api.mapbox.com/v4/mapbox.satellite/${x},${y},${zoom}/1024x1024.jpg70?access_token=${accessToken}`;

  s3.headObject({Bucket: 'chrissy-gunk', Key: key}, (err, metadata) => {
    if (metadata) {
      response.redirect(cachedImagePath);
    } else {
      response.redirect(url);
      uploadImageToS3({url, key, quality: 30})
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
