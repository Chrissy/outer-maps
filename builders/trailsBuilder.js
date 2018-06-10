const jsonfile = require('jsonfile')
const helpers = require('@turf/helpers');
const path = require('path').normalize;
const gQuery = require('../db/genericQuery');
const labelMaker = require('../modules/labelMaker').labelMaker;
const exec = require('child_process').execSync;
const fs = require('fs');

const tempFileName = 'temp-trails.geojson';

const queries = [
  {
    name: "trails-zoomed-out",
    minZoom: 6,
    maxZoom: 8.75,
    query: `
      SELECT name, id, type, ST_Length(geog) as distance, ST_SimplifyVW(geog::geometry, 0.000005) as geom
      FROM trails
      WHERE ST_Length(geog) > 5000 AND type = 'hike' OR type = 'horse' OR type = 'bike' OR
      type = 'motorcycle' OR type = 'atv' AND name != ''
    `
  },
  {
    name: "trails",
    minZoom: 9,
    maxZoom: 9.75,
    query: `
      SELECT name, id, type, station1, ST_Length(geog) as distance, ST_SimplifyVW(geog::geometry, 0.000003) as geom,
      ST_AsGeoJson(ST_Envelope(geog::geometry)) as bounds
      FROM trails
      WHERE ST_Length(geog) > 3000 AND type = 'hike' OR type = 'horse' OR type = 'bike' OR
      type = 'motorcycle' OR type = 'atv' AND name != ''
    `
  },
  {
    name: "trails",
    minZoom: 10,
    maxZoom: 11.75,
    query: `
      SELECT name, id, type, station1, ST_Length(geog) as distance, ST_SimplifyVW(geog::geometry, 0.000001) as geom,
      ST_AsGeoJson(ST_Envelope(geog::geometry)) as bounds
      FROM trails
      WHERE ST_Length(geog) > 1500 AND type = 'hike' OR type = 'horse' OR type = 'bike' OR
      type = 'motorcycle' OR type = 'atv' AND name != ''
    `
  },
  {
    name: "trails",
    minZoom: 12,
    maxZoom: 14,
    query: `
      SELECT name, id, type, station1, ST_Length(geog) as distance, geog::geometry as geom,
      ST_AsGeoJson(ST_Envelope(geog::geometry)) as bounds
      FROM trails
      WHERE type = 'hike' OR type = 'horse' OR type = 'bike' OR
      type = 'motorcycle' OR type = 'atv' AND name != ''
    `
  },
  {
    name: "trail-labels-zoomed-out",
    labelLength: 1.5,
    minZoom: 9,
    maxZoom: 11.75,
    query: `
      SELECT name, id, type, ST_SimplifyVW(geog::geometry, 0.000004) as geom
      FROM trails
      WHERE ST_Length(geog) > 3000 AND (type = 'hike' OR type = 'horse' OR type = 'bike') AND name != ''
    `
  },
  {
    name: "trail-labels",
    labelLength: 0.75,
    minZoom: 12,
    maxZoom: 14,
    query: `
      SELECT name, id, type, ST_SimplifyVW(geog::geometry, 0.0000005) as geom
      FROM trails
      WHERE (type = 'hike' OR type = 'horse' OR type = 'bike') AND name != ''
    `
  },
  {
    name: "park-boundary-labels",
    minZoom: 1,
    maxZoom: 12,
    query: `
      SELECT name, id, ST_Area(geog) as area, ST_AsGeoJson(ST_Envelope(geog::geometry)) as bounds, station1, ST_PointOnSurface(geog::geometry) as geom
      FROM boundaries
    `,
  }
]

addTippecanoeProps = (data, props) => {
  return Object.assign({}, data, {
    features: data.features.map(f => Object.assign({}, f, {
      "tippecanoe" : props
    }))
  });
}

build = (data, {name, minZoom = 0, maxZoom = 99, labelLength} = {}, resolve) => {

  const newObj = addTippecanoeProps(data, {
    "maxzoom" : maxZoom,
    "minzoom" : minZoom,
    layer: name
  });

  jsonfile.writeFile("./" + tempFileName, newObj, {flag: 'a'}, () => {
    console.log(name + " done!");
    resolve();
  });
};

const pool = gQuery.pool();

const processes = queries.map(q => {
  return new Promise((resolve, reject) => {
    gQuery.query(q.query, pool, (result) => {
      gQuery.geoJson(result, (result) => {
        build((q.labelLength) ? labelMaker(result, q.labelLength) : result, q, resolve);
      });
    });
  });
})

Promise.all(processes).then(() => {
  console.log("making tiles...")
  exec(`tippecanoe --quiet -f -P -M 100000 -as -an -al -ap -o tiles/local.mbtiles ${tempFileName}`);
  fs.unlink("./" + tempFileName, () => {
    console.log("Done! Tiles are cached into memory by the server. You will need to restart.")
  });
})
