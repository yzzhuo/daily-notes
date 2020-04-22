---
title: 用Yeoman来创建我的web应用
date: 2015-08-11 23:13:58
tags: 前端工具
---

最近在用AngularJS折腾些东西，打算写一个基于Angular的项目，打算手动创建时被告知可以用Yeoman来生成Angualr项目文件，于是乎去了解了一下Yeoman这玩意。

> 官网显示Yeoman是一个现代Web app的脚手架工具，这里的脚手架就是说在开发者开发web应用的立项阶段，可以使用Yeoman来生成项目的文件和代码结构。

### Yeoman实践

- 和bower等类似，利用npm即可安装yeoman,只是安装时用不必打全称:

  ```
  npm install -g yo
  ```

  确认是否安装成功，若能显示版本号即安装成功

  ```
  yo -v
  ```

- 创建项目
  在创建项目前，要先安装模具，比如这里我想要创建一个基于Angular的项目，我要先安装angular这个模具。yeoman官网有generator的列表，可以根据自己实际情况去看自己需要的模具。

  ```
  npm install -g generator-angular
  ```

此外，也可以使用yo命令，后选择安装模块来进行安装。

安装完模块后，就可以开始创建项目了。进入自己的项目目录angualr-app文件夹，执行以下命令：

```
yo angular
```

在回答了一些问题后，就可以看到该目录生成了一系列的文件。
[![img](http://ww1.sinaimg.cn/large/63739cabjw1ex9y2z3owzj20e40d7q3y.jpg)](http://ww1.sinaimg.cn/large/63739cabjw1ex9y2z3owzj20e40d7q3y.jpg)
app/:web应用的父级目录。
Gruntfile.js、package.json 以及node_modules：Grunt需要使用的依赖以及配置。
test、karma.conf.js/karma-e2e.conf.js：测试框架以及针对这个项目的单元测试。

- 运行创建好的初始应用

  ```
  grunt serve

  ```

  通过在浏览器访问localhost:9000就可以看到初始的应用了。

通过yeoman创建好了我的项目结构后，就可以开始编写自己的应用啦

另外再说一点：在用编辑器更改应用，每次保存更改后，浏览器会自动刷新，可以实时来查看应用的状态真的太赞了。