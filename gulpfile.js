'use strict';
// Include gulp

var sync = require('gulp-npm-script-sync');

var htmlreplace = require('gulp-html-replace');
var inject = require('gulp-inject');

var jshint = require('gulp-jshint');
var less = require('gulp-less-to-scss');
var sass = require('gulp-sass');
var imagemin = require('gulp-imagemin');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var HTMLmin = require('gulp-htmlmin');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var cssnano = require('gulp-cssnano');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var es = require('event-stream');

var gulp = require('gulp');
var ngmin = require('gulp-ng-annotate');
var usemin = require('gulp-usemin');
var rev = require('gulp-rev');
var clean = require('gulp-rimraf');

var paths = {
  scripts: [ 'app/**/*.js', '!bower_components/**/*.js' ],
  html: [
    'app/**/*.html',
    'bower_components/font-awesome/**/*.svg',
    'bower_components/font-awesome/**/*.eot',
    'bower_components/font-awesome/**/*.ttf',
    'bower_components/font-awesome/**/*.woff',
    'bower_components/font-awesome/**/*.otf',
    '!app/index.html',
    '!bower_components/**/*.html'
  ],
  index: 'app/index.html',
  build: 'build/'
};
/* 1 */
gulp.task('clean', function(){
  gulp.src( paths.build, { read: false } )
    .pipe(clean());
});

gulp.task('copy', [ 'clean' ], function() {
  gulp.src( paths.html )
    .pipe(gulp.dest('build/'));
});

gulp.task('copy-html-files', function() {
  gulp.src(['app/**/*.html', '!app/index.html'], {base: 'app'})
  .pipe(gulp.dest('build/'));
});

gulp.task('usemin', [ 'copy' ], function(){
  gulp.src( paths.index )
    .pipe(usemin({
      css: [ cssnano(), 'concat', rev() ],
      js: [ ngmin(), uglify(), rev() ]
    }))
    .pipe(gulp.dest( paths.build ));
});

// JavaScript linting task
gulp.task('jshint', function() {
	return gulp.src(['app/js/main.js', 'app/js/app.js'])
	.pipe(jshint())
	.pipe(jshint.reporter('default'));
});

// Convert Less to Sass
gulp.task('less', function() {
	return gulp.src('app/css/less/*.less')
	.pipe(less())
	.pipe(gulp.dest('app/css/scss'));
});

// Compile Sass task
gulp.task('sass', function() {
 	return gulp.src('app/css/scss/*.scss')
 	.pipe(sass())
	.pipe(gulp.dest('app/css'));
});

// Watch task
gulp.task('watch', function() {
	gulp.watch(['app/js/*.js'], ['jshint']);
	gulp.watch('app/css/scss/*.scss', ['sass']);
});

// Default task
gulp.task('default', ['jshint', 'usemin', 'watch', 'copy-html-files']);

// HTML task
gulp.task('html', ['index', 'mini']);

// Minify index
gulp.task('mini', function() {
	return gulp.src('app/index.html')
	.pipe(htmlreplace({
		'css': 'build/css/portfolio.min.css',
		'js': 'build/js/portfolio.min.js'
	}))
	.pipe(HTMLmin({collapseWhitespace: true}))
	.pipe(rename(function(path) {
		path.dirname += 'build/';
		path.basename += '-min';
		path.extname = '.html';
	}))
	.pipe(gulp.dest('build/'));
});

gulp.task('index', function() {
	return gulp.src('app/index.html')
	.pipe(htmlreplace({
		'css': 'build/css/portfolio.css',
		'js': 'build/js/portfolio.js'
	}))
	.pipe(gulp.dest('build/'));
});

// Inject .js files
gulp.task('inject', ['jquery', 'ga']);

gulp.task('jquery', function() {
	gulp.src('app/index.html')
	.pipe(inject(gulp.src('node_modules/jquery/dist/jquery.js'), {
		starttag: '<!-- inject:jquery -->',
		transform: function (filePath, file) {
			return file.contents.toString('utf8');
		}
	}))
	.pipe(gulp.dest('build/'));
});

gulp.task('ga', function() {
	gulp.src('app/index.html')
	.pipe(inject(gulp.src('js/analytics.js'), {
		starttag: '<!-- inject:analytics -->',
		transform: function (filePath, file) {
			return file.contents.toString('utf8');
		}
	}))
	.pipe(gulp.dest('build/'));
});

// JavaScript build task, removes whitespace and concatenates all files
gulp.task('js', function() {
	var home = browserify(['app/scripts/*.js'])
	.bundle()
	.pipe(source('app/scripts.js'))
	.pipe(gulp.dest('app/js'));

	var work = browserify(['app/scripts/*.js'])
	.bundle()
	.pipe(source('app/scripts.js'))
	.pipe(buffer())
	.pipe(uglify())
	.pipe(gulp.dest('build/js'));

	return es.concat(home, work);
});

// Scripts build task
gulp.task('scripts', ['js', 'inject']);

// Styles build task, concatenates all files
gulp.task('css', function() {
	return gulp.src(['app/**/*.css'])
	.pipe(concat('app/styles.css'))
	.pipe(cssnano())
	.pipe(gulp.dest('build/css'));
});

// CSS, LESS, and SASS build task
gulp.task('styles', ['less', 'sass', 'css']);

// Image optimization task
gulp.task('images', ['img', 'ico']);

gulp.task('img', function() {
	return gulp.src('app/images/*')
    .pipe(imagemin())
		.pipe(gulp.dest('build/images'));
});

gulp.task('ico', function() {
	return gulp.src('app/images/icons/*')
		.pipe(imagemin())
		.pipe(gulp.dest('build/images/icons'));
});

// Build task
gulp.task('build', ['jshint', 'html', 'scripts', 'styles', 'images', 'default']);

gulp.task('sync', function() {
	sync(gulp, {
		path: 'package.json'
	});
});
