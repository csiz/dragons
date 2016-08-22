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

let cache = new Cache()

gulp.task("client:scripts", () => {
    return browserify({
        entries: "./src/scripts/client.es6",
        extensions: [".js", ".es6", ".coffee"],
        debug: true})
        .transform(babelify, {presets: ["es2015"], extensions: [".es6"]})
        .transform(coffeeify, {extensions: [".coffee"]})
        .transform(cssify)
        .bundle()
        .on("error", err => { 
            gutil.log(gutil.colors.red(err.name));
            gutil.log(err.message.replace(err.filename + ": ", ""));
            gutil.log(gutil.colors.yellow(err.filename + ":" + err.loc.line + ":" + err.loc.column) + "\n" + err.codeFrame)
            // gutil.log(err)
            this.emit("end"); 
        })
        .pipe(source("main.js"))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sourcemaps.write(".sourcemaps"))
        .pipe(gulp.dest("./build/client/scripts"))
})

gulp.task("server:scripts", () => {
    return gulp.src("./src/scripts/**/*")
        .pipe(gulp.dest("./build/server/"))
    
    // TODO: fix this
    let stream = gulp.src("./src/scripts/**/*")
        .pipe(cache.filter())
        .pipe(babel({
            sourceMaps: true,
            presets: ["es2015"],
            sourceRoot: "./src/scripts/server.es6"
        }))
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sourcemaps.write(".sourcemaps"))
        .pipe(cache.cache())
        .pipe(gulp.dest("./build/server/"))
    return stream
})


gulp.task("build", ["client:scripts", "server:scripts"])

gulp.task("watch", ["build"], () => {
  gulp.watch("./src/**/*", ["client:scripts", "server:scripts"]);
})

gulp.task("default", ["watch"])

gulp.task("clean", () => {
    return del.sync("build")
})
