'use strict';

require('dotenv').load({
	path: '../.env'
});

var root = 'root';
var assets = require('../lib/assets');
var js = assets.js(root);
var img = assets.img(root);
var gulp = require('gulp');

gulp.task('js-copy', function() {
	return js.out({
		src: './src/js/angular/*.js',
		dest: './out/js/angular'
	});
});

gulp.task('js-out', ['js-copy']);

gulp.task('js-upload', function() {
	return js.s3({
		src: './out/js/**/*.min.js',
		dest: 'js'
	});
});

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

// Rerun the task when a file changes
gulp.task('watch', function() {
	gulp.watch('./src/js', ['js-out']);
	gulp.watch('./src/img', ['img-out']);
});

gulp.task('default', ['js-out', 'img-out', 'watch']);

gulp.task('upload', ['js-out', 'js-upload', 'img-out', 'img-upload']);
