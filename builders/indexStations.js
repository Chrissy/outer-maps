const utils = require('../migrations/migrationUtils');
const Moment = require('moment');
const moment = new Moment;

if (!process.argv.length) console.log("stations indexer requires a geo table to index")

console.log("adding noaa stations to db...");

console.log("Starting at " + moment.format("MMMM Do YYYY, h:mm:ss a"))

const table = process.argv[2];

utils.uploadShapeFile({
  tableName: 'stations',
  directoryName: 'noaa_stations',
  filename: 'stations',
  srid: '4326'
}, () => {
  console.log(`assigning weather stations to ${table} based on location. this could take a while!`)

  utils.genericQuery(`
    CREATE TABLE stations_index AS
    WITH t AS (SELECT * FROM ${table}),
    s AS (SELECT * FROM stations)
    SELECT DISTINCT ON (t.id) t.id, t.name, s.stationid
    FROM t LEFT JOIN s
    ON st_dwithin(s.geog, t.geog, 100000, false) ORDER BY t.id, s.geog <-> t.geog;

    CREATE TABLE ${table}_new AS
    SELECT t.*, s.stationid AS station1
    FROM ${table} AS t, stations_index as s
    WHERE t.id = s.id;

    DROP TABLE ${table};
    ALTER TABLE ${table}_new RENAME TO ${table};

    ALTER TABLE ${table} DROP COLUMN id;
    ALTER TABLE ${table} ADD COLUMN id SERIAL PRIMARY KEY;

    DROP TABLE stations_index, stations;
  `, () => {
    const newMoment = new Moment;
    console.log("Done! " + newMoment.format("MMMM Do YYYY, h:mm:ss a"))
  })

});
