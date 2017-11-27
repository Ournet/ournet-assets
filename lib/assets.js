'use strict';

var path = require('path');
var gulp = require('gulp');
var aws = {
	// key: process.env.AWS_ACCESS_KEY_ID,
	// secret: process.env.AWS_SECRET_ACCESS_KEY,
	Bucket: process.env.AWS_BUCKET,
	ACL: 'public-read'
		// Region: process.env.AWS_REGION
};
var _ = require('lodash');
var s3 = require('gulp-s3-upload')(aws);
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var gzip = require('gulp-gzip');
var rev = require('gulp-rev');
var foo = require('gulp-empty');
var less = require('gulp-less');
var mincss = require('gulp-minify-css');
var changed = require('gulp-changed');

function optionalConcat(options) {
	if (options.name) {
		return concat({
			path: options.name,
			cwd: ''
		});
	}
	return foo();
}

exports.js = function(root) {
	var js = {
		/**
		 * Output js files
		 * @param  {string} options.src Source path
		 * @param  {string} options.dest Destination path
		 * @param  {string} [options.base] Source base path
		 * @param  {string} [options.name] Concat file name
		 */
		out: function(options) {

			if (options.rev) {
				return gulp.src(options.src)
					.pipe(optionalConcat(options))
					.pipe(uglify())
					// .pipe(changed(options.dest))
					.pipe(gulp.dest(options.dest))
					.pipe(rev())
					// .pipe(changed(options.dest))
					.pipe(gulp.dest(options.dest))
					.pipe(rev.manifest({
						merge: true
					}))
					// .pipe(changed(options.dest))
					.pipe(gulp.dest(options.dest));
			}

			return gulp.src(options.src)
				.pipe(optionalConcat(options))
				.pipe(uglify())
				.pipe(gulp.dest(options.dest));
		},
		/**
		 * Output js files
		 * @param  {string} options.src Source path
		 * @param  {string} [options.dest] Destination path
		 */
		s3: function(options) {
			return gulp.src(options.src)
				.pipe(gzip({
					append: false
				}))
				.pipe(rename(function(p) {
					p.dirname = path.join(root, options.dest || '', p.dirname);
				}))
				.pipe(s3(_.assign({}, aws, {
					CacheControl: 'public,max-age=' + (options.cache || 86400 * 14) + ',immutable',
					ContentEncoding: 'gzip'
				})));
		}
	};

	return js;
};

exports.css = function(root) {
	var css = {
		/**
		 * Output css files
		 * @param  {string} options.src Source path
		 * @param  {string} options.dest Destination path
		 * @param  {string} [options.base] Source base path
		 * @param  {string} [options.name] Concat file name
		 */
		less: function(options) {

			if (options.rev) {
				return gulp.src(options.src)
					.pipe(less())
					.pipe(optionalConcat(options))
					// .pipe(changed(options.dest))
					.pipe(mincss())
					// .pipe(changed(options.dest))
					.pipe(gulp.dest(options.dest))
					.pipe(rev())
					// .pipe(changed(options.dest))
					.pipe(gulp.dest(options.dest))
					.pipe(rev.manifest({
						merge: true
					}))
					// .pipe(changed(options.dest))
					.pipe(gulp.dest(options.dest));
			}

			return gulp.src(options.src)
				.pipe(less())
				.pipe(optionalConcat(options))
				// .pipe(changed(options.dest))
				.pipe(mincss())
				// .pipe(changed(options.dest))
				.pipe(gulp.dest(options.dest));
		},
		/**
		 * Output js files
		 * @param  {string} options.src Source path
		 * @param  {string} [options.dest] Destination path
		 */
		s3: function(options) {
			return gulp.src(options.src)
				.pipe(gzip({
					append: false
				}))
				.pipe(rename(function(p) {
					p.dirname = path.join(root, options.dest || '', p.dirname);
				}))
				.pipe(s3(_.assign({}, aws, {
					CacheControl: 'public,max-age=' + (86400 * 14) + ',immutable',
					ContentEncoding: 'gzip'
				})));
		}
	};

	return css;
};

exports.img = function(root) {
	var img = {
		/**
		 * Output img files
		 * @param  {string} options.src Source path
		 * @param  {string} options.dest Destination path
		 */
		out: function(options) {
			return gulp.src(options.src)
				.pipe(imagemin({
					optimizationLevel: 5
				}))
				.pipe(gulp.dest(options.dest));
		},
		/**
		 * Output js files
		 * @param  {string} options.src Source path
		 * @param  {string} [options.dest] Destination path
		 */
		s3: function(options) {
			return gulp.src(options.src)
				.pipe(rename(function(p) {
					p.dirname = path.join(root, options.dest || '', p.dirname);
				}))
				.pipe(s3(_.assign({}, aws, {
					CacheControl: 'public,max-age=' + (86400 * 30) + ',immutable'
				})));
		}
	};

	return img;
};
