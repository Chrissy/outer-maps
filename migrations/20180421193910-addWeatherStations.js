'use strict';

import Moment from 'moment';
import utils from '../db/migrationUtils';

var dbm;
var type;
var seed;
const moment = new Moment;


const addStationsToGeoTable = (table, db, cb) => {
  console.log(`assigning weather stations to ${table} based on location. this could take a while!`)

  db.runSql(`
    CREATE TABLE stations_index AS
    WITH t AS (SELECT * FROM ${table}),
    s AS (SELECT * FROM stations)
    SELECT DISTINCT ON (t.id) t.id, t.name, s.stationid
    FROM t LEFT JOIN s
    ON st_dwithin(s.geog, t.geog, 100000, false) ORDER BY t.id, s.geog <-> t.geog;

    CREATE TABLE ${table}_new AS
    SELECT t.*, s.stationid AS station1
    FROM ${table} AS t, stations_index as s
    WHERE t.id = s.id;

    DROP TABLE ${table};
    ALTER TABLE ${table}_new RENAME TO ${table};

    ALTER TABLE ${table} DROP COLUMN id;
    ALTER TABLE ${table} ADD COLUMN id SERIAL PRIMARY KEY;

    DROP TABLE stations_index;
  `, cb);
};

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, next) {
  console.log("adding noaa stations to db...");
  console.log("Starting at " + moment.format("MMMM Do YYYY, h:mm:ss a"));

  utils.uploadShapeFile({
    tableName: 'stations',
    directoryName: 'noaa_stations',
    filename: 'stations',
    srid: '4326'
  }, () => {
    addStationsToGeoTable('boundaries', db, () => {
      addStationsToGeoTable('trails', db, () => {
        db.runSql('DROP TABLE stations')
        const newMoment = new Moment;
        console.log("Done! " + newMoment.format("MMMM Do YYYY, h:mm:ss a"));
        next();
      });
    });
  });
};

exports.down = function(db, next) {
  db.runSql(`
    ALTER TABLE trails DROP COLUMN station1;
    ALTER TABLE boundaries DROP COLUMN station1;
  `)
};

exports._meta = {
  "version": 1
};
