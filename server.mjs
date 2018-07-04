import optional from "optional";
import http from "http";
import fs from "fs";
import {normalize} from "path";
import pg from "pg"
import express from "express";

import webpackMiddleware from "webpack-dev-middleware";
import webpackConfig from "./webpack.dev.config.js";
import webpack from "webpack";
import tilelive from "@mapbox/tilelive";
import mbtiles from "@mapbox/mbtiles";

import {pool} from "./db/genericQuery";

import getTrail from "./db/getTrail";
import getBoundary from "./db/getBoundary";
import getMapboxTerrain from "./services/getMapboxTerrain";

const app = express();
const pool = createPool();

app.get("/api/trail/:id", async function(request, response) {
  const trail = await getTrail(request.params.id, pool);
  return response.json(trail);
});

app.get("/api/boundary/:id", async function(request, response) {
  const boundary = await getBoundary(request.params.id, pool);
  return response.json(boundary);
});

app.get("/api/terrain/:x/:y/:zoom", async function(request, response) {
  const terrain = await getMapboxTerrain(request.params, pool);
  return response.redirect(terrain.url);
});

if (process.env.NODE_ENV == "production") {
  app.get("/dist/bundle.js", (request, response) => {
    response.redirect(
      "https://s3-us-west-2.amazonaws.com/chrissy-gunk/bundle.js"
    );
  });
}

if (process.env.NODE_ENV !== "production") {
  mbtiles.registerProtocols(tilelive);

  app.use(
    webpackMiddleware(webpack(webpackConfig), {
      publicPath: webpackConfig.output.publicPath
    })
  );

  tilelive.load("mbtiles://./tiles/local.mbtiles", function(err, source) {
    if (err) throw err;
    app.get("/tiles/:z/:x/:y.*", function(request, response) {
      source.getTile(
        request.params.z,
        request.params.x,
        request.params.y,
        function(err, tile, headers) {
          response.setHeader("Content-Encoding", "gzip");
          response.send(tile);
        }
      );
    });
  });
}

app.use(express.static("public"));

app.listen(process.env.PORT || 5000, function() {
  console.log("listening on port 5000");
});
