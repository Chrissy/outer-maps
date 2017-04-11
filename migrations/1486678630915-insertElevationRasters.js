'use strict'

const utils = require('./migrationUtils');

exports.up = function(next) {
  utils.insertElevationRasters({
    directoryName: 'elevation_rasters',
    srid: '4326',
    tableName: 'elevation'
  }, next);
};

exports.down = function(next) {
  utils.genericQuery("DROP TABLE elevation", next);
};
