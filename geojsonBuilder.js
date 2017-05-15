const fs = require('fs');
const jsonfile = require('jsonfile')
const helpers = require('@turf/helpers');
const path = require('path').normalize;
const gQuery = require('./modules/genericQuery');
const labelMaker = require('./modules/labelMaker').labelMaker;
const exec = require('child_process').execSync;

const pool = gQuery.pool();

build = ({name, data, minZoom = 0, maxZoom = 99} = {}) => {
  const tempFileName = `./tiles/${name}.geojson`;
  jsonfile.writeFile(tempFileName, Object.assign({}, data, {
    features: data.features.map(f => Object.assign({}, f, {
      "tippecanoe" : { "maxzoom" : maxZoom, "minzoom" : minZoom }
    }))
  }));
};

gQuery.query(`
  SELECT name, id, type, ST_SimplifyVW(geog::geometry, 0.000001) as geom
  FROM trails
  WHERE type = 'hike' OR type = 'horse' OR type = 'bike' OR
  type = 'motorcycle' OR type = 'atv' AND name != ''
`, pool, (result) => {
  gQuery.geoJson(result, (result) => {
    build({
      name: "trails",
      data: result,
      minZoom: 10,
      maxZoom: 15
    });
  });
});

gQuery.query(`
  SELECT name, id, type, ST_SimplifyVW(geog::geometry, 0.000005) as geom
  FROM trails
  WHERE type = 'hike' OR type = 'horse' OR type = 'bike' OR
  type = 'motorcycle' OR type = 'atv' AND name != ''
`, pool, (result) => {
  gQuery.geoJson(result, (result) => {
    build({
      name: "trails-zoomed-out",
      data: result,
      minZoom: 6,
      maxZoom: 9.75
    });
  });
});

gQuery.query(`
  SELECT name, id, ST_Simplify(geog::geometry, 0.0005) as geom
  FROM boundaries
`, pool, (result) => {
  gQuery.geoJson(result, (result) => {
    build({
      name: "park-boundaries",
      data: result,
      minZoom: 0,
      maxZoom: 15
    });
  });
});

gQuery.query(`
  SELECT name, id, type, ST_SimplifyVW(geog::geometry, 0.000001) as geom
  FROM trails
  WHERE (type = 'hike' OR type = 'horse' OR type = 'bike') AND name != ''
`, pool, (result) => {
  gQuery.geoJson(result, (result) => {
    build({
      name: "trail-labels",
      data: labelMaker(result, 1),
      minZoom: 12.25,
      maxZoom: 15
    });
  });
});

gQuery.query(`
  SELECT name, id, type, ST_SimplifyVW(geog::geometry, 0.000004) as geom
  FROM trails
  WHERE (type = 'hike' OR type = 'horse' OR type = 'bike') AND name != ''
`, pool, (result) => {
  gQuery.geoJson(result, (result) => {
    build({
      name: "trail-labels-zoomed-out",
      data: labelMaker(result, 2),
      minZoom: 10,
      maxZoom: 12
    });
  });
});
