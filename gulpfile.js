const gulp = require('gulp');
const del = require('del');
const pump = require('pump');
const plugins = require('gulp-load-plugins')();
const gutil = require('gulp-util');
const uglify = require('gulp-uglify-es').default;
const runSequence = require('run-sequence');
const jsdocConfig = require('./jsdoc.json');

const libJs = [
  'node_modules/jquery/dist/jquery.js',
  'node_modules/angular/angular.js',
  'node_modules/angular-animate/angular-animate.js',
  'node_modules/angular-messages/angular-messages.js',
  'node_modules/@uirouter/angularjs/release/angular-ui-router.js',
  'node_modules/angular-storage/dist/angular-storage.js',
  'node_modules/angular-translate/dist/angular-translate.js',
  'node_modules/angular-translate-loader-partial/angular-translate-loader-partial.js',
  'node_modules/ui-bootstrap4/dist/ui-bootstrap-tpls.js',
];
const localJs = [
  'frontend/app/app.module.js',
  'frontend/app/**/*.module.js',
  'frontend/app/**/*.js',
];
const sourceJs = libJs.concat(localJs);
const sourceBackend = [
  'README.md',
  'jsdoc-externals.js',
  'backend/bin/www',
  'backend/**/*.js'
];
const sourceCss = [
  'frontend/styles/**/*.sass',
  'frontend/styles/**/*.scss'
];
const sourceHtml = ['frontend/html/**/*'];
const sourceImage = ['frontend/images/**/*'];
const sourceI18n = ['frontend/i18n/**/*'];
const dest = 'web';
const destinationJs = `${dest}/js`;
const destinationCss = `${dest}/stylesheets`;
const destinationHtml = `${dest}`;
const destinationImage = `${dest}/images`;
const destinationI18n = `${dest}/i18n`;
const finalJs = 'frontend.js';
const lintJs = [
  '/**/*.js',
  '!**/*gulpfile.js'
];
const cleanDest = [`${dest}`];
const cleanJs = [`${destinationJs}`];
const cleanCss = [`${destinationCss}`];
const cleanHtml = [
  `${destinationHtml}/**/*.html`,
  `${destinationHtml}/partials`
];
const cleanImage = [`${destinationImage}`];
const cleanI18n = [`${destinationI18n}`];
const isProduction = (process.env.NODE_ENV === 'production');
const pumpPromise = streams => new Promise((resolve, reject) => {
  pump(streams, (err) => {
    if (err) {
      gutil.log(gutil.colors.red('[Error]'), err.toString());
      reject(err);
    } else resolve();
  });
});

gulp.task('doc', (cb) => {
  gulp.src(sourceBackend, { read: false })
    .pipe(plugins.jsdoc3(jsdocConfig, cb));
});

// Validates js files
gulp.task('lint', () => pumpPromise([
  gulp.src(lintJs),
  plugins.eslint(),
  plugins.eslint.format('stylish'),
  plugins.eslint.failAfterError(),
]));

// Removes js
gulp.task('clean-js', () => del(cleanJs));

// Removes css
gulp.task('clean-css', () => del(cleanCss));

// Removes html
gulp.task('clean-html', () => del(cleanHtml));

// Removes images
gulp.task('clean-image', () => del(cleanImage));

// Removes i18n jsons
gulp.task('clean-i18n', () => del(cleanI18n));

// Removes all static files
gulp.task('clean', (callback) => runSequence('clean-js', 'clean-css', 'clean-html', 'clean-image', 'clean-i18n', callback));

// Creates css from sass files and reload in dev mode
gulp.task('css', () => pumpPromise([
  gulp.src(sourceCss),
  plugins.sass(),
  plugins.cleanCss(),
  gulp.dest(destinationCss),
  plugins.if(!isProduction, plugins.connect.reload()),
]));

// Copies js lib
gulp.task('lib-js', () => pumpPromise([
  plugins.if(!isProduction, gulp.src(libJs)),
  plugins.if(!isProduction, gulp.dest(destinationJs)),
]));

// Copies and minifies if necessary js files and reloads in dev mode
gulp.task('js', () => pumpPromise([
  gulp.src((isProduction ? sourceJs : localJs)),
  plugins.concat(finalJs),
  gulp.dest(destinationJs),
  plugins.if(isProduction, uglify({ mangle: false })),
  plugins.if(isProduction, plugins.rename({ suffix: '.min' })),
  plugins.if(isProduction, gulp.dest(destinationJs)),
  plugins.if(!isProduction, plugins.connect.reload()),
]));

// Copies and replaces in html js import if production mode and reloads in dev mode
gulp.task('html', () => pumpPromise([
  gulp.src(sourceHtml),
  plugins.if(isProduction, plugins.htmlReplace({ js: '/js/frontend.min.js' })),
  gulp.dest(destinationHtml),
  plugins.if(!isProduction, plugins.connect.reload()),
]));

// Copies images and reloads in dev mode
gulp.task('image', () => pumpPromise([
  gulp.src(sourceImage),
  gulp.dest(destinationImage),
  plugins.if(!isProduction, plugins.connect.reload()),
]));

// Copies i18n files and reloads in dev mode
gulp.task('i18n', () => pumpPromise([
  gulp.src(sourceI18n),
  gulp.dest(destinationI18n),
  plugins.if(!isProduction, plugins.connect.reload()),
]));

// Creates connect server for dev mode
gulp.task('connect', () => {
  if (!isProduction) {
    plugins.connect.server({
      root: ['web', 'node_modules'],
      livereload: true,
    });
  }
});

// Watches files for reload in dev mode
gulp.task('watch', () => {
  if (!isProduction) {
    gulp.watch(sourceCss, ['css']);
    gulp.watch(sourceJs, ['js']);
    gulp.watch(sourceHtml, ['html']);
    gulp.watch(sourceImage, ['image']);
    gulp.watch(sourceI18n, ['i18n']);
    gulp.watch(sourceBackend, ['doc']);
  }
});

// Default task
gulp.task('default', callback => runSequence('clean', ['html', 'image', 'i18n', 'css', 'lib-js', 'js'], 'connect', 'watch', callback));
gulp.task('postinstall', ['default']);
