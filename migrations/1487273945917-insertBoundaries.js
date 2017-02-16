'use strict'

const utils = require('./migrationUtils');

const landTypes = [
  'Forest Reserve BLM',
  'National Conservation Area BLM',
  'National Forest FS',
  'National Game Preserve FWS',
  'National Grassland FS',
  'National Historic Site NPS',
  'National Lakeshore NPS',
  'National Monument BLM',
  'National Monument FS',
  'National Monument NPS',
  'National Park NPS',
  'National Preserve NPS',
  'National Recreation Area BLM',
  'National Recreation Area FS',
  'National Recreation Area NPS',
  'National Reserve NPS',
  'National River NPS',
  'National Scenic Area FS',
  'National Scenic River NPS',
  'National Seashore NPS',
  'National Wild and Scenic River BLM',
  'National Wild and Scenic River NPS',
  'National Wildlife Refuge FWS',
  'Waterfowl Production Area FWS',
  'Wilderness BLM',
  'Wilderness FS',
  'Wilderness FWS',
  'Wilderness NPS',
  'Wilderness Study Area BLM',
  'Wilderness Study Area FS',
  'Wilderness Study Area FWS',
  'Wilderness Study Area NPS',
  'Wildlife Management Area FWS'
]

const fullStr = landTypes.reduce((str,type) => str.concat(`feature1='${type}' OR `),'') + "feature1 = ''";
const source = 'https://catalog.data.gov/dataset/federal-lands-of-the-united-states-direct-download';

exports.up = function(next) {

  utils.uploadShapeFile({
    tableName: 'federal_lands',
    directoryName: 'federal_lands',
    filename: 'fedlanp020',
    srid: "4269"
  });

  console.log("merging...")

  utils.genericQuery(`
    CREATE TABLE boundaries__new AS SELECT * FROM boundaries;

    INSERT INTO boundaries__new(name, state, type, geog, source)
    SELECT name1, state, feature1, geog, '${source}' FROM federal_lands WHERE ${fullStr};

    DROP TABLE boundaries;

    ALTER TABLE boundaries__new RENAME TO boundaries;

    ALTER TABLE boundaries DROP COLUMN id;
    ALTER TABLE boundaries ADD COLUMN id SERIAL PRIMARY KEY;

    DROP TABLE federal_lands;
  `, next);
};

exports.down = function(next) {
  utils.genericQuery(`DELETE FROM boundaries WHERE source = '${source}'`, next);
};
