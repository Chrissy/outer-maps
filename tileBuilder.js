const fs = require('fs');
const jsonfile = require('jsonfile')
const helpers = require('@turf/helpers');
const path = require('path').normalize;
const gQuery = require('./modules/genericQuery');
const labelMaker = require('./modules/labelMaker').labelMaker;

const pool = gQuery.pool();

build = (name, result) => {
  const tempFileName = `./public/dist/${name}.geojson`;
  jsonfile.writeFile(tempFileName, result, () => console.log(`${name} done!`));
};

gQuery.query(`
  SELECT name, id, type, ST_SimplifyVW(geog::geometry, 0.000001) as geom
  FROM trails
  WHERE type = 'hike' OR type = 'horse' OR type = 'bike' OR
  type = 'motorcycle' OR type = 'atv' AND name != ''
`, pool, (result) => gQuery.geoJson(result, (result) => build("trails", result)));

gQuery.query(`
  SELECT name, id, ST_Simplify(geog::geometry, 0.0005) as geom
  FROM boundaries
`, pool, (result) => gQuery.geoJson(result, (result) => build("park-boundaries", result)));

gQuery.query(`
  SELECT name, id, type, ST_SimplifyVW(geog::geometry, 0.000001) as geom
  FROM trails
  WHERE (type = 'hike' OR type = 'horse' OR type = 'bike') AND name != ''
`, pool, (result) => {
    gQuery.geoJson(result, (result) => build('trail-labels', labelMaker(result, 1)));
});

gQuery.query(`
  SELECT name, id, type, ST_SimplifyVW(geog::geometry, 0.000004) as geom
  FROM trails
  WHERE (type = 'hike' OR type = 'horse' OR type = 'bike') AND name != ''
`, pool, (result) => {
    gQuery.geoJson(result, (result) => build('trail-labels-zoomed-out', labelMaker(result, 2)));
});
