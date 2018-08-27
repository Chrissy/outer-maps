"use strict";

const utils = require("../db/migrationUtils");

exports.up = function(db, next) {
  utils.insertElevationRasters({
    directoryName: "elevation_rasters",
    srid: "4326",
    tableName: "elevation"
  });
  db.runSql("SELECT current_user", next);
};

exports.down = function(db, next) {
  db.runSql("DROP TABLE elevation", next);
};

exports._meta = {
  version: 1
};
