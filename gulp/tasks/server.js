var gulp = require('gulp');
var bg = require('gulp-bg');
var config = require('../config.js').server;

gulp.task('server', bg('node', '--harmony', config.path));