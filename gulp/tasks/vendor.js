var gulp        = require('gulp');
var config      = require('../config').vendor;

gulp.task('vendor', function() {
  return gulp.src(config.files).pipe(gulp.dest(config.dest));
});