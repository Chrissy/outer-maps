const fs = require('fs');
const jsonfile = require('jsonfile')
const helpers = require('@turf/helpers');
const execSync = require('child_process').execSync;
const path = require('path').normalize;
const dbgeo = require('dbgeo');
const gQuery = require('./modules/genericQuery');

buildTrails = () => {
  console.log('building trails...');

  gQuery.query(`
    SELECT
      name, id, type, source, ST_Simplify(geog, 0.000003 as geom
    FROM trails
    WHERE type != 'road' AND name != '' AND name != 'Null' AND name != 'null'
  `, pool, (result) => {

    console.log('formatting...');

    gQuery.geoJson(result, (result) => {
      const chunks = 100;

      console.log('writing geojson...');

      for (let i = 0; i < chunks; i++) {
        const breakPoint = Math.ceil(result.length / chunks);
        const toWrite = result.slice(breakPoint * i, breakPoint * (i + 1));
        jsonfile.writeFileSync('trails.geojson', toWrite, {flag: 'a'});
      };

      console.log(('creating vector tiles...'));

      execSync(`tippecanoe -o ${path(__dirname + '/trails.mbtiles')} [${path(__dirname + '/trails.geojson')}]`);
    });
  });
};

buildTrails();
