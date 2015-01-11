var reactify = require('reactify');
var envify = require('envify');
var es6ify = require('es6ify');
var stringify = require('stringify');
var LessPluginAutoPrefix = require('less-plugin-autoprefix'),
    autoprefix= new LessPluginAutoPrefix({browsers: ["last 2 versions"]});

var dest = './build';
var src = './app';

es6ify.traceurOverrides = {
	annotations: true,
	arrayComprehension: true,
	asyncFunctions: true,
	require: true
};

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
		src: src + "/client/images/**",
		dest: dest + "/images"
	},
	browserify: {
		bundleConfigs: [{
			entries: src + '/client/js/main.js',
			dest: dest,
			outputName: 'app.js',
			require: [ 'react', 'lodash' ]
		}],
		transform: [ stringify({ extensions: [ '.svg' ] }), es6ify, envify ]
	},
	less: {
		src: src + '/client/less/main.less',
		dest: dest,
		settings: {
			paths: [ src + '/less/includes' ],
			plugins: [autoprefix]
		}
	},
	production: {
		cssSrc: dest + '/*.css',
		jsSrc: dest + '/*.js',
		dest: dest
	},
	vendor: {
		files: [
			'node_modules/es6ify/node_modules/traceur/bin/traceur-runtime.js',
			'node_modules/otr/build/otr.min.js',
			'node_modules/otr/build/otr.js',
			'node_modules/otr/build/dep/bigint.js',
			'node_modules/otr/build/dep/crypto.js',
			'node_modules/otr/build/dep/eventemitter.js'
		],
		dest: dest + '/vendor'
	}
};