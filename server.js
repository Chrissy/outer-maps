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
    client.query('SELECT the_geog FROM osm_trails limit 1', function(err, result){
      if (err) throw err;

      response.send(result.rows[0].the_geog);
      client.end();
    })
  })
})

app.listen(5000, function () {
  console.log('listening on port 5000');
});
