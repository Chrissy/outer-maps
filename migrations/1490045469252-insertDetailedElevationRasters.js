'use strict'

const utils = require('./migrationUtils');

exports.up = function(next) {
  utils.insertElevationRasters({
    directoryName: 'detailed_elevation_rasters',
    srid: '4326',
    tableName: 'elevation_detailed'
  });

  next();
};

exports.down = function(next) {
  utils.genericQuery("DROP TABLE elevation_detailed", next);
};
