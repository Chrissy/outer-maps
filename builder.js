const fs = require('fs');
const jsonfile = require('jsonfile')
const helpers = require('@turf/helpers');
const execSync = require('child_process').execSync;
const path = require('path').normalize;
const gQuery = require('./modules/genericQuery');

const pool = gQuery.pool();

buildTrails = () => {
  console.log('building trails...');

  gQuery.query(`
    SELECT
      name, id, type, ST_SimplifyVW(geog::geometry, 0.0000005) as geom
    FROM trails
    WHERE type = 'hike' OR type = 'horse' AND name != ''
  `, pool, (result) => {

    console.log('writing geojson...');

    gQuery.geoJson(result, (result) => {
      jsonfile.writeFileSync('trails.geojson', result);
      execSync(`mapbox upload trails trails.geojson`, {stdio:[0,1,2]});
    });
  });
};

buildTrails();
