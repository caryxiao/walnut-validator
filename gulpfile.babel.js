
import gulp from "gulp";
import rename from "gulp-rename";
import replace from "gulp-replace";
import jshint from "gulp-jshint";
import babel from "gulp-babel";
import concat from "gulp-concat";
import webpack from "gulp-webpack";
// import wiredep from "wiredep"

// gulp.task('jshint', function () {
//     return gulp.src("src/*.js")
//         .pipe(jshint())
//         .pipe(jshint.reporter('default'));
// });

gulp.task('babel', () => {
    return gulp.src('src/*.js')
        .pipe(babel())
        .pipe(gulp.dest('dist'));
});

// gulp.task('minify', ['babel'], () => {
//     return gulp.src("src/*.js")
//         .pipe(babel({
//             presets: ['es2015']
//         }))
//         .pipe(webpack())
//         .pipe(concat('walnut-validator.js'))
//         .pipe(gulp.dest('dist'));
// });

gulp.task('default', ['babel']);