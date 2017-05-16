const fs = require('fs');
const gulp = require('gulp');
const merge = require('gulp-merge-json');
const plumber = require('gulp-plumber');
const jeditor = require("gulp-json-editor");
const env = require("./environment/development.js");

gulp.task('mapify', () => {
  var index = JSON.parse(fs.readFileSync('./styles/index.json'));

  return gulp.src(index.files)
  .pipe(plumber())
  .pipe(merge({
    fileName: 'mapbox-styles.json',
    concatArrays: true
  }))
  .on('error', (err) => console.log(err))
  .pipe(jeditor(function(json){
    json.sources = json[env.tileSource];
    json.layers = json.layers.map(l => {
      const source = (env.tileSource == "remote") ? "composite" : "local"
      l.source = (l.source == "$source") ? source : l.source;
      return l;
    });
    return json;
  }))
  .pipe(gulp.dest('public/dist'))
});

gulp.task('watch', () => gulp.watch('styles/*.json', ['mapify']));
gulp.task('default', ['mapify', 'watch']);
