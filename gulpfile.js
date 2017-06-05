var path = require('path');
var gulp = require('gulp');
var minifyCss = require("gulp-minify-css");
var staticPath =path.join( __dirname , '/public/');//视图文件路径
//压缩CSS模块
gulp.task('css', function () {
  gulp.src(staticPath + '**/*.css') // 要压缩的css文件
      .pipe(minifyCss()) //压缩css
      .pipe(gulp.dest('online_public'));
});
//复制图片
gulp.task('cp-images', function() {
  return gulp.src(staticPath + 'images/**/*')
      .pipe(gulp.dest('online_public/images'));
});

gulp.task('cp-media', function() {
  return gulp.src(staticPath + 'media/*')
      .pipe(gulp.dest('online_public/media'));
});

gulp.task('default', ['css', 'cp-images', 'cp-media']);


//复制js 
// gulp.task('cp-js', function() {
//   return gulp.src(staticPath + 'js/**/*')
//       .pipe(gulp.dest('online_public/js'));
// });
//压缩JS模块
//var uglify = require('gulp-uglify');
//重命名模块
//var rename = require('gulp-rename');

//处理html  页面代码<!-- build:js /js/lib.mini.js --><!-- /build -->
//var processhtml = require('gulp-processhtml')
//gulp script启动任务
// gulp.task('script', function() {
//   // 匹配js文件
//   gulp.src(staticPath + '**/*.js')
//       // 压缩文件
//       .pipe(uglify())
//       //重命名文件
//       //.pipe(rename({ extname: '.min.js' }))
//       // 另存压缩后的文件
//       .pipe(gulp.dest(staticPath))
// });


//处理html
//gulp.task("processhtml", function () {
//  gulp.src(__dirname+'/views/login/denglu.html')
//      .pipe(processhtml())
//      .pipe(gulp.dest(__dirname+'/views/login/'))
//})


// gulp auto启动任务
//gulp.task('auto', function () {
//  // 监听文件修改
//  gulp.watch(staticPath + '**/*.js', ['script'])
//})


// 使用 gulp.task('default') 定义默认任务
// 在命令行使用 gulp 启动 script 任务和 auto 任务