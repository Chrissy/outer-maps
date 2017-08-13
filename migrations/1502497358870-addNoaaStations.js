'use strict'

const utils = require('./migrationUtils');

exports.up = function(next) {
  console.log("adding noaa stations...");
  
  utils.uploadShapeFile({
    tableName: 'stations',
    directoryName: 'noaa_stations',
    filename: 'stations',
    srid: '4326'
  });
    
  utils.genericQuery(`
    CREATE TABLE closest_stations AS WITH 
    trail AS (SELECT id, geog FROM trails), 
    station AS (SELECT * FROM stations CROSS JOIN trail WHERE datatypes 
      LIKE '%TMAX% %TMIN% %PRCP% %SNOW% %SNWD%' ORDER BY stations.geog <-> trail.geog LIMIT 1) 
    SELECT trail.id, stationid FROM trail, station;
  `)
};

exports.down = function(next) {
  utils.genericQuery("DROP TABLE stations", next);
};
