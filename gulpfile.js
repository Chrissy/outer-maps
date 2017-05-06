const fs = require('fs');
const gulp = require('gulp');
const merge = require('gulp-merge-json');

gulp.task('mapify', () => {
  var index = JSON.parse(fs.readFileSync('./styles/index.json'));
  return gulp.src(index.files)
  .pipe(merge({
    fileName: 'mapbox-styles.json',
    concatArrays: true
  }))
  .pipe(gulp.dest('public/dist'))
});

gulp.task('watch', () => gulp.watch('styles/*.json', ['mapify']));
gulp.task('default', ['mapify', 'watch']);
