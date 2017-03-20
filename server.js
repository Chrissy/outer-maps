const http = require('http');
const pg = require('pg');
const express = require('express');
const browserify = require('browserify-middleware');
const geoViewport = require('geo-viewport');
const polyline = require('polyline');
const app = express();
const _ = require('underscore');
const env = require('./environment/development');
const geoJson = require('./modules/geoJson.js');

app.use(express.static('public'));

app.get('/bundle.js', browserify(__dirname + '/components/app.js', {
  mode: (process.env.NODE_ENV == 'production') ? 'production' : 'development',
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

const getTrail = function(id, callback) {
  let query = `
    SELECT
      name,
      surface,
      ST_AsGeoJson(ST_LineMerge(geog::geometry)) as geog,
      ST_Length(geog) as distance,
      ST_AsGeoJson(ST_Centroid(geog::geometry)) as center,
      ST_AsGeoJson(ST_Envelope(geog::geometry)) as bounds
    FROM trails
    WHERE id = ${id}
    LIMIT 1
  `

  pool.connect(function(err, client, done){
    client.query(query, function(err, result){
      done();

      if (err) throw err;

      let r = result.rows[0]
      callback(Object.assign(result.rows[0], {bounds: geoJson.boxToBounds(JSON.parse(r.bounds))}));
    })
  })
}

app.get('/api/trails/:id', function(request, response) {
  getTrail(request.params.id, function(r){
    response.json({
      "name": r.name,
      "id": request.params.id,
      "surface": r.surface,
      "geography": JSON.parse(r.geog),
      "distance": r.distance,
      "center": JSON.parse(r.center).coordinates,
      "bounds": [[r.bounds[0],r.bounds[1]], [r.bounds[2], r.bounds[3]]]
    });
  })
})

app.get('/api/boundaries/:id', function(request, response) {
  let query = `
    SELECT
      name,
      ST_Area(geog) as area,
      ST_AsGeoJson(ST_Centroid(geog::geometry)) as center,
      ST_AsGeoJson(ST_Envelope(geog::geometry)) as bounds
    FROM boundaries
    WHERE id = ${request.params.id}
    LIMIT 1
  `

  pool.connect(function(err, client, done){
    client.query(query, function(err, result){
      done();

      if (err) throw err;

      const r = result.rows[0];
      const envelope = JSON.parse(r.bounds).coordinates[0];

      response.json({
        "name": r.name,
        "id": request.params.id,
        "area": r.area,
        "center": JSON.parse(r.center).coordinates,
        "bounds": [envelope[0], envelope[2]]
      });
    })
  })
})

app.get('/api/elevation/:id', function(request, response){
  const query = `
    select ST_AsGeoJson(ST_LineMerge(geog::geometry)) as geog
    FROM trails
    WHERE id = ${request.params.id}
  `

  pool.connect(function(err, client, done){
    client.query(query, function(err, result){
      if (err) throw err;

      const geoJson = JSON.parse(result.rows[0].geog);

      const query = `
        WITH pairs(x,y) AS (
          VALUES
          ${geoJson.coordinates.reduce((acc, el, i) => acc + `${(i == 0) ? '' : ','}(${el[0]},${el[1]})`, '')}
        )
        SELECT
          ST_Value(rast, ST_SetSRID(ST_Point(x,y), 4326)) as elevation
        FROM elevation
        CROSS JOIN pairs
        WHERE ST_Intersects(rast, ST_SetSRID(ST_GeomFromGeoJson('${JSON.stringify(geoJson)}'), 4326))
      `;

      console.log(query)

      client.query(query, function(err, result){
        if (err) throw err;
        done();
        response.json(result.rows.map(r => r.elevation));
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

app.get('/api/elevation-dump/:x1/:y1/:x2/:y2', function(request, response){
  const query = `
    select to_json(ST_DumpValues(ST_Clip(ST_Union(rast),
      ST_MakeEnvelope(${request.params.x1}, ${request.params.y1}, ${request.params.x2}, ${request.params.y2}, 4326)
    )))
    from elevation_detailed where ST_Intersects(rast,
      ST_MakeEnvelope(${request.params.x1}, ${request.params.y1}, ${request.params.x2}, ${request.params.y2}, 4326)
    );
  `;

  pool.connect(function(err, client, done){
    client.query(query, function(err, result){
      done();
      if (err) throw err;
      console.log(result)
      const vertices = result.rows[0].to_json.valarray
      response.json({length: vertices.length, height: vertices[0].length, vertices: _.flatten(vertices)});
    });
  });
});

app.listen(5000, function () {
  console.log('listening on port 5000');
});
