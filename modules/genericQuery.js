const pg = require('pg');
const env = process.env;
const dbgeo = require('dbgeo');

exports.pool = () => {
  return new pg.Pool({
    database: process.env.DATABASE_URL || env.databaseName,
    max: 10,
    idleTimeoutMillis: 3000,
    user: env.dbUser || ''
  });
};

exports.query = (query, pool, cb) => {
  pool.connect(function(err, client, done){
    client.query(query, function(err, result){
      done();
      if (err) throw err;
      cb(result);
    });
  });
}

exports.geoJson = (results, cb) => {
  dbgeo.parse(results.rows, {outputFormat: 'geojson', precision: 6}, (error, result) => {
    cb(result)
  });
}
