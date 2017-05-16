const jsonfile = require('jsonfile');
const gQuery = require('./modules/genericQuery');
const exec = require('child_process').execSync;
const pool = gQuery.pool();

// large polygons are very intensive on the tile pipeline, and don't change much
// so we process and upload them seperately.

gQuery.query(`
  SELECT name, id, ST_Simplify(geog::geometry, 0.0005) as geom
  FROM boundaries
`, pool, (result) => {
  gQuery.geoJson(result, (result) => {
    jsonfile.writeFile("./tiles/park-boundaries.geojson", result);
  });
});
