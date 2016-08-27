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

import nodemon from "gulp-nodemon"
import babel from "gulp-babel"
import Cache from "gulp-file-cache"

import livereload from "gulp-livereload"

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
            sourceRoot: "./src/scripts/server.es6"
        }))
        .on("error", onserverError)
        .pipe(cache.cache())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sourcemaps.write(".sourcemaps"))
        .pipe(gulp.dest("./build/server/"))
})

gulp.task("client:pages", () => {
    return gulp.src("./src/**/*.html")
        .pipe(gulp.dest("./build/client/"))
})

gulp.task("build", ["client:scripts", "server:scripts", "client:pages"], () => {

})

gulp.task("watch", ["build"], () => {
    livereload.listen()

    gulp.watch("./src/**/*", ["client:scripts", "server:scripts", "client:pages"]);

    nodemon({
        script: "build/server/server.js",
        watch: "build/server",
    })
        .on("restart", () => {
            gutil.log("Calling livereload.")
            livereload.reload()
        })
})

gulp.task("default", ["watch"])

gulp.task("clean", () => {
    return del.sync("build")
})
