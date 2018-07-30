require("dotenv").config();
const fs = require("fs");
const gulp = require("gulp");
const merge = require("gulp-merge-json");
const plumber = require("gulp-plumber");
const jeditor = require("gulp-json-editor");

gulp.task(
  "mapify",
  gulp.series(() => {
    const index = JSON.parse(fs.readFileSync("./styles/map/base.json")).imports;
    const tileSource =
      process.env.NODE_ENV === "production" ? "remote" : process.env.TILES;

    return gulp
      .src(["base", ...index].map(l => `styles/map/${l}.json`))
      .pipe(plumber())
      .pipe(
        merge({
          fileName: "mapbox-styles.json",
          concatArrays: true
        })
      )
      .on("error", err => console.log(err))
      .pipe(
        jeditor(function(json) {
          json.sources = json[tileSource];
          json.layers = json.layers.map(l => {
            const source = tileSource == "local" ? "local" : "composite";
            l.source = l.source == "$source" ? source : l.source;
            return l;
          });
          return json;
        })
      )
      .pipe(gulp.dest("public/dist"));
  })
);

gulp.task("watch", gulp.series(() => gulp.watch("styles/*.json", ["mapify"])));
gulp.task("default", gulp.series("mapify"));
