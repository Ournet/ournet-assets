'use strict';

require('dotenv').config();

const gulp = require('gulp');
const gulpif = require('gulp-if');
const imagemin = require('gulp-imagemin');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const rev = require('gulp-rev-all');
const connect = require('gulp-connect');

const buffer = require('gulp-buffer');
const log = require('gulplog');
const browserify = require('browserify');
const uglify = require('gulp-uglify');
const tap = require('gulp-tap');

const isProduction = process.env.NODE_ENV === 'production';

// --------- IMAGES ------------

gulp.task('imagemin', () =>
    gulp.src('./img/**')
        .pipe(imagemin())
        .pipe(gulp.dest('../../dest/ournet/img/'))
);

gulp.task('img', ['imagemin']);

// --------- CSS -------------

const cssDist = '../../dest/ournet/css';

gulp.task('sass', function () {
    return gulp.src([
        './scss/weather/main.scss',
        './scss/weather/page-widget.scss',
    ], { base: './scss' })
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(cssDist))
        // .pipe(sourcemaps.init())
        .pipe(gulpif(isProduction, cleanCSS()))
        .pipe(gulpif(isProduction, rev.revision()))
        .pipe(gulpif(isProduction, gulp.dest(cssDist)))
        .pipe(gulpif(isProduction, rev.manifestFile()))
        // .pipe(sourcemaps.write())
        // .pipe(rename({ basename: config.css.main }))
        .pipe(gulpif(isProduction, gulp.dest(cssDist)));
});

gulp.task('sass:watch', function () {
    gulp.watch('./scss/**/*.scss', ['sass']);
});

// --------- JS -------------

const jsDist = '../../dest/ournet/js';

gulp.task('js', function () {
    return gulp.src([
        './js/weather/main.js',
        './js/weather/page-widget.js',
    ], { read: false, base: './js' }) // no need of reading file because browserify does.
        // transform file objects using gulp-tap plugin
        .pipe(tap(function (file) {

            log.info('bundling ' + file.path);

            // replace file contents with browserify's bundle stream
            file.contents = browserify(file.path, { debug: true }).bundle();

        }))
        .pipe(gulp.dest(jsDist))
        .pipe(gulpif(isProduction, buffer()))
        .pipe(gulpif(isProduction, uglify()))
        .pipe(gulpif(isProduction, rev.revision()))
        .pipe(gulpif(isProduction, gulp.dest(cssDist)))
        .pipe(gulpif(isProduction, rev.manifestFile()))
        .pipe(gulpif(isProduction, gulp.dest(jsDist)));
});

gulp.task('js:watch', function () {
    gulp.watch('./js/**/*.js', ['js']);
});

gulp.task('connect', function () {
    connect.server({
        root: '../../dest/ournet',
        port: parseInt(process.env.PORT),
    });
});


gulp.task('watch', ['sass:watch', 'js:watch']);
gulp.task('serv', ['watch', 'connect']);
gulp.task('default', ['img', 'sass', 'js']);
