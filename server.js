const http = require('http');
const fs = require('fs');
const path = require('path').normalize;
const pg = require('pg');
const bezier = require ('@turf/bezier');
const lineDistance = require('@turf/line-distance');
const helpers = require('@turf/helpers');
const express = require('express');
const browserify = require('browserify-middleware');
const app = express();
const _ = require('underscore');
const env = require('./environment/development');
const accessToken =  'pk.eyJ1IjoiZml2ZWZvdXJ0aHMiLCJhIjoiY2lvMXM5MG45MWFhenUybTNkYzB1bzJ0MiJ9._5Rx_YN9mGwR8dwEB9D2mg';
const statUtils = require('./modules/statUtils');
const gQuery = require('./modules/genericQuery');

app.use(express.static('public'));

app.get('/bundle.js', browserify(__dirname + '/components/app.js', {
  mode: (process.env.NODE_ENV == 'production') ? 'production' : 'development',
  transform: ['babelify'],
  plugins: [{
    plugin: 'css-modulesify',
    options: { output: './public/bundle.css'}
  }]
}));

const pool = gQuery.pool();

app.get('/api/trails/:x1/:y1/:x2/:y2', function(request, response) {
  const query = `
    SELECT
      name, id, type, ST_SimplifyVW(geog::geometry, 0.0000005) as geom
    FROM trails
    WHERE ST_Intersects(geog,
      ST_MakeEnvelope(${request.params.x1}, ${request.params.y1}, ${request.params.x2}, ${request.params.y2})
    )
    AND type != 'road' AND name != ''
  `;

  gQuery.query(query, pool, (result) => {
    gQuery.geoJson(result, (result) => response.json(result));
  });
});

app.get('/api/trail-paths-for-labels/:x1/:y1/:x2/:y2/:threshold/:minlength', function(request, response) {
  let query = `
    SELECT name, id, type,
      ST_AsGeoJson(ST_SimplifyVW(geog::geometry, ${(request.params.threshold / 100 ) * 0.00005})) as geog
    FROM trails
    WHERE ST_Intersects(geog,
      ST_MakeEnvelope(${request.params.x1}, ${request.params.y1}, ${request.params.x2}, ${request.params.y2})
    ) AND (type = 'hike' OR type = 'bike') AND name != 'trail' AND name != 'Trail' AND name != 'TRAIL';
  `

  gQuery.query(query, pool, (result) => {
    const labelPaths = result.rows.reduce((a, r) => {
      const multiLineString = geomToLabelMultiLineString(JSON.parse(r.geog));

      return [...a, Object.assign({}, multiLineString, {
        "properties": {
          "name": r.name,
          "id": r.id,
          "type": r.type,
        }
      })];
    }, []);

    response.json(helpers.featureCollection(labelPaths));
  });
});

app.get('/api/boundaries/:x1/:y1/:x2/:y2', function(request, response) {
  let query = `
    SELECT name, id, ST_Simplify(geog::geometry, 0.0003) as geom
    FROM boundaries
    WHERE ST_Intersects(geog,
      ST_MakeEnvelope(${request.params.x1}, ${request.params.y1}, ${request.params.x2}, ${request.params.y2})
    )
  `

  gQuery.query(query, pool, (result) => {
    gQuery.geoJson(result, (result) => response.json(result));
  });
});

app.get('/api/elevation', function(request, response){
  const points = JSON.parse(request.query.points);
  const pointsStr = points.reduce((a, p, i) =>  a + `${(i == 0) ? '' : ','}ST_MakePoint(${p[0]},${p[1]})`, '');

  const query = `
    WITH trail AS (
        SELECT ST_SetSRID(ST_MakeLine(ARRAY[${pointsStr}]), 4326) AS path
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
      ST_Value(rast, point) as elevation
    FROM raster
    CROSS JOIN points
  `;

  query(query, pool, (result) => {
    const elevations = statUtils.rollingAverage(statUtils.glitchDetector(result.rows.map(r => r.elevation)), 15);
    response.json(elevations.map((r, i) => {
      return {
        elevation: r,
        coordinates: points[i]
      };
    }));
  });
});

app.get('/api/elevation-dump/:x1/:y1/:x2/:y2', function(request, response){
  const cachedPath = path(__dirname + `/public/cache/elevation/elevation-${request.params.x1}-${request.params.y1}-${request.params.x2}-${request.params.y2}.json`);

  if (fs.existsSync(cachedPath)) return response.json(JSON.parse(fs.readFileSync(cachedPath)));

  const query = `
    select to_json(ST_DumpValues(ST_Clip(ST_Union(rast),
      ST_MakeEnvelope(${request.params.x1}, ${request.params.y1}, ${request.params.x2}, ${request.params.y2}, 4326)
    )))
    from elevation_detailed where ST_Intersects(rast,
      ST_MakeEnvelope(${request.params.x1}, ${request.params.y1}, ${request.params.x2}, ${request.params.y2}, 4326)
    );
  `;

  query(query, pool, (result) => {
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

app.listen(5000, function () {
  console.log('listening on port 5000');
});
