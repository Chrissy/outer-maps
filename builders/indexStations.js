const utils = require('../migrations/migrationUtils');
const Moment = require('moment');
const moment = new Moment;

console.log("adding noaa stations to db...");

console.log("Starting at " + moment.format("MMMM Do YYYY, h:mm:ss a"))

utils.uploadShapeFile({
  tableName: 'stations',
  directoryName: 'noaa_stations',
  filename: 'stations',
  srid: '4326'
}, () => {
  console.log("assigning weather stations to trails based on location. this could take up to an hour!")

  utils.genericQuery(`
    create table stations_index as
    with t as (select * from trails where type = 'hike' OR type = 'horse' OR type = 'bike' OR type = 'motorcycle' OR type = 'atv' AND name != ''),
    s as (select * from stations)
    select distinct on (t.id) t.id, t.name, s.stationid
    from t left join s
    on st_dwithin(s.geog, t.geog, 50000, false) order by t.id, s.geog <-> t.geog;

    CREATE TABLE trails_new AS
    SELECT trail.id, trail.name, trail.source_id, trail.source, trail.type, trail.geog, stationid AS station1
    FROM trails AS trail, stations_index AS station
    WHERE trail.id = station.id;

    DROP TABLE trails;
    ALTER TABLE trails_new RENAME TO trails;

    ALTER TABLE trails DROP COLUMN id;
    ALTER TABLE trails ADD COLUMN id SERIAL PRIMARY KEY;

    DROP TABLE stations_index, stations;
  `, () => {
    const newMoment = new Moment;
    console.log("Done! " + newMoment.format("MMMM Do YYYY, h:mm:ss a"))
  })

});
