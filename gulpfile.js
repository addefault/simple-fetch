const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const csso = require('gulp-csso');
const uglify = require('gulp-uglify');
const sync = require('browser-sync');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');

function scss() {
    return gulp.src('src/scss/**.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 6 versions']
        }))
        .pipe(csso())
        .pipe(rename(path => path.basename += '.min'))
        .pipe(gulp.dest('template/css'))
}

function js() {
    return gulp.src('src/js/**.js')
        .pipe(uglify())
        .pipe(rename(path => path.basename += '.min'))
        .pipe(gulp.dest('template/js'))
}

function server() {
    sync.init({
        server: '.'
    })
    gulp.watch('**.html').on('change', sync.reload);
    gulp.watch('src/scss/**.scss', gulp.series(scss)).on('change', sync.reload);
    gulp.watch('src/js/**.js', gulp.series(js)).on('change', sync.reload);
}

exports.default = gulp.series(scss, js, server);