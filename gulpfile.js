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
var livereload = require("gulp-livereload");
var browserify = require("gulp-browserify")

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
    return gulp.src(paths.client.scripts, {read: false})
        .pipe(changed("build/client/scripts/"))
        .pipe(browserify({
            transform: ["coffeeify"],
            extensions: [".coffee"],
            debug: true
        }))
        .pipe(concat("main.js"))
        .pipe(gulp.dest("build/client/scripts/"))
        .pipe(livereload())
        ;
});

gulp.task("client-html", () => {
    return gulp.src(paths.client.html)
        .pipe(changed("build/client/"))
        .pipe(gulp.dest("build/client/"))
        .pipe(livereload())
        ;
});

gulp.task("client-style", () => {
    return gulp.src(paths.client.style)
        .pipe(changed("build/client/styles/"))
        .pipe(gulp.dest("build/client/styles"))
        .pipe(livereload())
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
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("build/"))
        .pipe(livereload())
        ;
});

gulp.task("watch-server", ["server"], () => {
    gulp.watch(paths.server.scripts, ["server"]);
    nodemon({
        script: "build/main.js",
        watch: "build/**/*"
    });
    livereload.listen();

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