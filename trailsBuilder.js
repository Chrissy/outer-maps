const jsonfile = require('jsonfile')
const helpers = require('@turf/helpers');
const path = require('path').normalize;
const gQuery = require('./modules/genericQuery');
const labelMaker = require('./modules/labelMaker').labelMaker;
const exec = require('child_process').execSync;
const pool = gQuery.pool();
const glob = require('glob');

build = ({name, data, minZoom = 0, maxZoom = 99} = {}, resolve) => {
  console.log("making " + name);
  const tempFileName = `./tiles/${name}.geojson`;
  jsonfile.writeFile(tempFileName, Object.assign({}, data, {
    features: data.features.map(f => Object.assign({}, f, {
      "tippecanoe" : { "maxzoom" : maxZoom, "minzoom" : minZoom }
    }))
  }), () => {
    console.log(name + " done!");
    resolve();
  });
};

const trailsZoomedOut = new Promise((resolve, reject) => {
  gQuery.query(`
    SELECT name, id, type, ST_Length(geog) as distance, ST_SimplifyVW(geog::geometry, 0.000005) as geom
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
      }, resolve);
    });
  });
});

const trails = new Promise((resolve, reject) => {
  gQuery.query(`
    SELECT name, id, type, ST_SimplifyVW(geog::geometry, 0.0000001) as geom
    FROM trails
    WHERE type = 'hike' OR type = 'horse' OR type = 'bike' OR
    type = 'motorcycle' OR type = 'atv' AND name != ''
  `, pool, (result) => {
    gQuery.geoJson(result, (result) => {
      build({
        name: "trails",
        data: result,
        minZoom: 10,
        maxZoom: 14
      }, resolve);
    });
  });
});

const trailLabelsZoomedOut = new Promise((resolve, reject) => {
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
        maxZoom: 11.75
      }, resolve);
    });
  });
});

const trailLabels = new Promise((resolve, reject) => {
  gQuery.query(`
    SELECT name, id, type, ST_SimplifyVW(geog::geometry, 0.000001) as geom
    FROM trails
    WHERE (type = 'hike' OR type = 'horse' OR type = 'bike') AND name != ''
  `, pool, (result) => {
    gQuery.geoJson(result, (result) => {
      build({
        name: "trail-labels",
        data: labelMaker(result, 1),
        minZoom: 12,
        maxZoom: 14
      }, resolve);
    });
  });
});

Promise.all([trailsZoomedOut, trails, trailLabelsZoomedOut, trailLabels]).then(() => {
  glob("./tiles/*.geojson", (err, files) => {
    console.log("making tiles...")
    exec(`tippecanoe -f -P -M 100000 -as -an -al -ap -o tiles/local.mbtiles ${files.join(" ")}`);
    console.log("Tiles are cached into memory by the server. You will need to restart!")
  });
})
