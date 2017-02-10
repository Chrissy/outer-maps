const pg = require('pg');
const env = require('../environment/development');
const execSync = require('child_process').execSync;
const path = require('path').normalize;

const genericQuery = function(query, callback) {
    var pool = new pg.Pool({
      database: env.databaseName,
      max: 10,
      idleTimeoutMillis: 3000,
      user: dbUser
    });

    pool.connect(function(err, client, done){
      client.query(query, function(err, result){
        if (err) console.log(err);

        done();

        console.log(result);
        callback();
      });
    });
}

exports.genericQuery = genericQuery;

exports.uploadShapeFile = function({directoryName, filename, srid = '4326', tableName} = {}) {
  console.log("uploading...");

  const pathStr = path(env.libDirectory + "/" + directoryName);
  const user = (env.dbUser) ? `-U ${env.dbUser}` : '';

  execSync(`shp2pgsql -G -c -s ${srid}:4326 ${filename}.shp public.${tableName} | psql -d ${env.databaseName} ${user}`, {cwd: pathStr});
}

exports.mergeIntoTrailsTable = function({baseTableName, mergingTableName, name = 'name', surface = 'surface', sourceId='source_id', geog = 'geog', sourceUrl} = {}, callback) {
  const query = `
    CREATE TABLE ${baseTableName}__new AS SELECT * FROM ${baseTableName};

    INSERT INTO ${baseTableName}__new(name, surface, source_id, geog, source)
    SELECT ${name}, ${surface}, ${sourceId}, ${geog}, '${sourceUrl}' FROM ${mergingTableName};

    DROP TABLE ${baseTableName};

    ALTER TABLE ${baseTableName}__new RENAME TO ${baseTableName};

    ALTER TABLE ${baseTableName} DROP COLUMN id;
    ALTER TABLE ${baseTableName} ADD COLUMN id SERIAL PRIMARY KEY;

    DROP TABLE ${mergingTableName};
  `;

  console.log("merging...")

  return genericQuery(query, callback);
}

exports.insertElevationRasters = function({directoryName, srid = '4326', tableName} = {}) {
  console.log("inserting...");

  const pathStr = path(env.libDirectory + "/" + directoryName);
  const user = (env.dbUser) ? `-U ${env.dbUser}` : '';

  execSync(`raster2pgsql -s ${srid} -C *.tif public.${tableName} | psql -d ${env.databaseName} ${user}`, {cwd: pathStr});
}
