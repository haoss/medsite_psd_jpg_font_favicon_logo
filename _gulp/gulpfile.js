'use strict';

const gulp = require('gulp'),
      gulpif = require('gulp-if'),
      pug = require('gulp-pug'),
      emitty = require('emitty').setup('_pug', 'pug'),
      plumber = require('gulp-plumber'),
      browserSync = require('browser-sync'),
      scss = require('gulp-sass'),
      autoprefixer = require('gulp-autoprefixer'),
      sourcemaps = require('gulp-sourcemaps'),
      plugins = require('gulp-load-plugins')(),
      cleanCSS = require('gulp-clean-css'),
      tinypng = require('gulp-tinypng'),
      rimraf = require('rimraf'),
      rename = require('gulp-rename'),
      wait = require('gulp-wait2'),
      emailBuilder = require('gulp-email-builder'),
      critical = require('critical').stream
;

// Ключ активации для оптимизации 500 бесплатных картинок в месяц на сайте https://tinypng.com/
// Ключ зарегистрирован на почту haoss_ut@mail.ru
// Нужен новый ключ, регистрируется на другую (свою) почту 
const TINYPNG_API = "GuAIy8BmW79-zVDoYRzRR_9eVe-QnhlN";

gulp.task('emailBuilder', function() {
  return gulp.src(['./dist/email.html'])
    .pipe(emailBuilder().build())
    .pipe(rename('email-inline.html'))
    .pipe(gulp.dest('./dist/'));
});

// Pug
gulp.task('pug', () =>
  new Promise((resolve, reject) => {
    emitty.scan(global.emittyChangedFile).then(() => {
      gulp.src('_pug/*.pug')
        .pipe(plumber())
        .pipe(gulpif(global.watch, emitty.filter(global.emittyChangedFile)))
        .pipe(pug({
          pretty: '    '
        }))
        .pipe(gulp.dest('dist'))
        .on('end', resolve)
        .on('error', reject);
    });
  })
);

// Sass
gulp.task('scss', function () {
  return gulp.src('_scss/main.scss')
    .pipe(wait(1500))
    .pipe(plumber())
    .pipe(plugins.sourcemaps.init())
    .pipe(scss({

    }).on('error', scss.logError))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(cleanCSS())
    .pipe(rename('style.min.css'))
    .pipe(plugins.sourcemaps.write("/"))
    .pipe(gulp.dest('dist/css/'))
});

// Tinypng
gulp.task('tiny', function () {
  return gulp.src('_tinypng/**/*.{png,jpg}')
    .pipe(tinypng(TINYPNG_API))
    .pipe(gulp.dest('dist/images/tinypng/'))
});
gulp.task('rimraf', function (cb) {
  rimraf('.gulp', cb);
});
gulp.task('compress', gulp.series('tiny', 'rimraf'));

// Static server
gulp.task('browser-sync', function () {
  browserSync.init({
    server: {
      baseDir: "./"
    },
    notify: false,
    // reloadDelay: 3000
  });
});

gulp.task('critical', function () {
  return gulp.src('dist/index.html')
    .pipe(critical({
      base: 'dist/', 
      inline: true, 
      css: ['dist/css/style.min.css']
    }))
    .on('error', function(err) { log.error(err.message); })
    .pipe(rename('index-critical.html'))
    .pipe(gulp.dest('dist/'));
});

// Your "watch" task
gulp.task('watch', () => {
  global.watch = true;

  gulp.watch('_pug/**/*.pug', gulp.series('pug'))
    .on('all', (event, filepath) => {
      global.emittyChangedFile = filepath;
    });
  gulp.watch('_scss/**/*.scss', gulp.series('scss'));
  gulp.watch('dist/js/*.js').on("change", browserSync.reload);
  gulp.watch('dist/css/*.css').on('change', browserSync.reload);
  gulp.watch('dist/*.html').on('change', browserSync.reload);
});

// Default
gulp.task('default', gulp.parallel('browser-sync', 'watch'));