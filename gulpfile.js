const gulp = require('gulp');
const merge = require('gulp-merge-json');

gulp.task('mapbox-styles', function(){
  return gulp.src([
      'styles/base.json',
      'styles/metadata.json',
      'styles/landcover.json',
      'styles/elevation.json',
      'styles/roads.json'
    ])
    .pipe(merge({
      fileName: 'mbstyles.json',
      concatArrays: true
    }))
    .pipe(gulp.dest('public'))
});

gulp.task('default', ['mapbox-styles']);
