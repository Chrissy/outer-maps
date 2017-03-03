const http = require('http');
const pg = require('pg');
const express = require('express');
const browserify = require('browserify-middleware');
const app = express();
const _ = require('underscore');
const env = require('./environment/development');
const geoJson = require('./modules/geoJson.js');

app.use(express.static('public'));

app.get('/bundle.js', browserify(__dirname + '/components/app.js', {
  mode: (process.env.production) ? 'production' : 'development',
  transform: ['babelify'],
  plugins: [{
    plugin: 'css-modulesify',
    options: { output: './public/bundle.css'}
  }]
}));

var pool = new pg.Pool({
  database: env.databaseName,
  max: 10,
  idleTimeoutMillis: 3000,
  user: env.dbUser
});

app.get('/api/:x1/:y1/:x2/:y2', function(request, response) {

  const query = `
    SELECT id, ST_AsGeoJson(geog) AS geog
    FROM trails
    WHERE ST_Intersects(geog,
      ST_MakeEnvelope(${request.params.x1}, ${request.params.y1}, ${request.params.x2}, ${request.params.y2})
    )
  `

  pool.connect(function(err, client, done){
    client.query(query, function(err, result){
      done();
      if (err) throw err;
      response.json(geoJson.make(result));
    })
  })
})

app.get('/api/trails/:id', function(request, response) {
  let query = `
    SELECT
      name,
      surface,
      ST_AsGeoJson(geog) as geog,
      ST_Length(geog) as distance,
      ST_AsGeoJson(ST_Centroid(geog::geometry)) as center
    FROM trails
    WHERE id = ${request.params.id}
    LIMIT 1
  `

  pool.connect(function(err, client, done){
    client.query(query, function(err, result){
      done();

      if (err) throw err;

      let r = result.rows[0]

      response.json({
        "name": r.name,
        "id": request.params.id,
        "surface": r.surface,
        "geography": JSON.parse(r.geog),
        "distance": r.distance,
        "center": JSON.parse(r.center).coordinates
      });
    })
  })
})

app.get('/api/boundaries/:id', function(request, response) {
  let query = `
    SELECT
      name,
      ST_Area(geog) as area,
      ST_AsGeoJson(ST_Centroid(geog::geometry)) as center
    FROM boundaries
    WHERE id = ${request.params.id}
    LIMIT 1
  `

  pool.connect(function(err, client, done){
    client.query(query, function(err, result){
      done();

      if (err) throw err;

      let r = result.rows[0]

      response.json({
        "name": r.name,
        "id": request.params.id,
        "area": r.area,
        "center": JSON.parse(r.center).coordinates
      });
    })
  })
})

app.get('/api/elevation/:id', function(request, response){
  const query = `
    select ST_AsGeoJson(geog) as geog
    FROM trails
    WHERE id = ${request.params.id}
  `

  pool.connect(function(err, client, done){
    client.query(query, function(err, result){
      if (err) throw err;

      var data = JSON.parse(result.rows[0].geog);
      var points = (data.type == "MultiLineString") ? _.flatten(data.coordinates, true) : data.coordinates;
      var elevations = [], distance = 0;

      points.forEach(function(point, i) {
        const query = `
          SELECT ST_Value(rast, ST_Transform(
            ST_GeomFromText(
              'POINT(${point[0]} ${point[1]})',
            4326), 4326)
          )
          FROM elevation
          WHERE rid=4
        `;
        client.query(query, function(err, result){
          if (err) throw err;
          if (result) elevations.push(result.rows[0].st_value);
          if (i + 1 >= points.length) {
            done();
            response.json(elevations);
          }
        })
      });
    });
  });
});

app.get('/api/boundaries/:x1/:y1/:x2/:y2', function(request, response) {
  const query = `
    SELECT id AS id, name AS name, ST_AsGeoJson(geog) AS geog
    FROM boundaries
    WHERE ST_Intersects(geog,
      ST_MakeEnvelope(${request.params.x1}, ${request.params.y1}, ${request.params.x2}, ${request.params.y2})
    )
  `
  pool.connect(function(err, client, done){
    client.query(query, function(err, result){
      done();
      if (err) throw err;
      response.json(geoJson.make(result));
    });
  });
});

app.listen(5000, function () {
  console.log('listening on port 5000');
});
