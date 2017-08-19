const fs = require('fs');
const gulp = require('gulp');
const merge = require('gulp-merge-json');
const plumber = require('gulp-plumber');
const jeditor = require("gulp-json-editor");
const source = JSON.parse(fs.readFileSync("./.env")).tiles;

console.log(source)

gulp.task('mapify', () => {
  var index = JSON.parse(fs.readFileSync('./styles/base.json')).imports;

  return gulp.src(['base', ...index].map(l => `styles/${l}.json`))
  .pipe(plumber())
  .pipe(merge({
    fileName: 'mapbox-styles.json',
    concatArrays: true
  }))
  .on('error', (err) => console.log(err))
  .pipe(jeditor(function(json){
    json.sources = json[source];
    json.layers = json.layers.map(l => {
      const source = (source == "local") ? "local" : "composite"
      l.source = (l.source == "$source") ? source : l.source;
      return l;
    });
    return json;
  }))
  .pipe(gulp.dest('public/dist'))
});

gulp.task('watch', () => gulp.watch('styles/*.json', ['mapify']));
gulp.task('default', ['mapify']);
