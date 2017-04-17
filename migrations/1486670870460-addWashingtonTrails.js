'use strict'

const utils = require('./migrationUtils');

exports.up = function(next) {
  utils.uploadShapeFile({
    tableName: 'washington_trails',
    directoryName: 'washington_state',
    filename: 'WA_RCO_Trail_2015',
    srid: "2927"
  });

  utils.genericQuery(`
    ALTER TABLE washington_trails ADD type text;
    UPDATE washington_trails SET
      type = CASE
      WHEN four_wheel = 'Yes' then 'road'
      WHEN atv = 'Yes' THEN 'atv'
      WHEN motorcycle = 'Yes' THEN 'motorcycle'
      WHEN bicycle = 'Yes' THEN 'bike'
      WHEN pack_and_s = 'Yes' THEN 'horse'
      WHEN hiker_pede = 'Yes' THEN 'hike'
      WHEN snowshoe = 'Yes' THEN 'snow'
      WHEN cross_coun = 'Yes' THEN 'snow'
      WHEN snowmobile = 'Yes' THEN 'snow'
      END;
  `)

  utils.mergeIntoTrailsTable({
    baseTableName: 'trails',
    mergingTableName: 'washington_trails',
    name: 'tr_nm',
    geog: 'geog',
    type: 'type',
    sourceUrl: 'http://www.rco.wa.gov/maps/Data.shtml',
  }, next);
};

exports.down = function(next) {
  utils.genericQuery("DELETE FROM trails WHERE source = 'http://www.rco.wa.gov/maps/Data.shtml'", next);
};
