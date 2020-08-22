const gulp = require('gulp');
const browserSync = require('browser-sync');
const babel = require('gulp-babel');
const uglify = require('gulp-terser');
const rename = require('gulp-rename');
const cleancss = require('gulp-clean-css');
const filter = require('gulp-filter');
const del = require('del');

const workboxBuild = require('workbox-build');


const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const sourcemaps = require('gulp-sourcemaps');
const log = require('gulplog');

'use strict';

//JS from html template
function processJs() {
  return gulp.src([
    'web/assets/js/*.js',
  ])
    //.pipe(babel({
    //  presets: ['env']
    //}))
    //.pipe(uglify())
    //.pipe(rename({
    //    suffix: '.min'
    //}))
    .pipe(gulp.dest('build/assets/js'));
}

gulp.task('processJs', processJs);

function watchJs() {
  gulp.watch('web/assets/js/*.js', processJs);
  gulp.watch('app/js2/**/*.js', processAnalysis3);
}

function processAnalysis3() {
  // set up the browserify instance on a task basis
  var b2 = browserify({
    entries: [
      './app/js2/main.js',
      './node_modules/three/examples/jsm/controls/OrbitControls.js',
  ],

    transform: ['babelify'],
    debug: true
  })
  .transform(babelify.configure({
    presets: ["@babel/preset-env"]
  }));

  return b2.bundle()
    .pipe(source('app2.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        //.pipe(uglify())
        .on('error', log.error)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./build/'));
}

// Clean "build" directory
function clean() {
  return del(['build/*'], {
    dot: true
  });
};

function copy() {
  return gulp.src([
      'web/*.html',
      'web/**/*.jpg',
      'web/**/*.svg',
      'web/**/*.png',
      'web/**/*.scss',
      'web/**/webfonts/*',
      'web/**/d3/d3.js',
      'web/**/data/*',
      'resources/**/default.csv'
    ])
    .pipe(gulp.dest('build'));
}

gulp.task('copy', copy);

function serve() {
  return browserSync.init({
    server: 'build',
    open: false,
    port: 3000
  });
}

function buildSw() {
  return workboxBuild.injectManifest({
    swSrc: 'app/sw.js',
    swDest: 'build/sw.min.js',
    globDirectory: 'build',
    globPatterns: [
      '**',
    ],
    globIgnores: [
      'sw.js', 'app2.js'
    ]
  }).then(resources => {
    console.log(`Injected ${resources.count} resources for precaching, ` +
      `totaling ${resources.size} bytes.`);
  }).catch(err => {
    console.log('Uh oh 😬', err);
  });
}

function copyHtml() {
  return gulp.src(['web/*.html'])
  .pipe(gulp.dest('build/'));
}


function watchHtml() {
  gulp.watch('web/*.html', copyHtml);
}

function processCss() {
  return gulp.src('web/assets/css/*.css')
    .pipe(filter([
      'web/assets/css/main.css',
      'web/assets/css/main2.css',
      'web/assets/css/main-portrait.css',
      'web/assets/css/ipad.css',
      'web/assets/css/fontawesome-all.min.css'
    ]))
    .pipe(cleancss())
    .pipe(gulp.dest('build/assets/css/'));
}

gulp.task('processCss', processCss)

function watchCss() {
  gulp.watch('web/assets/css/*.css', processCss);
}

function watch() {
  gulp.parallel(watchCss);
}

gulp.task('watch', watch);

gulp.task("build", gulp.series(
  clean,
  copy,
  processJs,
  processAnalysis3,
  processCss,
  buildSw
));

gulp.task('buildAndServe', gulp.series("build", gulp.parallel(
    watchCss, 
    watchJs,
    watchHtml, 
    serve)
));
