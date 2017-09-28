var gulp = require('gulp');
var browserify = require('browserify');//获取入口文件
var source = require('vinyl-source-stream'); //合并js
var buffer = require('vinyl-buffer'); //转流 把基于node的流改为基于gulp的流
var rev = require('gulp-rev'); // 生成md5 身份标识
var collector = require('gulp-rev-collector'); // 自动替换
gulp.task('module',function(){
    browserify({
        entries: ['./entry.js']
    }).bundle()
      .pipe(source('bundle.js'))
      .pipe(buffer()) // 转流
      .pipe(rev()) // 生成md5后缀
      .pipe(gulp.dest('./'))
      .pipe(rev.manifest())
      .pipe(gulp.dest('./'))
})
gulp.task('replace',function(){
    setTimeout(function(){
        gulp.src(['./index.html','./rev-manifest.json'])
        .pipe(collector({
            replaceReved:true
        }))
        .pipe(gulp.dest('./'))
    },500)
})
gulp.task('default',['module','replace']);