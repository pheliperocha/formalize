var gulp = require('gulp'),
     uglifyjs = require('gulp-uglify'),
     uglifycss = require('gulp-uglifycss'),
     autoprefixer = require('gulp-autoprefixer'),
     imagemin = require('gulp-imagemin');
     concat = require('gulp-concat');
     sass = require('gulp-sass');
     merge = require('merge-stream');
     plato = require('gulp-plato');

// Task to uglify js files
gulp.task('scripts', function() {
     gulp.src('./dev/js/*.js')
          .pipe(concat('formalize.min.js'))
          //.pipe(uglifyjs())
          //.on("error", errorLog)
          .pipe(gulp.dest('./dist/js/'));
});

// Task the styles files of the project
// Compiler the sass files and concat
// Add autoprefixer in css styles to fit in the 1% most useful browser
// Concat all css files
// Merge sass files compiled with pure css files
// And minify
gulp.task('styles', function () {
     var scssStream = gulp.src('./dev/sass/fomalize.scss')
          .pipe(sass())
          .pipe(concat('scss.min.scss'));

     var cssStream = gulp.src('./dev/css/**/*.css')
          .pipe(autoprefixer({
               browsers: ['> 1%']
          }))
          .pipe(concat('css.min.css'))
          .on("error", errorLog);

var mergedStream = merge(scssStream, cssStream)
        .pipe(concat('style.min.css'))
        //.pipe(uglifycss())
        .pipe(gulp.dest('./dist/css/'));

return mergedStream;
});

// Task to minify the images files
// Need review
gulp.task('image', function() {
     gulp.src('./img/*')
          .pipe(imagemin())
          .pipe(gulp.dest('./img/'));
});

gulp.task('plato', function () {
     return gulp.src('./dev/js/*.js')
          .pipe(plato('report', {
               jshint: {
                    options: {
                         strict: true
                    }
               },
               complexity: {
                    trycatch: true
               }
          }));
});

// Watch the changes to then apply the uglify to the respectives files
gulp.task('watch', function() {
     gulp.watch("./dev/js/*.js", ['scripts', 'plato']);
     gulp.watch("./dev/css/**/*.css", ['styles']);
     gulp.watch("./dev/sass/**/*.scss", ['styles']);
});

// Function to catch erros and prevent to stop the watch event
function errorLog(error) {
     console.error.bind(error);
     this.emit('end');
}

gulp.task('default', ['scripts', 'styles', 'plato', 'watch']);
