'use strict';

// Gulp dependencies
const gulp = require('gulp');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const jsonminify = require('gulp-jsonminify');

// Core
// ------------------------------------------------------------------------------------------------------

gulp.task('build_background_and_content_scripts', function () {
    return gulp.src(['src/js/background.js', 'src/js/content.js']).pipe(gulp.dest('dist/js'));
});

gulp.task('build_core', gulp.series('build_background_and_content_scripts'));

// Options
// ------------------------------------------------------------------------------------------------------

gulp.task('build_options_styles', function () {
    return gulp
        .src(['src/css/libs/**/*.css', 'src/css/options.css'])
        .pipe(concat('options.css'))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('build_options_libs', function () {
    return gulp
        .src(['src/js/libs/**/*.js'])
        .pipe(concat('libs.js'))
        .pipe(
            rename({
                suffix: '.min',
            })
        )
        .pipe(gulp.dest('dist/js/libs'));
});

gulp.task('build_options_script', function () {
    return gulp.src(['src/js/options/**/*.js']).pipe(concat('options.js')).pipe(gulp.dest('dist/js'));
});

gulp.task('build_options_icons', function () {
    return gulp
        .src(['src/js/options/icons.json'])
        .pipe(jsonminify())
        .pipe(
            rename({
                suffix: '.min',
            })
        )
        .pipe(gulp.dest('dist/js'));
});

gulp.task('build_options_html', function () {
    return gulp.src(['src/html/**/*.html']).pipe(gulp.dest('dist/html'));
});

gulp.task(
    'build_options',
    gulp.series(
        'build_options_styles',
        'build_options_libs',
        'build_options_script',
        'build_options_html',
        'build_options_icons'
    )
);

// ------------------------------------------------------------------------------------------------------

gulp.task('build', gulp.series('build_core', 'build_options'));

gulp.task('watch', function () {
    gulp.watch('src/**/*', gulp.series('build_core', 'build_options'));
});

// Default tasks (called when running `gulp` from cli)
gulp.task('default', gulp.series('build_core', 'build_options', 'watch'));
