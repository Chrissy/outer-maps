'use strict'

const utils = require('./migrationUtils');

exports.up = function(next) {
  utils.uploadShapeFile({
    tableName: 'national_park_boundaries',
    directoryName: 'national_park_boundaries',
    filename: 'nps_boundary',
    srid: "4269"
  });

  utils.mergeIntoBoundariesTable({
    baseTableName: 'boundaries',
    mergingTableName: 'national_park_boundaries',
    name: 'unit_name',
    region: 'region',
    geog: 'geog',
    sourceUrl: 'https://irma.nps.gov/DataStore/Reference/Profile/2225713',
  }, next);
};

exports.down = function(next) {
  utils.genericQuery("DELETE FROM boundaries WHERE source = 'https://irma.nps.gov/DataStore/Reference/Profile/2225713'", next);
};
