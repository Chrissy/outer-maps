const query = require('./modules/genericQuery');
const fs = require('fs');
const jsonfile = require('jsonfile')
const helpers = require('@turf/helpers');
const pool = query.genericPool();
const execSync = require('child_process').execSync;
const path = require('path').normalize;

buildTrails = () => {
  console.log('getting trails from db...');

  query.genericQuery(`
    SELECT
      name, id, type, source, ST_AsGeoJson(geog::geometry) as geog
    FROM trails
    WHERE type != 'road' AND name != '' AND name != 'Null' AND name != 'null'
  `, pool, (result) => {

    console.log('formatting...');

    const trails = result.rows.map(r => {
      const feature = helpers.feature(JSON.parse(r.geog));

      return Object.assign({}, feature, {
        "properties": {
          "name": r.name,
          "id": r.id,
          "type": r.type,
          "source": r.source
        }
      });
    });

    const chunks = 100;

    console.log('writing geojson...');

    for (let i = 0; i < chunks; i++) {
      const breakPoint = Math.ceil(trails.length / chunks);
      const toWrite = trails.slice(breakPoint * i, breakPoint * (i + 1));
      jsonfile.writeFileSync('trails.geojson', toWrite, {flag: 'a'});
    };

    console.log(('creating vector tiles...'));

    execSync(`tippecanoe -o ${path(__dirname + '/trails.mbtiles')} [${path(__dirname + '/trails.geojson')}]`);

  });
};

buildTrails();
