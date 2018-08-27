"use strict";

const utils = require("../db/migrationUtils");

exports.up = function(db, next) {
  utils.uploadShapeFile({
    tableName: "washington_trails",
    directoryName: "washington_state",
    filename: "WA_RCO_Trail_2015",
    srid: "2927"
  });

  db.runSql(
    `
    ALTER TABLE washington_trails ADD type text;
    UPDATE washington_trails SET
      type = CASE
      WHEN four_wheel = 'Yes' then 'road'
      WHEN atv = 'Yes' THEN 'atv'
      WHEN motorcycle = 'Yes' THEN 'motorcycle'
      WHEN bicycle = 'Yes' THEN 'bike'
      WHEN pack_and_s = 'Yes' THEN 'hike'
      WHEN hiker_pede = 'Yes' THEN 'hike'
      WHEN snowshoe = 'Yes' THEN 'snow'
      WHEN cross_coun = 'Yes' THEN 'snow'
      WHEN snowmobile = 'Yes' THEN 'snow'
      END;

      ALTER TABLE washington_trails RENAME COLUMN tr_nm TO name;

      ${utils.packandExplodeTrails("washington_trails")}
      ${utils.patchDisconnectedTrails("washington_trails")}
      ${utils.mergeIntoTrailsTable({
    mergingTableName: "washington_trails",
    sourceUrl: "http://www.rco.wa.gov/maps/Data.shtml"
  })}
  `,
    err => {
      if (err) console.log(err);
      next();
    }
  );
};

exports.down = function(db, next) {
  db.runSql(
    "DELETE FROM trails WHERE source = 'http://www.rco.wa.gov/maps/Data.shtml'",
    next
  );
};

exports._meta = {
  version: 1
};
