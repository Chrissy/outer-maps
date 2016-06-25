const http = require('http');
const pg = require('pg');
const express = require('express');

const hostname = '0.0.0.0';
const port = 5000;

var pool = new pg.Pool({database: 'mountains_2'});

const server = http.createServer((request, response) => {
  response.statusCode = 200;
  response.setHeader('Content-Type', 'text/plain');

  pool.connect(function(err, client, done){
    client.query('SELECT the_geog FROM osm_trails limit 1', function(err, result){
      if (err) throw err;

      response.end(result.rows[0].the_geog);
      client.end();
    })
  })
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
