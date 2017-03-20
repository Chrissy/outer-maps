'use strict'

const utils = require('./migrationUtils');

exports.up = function(next) {
  utils.uploadShapeFile({
    tableName: 'national_forest_service_trails',
    directoryName: 'national_forest_service_trails',
    filename: 'trails',
    srid: '4269'
  });

  utils.mergeIntoTrailsTable({
    baseTableName: 'trails',
    mergingTableName: 'national_forest_service_trails',
    name: 'trail_name',
    sourceId: 'trail_cn',
    geog: 'geog',
    sourceUrl: 'https://data.fs.usda.gov/geodata/edw/edw_resources/meta/S_USA.TrailNFS_Publish.xml',
  }, next);
};

exports.down = function(next) {
  utils.genericQuery("DELETE FROM trails WHERE source = 'https://data.fs.usda.gov/geodata/edw/edw_resources/meta/S_USA.TrailNFS_Publish.xml'", next);
};
