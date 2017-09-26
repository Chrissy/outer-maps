const jsonfile = require('jsonfile');
const gQuery = require('../modules/genericQuery');
const exec = require('child_process').execSync;
const pool = gQuery.pool();

// large polygons are very intensive on vector tiles, so
// so we process and upload the parks seperately as geojson.

gQuery.query(`
  SELECT name, id, ST_Simplify(geog::geometry, 0.0005) as geom
  FROM boundaries
`, pool, (result) => {
  gQuery.geoJson(result, (result) => {
    jsonfile.writeFile("./tiles/park-boundaries.geojson", result);
  });
});
