const fs = require('fs');
const jsonfile = require('jsonfile')
const helpers = require('@turf/helpers');
const execSync = require('child_process').execSync;
const path = require('path').normalize;
const gQuery = require('./modules/genericQuery');

const pool = gQuery.pool();

build = (name, result) => {
  console.log('building...');
  gQuery.geoJson(result, (result) => {
    jsonfile.writeFileSync(`_temp_${name}.geojson`, result);
    execSync(`mapbox upload ${name} _temp_${name}.geojson`, {stdio:[0,1,2]});
    fs.unlink(`_temp_${name}.geojson`);
  });
};

gQuery.query(`
  SELECT
    name, id, type, ST_SimplifyVW(geog::geometry, 0.0000005) as geom
  FROM trails
  WHERE type = 'hike' OR type = 'horse' AND name != ''
`, pool, (result) => build("trails-hike-horse", result));
