/**
 * Requirements
 */

var gulp = require('gulp'),
  cleanCss = require('gulp-clean-css'),
  uglify = require('gulp-uglify-es').default,
  concat = require('gulp-concat'),
  less = require('gulp-less'),
  sourcemaps = require('gulp-sourcemaps');


/**
 * Config
 */

var production = false,
  distDir = './dist/',
  srcDir = './src/';


/**
 * Gulp task functions
 */

function processScripts() {

  var sourceDirs = [
    srcDir + 'js/lib/**/*.js',
    srcDir + 'js/app.js',
    srcDir + 'js/mixins/util.js',
    srcDir + 'js/mixins/i18n-handler.js',
    srcDir + 'js/mixins/**/*.js',
    srcDir + 'js/components/**/*.js'
  ];

  gulp.src(sourceDirs)
    .pipe(concat('astrid-engine-bundle.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(distDir));

  gulp.src(sourceDirs)
    .pipe(sourcemaps.init())
    .pipe(concat('astrid-engine-bundle.sourcemaps.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(distDir));

}

function compileLess() {

  var stream = gulp.src(srcDir + 'less/astrid-engine.less')
    .pipe(less());

  production && stream.pipe(cleanCss());

  stream.pipe(gulp.dest(distDir));

}

function watch() {
  gulp.watch(srcDir + '/less/*.less' , ['styles']);
  gulp.watch(srcDir + '/js/**/*.js' , ['scripts']);
}

function buildForProd() {

  production = true;

  compileLess();
  processScripts();

}


/**
 * Gulp task definitions
 */
gulp.task('watch', watch);
gulp.task('styles', compileLess);
gulp.task('scripts', processScripts);
gulp.task('build', buildForProd);
gulp.task('default', ['watch']);