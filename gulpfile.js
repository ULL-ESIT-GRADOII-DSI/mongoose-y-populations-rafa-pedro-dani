(() => {
    'use strict';

    let gulp        = require('gulp');
    let nodemon     = require('gulp-nodemon');
    let browserSync = require('browser-sync');
    let jshint      = require('gulp-jshint');
    let jscs        = require('gulp-jscs');
    let scsslint    = require('gulp-scss-lint');
    let clean       = require('gulp-clean');

    gulp.task('default', ['browser-sync']);

    gulp.task('clean', () => {
        return gulp.src([
                'public/stylesheets/*.css'
            ])
            .pipe(clean());
    });

    gulp.task('browser-sync', ['nodemon'], () => {
        browserSync.init(null, {
            proxy: 'http://localhost:3000',
            files: [
                'views/**/*.ejs',
                'public/js/**/*.js',
                'public/img/**/*.*',
                'public/vendor/**/*.*',
                'assets/public/stylesheets/**/*.scss'
            ],
            port: 8080
        });
    });

    gulp.task('nodemon', (cb) => {
        var started = false;

        return nodemon({
            script: 'bin/www'
        }).on('start', () => {
            if (!started) {
                cb();
                started = true;
            }
        });
    });

    gulp.task('lint', ['lint:jshint', 'lint:jscs', 'lint:scss']);

    // Tarea para pasar el JSHint a el código
    gulp.task('lint:jshint', () => {
        return gulp.src([
                'gulpfile.js',
                'public/js/**/*.js',
                'routes/**/*.js',
                'assets/modules/**/*.js',
                'db/models/**/*.js'
            ])
            .pipe(jshint('.jshintrc'))
            .pipe(jshint.reporter('jshint-stylish'));
    });

    // Tarea para pasar el JSCS a el código
    gulp.task('lint:jscs', () => {
        return gulp.src([
                'gulpfile.js',
                'public/js/**/*.js',
                'routes/**/*.js',
                'assets/modules/**/*.js',
                'db/models/**/*.js'
            ])
            .pipe(jscs())
            .pipe(jscs.reporter());
    });

    // Tarea para pasar el SCSS-Lint a el código
    gulp.task('lint:scss', () => {
        return gulp.src('assets/frontend/stylesheets/**/*.scss')
            .pipe(scsslint());
    });
})();
