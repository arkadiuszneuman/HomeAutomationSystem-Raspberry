var gulp = require('gulp');
var ngAnnotate = require('gulp-ng-annotate');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var header = require('gulp-header');
var less = require('gulp-less');
var minifyCss = require('gulp-minify-css');

var pkg = require('./package.json');
var banner = ['/**',
    ' * <%= pkg.description %> <%= pkg.version %>',
    ' * ©<%= new Date().getFullYear() %>',
    ' * All rights reserved',
    ' */',
    ''].join('\n');

function swallowError(error) {
    console.log(error.toString());
    this.emit('end');
}

gulp.task('js', function () {
    return gulp.src(['public/js/**/*.js', '!public/js/template/**/*.js'])
        .pipe(ngAnnotate({ single_quotes: true }))
        .pipe(concat('has.js'))
        .pipe(uglify())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest('dist'));
});

gulp.task('less', function () {
    return gulp.src('public/**/*.less')
        .pipe(less())
        .on('error', swallowError)
        .pipe(gulp.dest('public/'));
});

gulp.task('css', function () {
    return gulp.src('public/css/**/*.css')
        .pipe(concat('has.css'))
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', function () {
    gulp.watch('public/js/**/*.js', ['js']);
    gulp.watch('public/**/*.less', ['less']);
    gulp.watch('public/css/**/*.css', ['css']);
});

gulp.task('default', ['js', 'css', 'less']);