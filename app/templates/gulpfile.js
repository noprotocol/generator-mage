'use strict';

var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    jshint = require('gulp-jshint'),
    nodemon = require('gulp-nodemon'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    plumber = require('gulp-plumber'),
    concat = require('gulp-concat'),
    gutil = require('gulp-util'),
    bower = require('gulp-bower'),
    livereload = require('gulp-livereload');

gulp.task('default', ['server', 'watch']);

gulp.task('watch', ['styles', 'scripts', 'bower', 'views'], function() {
  // API Watches
  // gulp.watch(['api/**/*.js'], [
    // 'test',
    // 'lint'
  // ]);

  // Client watches
  gulp.watch(['./client/styles/**/*.scss'], [
    'styles'
  ]);

  gulp.watch(['./client/scripts/**/*.js'], [
    'scripts'
  ]);

  gulp.watch(['./client/components/**'], [
    'bower'
  ]);

  gulp.watch(['./client/index.html', 'client/views/**/*.html'], [
    'views'
  ]);

  gulp.watch('./public/**').on('change', livereload.changed);
});

gulp.task('build', ['styles', 'scripts', 'bower', 'views'], function() {});

gulp.task('styles', function () {
  return gulp.src('./client/styles/app.scss')
  .pipe(sass({
    onError: function(e) { console.log(e.toString()); },
    includePaths: require('node-neat').includePaths
  }))
  .pipe(autoprefixer('last 2 versions', '> 1%', 'ie 8'))
  .pipe(gulp.dest('./public/css/'));
});

gulp.task('views', function() {
  gulp.src('./client/index.html')
  .pipe(gulp.dest('./public/'));

  return gulp.src('./client/views/**/*')
  .pipe(gulp.dest('./public/views/'));
});

gulp.task('bower', function() {
  return bower({ directory: './client/components' })
  .pipe(gulp.dest('./public/lib'));
});

gulp.task('scripts', function() {
  return gulp.src('./client/scripts/**/*')
  .pipe(jshint())
  .pipe(jshint.reporter('jshint-stylish'))
  .pipe(concat('main.js'))
  .pipe(gulp.dest('./public/js'));
});

gulp.task('server', function () {
  // Start livereload server
  livereload.listen();

  // Start the webserver
  nodemon({ script: 'server.js', ext: 'html js', env: { 'NODE_ENV': 'development' }, ignore: ['public/*', 'client/**', 'node_modules/**'] })
  // .on('change', ['lint'])
  .on('restart', function () {
    console.log('restarted server');
  });
});

function _handleError(err) {
  console.log(err.toString());
  this.emit('end');
}
