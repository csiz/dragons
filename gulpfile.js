// Imports:

var gulp = require("gulp");
var coffee = require("gulp-coffee");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var imagemin = require("gulp-imagemin");
var changed = require("gulp-changed");
var sourcemaps = require("gulp-sourcemaps");
var del = require("del");
var nodemon = require("gulp-nodemon");

// Paths to source files:

var paths = {
    server: {
        scripts: ["server/**/*.coffee"]
    },
    client: {
        html: ["client/**/*.html"],
        scripts: ["client/**/*.coffee"],
        style: ["client/**/*.css"]
    }
};

// Clean.

gulp.task("clean", () => {
    return del(["build"]);
});

// Client build tasks:

gulp.task("client-scripts", () => {
    return gulp.src(paths.client.scripts)
        .pipe(changed("build/client/scripts/"))
        .pipe(sourcemaps.init())
            .pipe(coffee())
            .pipe(uglify())
            .pipe(concat("main.min.js"))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("build/client/scripts/"))
        ;
});

gulp.task("client-html", () => {
    return gulp.src(paths.client.html)
        .pipe(gulp.dest("build/client/"))
        ;
});

gulp.task("client-style", () => {
    return gulp.src(paths.client.style)
        .pipe(gulp.dest("build/client/styles"))
        ;
});

gulp.task("client", ["client-html", "client-scripts", "client-style"]);

gulp.task("watch-client", ["client"], () => {
    gulp.watch(paths.client.scripts, ["client-scripts"]);
    gulp.watch(paths.client.html, ["client-html"]);
    gulp.watch(paths.client.style, ["client-style"]);
});



// Server build tasks:

gulp.task("server", ["client"], () => {
    return gulp.src(paths.server.scripts)
        .pipe(changed("build/"))
        .pipe(sourcemaps.init())
            .pipe(coffee())
            .pipe(uglify())
            .pipe(concat("server.min.js"))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("build/"))
        ;
});

gulp.task("watch-server", ["server"], () => {
    gulp.watch(paths.server.scripts, ["server"]);
    nodemon({
        script: "build/server.min.js",
        watch: "build/**/*"
    });
});

// Targets:

gulp.task("watch", ["watch-server", "watch-client"]);
gulp.task("rewatch", ["clean"], () => {
    gulp.start("watch");
});

gulp.task("build", ["server", "client"]);
gulp.task("rebuild", ["clean"], () => {
    gulp.start("build");
});

gulp.task("default", ["clean"], () => {
    gulp.start("watch");
});