const http = require('http');
const pg = require('pg');
const express = require('express');
const app = express();

app.use(express.static('public'))

const hostname = '0.0.0.0';
const port = 5000;

var pool = new pg.Pool({database: 'mountains_2'});

app.get('/api/:x1/:y1/:x2/:y2', function(request, response) {

  var query = `
    SELECT name, ogc_fid, ST_AsGeoJson(the_geog) AS the_geog
    FROM osm_trails
    WHERE ST_Intersects(the_geog,
      ST_MakeEnvelope(${request.params.x1}, ${request.params.y1}, ${request.params.x2}, ${request.params.y2})
    )
  `

  pool.connect(function(err, client, done){
    client.query(query, function(err, result){
      if (err) throw err;

      var features = []

      for (var row of result.rows) {
        features.push({
          "type": "Feature",
          "properties": {
            "name": row.name || "needs name",
            "source": "osm",
            "id": row.ogc_fid
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
