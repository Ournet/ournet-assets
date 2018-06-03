'use strict';

const gulp = require('gulp');
const imagemin = require('gulp-imagemin');


gulp.task('imagemin', () =>
  gulp.src('./img/**')
    .pipe(imagemin())
    .pipe(gulp.dest('../../dest/root/img/'))
);

gulp.task('img', ['imagemin']);

gulp.task('default', ['img']);
