const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const rename = require("gulp-rename");
const clean = require("del");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const autoprefixer = require("gulp-autoprefixer");
const minifyCss = require("gulp-clean-css");
const imagemin = require("gulp-imagemin");
const browserSync = require("browser-sync").create();

function moveCss() {
  return gulp
    .src("./src/scss/index.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(rename("styles.min.css"))
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(minifyCss())
    .pipe(gulp.dest("./dest"));
}

function filesClean() {
  return clean("dest");
}

function moveJS() {
  return gulp
    .src("src/js/*.js")
    .pipe(uglify())
    .pipe(concat("scripts.min.js"))
    .pipe(gulp.dest("./dest"));
}

function moveImg() {
  return gulp.src("src/img/*").pipe(imagemin())
    .pipe(gulp.dest("dest/images"));
}

gulp.task("build", gulp.series(filesClean, moveCss, moveJS, moveImg));

gulp.task("dev", function () {
  browserSync.init({
    server: {
      baseDir: "./",
    },
  });
  gulp.watch(
    ["./*.html", "./src/scss/**/*.scss", ".src/js/*.js"],
    browserSync.reload
  );
  gulp.watch(["./src/scss/**/*.scss", "./src/js/*.js"], gulp.series("build"));
});

