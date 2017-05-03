const pg = require('pg');
const env = require('../environment/development');

exports.genericPool = () => {
  return new pg.Pool({
    database: env.databaseName,
    max: 10,
    idleTimeoutMillis: 3000,
    user: env.dbUser
  });
};

exports.genericQuery = (query, pool, cb) => {
  pool.connect(function(err, client, done){
    client.query(query, function(err, result){
      done();
      if (err) throw err;
      cb(result);
    });
  });
}
