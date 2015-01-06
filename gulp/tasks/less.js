var gulp         = require('gulp');
var browserSync  = require('browser-sync');
var less 		 = require('gulp-less');
var path 		 = require('path');
var sourcemaps   = require('gulp-sourcemaps');
var handleErrors = require('../util/handleErrors');
var config       = require('../config').less;
var autoprefixer = require('gulp-autoprefixer');

gulp.task('less', function () {
  return gulp.src(config.src)
  	.pipe(sourcemaps.init())
  	.pipe(less(config.settings))
  	.on('error', handleErrors)
  	.pipe(sourcemaps.write())
  	.pipe(autoprefixer({ browsers: ['last 2 version'] }))
  	.pipe(gulp.dest(config.dest))
  	.pipe(browserSync.reload({stream:true}))


  gulp.src('./less/**/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./public/css'));
});