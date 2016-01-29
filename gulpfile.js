var gulp = require('gulp'),
    less = require('gulp-less'),
    connect = require('gulp-connect'),
    open = require('gulp-open'),
    livereload = require('gulp-livereload'),
    LessPluginCleanCSS = require('less-plugin-clean-css'),
    LessPluginAutoPrefix = require('less-plugin-autoprefix'),
    cleancss = new LessPluginCleanCSS({ advanced: true }),
    autoprefix= new LessPluginAutoPrefix({ browsers: ["last 2 versions"] }),
    gulpconcat = require('gulp-concat'),
    gulp  = require('gulp'),
    shell = require('gulp-shell');

gulp.task('kss', function () {
  return gulp.src('*.js', {read: false})
    .pipe(shell([
      './node_modules/.bin/kss-node <%= theme %> <%= output %> --css <%= css %> --template <%= template %>',
    ], {
      templateData: {
        theme :'./theme',
        output:'./styleguide',
        css: '../main.css',
        template:'./template/'
      }
    }));
}) 

//Compile LESS
.task('less', function() {
  gulp.src('./main.less')
    .pipe(less({
      plugins: [autoprefix, cleancss]
    }))
    .pipe(gulp.dest('./build'))
    .pipe(gulp.dest('./'))
    .pipe(gulp.dest('./styleguide'));
})

//Run a server on localhost:8081
.task('connect', function(){
  connect.server({
    root: ['styleguide'],
    port: '8081',
    base: 'http://localhost',
    livereload: true
  });
})

//Copies resources to various folders
  .task('copy', function(){
    gulp
      .src('assets')
      .pipe(gulp.dest('build'));
  })

//Open Chrome at start
.task('open', function(){
  gulp
    .src('styleguide/index.html')
    .pipe(
      open('', {app: 'google chrome',url: 'http://localhost:8081/'})
    );
})

//Reload and run less/kss when something changes
.task('onchange', ['kss','less', 'copy'], function(){
  livereload.reload();
})

.task('watch', ['less','connect','open'], function(){
  livereload.listen();
  gulp.watch(['main.less','theme/*.*','template/*.*','template/**/*.*'], ['onchange']);
});