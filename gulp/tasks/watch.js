var gulp  = require('gulp');
var config= require('../config');

gulp.task('watch', ['watchify', 'browserSync'], function() {
  gulp.watch(config.less.src,   ['less']);
  gulp.watch(config.images.src, ['images']);
  gulp.watch(config.server.files, [ 'server' ]);
});