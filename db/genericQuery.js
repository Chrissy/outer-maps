const pg = require("pg");
const dbgeo = require("dbgeo");

if (process.env.NODE_ENV == "production") pg.defaults.ssl = true;

exports.pool = () => {
  return new pg.Pool();
};

exports.query = (query, pool, cb) => {
  pool.connect(function(err, client, done) {
    if (err) throw err;
    client.query(query, function(err, result) {
      done();
      if (err) throw err;
      cb(result);
    });
  });
};

exports.geoJson = (results, cb) => {
  dbgeo.parse(
    results.rows,
    { outputFormat: "geojson", precision: 6 },
    (error, result) => {
      cb({
        ...result,
        features: result.features.map(feature => ({
          id: feature.properties.id,
          ...feature
        }))
      });
    }
  );
};
