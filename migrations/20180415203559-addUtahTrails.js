'use strict';

const utils = require('../db/migrationUtils');

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, next) {
  utils.uploadShapeFile({
    tableName: 'utah_trails',
    directoryName: 'utah_state',
    filename: 'Trails',
    srid: '26912'
  });

  db.runSql(`
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

      ${utils.packandExplodeTrails('utah_trails')}
      ${utils.patchDisconnectedTrails('utah_trails')}
      ${utils.mergeIntoTrailsTable({
        mergingTableName: 'utah_trails',
        sourceUrl: 'https://gis.utah.gov/data/recreation/trails/'
      })}
  `, (err) => {
    if (err) console.log(err);
    console.log("done with utah")
    next();
  });
};

exports.down = function(db, next) {
  db.runSql("DELETE FROM trails WHERE source = 'https://gis.utah.gov/data/recreation/trails/'", next);
};

exports._meta = {
  "version": 1
};
