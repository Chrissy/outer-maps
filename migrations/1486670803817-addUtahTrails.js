'use strict'

const utils = require('./migrationUtils');

exports.up = function(next) {
  utils.uploadShapeFile({
    tableName: 'utah_trails',
    directoryName: 'utah_state',
    filename: 'Trails',
    srid: '26912'
  });

  utils.mergeIntoTrailsTable({
    baseTableName: 'trails',
    mergingTableName: 'utah_trails',
    name: 'primarynam',
    surface: 'surfacetyp',
    sourceId: 'trailid',
    geog: 'geog',
    sourceUrl: 'https://gis.utah.gov/data/recreation/trails/',
  }, next);
};

exports.down = function(next) {
  utils.genericQuery("DELETE FROM trails WHERE source = 'https://gis.utah.gov/data/recreation/trails/'", next);
};
