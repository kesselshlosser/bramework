// DEPENDENCIES
var gulp         = require('gulp');
var rename       = require('gulp-rename');
var copy         = require('gulp-copy');
var run          = require('gulp-run');
var plumber      = require('gulp-plumber');
var notify       = require('gulp-notify');
var sourcemaps   = require('gulp-sourcemaps');
var browserSync  = require('browser-sync').create();
var sass         = require('gulp-sass');
var postcss      = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano      = require('cssnano');
var concat       = require('gulp-concat');
var uglify       = require('gulp-uglify-es').default;
var svgstore     = require('gulp-svgstore');
var svgmin       = require('gulp-svgmin');
var sassdoc      = require('sassdoc')



// PATHS
const path = {
	source: 'src/',
	build: 'build/',
	dist: 'dist/',
	docs: 'docs/'
};



// CONFIG
const config = {


	// Sourcemaps
	sourcemap: {
		build: '../../' + path.build + 'sourcemap'
	},


	// Browser Sync
	browsersync: {
		server: 'dist/',
		// startPath: "index.html",
		browser: 'google chrome'
	},


	// HTML
	html: {
		task: 'html',
		source: [path.source + 'html/**/*.html',
						 path.source + 'html/_config.yml'],
		build: path.dist + '**/*.html',
		dist: path.dist,
		shellCommand: 'jekyll build --source src/html --destination dist/'
	},


	// PHP
	php: {
		task: 'php',
		source: path.source + 'php/**/*.php',
		dist: path.dist
	},


	// CSS
	css: {
		task: 'css',
		source: path.source + 'scss/**/*.scss',
		dist: path.dist + 'assets/',
		plugin: {
			rename: {
				suffix: '.min'
			},
			sass: {},
			// PostCSS
			postcss: [
				autoprefixer({
					browsers: ['> 5%']
				}),
				cssnano({
					autoprefixer: false,
					safe: true,
					sourcemap: false
				})
			]
		},
		docs: {
			task: 'css:docs',
			source: path.source + 'scss/**/*.scss',
			plugin: {
				sassdoc: {
					dest: path.docs + 'reference/'
				}
			}
		}
	},


	// JS
	js: {
		task: 'js',
		source: path.source + 'js/**/*.js',
		dist: path.dist + 'assets/',
		plugin: {
			concat: {
				path: 'script.js'
			},
			uglify: {},
			rename: {
				suffix: '.min'
			}
		}
	},


  // SVG
	svg: {
		task: 'svg',
		source: path.source + 'svg/**/*.svg',
		dist: path.dist + 'assets/',
		plugin: {
			svgmin: {},
			svgstore: {},
			rename: {
				basename: 'icons',
				suffix: '.min',
				extname: '.svg'
			}
		}
	},
};



// ALL TASKS
const tasks = [config.html.task, config.php.task, config.css.task, config.js.task, config.svg.task];

gulp.task('build', tasks);
gulp.task('docs', [config.css.docs.task]);



// HTML
gulp.task(config.html.task, function() {
	return gulp.src('')
	.pipe(plumber({errorHandler: reportError}))
		.pipe(run(config.html.shellCommand))
	.pipe(plumber.stop());
});



// PHP (Only copy the PHP files in )
gulp.task(config.php.task, function () {
	return gulp.src(config.php.source)
	.pipe(plumber({errorHandler: reportError}))
	.pipe(plumber.stop())
	.pipe(gulp.dest(config.php.dist))
});



// CSS
gulp.task(config.css.task, function () {
	return gulp.src(config.css.source)
	.pipe(plumber({errorHandler: reportError}))
		.pipe(sourcemaps.init())
			.pipe(sass(config.css.plugin.sass))
			.pipe(postcss(config.css.plugin.postcss))
			.pipe(rename(config.css.plugin.rename))
		.pipe(sourcemaps.write(config.sourcemap.build))
	.pipe(plumber.stop())
	.pipe(gulp.dest(config.css.dist))
	.pipe(browserSync.stream());
});


// CSS Docs
gulp.task(config.css.docs.task, function () {
  return gulp.src(config.css.docs.source)
    .pipe(sassdoc(config.css.docs.plugin.sassdoc));
});



// JS
gulp.task(config.js.task, function() {
	return gulp.src(config.js.source)
	.pipe(plumber({errorHandler: reportError}))
		.pipe(sourcemaps.init())
			.pipe(concat(config.js.plugin.concat))
			.pipe(uglify(config.js.plugin.uglify))
			.pipe(rename(config.js.plugin.rename))
		.pipe(sourcemaps.write(config.sourcemap.build))
	.pipe(plumber.stop())
	.pipe(gulp.dest(config.js.dist))
	.pipe(browserSync.stream());
});



// SVG
gulp.task(config.svg.task, function() {
	return gulp.src(config.svg.source)
	.pipe(plumber({errorHandler: reportError}))
		.pipe(svgmin(config.svg.plugin.svgmin))
		.pipe(svgstore(config.svg.plugin.svgstore))
		.pipe(rename(config.svg.plugin.rename))
	.pipe(plumber.stop())
	.pipe(gulp.dest(config.svg.dist))
	.pipe(browserSync.stream());
});



// ERROR
var reportError = function (error) {
	notify({
		title: 'Gulp error',
		subtitle: error.plugin,
		message: error.message,
		sound: 'Basso',
		timeout: 3
	}).write(error);
	console.error(error.toString());
	this.emit('end');
};



// DEFAULT
gulp.task('default', tasks, function () {

	// Browser sync
	browserSync.init(config.browsersync);

	// Watch
	gulp.watch(config.html.source, [config.html.task]);
	gulp.watch(config.html.build).on('change', browserSync.reload);
	gulp.watch(config.php.source, [config.php.task]);
	gulp.watch(config.css.source, [config.css.task]);
	gulp.watch(config.js.source, [config.js.task]);
	gulp.watch(config.svg.source, [config.svg.task]);

	gulp.watch(config.css.docs.source, [config.css.docs.task]);
});



// DEFAULT
gulp.task('servedocs', tasks, function () {

	// Browser sync
	browserSync.init({
		server: './',
		// startPath: "index.html",
		browser: 'google chrome'
	});

});
