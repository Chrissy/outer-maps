const gulp = require('gulp');
const merge = require('gulp-merge-json');

gulp.task('mapbox-styles', function(){
  return gulp.src('styles/*.json')
    .pipe(merge({
      fileName: 'mbstyles.json'
    }))
    .pipe(gulp.dest('public'))
});

gulp.task('default', ['mapbox-styles']);
