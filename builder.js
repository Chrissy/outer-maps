const fs = require('fs');
const jsonfile = require('jsonfile')
const helpers = require('@turf/helpers');
const exec = require('child_process').spawn;
const path = require('path').normalize;
const gQuery = require('./modules/genericQuery');

const pool = gQuery.pool();

build = (name, result) => {
  const tempFileName = `map_dist/${name}.geojson`;
  console.log(`building ${name}...`);

  gQuery.geoJson(result, (result) => {
    jsonfile.writeFile(tempFileName, result, () => {
      const proc = exec('mapbox', ['upload', name, tempFileName]);
      proc.on('close', () => console.log(`${name} uploaded!`));
    });
  });
};

gQuery.query(`
  SELECT name, id, type, ST_SimplifyVW(geog::geometry, 0.0000005) as geom
  FROM trails
  WHERE type = 'hike' OR type = 'horse' AND name != ''
`, pool, (result) => build("trails-hike-horse", result));

gQuery.query(`
  SELECT name, id, type, ST_SimplifyVW(geog::geometry, 0.0000005) as geom
  FROM trails
  WHERE type = 'bike' AND name != ''
`, pool, (result) => build("trails-bike-hike", result));

gQuery.query(`
  SELECT name, id, type, ST_SimplifyVW(geog::geometry, 0.0000005) as geom
  FROM trails
  WHERE type = 'atv' OR type = 'motorcycle' AND name != ''
`, pool, (result) => build("trails-atv-motorcycle", result));

gQuery.query(`
  SELECT name, id, ST_Simplify(geog::geometry, 0.0005) as geom
  FROM boundaries
`, pool, (result) => build("park-boundaries", result));
