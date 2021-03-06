var gulp = require('gulp'),
compass = require('gulp-compass'),
sourcemaps = require('gulp-sourcemaps'),
handlebars = require('gulp-compile-handlebars'),
rename = require('gulp-rename'),
dir = require('node-dir'),
browserSync = require('browser-sync').create(),
del = require('del'),
useref = require('gulp-useref'),
uglify = require('gulp-uglify'),
gulpIf = require('gulp-if'),
minifyCSS = require('gulp-minify-css');
cssnano = require('gulp-cssnano'),
imagemin = require('gulp-imagemin'),
runSequence = require('run-sequence');

var srcPath = 'src/';
var distPath = 'dist/';

require('gulp-stats')(gulp);

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: distPath,
    },
    port: 8080,
    startPath: 'main.html',
  })
});

// gulp.task('compass', function(){
//   return gulp.src(srcPath+'scss/**/*.+(scss|sass)')
//     .pipe(compass({
//       style: 'compressed',
//       sourcemap: true
//     }).on('error', sass.logError)) // Using gulp-sass
//     .pipe(minifyCSS())
//     .pipe(gulp.dest(distPath+'css'))
//     .pipe(browserSync.reload({
//       stream: true
//     }));
// });

gulp.task('compass', function() {
  gulp.src(srcPath+'scss/**/*.+(scss|sass)')
    .pipe(compass({
      css: distPath+'css/',
      sass: srcPath+'scss/',
      style: 'compressed',
      sourcemap: true
    }))
    .on('error', function(error) {
      // Would like to catch the error here
      console.log(error);
      this.emit('end');
    })
    //.pipe(minifyCSS())
    .pipe(gulp.dest(distPath+'css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// gulp.task('autoprefixer', function () {
//   var postcss      = require('gulp-postcss');
//   var autoprefixer = require('autoprefixer');
//
//   return gulp.src(distPath+'css/**/*.css')
//     .pipe(sourcemaps.init())
//     .pipe(postcss([ autoprefixer({
//       browsers: ['last 5 versions'],
//       cascade: false
//     }) ]))
//     //.pipe(sourcemaps.write('.'))
//     .pipe(gulp.dest(distPath+'css/'));
// });

gulp.task('fonts', function() {
  return gulp.src([
    srcPath+'fonts/**/*',
    '!'+srcPath+'fonts/**/*.+(html|css)'
  ])
  .pipe(gulp.dest(distPath+'fonts'))
});

gulp.task('images', function() {
  return gulp.src([
    srcPath+'**/*.{png,jpg,gif,svg}',
    '!'+srcPath+'fonts/**/*.*'
  ])
  .pipe(gulp.dest(distPath))
});

gulp.task('images:opt', function() {
  return gulp.src([
    distPath+'**/*.{png,jpg,gif,svg}',
    '!'+srcPath+'fonts/**/*.*'
  ])
  .pipe(imagemin())
  .pipe(gulp.dest(distPath))
});

gulp.task('js', function() {
  return gulp.src([
    srcPath+'**/*.js',
    '!'+srcPath+'templates/**/*.*'
  ])
  .pipe(gulp.dest(distPath))
});

gulp.task('useref', function(){
  return gulp.src(distPath+'**/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest(distPath))
});



gulp.task('hbs', function() {
  //var path = require('path');
  //var partialsList = './'+srcPath+'templates/partials'+path;
  var partialsDir = srcPath+'templates/partials';
  //var dirName = path.dirname(partialsList);
  //console.log(dirName);

  var subdirsList = dir.subdirs(partialsDir, function(err, subdirs) {
    if (err) {
      throw err;
    } else {
      //console.log(subdirs);
      var batchList = subdirs;
      batchList.push('./'+srcPath+'templates/partials/');

      var content = require('./'+srcPath+'templates/data/main.json');
      var helper = require('./'+srcPath+'templates/helpers/main-helper.js');
      var options = {
        //ignorePartials: true,
        // partials : {
        //   footer : '<footer>the end</footer>'
        // },
        batch: batchList,
        helpers : helper
      }
      console.log(batchList);
      return gulp.src([
          srcPath+'templates/pages/**/*.hbs',
          //'!'+srcPath+'templates/**/*.hbs',
        ])
        .pipe(handlebars(content, options))
        .pipe(rename({extname: '.html'}))
        .pipe(gulp.dest(distPath))
        .pipe(browserSync.reload({
          stream: true
        }))
    }
  });
});

gulp.task('clean:dist', function() {
  console.log('deleta');
  return del.sync(distPath);
})

gulp.task('watch', ['browserSync'], function(callback){
  runSequence('hbs', //clean:dist e a task original aqui, removida porque deu problema no windows
    ['compass', 'js', 'useref', 'images', 'fonts'],
    callback
  );
  gulp.watch([
    srcPath+'templates/**/*.hbs',
    srcPath+'templates/data/**/*.*'
  ], ['hbs']);
  gulp.watch(srcPath+'scss/**/*.+(scss|sass)', ['compass']);
  gulp.watch([
    srcPath+'fonts/**/*',
    '!'+srcPath+'fonts/**/*.+(html|css)'
  ], ['fonts']);
  gulp.watch([
    srcPath+'**/*.js',
    '!'+srcPath+'templates/**/*.*'
  ], ['js']);
  gulp.watch([
    srcPath+'**/*.{png,jpg,gif,svg}',
    '!'+srcPath+'fonts/**/*.*'
  ], ['images']);
  gulp.watch([
    srcPath+'fonts/**/*',
    distPath+'js/**/*.js',
    distPath+'*.[html|css]',
    '!'+srcPath+'fonts/**/*.+(html|css)'
  ], browserSync.reload);
})

gulp.task('build', function (callback) {
  runSequence('clean:dist',
    ['compass', 'js', 'hbs', 'images', 'fonts'],
    callback
  )
});

gulp.task('build:min', function (callback) {
  runSequence('clean:dist',
    ['compass', 'js', 'hbs', 'useref', 'images', 'images:opt', 'fonts'],
    callback
  )
});

gulp.task('default', function (callback) {
  runSequence(['build', 'browserSync', 'watch'],
    callback
  )
});
