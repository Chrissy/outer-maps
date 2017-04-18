'use strict'

const utils = require('./migrationUtils');

exports.up = function(next) {
  console.log("uploading nez perce...")
  //no type for this source. periodically check for updates here

  utils.uploadShapeFile({
    tableName: 'nez_perce',
    directoryName: 'idaho_trails',
    filename: 'TrailNez_20120328',
    srid: '26911'
  });

  utils.genericQuery(`
    ALTER TABLE nez_perce ADD type text;
    UPDATE nez_perce SET type = 'mixed';
    ALTER TABLE nez_perce ADD geog2d geography;
    UPDATE nez_perce SET geog2d = ST_Force2D(geog::geometry);
    ALTER TABLE nez_perce RENAME COLUMN geog2d TO geog;
  `, function(){
    utils.packandExplodeTrails('nez_perce', () => {
      utils.mergeIntoTrailsTable({
        mergingTableName: 'nez_perce',
        sourceUrl: 'https://www.fs.usda.gov/main/nezperceclearwater/landmanagement/gis#nezperce',
      }, next);
    });
  })
};

exports.down = function(next) {
  utils.genericQuery("DELETE FROM trails WHERE source = 'https://www.fs.usda.gov/detailfull/bitterroot/landmanagement/gis/?cid=fseprd523955&width=full'", next);
};
