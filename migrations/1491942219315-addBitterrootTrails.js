'use strict'

const utils = require('./migrationUtils');

exports.up = function(next) {
  console.log("uploading bitterroot...")

  utils.uploadShapeFile({
    tableName: 'bitterroot',
    directoryName: 'idaho_trails',
    filename: 'bitterroot',
    srid: '26911'
  });

  utils.genericQuery(`
    ALTER TABLE bitterroot ADD type text;
    UPDATE bitterroot SET
      type = CASE
      WHEN designed_u like '%ATV%' THEN 'atv'
      WHEN designed_u like '%MTRCYCL%' THEN 'motorcycle'
      WHEN designed_u like '%PACK%' THEN 'hike'
      WHEN designed_u like '%HIKE%' THEN 'hike'
      END;
    ALTER TABLE bitterroot ADD geog2d geography;
    UPDATE bitterroot SET geog2d = ST_Force2D(geog::geometry);
  `, function(){
    utils.mergeIntoTrailsTable({
      baseTableName: 'trails',
      mergingTableName: 'bitterroot',
      name: 'name',
      sourceId: 'id',
      geog: 'geog2d',
      type: 'type',
      sourceUrl: 'https://www.fs.usda.gov/detailfull/bitterroot/landmanagement/gis/?cid=fseprd523955&width=full',
    }, next);
  })
};

exports.down = function(next) {
  utils.genericQuery("DELETE FROM trails WHERE source = 'https://www.fs.usda.gov/detailfull/bitterroot/landmanagement/gis/?cid=fseprd523955&width=full'", next);
};
