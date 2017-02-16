'use strict'

const utils = require('./migrationUtils');

exports.up = function(next) {
  const query = `
    CREATE TABLE boundaries(
      id SERIAL PRIMARY KEY,
      name VARCHAR(200),
      region VARCHAR(200),
      source varchar(200),
      geog geography(GEOMETRY,4326)
    )`;

    utils.genericQuery(query, next);
};

exports.down = function(next) {
  utils.genericQuery("DROP TABLE boundaries", next);
};
