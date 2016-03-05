gulp = require("gulp")
gutil = require("gulp-util")

coffee = require("gulp-coffee")
sourcemaps = require("gulp-sourcemaps")
uglify = require("gulp-uglify")

gulp.task("dragons-game", function(){
    return gulp.src("src/**/*.coffee")
        .pipe(sourcemaps.init())
        .pipe(coffee())
        .pipe(gutil.env.type === "production" ? uglify() : gutil.noop())
        .pipe(gulp.dest("build"));
});

gulp.task("default", ["dragons-game"]);

