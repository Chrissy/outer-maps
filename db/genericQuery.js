import pg from 'pg';
import dbgeo from 'dbgeo';

if (process.env.NODE_ENV == 'production') pg.defaults.ssl = true;
if (!process.env.DATABASE_URL) console.log("warning: no database url from the env. did you start the server correctly?")

export const pool = () => {
  return new pg.Pool({
    connectionString: process.env.DATABASE_URL
  });
};

export const query = (query, pool, cb) => {
  pool.connect(function(err, client, done) {
    if (err) throw err;
    client.query(query, function(err, result) {
      done();
      if (err) throw err;
      cb(result);
    });
  });
}

export const geoJson = (results, cb) => {
  dbgeo.parse(results.rows, {outputFormat: 'geojson', precision: 6}, (error, result) => {
    cb(result)
  });
}
