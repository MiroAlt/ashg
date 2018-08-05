var gulp = require('gulp');
var jshint = require('gulp-jshint');
var changed = require('gulp-changed');
var plumber = require('gulp-plumber');
var cleancss = require('gulp-clean-css');
var less = require('gulp-less');
var imagemin = require('gulp-imagemin');
var svgSymbols = require('gulp-svg-symbols');
var browserSync = require('browser-sync').create();
var SRC = 'app/js/*.js';
var DEST = 'dist/js';


// Static Server + watching less/html files
gulp.task('serve', ['less'], function (){

    browserSync.init({
        server: "./app"
    });

    gulp.watch('app/less/**/*.less', ['less']);
    gulp.watch('app/*.html').on('change', browserSync.reload);
});

/* Compile less into CSS & auto-inject into browsers */
gulp.task('less', function () {
    return gulp.src("app/less/*.less")
        .pipe(less())
        .pipe(gulp.dest("app/css"))
        .pipe(browserSync.stream());
});

/*Img min */
gulp.task('img', function () {
    return gulp.src('app/img/source/*')
        .pipe(imagemin(
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ))
        .pipe(gulp.dest('app/img'));
});

/*SVG sprites*/
gulp.task('sprites', function () {

    return gulp.src('app/img/svg/*.svg')
        .pipe(svgSymbols({
            svgClassname: 'svg-icon'
        }))
        .pipe(gulp.dest('app/img'));
});

/* Minify css */
gulp.task('cleancss', function () {

    return gulp.src('app/css/*.css')
        .pipe(cleancss({
            keepSpecialComments: 1
        }))
        .pipe(gulp.dest('dist/css'))

});

gulp.task('changed', function () {
    return gulp.src(SRC)
        .pipe(plumber())
        .pipe(changed(DEST))
        .pipe(gulp.dest(DEST));
});

/*jshint*/
gulp.task('jshint', function () {
    gulp.src('app/js/**/*.js')
        .pipe(plumber())
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});


gulp.task('watch', function () {
    gulp.watch(SRC, ['cleancss'])
});

// Default task
gulp.task('default', ['serve','less', 'watch']);