---
title: 前端工程化-gulp应用篇2
date: 2016-8-24 23:13:58
tags: 前端工具
---

今天是七夕节，我和工作有个约会。尽管如此，心情还是很高兴，因为在公司负责的第一个项目赶在七夕佳节上线了。虽然是很简单的展示页面，但是做的过程也有了许多的收获，并且和工作伙伴也更加熟悉了，嘿嘿嘿。BUT回校路上的一个追魂夺命Call打破了今日的宁静….好吧，回归正题，继续讲“前端工程化的gulp应用篇”之下回分解。

## 正文

### 优化CSS和JS文件

通常在生产环节，我们会对css和js进行一些优化：压缩和合并。这样可以减少http请求和减少文件大小，从而实现一定程度的性能优化。
在gulp中，我们可以用[`gulp-useref`](https://www.npmjs.com/package/gulp-useref)来帮助我们进行合并。

`gulp-useref`通过在html加入一段注释来判断要对那些文件进行合并。

```
<!-- build:<type> <path> -->
... HTML Markup, list of script / link tags.
<!-- endbuild -->

```

`<type>`可以是js，css或其它。`<path>`则是指合并目标的路径。

如果想把我们js里面的几个文件合并为一个`main.min.js`，html中添加如下代码：

```
<!--build:js js/main.min.js -->
<script src="js/lib/a-library.js"></script>
<script src="js/lib/another-library.js"></script>
<script src="js/main.js"></script>
<!-- endbuild -->

```

之后，还要在gulpfile文件进行配置（安装gulp-useref的过程我就省略了,后面的模块安装过程也同样省略了）

```
var useref = require('gulp-useref');

gulp.task('useref', function(){
      return gulp.src('app/*.html')
                .pipe(useref())
                .pipe(gulp.dest('dist'))
});

```

运行gulp useref，gulp就会合并注释标注的那3个js文件为main.min.js，并且dist文件也会有一个html文件，引用js的script标签也变成一个。（强烈建议自己动手试试，观察下结果！）
[![img](https://cdn.css-tricks.com/wp-content/uploads/2015/08/useref-html-1024x291.png)](https://cdn.css-tricks.com/wp-content/uploads/2015/08/useref-html-1024x291.png)
合并之后的文件，其实没有被压缩，这时我们可以用`gulp-uglify`来帮助我们对文件进行压缩，为了判断只对js文件进行压缩，我们还要引入另外一个压缩`gulp-if`。

```
// Other requires...
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');

gulp.task('useref', function(){
          return gulp.src('app/*.html')
                    .pipe(useref())
        // Minifies only if it's a JavaScript file
                    .pipe(gulpIf('*.js', uglify()))
                    .pipe(gulp.dest('dist'))
});

```

现在当我们运行了useref任务（合并了文件）之后gulp就立刻帮我们对合并的文件进行压缩。so wonderfu~我们可以似乎用相同的方法来对css文件进行合并，然后用`gulp-cssnano`来帮助我们对css文件进行压缩。

```
<!--build:css css/styles.min.css-->
<link rel="stylesheet" href="css/styles.css">
<link rel="stylesheet" href="css/another-stylesheet.css">
<!--endbuild-->

```

gulpfile配置

```
var cssnano = require('gulp-cssnano');

gulp.task('useref', function(){
      return gulp.src('app/*.html')
                .pipe(useref())
                    .pipe(gulpIf('*.js', uglify()))
                // Minifies only if it's a CSS file
                    .pipe(gulpIf('*.css', cssnano()))
                    .pipe(gulp.dest('dist'))
});

```

### 优化图片

`gulp-imagemin`可以帮我们对图片进行压缩。利用这个插件，我们可以对png，jpg，gif甚至是svg进行压缩，来上栗子：

```
var imagemin = require('gulp-imagemin');
gulp.task('images', function(){
          return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
                      .pipe(imagemin())
                      .pipe(gulp.dest('dist/images'))
        });

```

`imagemin()`方法可以传入其它的参数对压缩进行设置，具体看[`gulp-imagemin`文档](https://www.npmjs.com/package/gulp-imagemin)。

图片压缩的过程或许会比较慢，有时我们无需对所有图片重复进行压缩，为了达到这个目的，我们可以用`gulp-cache`。

```
var cache = require('gulp-cache');

gulp.task('images', function(){
      return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
          // Caching images that ran through imagemin
                  .pipe(cache(imagemin()))
                  .pipe(gulp.dest('dist/images'))
    });

```

### 对fonts等其它资源进行简单输出

有些资源，如果我们无须进行进一步处理，仅仅想把它从app目录（开发环境）复制到dist（生产环境）中，那就只要简单的进行输出和输出就好啦~

```
gulp.task('fonts', function() {
      return gulp.src('app/fonts/**/*')
                  .pipe(gulp.dest('dist/fonts'))
    })

```

我们现在有六个gulp任务可以进行不同的处理，为了方便我们使用，我们往往想把多个任务合并成一个任务，这样，我们只要运行一个命令就能执行多个任务了。但在此之前，我们可以了解一下怎么把生成的文件进行清空。

### 自动清空生成的文件

因为通过gulp的一些任务，gulp会自动帮我们生成一些文件，但是对于我们之前生成的，但是现在不需要的文件，我们需要对其进行清空时，就需要`del`模块来帮助我们。

`del（）`方法可以接收一组node globs来告诉gulp哪些文件要被删除。如果我们想把dist文件全部清空的话，这样就可以实现：

```
gulp.task('clean:dist', function() {
      return del.sync('dist');
    })

```

但是，前面`gulp-cache`来报错在缓存中的`dist/images`是不会被删除的，如果你想把这个文件也删除了，可以这样写：

```
gulp.task('cache:clear', function (callback) {
    return cache.clearAll(callback)
    })

```

### 对gulp tasks进行合并

回想一下我们至今做的一切。
对于开发环境，我们把sass编译成css，而且对其进行实时监控，浏览器可以在文件修改保存后自动刷新。 对于生产环境，我们对css和js进行合并压缩，对图片进行了压缩，对其它一些资源（fonts）直接进行复制。
对于后者，我们可以建立一个`build`来合并我们的`clean:dist`,`sass`.`useref`,`images`和`fonts`，有人会想到这么写：

```
gulp.task('build', [`clean`, `sass`, `useref`, `images`, `fonts`], function (){
        console.log('Building files');
})

```

然而，当我们执行build时，gulp会自发同时地去执行中括号里面的所有任务。

我们希望的是`clean`任务执行完了之后才执行其它任务。所以，为了按顺序执行某些任务，我们可以借助`run-sequence`。

```
var runSequence = require('run-sequence');

gulp.task('task-name', function(callback) {
      runSequence('task-one', 'task-two', 'task-three', callback);
    });

```

当`task-name`被执行，gulp会先运行`task-one`，运行完这个任务，再执行`task-two`，执行完了再执行最后一个任务。
`run-sequence`也允许同步执行某些任务：

```
gulp.task('task-name', function(callback) {
      runSequence('task-one', ['tasks','two','run','in','parallel'], 'task-three', callback);
});

```

这种情况下，gulp先运行task-one,运行完了再同时执行第二个参数里面的任务，里面的所有任务执行完毕就执行task-three。

好了，来构建我们生产环境的指令：

```
gulp.task('build', function (callback) {
      runSequence('clean:dist', ['sass', 'useref', 'images', 'fonts'], callback
  )
})

```

对于开发环境的指令，类似的方法，可以这么写：

```
gulp.task('default', function (callback) {
      runSequence(['sass','browserSync', 'watch'],callback
      )
})

```

注意，名为default的task可以直接在命令行运行gulp来执行该任务。

### 这就是所有了吗？

通过上面的教程，我们可以配置出一个简单的前端工作流，代码已经po到github上了[`basic-workflow`](https://github.com/yzzhuo/basic-workflow)。开发过程，我们可以通过`gulp`命令来自动编译sass并且在浏览器自动刷新等，完成了开发后通过`gulp build`就可以优化资源，输出到用于生产的dist目录中。

但是，千万别以为它能做的只是这些。你可以做更多的事情：

- [sourcemap](https://www.npmjs.com/package/gulp-sourcemaps)可以更容易定位到错误
- [sprity](https://www.npmjs.com/package/sprity)或者gulp.spritesmith可以合成雪碧图
- 通过webpack，browserify模块化js文件
- 利用模板引擎模块化html
- 自动部署到服务器
  ….

**对于不同的项目，可能需要根据自己的需求来构件不一样的前端工作流。但一旦能在开发之前构建出一个好的前端工作流，开发工作就会达到事半功倍的效果。用gulp就像有了一个供使唤的小弟，工作一下子轻松了许多，姐姐我终于不用到处瞎折腾啦**