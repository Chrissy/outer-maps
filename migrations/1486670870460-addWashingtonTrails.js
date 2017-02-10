'use strict'

const utils = require('./migrationUtils');

exports.up = function(next) {
  utils.uploadShapeFile({
    tableName: 'washington_trails',
    directoryName: 'washington_state',
    filename: 'WA_RCO_Trail_2015',
    srid: "2927"
  });

  utils.mergeIntoTrailsTable({
    baseTableName: 'trails',
    mergingTableName: 'washington_trails',
    name: 'tr_nm',
    surface: 'tr_surfc',
    sourceId: 'globalid',
    geog: 'geog',
    sourceUrl: 'http://www.rco.wa.gov/maps/Data.shtml',
  }, next);
};

exports.down = function(next) {
  utils.genericQuery("DELETE FROM trails WHERE source = 'http://www.rco.wa.gov/maps/Data.shtml'", next);
};
