const execSync = require("child_process").execSync;
const path = require("path").normalize;

const databaseName = process.env.DEV_DATABASE || process.env.DATABASE_NAME;
const user = process.env.DEV_USER || process.env.DATABASE_USER || "";

if (!databaseName) console.log("warning: no database name");

exports.uploadShapeFile = function(
  { directoryName, filename, srid = "4326", tableName },
  cb
) {
  console.log("uploading...");

  const pathStr = path(process.env.LIB + "/" + directoryName);

  execSync(
    `shp2pgsql -G -c -s ${srid}:4326 ${filename}.shp public.${tableName} | psql -d ${databaseName} ${user}`,
    { cwd: pathStr }
  );

  if (cb) cb();
};

exports.insertElevationRasters = function(
  { directoryName, srid = "4326", tableName } = {},
  cb
) {
  console.log("inserting...");

  const pathStr = path(process.env.LIB + "/" + directoryName);

  execSync(
    `raster2pgsql -s ${srid} -t "auto" -C *.tif public.${tableName} | psql -d ${databaseName} ${user}`,
    { cwd: pathStr }
  );

  if (cb) cb();
};

exports.deleteDuplicateTrails = function({ from, using }) {
  const query = `
    WITH t1 AS (
      SELECT
        geog::geometry as geom
      FROM trails
      WHERE source = '${using}'
      GROUP BY geom),
    t2 AS (
      SELECT
        geog::geometry as geom,
        id
      FROM trails
      WHERE source = '${from}'
      GROUP BY geom, id)
    DELETE FROM trails WHERE id IN (
      SELECT
        t2.id AS id
      FROM t1, t2
      WHERE
        ST_Intersects(t1.geom, t2.geom)
        AND ST_NumGeometries(ST_Intersection(t1.geom, t2.geom)) > 5
      GROUP BY t2.id);
  `;

  console.log(
    "deleting duplicates. this job takes a while and will continue to run asynchonously"
  );

  return query;
};

exports.packTrails = function(baseTableName) {
  const query = `
    CREATE TABLE merge_line_attempt(name, geog, type) AS
    SELECT
      name,
      ST_LineMerge(ST_Union(geog::geometry)) as geog,
      type
    FROM ${baseTableName}
    GROUP BY name, geog, type;

    DROP TABLE ${baseTableName};
    ALTER TABLE merge_line_attempt RENAME TO ${baseTableName};
    `;

  return query;
};

exports.explodeTrails = function(baseTableName) {
  const query = `
    CREATE TABLE explode_attempt(name, geog, type) AS
    SELECT
      dumped.name as name,
      (dumped.geom_dump).geom as simple_geom,
      dumped.type as type
    FROM (
      SELECT
        name,
        type,
        ST_Dump(ST_LineMerge(geog::geometry)) AS geom_dump
        FROM ${baseTableName}
        GROUP BY name, type, geom_dump) AS dumped
    GROUP BY name, simple_geom, type;

    DROP TABLE ${baseTableName};
    ALTER TABLE explode_attempt RENAME TO ${baseTableName};
    `;

  return query;
};

exports.packandExplodeTrails = function(baseTableName) {
  return `
    ${exports.packTrails(baseTableName)}
    ${exports.explodeTrails(baseTableName)}
  `;
};

exports.patchDisconnectedTrails = function(baseTableName) {
  const query = `
    ALTER TABLE ${baseTableName} ADD COLUMN id SERIAL PRIMARY KEY;

    WITH pool AS (
      SELECT
        id,
        name,
        geog,
        type
      FROM ${baseTableName}
      GROUP BY id, name, geog, type),
    values AS (
      SELECT
        distinct ON (geom) p1.name AS name,
        p1.type AS type,
        p1.geog AS geog1,
        p2.geog AS geog2,
        p1.id AS id1,
        p2.id AS id2,
        ST_ShortestLine(
          ST_Collect(ST_StartPoint(p1.geog::geometry), ST_EndPoint(p1.geog::geometry)),
          ST_Collect(ST_StartPoint(p2.geog::geometry), ST_EndPoint(p2.geog::geometry))
        ) AS geom
        FROM pool p1, pool p2
        WHERE p1.name = p2.name
          AND p1.type = p2.type
          AND p1.id != p2.id
        GROUP BY p1.name, p1.type, p1.geog, p2.geog, p1.id, p2.id, geom)
    INSERT INTO ${baseTableName}(name, geog, type)
    SELECT
      name,
      geom,
      type
    FROM values
    WHERE ST_Length(geom) < 0.002
    GROUP BY name, geom, type;
    `;

  console.log("connecting broken trails...");

  return `
      ${query}
      ${exports.packTrails(baseTableName)}
      ${exports.explodeTrails(baseTableName)}
    `;
};

exports.mergeIntoTrailsTable = function({ mergingTableName, sourceUrl } = {}) {
  const query = `
    CREATE TABLE merge_table AS SELECT * FROM trails;

    INSERT INTO merge_table(name, geog, type, source)
    SELECT
      name,
      geog,
      type,
      '${sourceUrl}' as sourceUrl
    FROM ${mergingTableName}
    GROUP BY name, geog, type, sourceUrl;

    DROP TABLE trails;
    DROP TABLE ${mergingTableName};
    ALTER TABLE merge_table RENAME TO trails;

    ALTER TABLE trails DROP COLUMN id;
    ALTER TABLE trails ADD COLUMN id SERIAL PRIMARY KEY;
  `;

  console.log("merging...");

  return query;
};

exports.mergeIntoBoundariesTable = function({
  baseTableName,
  mergingTableName,
  name = "name",
  region = "region",
  geog = "geog",
  sourceUrl
} = {}) {
  const query = `
    CREATE TABLE ${baseTableName}__new AS SELECT * FROM ${baseTableName};

    INSERT INTO ${baseTableName}__new(name, region, geog, source)
    SELECT
      ${name} as name,
      ${region} as region,
      ${geog} as geog,
      '${sourceUrl}' as sourceUrl
    FROM ${mergingTableName}
    GROUP BY name, region, geog, sourceUrl;

    DROP TABLE ${baseTableName};

    ALTER TABLE ${baseTableName}__new RENAME TO ${baseTableName};

    ALTER TABLE ${baseTableName} DROP COLUMN id;
    ALTER TABLE ${baseTableName} ADD COLUMN id SERIAL PRIMARY KEY;

    DROP TABLE ${mergingTableName};
  `;

  console.log("merging...");

  return query;
};
