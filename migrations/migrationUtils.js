const pg = require('pg');
const env = require('../environment/development');
const execSync = require('child_process').execSync;
const path = require('path').normalize;

const genericQuery = function(query, cb) {
    var pool = new pg.Pool({
      database: env.databaseName,
      max: 10,
      idleTimeoutMillis: 3000,
      user: env.dbUser
    });

    pool.connect(function(err, client, done){
      client.query(query, function(err, result){
        if (err) console.log(err);

        done();

        console.log(result);
        if (cb) cb();
      });
    });
}

exports.genericQuery = genericQuery;

exports.uploadShapeFile = function({directoryName, filename, srid = '4326', tableName} = {}, cb) {
  console.log("uploading...");

  const pathStr = path(env.libDirectory + "/" + directoryName);
  const user = (env.dbUser) ? `-U ${env.dbUser}` : '';

  execSync(`shp2pgsql -G -c -s ${srid}:4326 ${filename}.shp public.${tableName} | psql -d ${env.databaseName} ${user}`, {cwd: pathStr});

  if (cb) cb();
}

exports.insertElevationRasters = function({directoryName, srid = '4326', tableName} = {}, cb) {
  console.log("inserting...");

  const pathStr = path(env.libDirectory + "/" + directoryName);
  const user = (env.dbUser) ? `-U ${env.dbUser}` : '';

  execSync(`raster2pgsql -s ${srid} -t "auto" -C *.tif public.${tableName} | psql -d ${env.databaseName} ${user}`, {cwd: pathStr});

  if (cb) cb()
}

exports.mergeIntoTrailsTable = function({baseTableName, mergingTableName, name = 'name', geog = 'geog', sourceUrl, type = 'type'} = {}, callback) {
  const query = `
    CREATE TABLE ${mergingTableName}__merge_line_attempt AS
    SELECT ${type} as ${type}, ${name} as ${name},
    ST_LineMerge(ST_Union(${geog}::geometry)) as ${geog}
    FROM ${mergingTableName} group by ${name}, ${type};

    CREATE TABLE ${mergingTableName}__explode_attempt(${name}, ${geog}, ${type}, source) AS
    SELECT
      simple.${name},
      simple.simple_geom,
      simple.${type},
      '${sourceUrl}'
    FROM (
      SELECT
        dumped.*,
        (dumped.geom_dump).geom as simple_geom,
        (dumped.geom_dump).path as path
      FROM (
        SELECT *, ST_Dump(ST_LineMerge(${geog}::geometry)) AS geom_dump FROM ${mergingTableName}__merge_line_attempt
      ) AS dumped
    ) AS simple;

    DROP TABLE ${mergingTableName}__merge_line_attempt;
    ALTER TABLE ${mergingTableName}__explode_attempt ADD COLUMN id SERIAL PRIMARY KEY;

    WITH pool AS
      (SELECT id, ${name} as name, ${geog} as geog, ${type} as type, source FROM ${mergingTableName}__explode_attempt),
    values AS
      (SELECT distinct ON (geom) p1.name AS name, p1.type AS type, p1.geog AS geog1, p2.geog AS geog2, p1.id AS id1, p2.id AS id2,
        ST_ShortestLine(
          ST_Collect(ST_StartPoint(p1.geog::geometry), ST_EndPoint(p1.geog::geometry)),
          ST_Collect(ST_StartPoint(p2.geog::geometry), ST_EndPoint(p2.geog::geometry))
        ) AS geom
      from pool p1, pool p2 WHERE p1.name = p2.name AND p1.type = p2.type AND p1.id != p2.id)
    INSERT INTO ${mergingTableName}__explode_attempt(${name}, ${geog}, ${type}, source)
    SELECT name, geom, type, '${sourceUrl}' from values where ST_Length(geom) < 0.001;

    CREATE TABLE ${mergingTableName}__merge_line_attempt AS
    SELECT ${type} as ${type}, ${name} as ${name},
    ST_LineMerge(ST_Union(${geog}::geometry)) as ${geog}
    FROM ${mergingTableName}__explode_attempt group by ${name}, ${type};

    DROP TABLE ${mergingTableName}__explode_attempt;

    CREATE TABLE ${mergingTableName}__explode_attempt(${name}, ${geog}, ${type}, source) AS
    SELECT
      simple.${name},
      simple.simple_geom,
      simple.${type},
      '${sourceUrl}'
    FROM (
      SELECT
        dumped.*,
        (dumped.geom_dump).geom as simple_geom,
        (dumped.geom_dump).path as path
      FROM (
        SELECT *, ST_Dump(ST_LineMerge(${geog}::geometry)) AS geom_dump FROM ${mergingTableName}__merge_line_attempt
      ) AS dumped
    ) AS simple;

    CREATE TABLE ${baseTableName}__new AS SELECT * FROM ${baseTableName};

    INSERT INTO ${baseTableName}__new(name, geog, type, source) SELECT ${name}, ${geog}, ${type}, source from ${mergingTableName}__explode_attempt;

    DROP TABLE ${mergingTableName}__merge_line_attempt;
    DROP TABLE ${baseTableName};

    ALTER TABLE ${baseTableName}__new RENAME TO ${baseTableName};

    ALTER TABLE ${baseTableName} DROP COLUMN id;
    ALTER TABLE ${baseTableName} ADD COLUMN id SERIAL PRIMARY KEY;

    DROP TABLE ${mergingTableName};
  `;

  console.log("merging...")

  return genericQuery(query, callback);
}

exports.mergeIntoBoundariesTable = function({baseTableName, mergingTableName, name = 'name', region = 'region', geog = 'geog', sourceUrl} = {}, callback) {
  const query = `
    CREATE TABLE ${baseTableName}__new AS SELECT * FROM ${baseTableName};

    INSERT INTO ${baseTableName}__new(name, region, geog, source)
    SELECT ${name}, ${region}, ${geog}, '${sourceUrl}' FROM ${mergingTableName};

    DROP TABLE ${baseTableName};

    ALTER TABLE ${baseTableName}__new RENAME TO ${baseTableName};

    ALTER TABLE ${baseTableName} DROP COLUMN id;
    ALTER TABLE ${baseTableName} ADD COLUMN id SERIAL PRIMARY KEY;

    DROP TABLE ${mergingTableName};
  `;

  console.log("merging...")

  return genericQuery(query, callback);
}
