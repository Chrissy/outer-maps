"use strict";

// const utils = require("../db/migrationUtils");

exports.up = function(db, next) {
  db.runSql(
    `
    CREATE TABLE trails(
      id SERIAL PRIMARY KEY,
      name VARCHAR(200),
      surface VARCHAR(64),
      source_id VARCHAR(50),
      source VARCHAR(200),
      type VARCHAR(100),
      geog geography(GEOMETRY,4326)
    )`,
    err => {
      if (err) return console.log(err);
      next();
    }
  );
};

exports.down = function(db, next) {
  db.runSql("DROP TABLE trails", next);
};

exports._meta = {
  version: 1
};
