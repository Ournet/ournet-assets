'use strict';

require('dotenv').load({
	path: '../.env'
});

var root = 'ournet';
var assets = require('../lib/assets');
var js = assets.js(root);
var img = assets.img(root);
var css = assets.css(root);
var gulp = require('gulp');
var connect = require('gulp-connect');

// --------------- images -----------------

// Copy all static images
gulp.task('img-out', function() {
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

gulp.task('js-copy-news-main', function() {
	return js.out({
		src: ['./src/js/jquery.lazyload.js'],
		dest: './out/js/news',
		name: 'main.js',
		rev: true
	});
});

gulp.task('js-copy-weather-main', function() {
	return js.out({
		src: ['./src/js/weather/weather-dates.js', './src/js/weather/layout.js', '../node_modules/bootstrap/js/affix.js'],
		dest: './out/js/weather',
		name: 'main.js',
		rev: true
	});
});

gulp.task('js-copy-exchange-main', function() {
	return js.out({
		src: ['./src/js/exchange/app.js', './src/js/exchange/bootstrap/position.js', './src/js/exchange/our/services.js', './src/js/exchange/services.js', './src/js/exchange/our/directives.js', './src/js/exchange/controllers.js', './src/js/exchange/directives.js', './src/js/exchange/filters.js', './src/js/exchange/bootstrap/datepicker.js'],
		dest: './out/js/exchange',
		name: 'main.js',
		rev: true
	});
});

gulp.task('js-copy-weather-page-widget', function() {
	return js.out({
		src: ['../node_modules/devbridge-autocomplete/dist/jquery.autocomplete.js', './src/js/weather/page-widget.js'],
		dest: './out/js/weather',
		name: 'page-widget.js',
		rev: true
	});
});

gulp.task('js-out', ['js-copy-news-main', 'js-copy-exchange-main', 'js-copy-weather-main', 'js-copy-weather-page-widget']);

gulp.task('js-upload', function() {
	return js.s3({
		src: './out/js/**/*.min.js',
		dest: 'js'
	});
});

// --------------- css -----------------

gulp.task('css-news-main', function() {
	return css.less({
		src: ['./src/less/news/_main.less'],
		dest: './out/css/news',
		name: 'main.css',
		rev: true
	});
});
gulp.task('css-exchange-main', function() {
	return css.less({
		src: ['./src/less/exchange/_main.less'],
		dest: './out/css/exchange',
		name: 'main.css',
		rev: true
	});
});
gulp.task('css-weather-main', function() {
	return css.less({
		src: ['./src/less/weather/_main.less'],
		dest: './out/css/weather',
		name: 'main.css',
		rev: true
	});
});
gulp.task('css-weather-widget', function() {
	return css.less({
		src: ['./src/less/weather/_page-widget.less'],
		dest: './out/css/weather',
		name: 'page-widget.css',
		rev: true
	});
});

gulp.task('css-out', ['css-news-main', 'css-exchange-main', 'css-weather-main', 'css-weather-widget']);

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
	gulp.watch('./src/js/**/*', ['js-out']);
	gulp.watch('./src/img/**/*', ['img-out']);
	gulp.watch('./src/less/**/*', ['css-out']);
});

gulp.task('default', ['css-out', 'js-out', 'img-out', 'connect', 'watch']);

gulp.task('upload', ['css-out', 'js-out', 'img-out', 'js-upload', 'css-upload', 'img-upload']);
