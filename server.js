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

      response.json({
        "type": "FeatureCollection",
        "features": [
          {
            "type": "Feature",
            "id": "way/5303764",
            "properties": {
              "name": result.rows[0].name || "needs name",
              "ref": result.rows[0].ref || "needs ref",
              "source": "osm"
            },
            "geometry": JSON.parse(result.rows[0].the_geog)
          }
        ]
      });
      client.end();
    })
  })
})

app.listen(5000, function () {
  console.log('listening on port 5000');
});
