var 
	gulp 		= require('gulp'),
	connect		= require('gulp-connect'),
	util		= require('gulp-util'),
	uglify		= require('gulp-uglify'),
    rename      = require('gulp-rename'),
    util        = require('gulp-util'),
	info		= require('./package.json');

	args		= require('yargs').argv,
	port		= args.port || info.port || 4567;


gulp.task('default', ['serve'], function(){
	gulp.watch(['./polycal.js'], ['js']);
});


function handleError(err) {
    console.log(err.toString());
    util.beep();
    this.emit('end');
}


// Static server.

gulp.task('serve', function(){
	connect.server({
		port: port,
		root: __dirname
	});
});


// Minify.

gulp.task('js', function(){
    gulp.src('./polycal.js')
        .pipe(uglify())
        .on('error', handleError)
        .pipe(rename('polycal.min.js'))
        .pipe(gulp.dest('./'));
});
