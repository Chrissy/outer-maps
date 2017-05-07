const fs = require('fs');
const gulp = require('gulp');
const merge = require('gulp-merge-json');
const plumber = require('gulp-plumber');

gulp.task('mapify', () => {
  var index = JSON.parse(fs.readFileSync('./styles/index.json'));
  return gulp.src(index.files)
  .pipe(plumber())
  .pipe(merge({
    fileName: 'mapbox-styles.json',
    concatArrays: true
  }))
  .on('error', (err) => console.log(err))
  .pipe(gulp.dest('public/dist'))
});

gulp.task('watch', () => gulp.watch('styles/*.json', ['mapify']));
gulp.task('default', ['mapify', 'watch']);
