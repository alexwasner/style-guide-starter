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
    shell = require('gulp-shell'),
    merge = require('merge-stream');

gulp.task('ksstemplates', function () {
  gulp.src('*.js', {read: false})
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
}).task('kss', ['ksstemplates'], function () {
  gulp.src('./template/public/kss.less')
    .pipe(less({
      plugins: [autoprefix, cleancss]
    }))
    .pipe(gulp.dest('./styleguide'));
})

//Compile LESS
.task('less', function() {
  gulp.src('./main.less')
    .pipe(less({
      plugins: [autoprefix, cleancss]
    }))
    .pipe(gulp.dest('./build'))
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
      .src('assets/*')
      .pipe(gulp.dest('styleguide/assets'))
      .pipe(gulp.dest('build/assets'))
      .pipe(livereload());
  })

//Reload and run less/kss when something changes
.task('onchange', ['kss', 'less', 'copy'], function(){
  livereload.reload();
})

.task('default', ['kss', 'less','connect','copy'])

.task('watch', ['default'], function(){
  livereload.listen();
  gulp.watch(['main.less','theme/*.*','template/*.*','template/**/*.*'], ['onchange']);
});