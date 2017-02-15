'use strict'

const utils = require('./migrationUtils');

exports.up = function(next) {
  const query = `
    CREATE TABLE trails(
      id SERIAL PRIMARY KEY,
      name VARCHAR(200),
      surface VARCHAR(64),
      source_id varchar(50),
      source varchar(50),
      geog geography(GEOMETRY,4326)
    )`;

    utils.genericQuery(query, next);
};

exports.down = function(next) {
  const query = `DROP TABLE trails`;

  utils.genericQuery(query, next);
};
