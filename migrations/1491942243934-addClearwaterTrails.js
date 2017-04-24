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
    UPDATE clearwater SET
      type = CASE
      WHEN TRL_NO like '%T%' THEN 'road'
      WHEN TRL_NO like '%SNO%' THEN 'snow'
      ELSE 'horse'
      END;
    ALTER TABLE clearwater ADD geog2d geography;
    UPDATE clearwater SET geog2d = ST_Force2D(geog::geometry);
    ALTER TABLE clearwater DROP geog;
    ALTER TABLE clearwater RENAME COLUMN geog2d TO geog;
  `, function(){
    utils.packandExplodeTrails('clearwater', () => {
      utils.mergeIntoTrailsTable({
        mergingTableName: 'clearwater',
        sourceUrl: 'https://www.fs.usda.gov/main/nezperceclearwater/landmanagement/gis#clearwater',
      }, next);
    });
  })
};

exports.down = function(next) {
  utils.genericQuery("DELETE FROM trails WHERE source = 'https://www.fs.usda.gov/main/nezperceclearwater/landmanagement/gis#clearwater'", next);
};
