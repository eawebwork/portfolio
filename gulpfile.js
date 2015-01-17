var gulp = require('gulp'),
	jade = require('gulp-jade'),
	orchestrator = require('orchestrator'),
	sass = require('gulp-sass'),
	spritesmith = require('gulp.spritesmith'),
	autoprefixer = require('gulp-autoprefixer'),
	connect = require('gulp-connect'),
	watch = require('gulp-watch'),
	imagemin = require('gulp-imagemin'),
	concat = require('gulp-concat'),
	pngquant = require('imagemin-pngquant');

gulp.task('connect', function() {
	connect.server({
		port:1337,
		livereload: true,
		root: 'dist/'
	})
})
gulp.task('concat', function(){
	gulp.src('./assets/js/*.js')
  .pipe(concat('all.js'))
  .pipe(gulp.dest('dist/js/'))
})
gulp.task('imagemin', function() {
	gulp.src('assets/img/*')
	        .pipe(imagemin({
	            progressive: true,
	            svgoPlugins: [{removeViewBox: false}],
	            use: [pngquant()]
	        }))
	        .pipe(gulp.dest('dist/img/'));
})

gulp.task('jade', function() {
	gulp.src(['./assets/templates/*.jade', '!./assets/templates/**/_*.jade'])
		.pipe(jade({
			pretty: true
		}))
		.pipe(gulp.dest('dist/'))
		.pipe(connect.reload())
})

gulp.task('sass', function() {
	gulp.src(['./assets/scss/*.scss', '!./assets/scss/**/_*.scss'])
		.pipe(sass())
		.pipe(gulp.dest('dist/css/'))
		.pipe(connect.reload())
})

gulp.task('sprite', function () {
  var spriteData = gulp.src('assets/img/sprite/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: '_sprite.scss'
  }));
  spriteData.img
      .pipe(imagemin())
      .pipe(gulp.dest('dist/img'));
  spriteData.css
  	  .pipe(gulp.dest('assets/scss/helpers'))
});
gulp.task('autoprefixer', function () {
    	gulp.src('dist/css/*.css')
        .pipe(autoprefixer({
            browsers: [
              'last 2 versions',
              'safari 5',
              'ie 8',
              'ie 9',
              'opera 12.1',
            ],
            cascade: true
        }))
        .pipe(gulp.dest('dist/css'));
});


gulp.task('watch', function() {
	gulp.watch(['assets/templates/*.jade','assets/templates/**/*.jade'], ['jade']);
	gulp.watch(['assets/scss/*.scss','assets/scss/**/*.scss'], ['sass']);
	gulp.watch('assets/img/*', ['sprite']);
	gulp.watch('dist/css/*.css', ['autoprefixer']);
	gulp.watch('assets/img/*', ['imagemin']);
	gulp.watch('assets/js/*', ['concat']);
});

gulp.task('default', ['jade','imagemin', 'sprite', 'sass', 'concat',  'connect', 'autoprefixer', 'watch'])

