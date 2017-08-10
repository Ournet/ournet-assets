'use strict';

require('dotenv').load({
	path: '../.env'
});

var root = 'ournet';
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
	'js-userlocation': {
		// group: 'portal',
		type: 'js',
		options: {
			src: ['./src/js/Cookie.js', './src/js/user-location.js'],
			dest: './out/js',
			name: 'user-location.js'
		}
	},
	'js-portal-main': {
		group: 'portal',
		type: 'js',
		options: {
			src: ['../node_modules/appear/dist/appear.js', './src/js/portal/layout.js', './src/js/jquery.lazyload.js'],
			dest: './out/js/portal/desktop',
			name: 'main.js'
		}
	},
	'js-news-main': {
		group: 'news',
		type: 'js',
		options: {
			src: ['./src/js/news/layout.js', './src/js/jquery.lazyload.js', '../node_modules/bootstrap/js/dropdown.js', '../node_modules/social-likes/src/social-likes.js'],
			dest: './out/js/news/desktop',
			name: 'main.js'
		}
	},
	'js-weather-main': {
		group: 'weather',
		type: 'js',
		options: {
			src: ['../node_modules/appear/dist/appear.js', './src/js/weather/weather-dates.js', './src/js/weather/layout.js', '../node_modules/social-likes/src/social-likes.js', './src/js/weather/cocoshel-form.js'],
			dest: './out/js/weather/desktop',
			name: 'main.js'
		}
	},
	'js-weather-main_mobile': {
		group: 'weather',
		type: 'js',
		options: {
			src: ['./src/js/weather/weather-dates.js', './src/js/weather/layout_mobile.js'],
			dest: './out/js/weather/mobile',
			name: 'main.js'
		}
	},
	'js-weather-page-widget': {
		group: 'weather',
		type: 'js',
		options: {
			src: ['../node_modules/devbridge-autocomplete/dist/jquery.autocomplete.js', './src/js/weather/page-widget.js'],
			dest: './out/js/weather',
			name: 'page-widget.js'
		}
	},
	'js-weather-ins': {
		group: 'weather',
		type: 'js',
		options: {
			src: ['./src/js/weather/widget-ins.js'],
			dest: './out/js/weather',
			name: 'widget-ins.js'
		}
	},
	'js-exchange-main': {
		group: 'exchange',
		type: 'js',
		options: {
			src: ['./src/js/exchange/app.js', './src/js/exchange/bootstrap/position.js', './src/js/exchange/our/services.js', './src/js/exchange/services.js', './src/js/exchange/our/directives.js', './src/js/exchange/controllers.js', './src/js/exchange/directives.js', './src/js/exchange/filters.js', './src/js/exchange/bootstrap/datepicker.js'],
			dest: './out/js/exchange',
			name: 'main.js'
		}
	},
	'js-horoscope-main': {
		group: 'horoscope',
		type: 'js',
		options: {
			src: ['./src/js/horoscope/main.js', '../node_modules/social-likes/src/social-likes.js'],
			dest: './out/js/horoscope',
			name: 'main.js'
		}
	},
	'js-horoscope-tab-widget-v1': {
		group: 'horoscope',
		type: 'js',
		options: {
			src: ['./src/js/Cookie.js', './src/js/dom.js', './src/js/horoscope/cookie-sign-store.js', './src/js/horoscope/tab-widget-v1.js'],
			dest: './out/js/horoscope',
			name: 'tab-widget-v1.js'
		}
	},
	// css
	'css-portal-main': {
		group: 'portal',
		type: 'css',
		options: {
			src: ['./src/less/portal/_main_desktop.less'],
			dest: './out/css/portal/desktop',
			name: 'main.css'
		}
	},
	'css-news-main': {
		group: 'news',
		type: 'css',
		options: {
			src: ['./src/less/news/_main_desktop.less'],
			dest: './out/css/news/desktop',
			name: 'main.css'
		}
	},
	'css-exchange-main': {
		group: 'exchange',
		type: 'css',
		options: {
			src: ['./src/less/exchange/_main.less'],
			dest: './out/css/exchange',
			name: 'main.css'
		}
	},
	'css-weather-main': {
		group: 'weather',
		type: 'css',
		options: {
			src: ['./src/less/weather/_main_desktop.less'],
			dest: './out/css/weather/desktop',
			name: 'main.css'
		}
	},
	'css-weather-main_mobile': {
		group: 'weather',
		type: 'css',
		options: {
			src: ['./src/less/weather/_main_mobile.less'],
			dest: './out/css/weather/mobile',
			name: 'main.css'
		}
	},
	'css-weather-page-widget': {
		group: 'weather',
		type: 'css',
		options: {
			src: ['./src/less/weather/_page-widget.less'],
			dest: './out/css/weather',
			name: 'page-widget.css'
		}
	},
	'css-weather-error-page': {
		group: 'weather',
		type: 'css',
		options: {
			src: ['./src/less/weather/_error-page.less'],
			dest: './out/css/weather',
			name: 'error-page.css'
		}
	},
	'css-horoscope-main': {
		group: 'horoscope',
		type: 'css',
		options: {
			src: ['./src/less/horoscope/_main.less'],
			dest: './out/css/horoscope',
			name: 'main.css'
		}
	},
	'css-horoscope-zodiac-signs': {
		group: 'horoscope',
		type: 'css',
		options: {
			src: ['./src/less/zodiac-signs.less'],
			dest: './out/css',
			name: 'zodiac-signs.css'
		}
	},
	'css-horoscope-zodiac-icons-45': {
		group: 'horoscope',
		type: 'css',
		options: {
			src: ['./src/less/horoscope/red-zodiac-icons-45.less'],
			dest: './out/css/horoscope',
			name: 'red-zodiac-icons-45.css'
		}
	},
	'css-horoscope-zodiac-icons-90': {
		group: 'horoscope',
		type: 'css',
		options: {
			src: ['./src/less/horoscope/red-zodiac-icons-90.less'],
			dest: './out/css/horoscope',
			name: 'red-zodiac-icons-90.css'
		}
	}
};

function configAction(item, options) {
	return function () {
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

gulp.task('clean', function () {
	return del(['out']);
});

// --------------- images -----------------

// Copy all static images
gulp.task('img', function () {
	return img.out({
		src: './src/img/**/*',
		dest: './out/img'
	});
});

gulp.task('img-upload', function () {
	return img.s3({
		src: './out/img/**/*',
		dest: 'img'
	});
});

// --------------- js -----------------

gulp.task('js-upload', function () {
	return js.s3({
		src: './out/js/**/*.min.js',
		dest: 'js'
	});
});

gulp.task('js-upload-ins', function () {
	return js.s3({
		src: './out/js/**/widget-ins.js',
		dest: 'js',
		// 7 days
		cache: 60 * 60 * 24 * 7
	});
});

// --------------- css -----------------

gulp.task('css-upload', function () {
	return css.s3({
		src: './out/css/**/*.min.css',
		dest: 'css'
	});
});

gulp.task('connect', function () {
	connect.server({
		root: 'out',
		port: 8044
	});
});

// Rerun the task when a file changes
gulp.task('watch', function () {
	gulp.watch('./src/js/**/*', ['js']);
	gulp.watch('./src/img/**/*', ['img']);
	gulp.watch('./src/less/**/*', ['css']);
});

gulp.task('default', ['css', 'js', 'img', 'connect', 'watch']);

gulp.task('upload', ['js-upload', 'js-upload-ins', 'css-upload', 'img-upload']);
