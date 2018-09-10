require("dotenv").config();

const jsonfile = require("jsonfile");
const gQuery = require("../db/genericQuery");
const labelMaker = require("../modules/labelMaker").labelMaker;
const exec = require("child_process").execSync;
const fs = require("fs");

const tempFileName = "temp-trails.geojson";

const queries = [
  {
    name: "trails-zoomed-out",
    minZoom: 6,
    maxZoom: 8,
    query: `
      SELECT name, id, type, ST_Length(geog) as distance, ST_SimplifyVW(geog::geometry, 0.000005) as geom
      FROM trails
      WHERE ST_Length(geog) > 5000
      AND type IN ('hike', 'horse', 'bike', 'motorcycle', 'atv')
      AND name != ''
    `
  },
  {
    name: "trails",
    minZoom: 9,
    maxZoom: 10,
    query: `
      SELECT name, id, type, station1, ST_Length(geog) as distance, ST_SimplifyVW(geog::geometry, 0.000003) as geom,
      ST_AsGeoJson(ST_Envelope(geog::geometry)) as bounds
      FROM trails
      WHERE ST_Length(geog) > 3000
      AND type IN ('hike', 'horse', 'bike', 'motorcycle', 'atv')
      AND name != ''
    `
  },
  {
    name: "trails",
    minZoom: 11,
    maxZoom: 14,
    query: `
      SELECT name, id, type, station1, ST_Length(geog) as distance, geog::geometry as geom,
      ST_AsGeoJson(ST_Envelope(geog::geometry)) as bounds
      FROM trails
      WHERE type IN ('hike', 'horse', 'bike', 'motorcycle', 'atv')
      AND name != ''
    `
  },
  {
    name: "trail-labels-zoomed-out",
    labelLength: 1.5,
    minZoom: 9,
    maxZoom: 12,
    query: `
      SELECT name, id, type, ST_SimplifyVW(geog::geometry, 0.000004) as geom
      FROM trails
      WHERE ST_Length(geog) > 3000
      AND type IN ('hike', 'horse', 'bike')
      AND name != ''
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
      WHERE type IN ('hike', 'horse', 'bike')
      AND name != ''
    `
  },
  {
    name: "trail-endpoints",
    minZoom: 9,
    maxZoom: 10,
    /*
      TODO: we should assign a unique identifier
      to these eventually and use a join
    */
    query: `
      WITH filtered_trails as (
        SELECT geog::geometry as geom from trails
        WHERE ST_Length(geog) > 3000
        AND type IN ('hike', 'horse', 'bike', 'motorcycle', 'atv')
        AND name != ''
        GROUP BY geom
      ), startpoints AS (
        SELECT st_startpoint(geom) as geom FROM filtered_trails
        GROUP BY geom
      ), endpoints AS (
        SELECT st_endpoint(geom) as geom FROM filtered_trails
      ) SELECT geom FROM startpoints UNION ALL SELECT geom FROM endpoints
      GROUP BY geom;
    `
  },
  {
    name: "trail-endpoints",
    minZoom: 11,
    maxZoom: 14,
    query: `
      WITH filtered_trails as (
        SELECT geog::geometry as geom from trails
        WHERE type IN ('hike', 'horse', 'bike', 'motorcycle', 'atv')
        AND name != ''
        GROUP BY geom
      ), startpoints AS (
        SELECT st_startpoint(geom) as geom FROM filtered_trails
        GROUP BY geom
      ), endpoints AS (
        SELECT st_endpoint(geom) as geom FROM filtered_trails
        GROUP BY geom
      ) SELECT geom FROM startpoints UNION ALL SELECT geom FROM endpoints
        GROUP BY geom;
    `
  },
  {
    name: "park-boundary-labels",
    minZoom: 1,
    maxZoom: 12,
    query: `
      SELECT name, id, ST_Area(geog) as area, ST_AsGeoJson(ST_Envelope(geog::geometry)) as bounds, station1, ST_PointOnSurface(geog::geometry) as geom
      FROM boundaries
    `
  },
  {
    name: "national-parks",
    minZoom: 1,
    maxZoom: 12,
    query: `
      SELECT name, id, ST_Simplify(geog::geometry, 0.0005) as geom
      FROM boundaries
    `
  }
];

const addTippecanoeProps = (data, props) => {
  return Object.assign({}, data, {
    features: data.features.map(f =>
      Object.assign({}, f, {
        tippecanoe: props
      })
    )
  });
};

const build = (data, { name, minZoom = 0, maxZoom = 99 } = {}, resolve) => {
  const newObj = addTippecanoeProps(data, {
    maxzoom: maxZoom,
    minzoom: minZoom,
    layer: name
  });

  jsonfile.writeFile("./" + tempFileName, newObj, { flag: "a" }, () => {
    console.log(name + " done!");
    resolve();
  });
};

const pool = gQuery.pool();

const processes = queries.map(q => {
  return new Promise(resolve => {
    gQuery.query(q.query, pool, result => {
      gQuery.geoJson(result, result => {
        build(
          q.labelLength ? labelMaker(result, q.labelLength) : result,
          q,
          resolve
        );
      });
    });
  });
});

Promise.all(processes).then(() => {
  console.log("making tiles...");
  exec(
    `tippecanoe --quiet -f -P -M 100000 -as -an -al -ap -o tiles/local.mbtiles ${tempFileName}`
  );
  fs.unlink("./" + tempFileName, () => {
    console.log(
      "Done! Tiles are cached into memory by the server. You will need to restart."
    );
  });
});
