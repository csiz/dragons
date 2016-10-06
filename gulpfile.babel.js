import gulp from "gulp"
import gutil from "gulp-util"
import sourcemaps from "gulp-sourcemaps"
import browserify from "browserify"
import babelify from "babelify"
import coffeeify from "coffeeify"
import cssify from "cssify"
import source from "vinyl-source-stream"
import buffer from "vinyl-buffer"
import del from "del"

import mocha from "gulp-mocha"
import should from "should"

import nodemon from "gulp-nodemon"
import babel from "gulp-babel"
import Cache from "gulp-file-cache"

import livereload from "gulp-livereload"

import _ from "lodash"

let cache = new Cache()

let onclientError = function(err) { 
    gutil.log(gutil.colors.red(err.name));
    gutil.log(err.message.replace(err.filename + ": ", ""));
    gutil.log(gutil.colors.yellow(err.filename + ":" + err.loc.line + ":" + err.loc.column) + "\n" + err.codeFrame)
    // gutil.log(err)
    this.emit("end"); 
}


gulp.task("client:scripts", () => {
    return browserify({
        entries: "./src/scripts/client.es6",
        extensions: [".js", ".es6", ".coffee"],
        debug: true})
        .transform(babelify, {presets: ["es2015"], extensions: [".es6"]})
        .transform(coffeeify, {extensions: [".coffee"]})
        .transform(cssify)
        .bundle()
        .on("error", onclientError)
        .pipe(source("main.js"))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sourcemaps.write(".sourcemaps"))
        .pipe(gulp.dest("./build/client/scripts"))
})

let onserverError = function(err) { 
    gutil.log(gutil.colors.red(err.name))
    gutil.log(err.message)
    gutil.log(gutil.colors.yellow(err.fileName + ":" + err.loc.line + ":" + err.loc.column) + "\n" + err.codeFrame)
    gutil.log(err.stack)
    // gutil.log(gutil.colors.red("the end"))
    this.emit("end")
}

gulp.task("server:scripts", () => {
    return gulp.src("./src/scripts/**/*")
        .pipe(cache.filter())
        .pipe(babel({
            sourceMaps: true,
            presets: ["es2015"],
            sourceRoot: "./src/scripts/"
        }))
        .on("error", onserverError)
        .pipe(cache.cache())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sourcemaps.write(".sourcemaps"))
        .pipe(gulp.dest("./build/server/"))
})

gulp.task("server:tests", ["server:scripts"], () => {
    return gulp.src("./build/server/**/*.test.js", {read: false})
        .pipe(mocha({globals: should}))
        .on("error", (err) => gutil.log(err))
})

gulp.task("client:pages", () => {
    return gulp.src("./src/**/*.html")
        .pipe(gulp.dest("./build/client/"))
})

gulp.task("client:data", () => {
    return gulp.src("./src/data/**/*.{png}")
        .pipe(cache.filter())
        .pipe(cache.cache())
        .pipe(gulp.dest("./build/client/data/"))
})

gulp.task("client", ["client:scripts", "client:pages", "client:data"])
gulp.task("server", ["server:scripts", "server:tests"])
gulp.task("tests", ["server:tests"])
gulp.task("build", ["client", "server"])

gulp.task("watch", ["build"], () => {
    livereload.listen()

    gulp.watch("./src/**/*", ["build"]);

    nodemon({
        script: "build/server/server.js",
        watch: "build",
        delay: 2000,
    })
    .on("restart", _.debounce(() => {
        gutil.log("Calling livereload.")
        livereload.reload()
    }, 1000))
})

gulp.task("default", ["watch"])

gulp.task("clean", () => {
    return del.sync("build")
})
