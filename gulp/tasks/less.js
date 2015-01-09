var gulp         = require('gulp');
var browserSync  = require('browser-sync');
var less 		 = require('gulp-less');
var path 		 = require('path');
var sourcemaps   = require('gulp-sourcemaps');
var handleErrors = require('../util/handleErrors');
var config       = require('../config').less;
var autoprefixer = require('gulp-autoprefixer');
var postcss      = require('gulp-postcss');

gulp.task('less', function () {
  return gulp.src(config.src)
  	.pipe(sourcemaps.init())
  	.pipe(less(config.settings))
  	.on('error', handleErrors)
//  	.pipe(postcss([autoprefixer({ browsers: ['last 2 version'] })]))
    .pipe(sourcemaps.write())
  	.pipe(gulp.dest(config.dest))
  	.pipe(browserSync.reload({stream:true}))
});