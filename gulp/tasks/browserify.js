var browserify   = require('browserify');
var browserSync  = require('browser-sync');
var watchify     = require('watchify');
var bundleLogger = require('../util/bundleLogger');
var gulp         = require('gulp');
var handleErrors = require('../util/handleErrors');
var source       = require('vinyl-source-stream');
var config       = require('../config').browserify;
var _            = require('lodash');

var browserifyTask = function(callback, devMode) {

  var bundleQueue = config.bundleConfigs.length;

  var browserifyThis = function(bundleConfig) {

    if (devMode) {
      _.extend(bundleConfig, watchify.args, { debug: true }, { transform: config.transform });
      bundleConfig = _.omit(bundleConfig, ['external', 'require']);
    }


    var bundler = browserify(bundleConfig);

    var bundle = function() {
      // Log when bundling starts
      bundleLogger.start(bundleConfig.outputName);

      return bundler
        .bundle()
        // Report compile errors
        .on('error', handleErrors)
        // Use vinyl-source-stream to make the
        // stream gulp compatible. Specifiy the
        // desired output filename here.
        .pipe(source(bundleConfig.outputName))
        // Specify the output destination
        .pipe(gulp.dest(bundleConfig.dest))
        .on('end', reportFinished)
        .pipe(browserSync.reload({stream:true}));
    };

    if(devMode) {
      // Wrap with watchify and rebundle on changes
      bundler = watchify(bundler);
      // Rebundle on update
      bundler.on('update', bundle);
      bundleLogger.watch(bundleConfig.outputName);
    } else {
      if (bundleConfig.require) bundler.require(bundleConfig.require);
      if (bundleConfig.external) bundler.external(bundleConfig.external);
    }

    var reportFinished = function() {
      // Log when bundling completes
      bundleLogger.end(bundleConfig.outputName)

      if(bundleQueue) {
        bundleQueue--;
        if(bundleQueue === 0) {
          // If queue is empty, tell gulp the task is complete.
          // https://github.com/gulpjs/gulp/blob/master/docs/API.md#accept-a-callback
          callback();
        }
      }
    };

    return bundle();
  };

  // Start bundling with Browserify for each bundleConfig specified
  config.bundleConfigs.forEach(browserifyThis);
}

gulp.task('browserify', browserifyTask);

module.exports = browserifyTask;