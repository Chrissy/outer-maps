const pg = require('pg');

const genericQuery = function(query, callback) {
  var pool = new pg.Pool({
    database: 'mountains_5',
    max: 10,
    idleTimeoutMillis: 3000
  });

  pool.connect(function(err, client, done){
    client.query(query, function(err, result){
      if (err) throw err;

      if (callback) callback(result, client, err);

      done();
    });
  });
}

const importOsmData = function(importFrom, importTo) {
  var query = `
    INSERT INTO ${importTo}(name, surface, source_id, geog)
    SELECT name, surfacetype, trail_id, geog FROM ${importFrom};

    UPDATE ${importTo} SET source = 'OSM Custom Import — Sequoia';
  `

  genericQuery(query, function(result) {
    console.log(result);
  });
}

const importUtahGov = function(importFrom, importTo) {
  var query = `
    INSERT INTO ${importTo}(name, surface, source_id, geog)
    SELECT primarynam, surfacetyp, trailid, geog FROM ${importFrom};

    UPDATE ${importTo} SET source = 'https://gis.utah.gov/data/recreation/trails/';
  `

  genericQuery(query, function(result) {
    console.log(result);
  });
}


const createTrailsTable = function(tableName) {
  var createTableQuery = `
    CREATE TABLE ${tableName}(
      id SERIAL PRIMARY KEY,
      name VARCHAR(200),
      surface VARCHAR(64),
      source_id varchar(20),
      source varchar(50),
      geog geography(GEOMETRY,4326)
    );`

  genericQuery(createTableQuery, function(result) {
      console.log(result);
  });
}

//createTrailsTable('trails_formatted');
importOsmData('osm_trails','trails_formatted');
//importUtahGov('utah_trails','trails_5');
