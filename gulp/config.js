var reactify = require('reactify');
var envify = require('envify');
var es6ify = require('es6ify');

var dest = './build';
var src = './app';

module.exports = {
	server: {
		path: src + '/server/index.js',
		files: src + '/server/**'
	},
	browserSync: {
		server: {
			baseDir: [ dest ]
		}
	},
	images: {
		src: src + "/images/**",
		dest: dest + "/images"
	},
	browserify: {
		bundleConfigs: [{
			entries: src + '/client/js/main.js',
			dest: dest,
			outputName: 'app.js',
			require: [ 'react', 'lodash' ]
		}],
		transform: [ reactify, es6ify, envify ]
	},
	less: {
		src: src + '/less/*.{less}',
		dest: dest,
		settings: {
			paths: [ src + '/less/includes' ]
		}
	},
	production: {
		cssSrc: dest + '/*.css',
		jsSrc: dest + '/*.js',
		dest: dest
	},
	vendor: {
		files: [
			'node_modules/es6ify/node_modules/traceur/bin/traceur-runtime.js'
		],
		dest: dest
	}
};