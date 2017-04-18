'use strict'

const utils = require('./migrationUtils');

exports.up = function(next) {
  utils.uploadShapeFile({
    tableName: 'utah_trails',
    directoryName: 'utah_state',
    filename: 'Trails',
    srid: '26912'
  });

  utils.genericQuery(`
    ALTER TABLE utah_trails ADD type text;
    UPDATE utah_trails SET
      type = CASE
      WHEN cartocode like '%4%' THEN 'road'
      WHEN designated like '%4WD%' THEN 'road'
      WHEN designated like '%ATV%' THEN 'atv'
      WHEN designated like '%MOTORCYCLE%' THEN 'motorcycle'
      WHEN designated like '%BIKE%' THEN 'bike'
      WHEN designated like '%HORSE%' THEN 'hike'
      WHEN designated like '%HIKE%' THEN 'hike'
      END;
      ALTER TABLE utah_trails RENAME COLUMN primarynam TO name;
  `, function(){
    utils.packandExplodeTrails('utah_trails', () => {
      utils.patchDisconnectedTrails('utah_trails', () => {
        utils.mergeIntoTrailsTable({
          mergingTableName: 'utah_trails',
          sourceUrl: 'https://gis.utah.gov/data/recreation/trails/'
        }, next);
      });
    });
  })
};

exports.down = function(next) {
  utils.genericQuery("DELETE FROM trails WHERE source = 'https://gis.utah.gov/data/recreation/trails/'", next);
};
