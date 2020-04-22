---
title: 前端工程化-gulp应用篇1
date: 2016-8-23 23:13:58
tags: 前端工具
---

实习了一个星期，给我的工作还是比较简单的。根据设计稿来实现宣传页面。如果时间回退，接手这类工作，也许我会立刻开始切图，然后写html，css和js，并且在改样式的过程，少不了改完代码，为了看看效果，手动刷新页面。这样循环往复，等到大致完成了，再看看代码有什么要优化的，比如去掉无用的代码，顺便在压缩一下图片….终于完成的时候，感叹一声，前端真是个体力活啊！

然而，现在的前端已经今非昔比，为了让前端的工作更加自动化，减少体力活，并且进一步优化，在开始一个项目之前，我们要搭建一个适合自己和这个项目的前端工作流。利用着空余时间，我学习了怎么去搭建这次项目的工作流，最终找到了真命天子gulp。下面我会根据我看到的一篇给[初学者的gulp教程](https://css-tricks.com/gulp-for-beginners/)来讲下如何搭建一个基础的前端工作流（你们把我下面的内容看成对上面的外文的一个简要的翻译版8）
、

## 正文

> gulp是一个帮助web开发者来完成多个任务的工具，目的在于简化前端工作。

### 为什么选择gulp？

gulp通常被称为“前端构建工具”，流行的前端构建工具除了gulp还有grunt等等。gulp和grunt的目的都是一样的，它们的主要区别在于配置，gulp的配置通常更加简洁和简单，而且运行起来也更加快。现在，让我们来继续看看如何用gulp来搭建一个工作流。

### 此次工作流的目标

- 在本地服务器跑我们的前端项目
- 将sass编译成css
- 当修改文件时浏览器可以自动刷新
- 优化各种资源（css，js，fonts，images），让其用于生产环境。

### 安装gulp

首先在安装gulp前，你必须安装了node.js。安装好了node的话，你就可以打开命令行，输入下面的命令来安装gulp：

```
npm install gulp -g

```

### 建立项目目录

新建一个文件夹，我取名叫`project`，在该目录运行`npm install`来为项目进行初始化建立一个`package.json`，该文件记录了文件所需的依赖，

```
npm init

```

一路回车下来结束就可以看到package.json这个文件从天而降了。于是乎，就可以开始安装gulp了。

```
npm install gulp --save-dev

```

`--save-dev`是用于把gulp作为开发需要的依赖模块记录在package.json中。安装完了之后，就可以看到项目目录中又有一个叫`node_modules`的文件从天而降。里面存储了gulp模块。

对于不同的项目，可能有不同的项目目录。不过开发者应该根据自己项目的情况和需求来建立自己的项目结构。对于本次项目，采用的是以下的目录结构：
[![img](http://ww2.sinaimg.cn/large/63739cabjw1f6k4hxza1aj20d209fmxt.jpg)](http://ww2.sinaimg.cn/large/63739cabjw1f6k4hxza1aj20d209fmxt.jpg)
其中`app`目录用于开发目的，保存我们开发书写的所有代码和文件，`dist`目录用于保存用于生产环境的经过优化的资源。

### 开始配置gulp来完成我们的第一个任务

打开新建的gulpfile.js文件，第一步就是引入gulp模块

```
var gulp = require('gulp');

```

然后就可以开始写第一个gulp任务，gulp之所以使用简单就是api的方法不多，官方的api就只列出了5个方法。现在我们即将使用的就是`gulp.task()`这个接口。这个方法的使用方法如下：

```
gulp.task('task-name', function() {
      // Stuff here
    });

```

`task-name`是任务的名字，你可以在文件中进行二次使用，也可以通过在命令行输入 `gulp task-name`来运行这个任务。
为了来体验gulp最基本的一个运作，我们来建立一个hello world任务吧。

```
gulp.task('hello', function() {
      console.log('hello world');
    });、

```

保存文件后在命令行运行`gulp hello`，如无意外你会看到命令行输出`hello world`

当然，gulp task通常会比这个复杂一点，比如你为了完成一个任务，可能会用到多个gulp插件，通常一个真正的gulp task看起来会是这样的：

```
gulp.task('task-name', function () {
  return gulp.src('source-files') // Get source files with gulp.src
.pipe(aGulpPlugin()) // Sends it through a gulp plugin
.pipe(gulp.dest('destination')) // Outputs the file in the destination folder
})

```

如你所见，一个实际的gulp task通常还会用到另外两个gulp的方法：`gulp.src`和`gulp.dest`。前者来告诉gulp task要应用在哪些文件上，后者则是告诉gulp要把任务处理的结果输出到哪里。

### 利用gulp来进行css预编译

为了把sass编译成css，我们需要利用一个模块叫`gulp-sass`。所以，先进行模块的安装

```
npm install gulp-sass --save-dev

```

并且在文件中引入
var sass = require(‘gulp-sass’);
建立一个叫做`sass`的任务来完成sass编译成css

```
gulp.task('sass', function(){
      return gulp.src('source-files')
        .pipe(sass()) // Using gulp-sass
     .pipe(gulp.dest('destination'))
});

```

为了试验一番，我们在`app/sass`目录下建立个sass文件sytles.scss，然后计划把编译得出的css文件放在`app/css`下面。所以修改代码如下：

```
gulp.task('sass', function(){
      return gulp.src('app/scss/styles.scss')
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
    .pipe(gulp.dest('app/css'))
    });

```

试着在scss文件写个样式然后在命令行运行`gulp sass`。运行结束，你就可以看到app/css文件下出现了一个编译好的css文件`styles.css`啦~但是，有人会问，如果我需要对多个sass文件一次性进行编译呢？那我们就需要`Node globs`来帮助了

### Globbing in Node

Globs用来匹配文件s，它类似正则表达式，但是通常用于文件匹配。

多数基于gulp的工作流常常会用到一下四种glob表达式：

1. `*.scss`：匹配当前项目目录下所有以scss为文件后缀的文件。
2. `**/*.scss`:匹配在当前目录下和任何子目录下的以scss为文件后缀的文件。
3. `！not-me.scss`：匹配中剔除not-me.scss，
4. `*.+(scss|sass):`:匹配项目目录下任何以scss或者sass为文件后缀的文件。

了解了这么多后，就可以修改我们上面的代码来达到编译多个sass文件的目的了：

```
gulp.task('sass', function() {
      return gulp.src('app/scss/**/*.scss') // Gets all files ending with .scss in app/scss and children dirs
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
})

```

不过，如果我们每次修改了sass文件，都要手动去命令行运行以下gulp sass的话其实也够呛。幸运的是，gulp提供了一个方法来监听文件的变化。

### 监听sass文件的变化

gulp的watch方法可以来帮我们监听文件是否发生了变化。该方法的用法大概如下：

```
// Gulp watch syntax
gulp.watch('files-to-watch', ['tasks', 'to', 'run']);

```

为了让gulp在我们对sass文件进行修改了之后自动帮我们进行编译，我们可以写上如下的代码：

```
gulp.watch('app/scss/**/*.scss', ['sass']); 

```

但是，我们往往需要对多个文件进行监听并且做不同的处理，所以，更长远的方法应该是建立一个gulp任务来负责进行监听的工作：

```
gulp.task('watch', function(){
  gulp.watch('app/scss/**/*.scss', ['sass']); 
  // Other watchers
})

```

### 实现浏览器实时更新

开发的过程如果我们修改了样式或者某个文件的代码，浏览器可以自动刷新方便我们观察变化就好了。利用gulp发现这其实小菜一碟。`browser-sync`模块可以帮助我们的项目在本地服务器跑起来，还支持浏览器自动刷新。接下来我们就来试试：

```
npm install browser-sync --save-dev

```

gulpfile.js配置文件中进行引入和创建任务：

```
var browserSync = require('browser-sync').create();
...
gulp.task('browserSync', function() {
      browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
})

```

该任务gulp会为我们在本地运行服务器，为了让browser Sync知道服务器的根目录，在baseDir里面写上我们的app目录。另外，对于我们之前写的sass任务也要做一些修改，这样当每次执行sass任务时，Browser Sync就能将新的css样式在浏览器进行更新。

```
gulp.task('sass', function() {
  return gulp.src('app/scss/**/*.scss') // Gets all files ending with .scss in app/scss
.pipe(sass())
.pipe(gulp.dest('app/css'))
.pipe(browserSync.reload({
  stream: true
}))
});

```

让我们打开两个命令行分别来运行browserSync和watch是麻烦的事情，还好，只要给watch任务添加第二个参数就可以让gulp先运行browserSync后立刻运行watch。

```
gulp.task('watch', ['browserSync'], function (){
  gulp.watch('app/scss/**/*.scss', ['sass']); 
  // Other watchers
})

```

我们还要确保sass在watch之前运行，所以再对代码进行下修改：

```
gulp.task('watch', ['browserSync', 'sass'], function (){
  gulp.watch('app/scss/**/*.scss', ['sass']); 
  // Other watchers
});

```

现在，在命令行运行`gulp watch`，试着修改sass，发现样式在浏览器上得到了实时更新。so amazing
[![img](https://cdn.css-tricks.com/wp-content/uploads/2015/08/bs-change-bg.gif)](https://cdn.css-tricks.com/wp-content/uploads/2015/08/bs-change-bg.gif)
如果我们希望修改html，js文件也能在浏览器上实时更新呢？加上两条代码就行拉：

```
gulp.task('watch', ['browserSync', 'sass'], function (){
      gulp.watch('app/scss/**/*.scss', ['sass']); 
    // Reloads the browser whenever HTML or JS files change
    gulp.watch('app/*.html', browserSync.reload); 
     gulp.watch('app/js/**/*.js', browserSync.reload); 
});

```

至今我们已经完成了三件事了：

1. 为开发需要跑一个本地服务器
2. 使用sass预编译
3. 文件修改保存后浏览器可以实时刷新

下篇文章将会讲述解决如何优化生产环境用的资源，请听下回分解~