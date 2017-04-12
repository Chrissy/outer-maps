'use strict'

const utils = require('./migrationUtils');

exports.up = function(next) {
  console.log("uploading sawtooth...");
  //warning: still using kml data. we should replace this some day

  utils.uploadShapeFile({
    tableName: 'sawtooth',
    directoryName: 'idaho_trails',
    filename: 'sawtooth-nf',
    srid: '4326'
  });

  utils.genericQuery(`
    ALTER TABLE sawtooth ADD type text;
    UPDATE sawtooth SET type = 'hike';
  `)

  utils.mergeIntoTrailsTable({
    baseTableName: 'trails',
    mergingTableName: 'sawtooth',
    name: 'name',
    sourceId: 'sourceId',
    geog: 'geog',
    type: 'type',
    sourceUrl: 'http://data.gis.idaho.gov/datasets?q=trails#sawtooth',
  }, next);
};

exports.down = function(next) {
  utils.genericQuery("DELETE FROM trails WHERE source = 'http://data.gis.idaho.gov/datasets?q=trails#sawtooth'", next);
};
