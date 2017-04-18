'use strict'

const utils = require('./migrationUtils');

exports.up = function(next) {
  console.log("uploading clearwater...");
  //no type for this source. periodically check for updates here

  utils.uploadShapeFile({
    tableName: 'clearwater',
    directoryName: 'idaho_trails',
    filename: 'TrailClw_20120328',
    srid: '26911'
  });

  utils.genericQuery(`
    ALTER TABLE clearwater ADD type text;
    UPDATE clearwater SET type = 'mixed';
    ALTER TABLE clearwater ADD geog2d geography;
    UPDATE clearwater SET geog2d = ST_Force2D(geog::geometry);
  `, function(){
    utils.mergeIntoTrailsTable({
      baseTableName: 'trails',
      mergingTableName: 'clearwater',
      name: 'name',
      sourceId: 'rte_cn',
      geog: 'geog2d',
      type: 'type',
      sourceUrl: 'https://www.fs.usda.gov/main/nezperceclearwater/landmanagement/gis#clearwater',
    }, next);
  })
};

exports.down = function(next) {
  utils.genericQuery("DELETE FROM trails WHERE source = 'https://www.fs.usda.gov/main/nezperceclearwater/landmanagement/gis#clearwater'", next);
};
