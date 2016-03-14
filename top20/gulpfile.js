'use strict';

require('dotenv').load({
	path: '../.env'
});

var root = 'top20';
var _ = require('lodash');
var assets = require('../lib/assets');
var js = assets.js(root);
var img = assets.img(root);
var css = assets.css(root);
var gulp = require('gulp');
var connect = require('gulp-connect');
var del = require('del');

var config = {
	// js
	// 'js-main': {
	// 	type: 'js',
	// 	options: {
	// 		src: ['./src/js/app.js', './src/js/bootstrap/position.js', './src/js/our/services.js', './src/js/exchange/services.js', './src/js/exchange/our/directives.js', './src/js/exchange/controllers.js', './src/js/exchange/directives.js', './src/js/exchange/filters.js', './src/js/exchange/bootstrap/datepicker.js'],
	// 		dest: './out/js',
	// 		name: 'main.js'
	// 	}
	// },
	// css
	'css-main': {
		type: 'css',
		options: {
			src: ['./src/less/_main.less'],
			dest: './out/css',
			name: 'main.css'
		}
	}
};

function configAction(item, options) {
	return function() {
		if (item.type === 'js') {
			return js.out(options);
		}
		return css.less(options);
	};
}

function createTasks() {

	var groups = {},
		name, item, options;

	for (name in config) {
		item = config[name];

		// default task:
		options = _.clone(item.options);
		var groupName = item.type;
		groups[groupName] = groups[groupName] || [];
		gulp.task(name, configAction(item, options));
		groups[groupName].push(name);
		if (item.group) {
			groups[item.group] = groups[item.group] || [];
			groups[item.group].push(name);
		}

		// prod task:
		options = _.clone(item.options);
		options.rev = true;
		groupName = 'prod';
		groups[groupName] = groups[groupName] || [];
		gulp.task(name + '-' + groupName, configAction(item, options));
		groups[groupName].push(name + '-' + groupName);
		if (item.group) {
			groups[item.group + '-' + groupName] = groups[item.group + '-' + groupName] || [];
			groups[item.group + '-' + groupName].push(name + '-' + groupName);
		}
	}

	for (name in groups) {
		gulp.task(name, groups[name]);
	}
}

createTasks();

gulp.task('clean', function() {
	return del(['out']);
});

// --------------- images -----------------

// Copy all static images
gulp.task('img', function() {
	return img.out({
		src: './src/img/**/*',
		dest: './out/img'
	});
});

gulp.task('img-upload', function() {
	return img.s3({
		src: './out/img/**/*',
		dest: 'img'
	});
});

// --------------- js -----------------

gulp.task('js-upload', function() {
	return js.s3({
		src: './out/js/**/*.min.js',
		dest: 'js'
	});
});

// --------------- css -----------------

gulp.task('css-upload', function() {
	return css.s3({
		src: './out/css/**/*.min.css',
		dest: 'css'
	});
});

gulp.task('connect', function() {
	connect.server({
		root: 'out',
		port: 8044
	});
});

// Rerun the task when a file changes
gulp.task('watch', function() {
	gulp.watch('./src/js/**/*', ['js']);
	gulp.watch('./src/img/**/*', ['img']);
	gulp.watch('./src/less/**/*', ['css']);
});

gulp.task('default', ['css', 'img', 'connect', 'watch']);

gulp.task('upload', ['js-upload', 'css-upload', 'img-upload']);
