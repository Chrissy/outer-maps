const fs = require("fs");
const gulp = require("gulp");
const merge = require("gulp-merge-json");
const plumber = require("gulp-plumber");
const jeditor = require("gulp-json-editor");

gulp.task("mapify", () => {
  const index = JSON.parse(fs.readFileSync("./styles/base.json")).imports;
  const tileSource =
    process.env.NODE_ENV === "production"
      ? "remote"
      : JSON.parse(fs.readFileSync("./.env")).tiles;

  return gulp
    .src(["base", ...index].map(l => `styles/${l}.json`))
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
          const sourceHover =
            tileSource == "local" ? "localHover" : "compositeHover";
          l.source = l.source == "$source" ? source : l.source;
          l.source = l.source == "$sourceHover" ? sourceHover : l.source;
          return l;
        });
        return json;
      })
    )
    .pipe(gulp.dest("public/dist"));
});

gulp.task("watch", () => gulp.watch("styles/*.json", ["mapify"]));
gulp.task("default", ["mapify"]);
