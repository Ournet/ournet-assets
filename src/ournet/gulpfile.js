'use strict';

require('dotenv').config();

const gulp = require('gulp');
const gulpif = require('gulp-if');
const imagemin = require('gulp-imagemin');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const rev = require('gulp-rev-all');

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
        './scss/main.scss',
    ])
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(cssDist))
        // .pipe(sourcemaps.init())
        .pipe(gulpif(isProduction, cleanCSS()))
        .pipe(gulpif(isProduction, rev.revision()))
        .pipe(gulpif(isProduction, gulp.dest(cssDist)))
        .pipe(gulpif(isProduction, rev.manifestFile()))
        // .pipe(sourcemaps.write())
        // .pipe(rename({ basename: config.css.main }))
        .pipe(gulp.dest(cssDist));
});

gulp.task('sass:watch', function () {
    gulp.watch('./scss/*.scss', ['sass']);
});



gulp.task('watch', ['sass:watch']);
gulp.task('default', ['img', 'sass']);
