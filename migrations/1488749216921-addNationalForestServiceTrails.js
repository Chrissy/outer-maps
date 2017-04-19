'use strict'

const utils = require('./migrationUtils');

exports.up = function(next) {
  utils.uploadShapeFile({
    tableName: 'national_forest_service_trails',
    directoryName: 'national_forest_service_trails',
    filename: 'trails',
    srid: '4269'
  });

  utils.genericQuery(`
    ALTER TABLE national_forest_service_trails ADD type text;
    UPDATE national_forest_service_trails SET
      type = CASE
      WHEN allowed_te like '%6%' then 'road'
      WHEN allowed_te like '%5%' THEN 'atv'
      WHEN allowed_te like '%4%' THEN 'motorcycle'
      WHEN allowed_te like '%3%' THEN 'bike'
      WHEN allowed_te like '%2%' THEN 'hike'
      WHEN allowed_te like '%1%' THEN 'hike'
      WHEN allowed_sn like 'N/A' THEN 'snow'
      END;
      ALTER TABLE national_forest_service_trails RENAME COLUMN trail_name TO name;
  `, function(){
    utils.packandExplodeTrails('national_forest_service_trails', () => {
      utils.mergeIntoTrailsTable({
        mergingTableName: 'national_forest_service_trails',
        sourceUrl: 'https://data.fs.usda.gov/geodata/edw/edw_resources/meta/S_USA.TrailNFS_Publish.xml'
      }, function(){
        utils.deleteDuplicateTrails({
          from:'https://data.fs.usda.gov/geodata/edw/edw_resources/meta/S_USA.TrailNFS_Publish.xml',
          using:'https://gis.utah.gov/data/recreation/trails/'
        });
        utils.deleteDuplicateTrails({
          from: 'https://data.fs.usda.gov/geodata/edw/edw_resources/meta/S_USA.TrailNFS_Publish.xml',
          using: 'http://www.rco.wa.gov/maps/Data.shtml'
        });
        next();
      });
    });
  })
};

exports.down = function(next) {
  utils.genericQuery("DELETE FROM trails WHERE source = 'https://data.fs.usda.gov/geodata/edw/edw_resources/meta/S_USA.TrailNFS_Publish.xml'", next);
};
