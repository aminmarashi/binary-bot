const gulp = require("gulp");
const del = require("del");
const paths = require("vinyl-paths");
const rev = require("gulp-rev");
const through = require("through2");
const concat = require("gulp-concat-util");
const concatCss = require("gulp-concat-css");
const rename = require("gulp-rename");
const cleanCSS = require("gulp-clean-css");
const { addToManifest } = require("./revision");

gulp.task("clean-bundle", () => gulp.src("./www/js/bundle*").pipe(paths(del)));

gulp.task("bundle-js", () =>
  gulp
    .src([
      "./node_modules/blockly/blockly_compressed.js",
      "./node_modules/blockly/blocks_compressed.js",
      "./node_modules/blockly/javascript_compressed.js"
    ])
    .pipe(concat("bundle.js"))
    .pipe(rev())
    .pipe(through.obj(addToManifest))
    .pipe(gulp.dest("www/js/"))
);

gulp.task("bundle-css", () =>
  gulp
    .src([
      "node_modules/{bootstrap/dist/css/bootstrap.min,jquery-ui-css/jquery-ui.min}.css"
    ])
    .pipe(concatCss("bundle.css"))
    .pipe(rev())
    .pipe(through.obj(addToManifest))
    .pipe(gulp.dest("www/css"))
);
