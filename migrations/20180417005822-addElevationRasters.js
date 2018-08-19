'use strict';

var dbm;
var type;
var seed;

const utils = require('../db/migrationUtils');

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
  utils.insertElevationRasters({
    directoryName: 'elevation_rasters',
    srid: '4326',
    tableName: 'elevation'});
  db.runSql("SELECT current_user", next);
};

exports.down = function(db, next) {
  db.runSql("DROP TABLE elevation", next);
};

exports._meta = {
  "version": 1
};
