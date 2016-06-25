const http = require('http');
const pg = require('pg');
const express = require('express');
const app = express();

app.use(express.static('public'))

const hostname = '0.0.0.0';
const port = 5000;

var pool = new pg.Pool({database: 'mountains_2'});

app.get('/api', function(request, response) {
  pool.connect(function(err, client, done){
    client.query('SELECT name, ref, ST_AsGeoJson(the_geog) AS the_geog FROM osm_trails limit 5', function(err, result){
      if (err) throw err;

      var features = []

      for (var row of result.rows) {
        features.push({
          "type": "Feature",
          "id": "way/5303764",
          "properties": {
            "name": row.name || "needs name",
            "ref": row.ref || "needs ref",
            "source": "osm"
          },
          "geometry": JSON.parse(row.the_geog)
        });
      }

      response.json({
        "type": "FeatureCollection",
        "features": features
      });
      client.end();
    })
  })
})

app.listen(5000, function () {
  console.log('listening on port 5000');
});
