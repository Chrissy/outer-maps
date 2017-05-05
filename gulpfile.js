const gulp = require('gulp');
const merge = require('gulp-merge-json');
const minify = require('gulp-minify');

gulp.task('mapify', () => {
  return gulp.src([
    'styles/base.json',
    'styles/metadata.json',
    'styles/landcover.json',
    'styles/elevation.json',
    'styles/roads.json'
  ])
  .pipe(merge({
    fileName: 'mapbox-styles.json',
    concatArrays: true
  }))
  .pipe(gulp.dest('public/dist'))
});

gulp.task('watch', () => gulp.watch('styles/*.json', ['mapify']));
gulp.task('default', ['watch']);
