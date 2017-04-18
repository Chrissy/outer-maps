'use strict'

const utils = require('./migrationUtils');

exports.up = function(next) {
  console.log("uploading caribou-targhee...");
  //warning: still using kml data. we should replace this some day

  utils.uploadShapeFile({
    tableName: 'caribou_targhee',
    directoryName: 'idaho_trails',
    filename: 'caribou-targhee',
    srid: '4326'
  });

  utils.genericQuery(`
    ALTER TABLE caribou_targhee ADD type text;
    UPDATE caribou_targhee SET type = 'mixed';
  `, function(){
    utils.mergeIntoTrailsTable({
      baseTableName: 'trails',
      mergingTableName: 'caribou_targhee',
      name: 'name',
      sourceId: 'sourceId',
      geog: 'geog',
      type: 'type',
      sourceUrl: 'http://data.gis.idaho.gov/datasets?q=trails#caribou-targhee',
    }, next);
  })
};

exports.down = function(next) {
  utils.genericQuery("DELETE FROM trails WHERE source = 'http://data.gis.idaho.gov/datasets?q=trails#caribou-targhee'", next);
};
