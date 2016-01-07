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
		src: ['./src/js/jquery.lazyload.js', './src/js/Popup.js', './src/js/sharedata.js'],
		dest: './out/js/news',
		name: 'main.js',
		rev: true
	});
});

gulp.task('js-copy-weather-main', function() {
	return js.out({
		src: ['./src/js/jquery.lazyload.js', './src/js/Popup.js', './src/js/sharedata.js', './src/js/weather/weather-dates.js', './src/js/bootstrap/affix.js'],
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
		src: ['./src/js/jquery.autocomplet.min.js', './src/js/weather/page-widget.js'],
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
		src: ['./src/less/weather/weather-widget.less'],
		dest: './out/css/weather',
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

// Rerun the task when a file changes
gulp.task('watch', function() {
	gulp.watch('./src/js', ['js-out']);
	gulp.watch('./src/img', ['img-out']);
	gulp.watch('./src/less', ['css-out']);
});

gulp.task('default', ['css-out', 'js-out', 'img-out', 'watch']);

gulp.task('upload', ['css-out', 'js-out', 'img-out', 'js-upload', 'img-upload', 'css-upload']);
