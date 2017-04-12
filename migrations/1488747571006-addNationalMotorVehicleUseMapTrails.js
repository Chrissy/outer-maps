'use strict'

const utils = require('./migrationUtils');

exports.up = function(next) {
  utils.uploadShapeFile({
    tableName: 'national_mvum_trails',
    directoryName: 'national_mvum_trails',
    filename: 'S_USA.Trail_MVUM',
    srid: '4269'
  });

  utils.genericQuery(`
    ALTER TABLE national_mvum_trails ADD type text;
    UPDATE national_mvum_trails SET
      type = CASE
      WHEN fourwd_gt5 = 'open' then 'road'
      WHEN atv = 'open' THEN 'atv'
      WHEN motorcycle = 'open' THEN 'motorcycle'
      END;
  `)

  utils.mergeIntoTrailsTable({
    baseTableName: 'trails',
    mergingTableName: 'national_mvum_trails',
    name: 'name',
    sourceId: 'id',
    geog: 'geog',
    type: 'type',
    sourceUrl: 'https://data.fs.usda.gov/geodata/edw/edw_resources/meta/S_USA.Road_MVUM.xml',
  }, next);
};

exports.down = function(next) {
  utils.genericQuery("DELETE FROM trails WHERE source = 'https://data.fs.usda.gov/geodata/edw/edw_resources/meta/S_USA.Road_MVUM.xml'", next);
};
