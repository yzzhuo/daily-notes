---
title: bower入门
date: 2015-08-11 23:13:58
tags: 前端工具
---

> 随着网页功能变得越来越复杂，同一张网页加载多个JavaScript函数库早已是家常便饭。开发者越来越需要一个工具，对浏览器端的各种库进行管理，比如搜索、自动安装\卸载、检查更新、确保依赖关系等等。Bower就是为了解决这个问题而诞生的针对浏览器端的库管理工具。

### bower的常用操作

- 包的安装：`$ bower install（包名）`

若包安装失败，执行”bower cache clean”，后重新安装。

- 包的搜索

  ```
  $ bower search （包名）
  ```

- 对已安装的包进行查看

  ```
  $ bower list
  ```


- 查看某个包的信息

  ```
  $ bower info （包名）
  ```

- 卸载包

  ```
  $ bower uninstall （包名）
  ```

### bower.json

这个文件便于在项目中对于包可以进行批量安装

- 在项目中创建bower.json`$ bower init`

bower.json的一般格式：

```
{
  "name": "blog",  
  "version": "0.0.1"     
  "authors": [
    "sb"
  ],
  "license": "MIT",
  "ignore": [      
    "**/.*",    
    "node_modules",      
    "bower_components",    
    "test",
    "tests"
  ],
  "dependencies": {
    "jquery": "~2.0.3"
  }
}
```

其中dependencies就是项目依赖的包列表。

- 安装包并更新bower.json`$ bower install （某包） --save`

### .bowerrc

若不希望包文件下载到/bower-component中，而下载安装到自己习惯的目录，则在项目目录下新建一个.bowerrc文件，修改里面的directory的路径。
一般的.bowerrc文件：

```
{
  "directory" : "components",//存放库文件的目录。
  "json"      : "bower.json",//描述各个库的json文件名。
  "endpoint"  : "https://Bower.herokuapp.com",//在线索引的网址，用来搜索各种库。
  "searchpath"  : "",//一个数组，储存备选的在线索引网址。如果某个库在endpoint中找不到，则继续搜索该属性指定的网址，通常用于放置某些不公开的库。
  "shorthand_resolver" : ""//定义各个库名称简写形式
}
```

### bower与npm

**npm和bower都是包管理器。npm是node端的包管理工具包，而bower是基于node的，用于管理前端依赖资源的管理工具。**
通常，在实际项目中，npm和bower都会用到，并且bower的安装和升级依赖于npm。
NPM主要运用于Node.js项目的内部依赖包管理，安装的模块位于项目根目录下的node_modules文件夹内。而Bower大部分情况下用于前端开发，对于CSS/JS/模板等内容进行依赖管理，依赖的下载目录结构可以自定义。
npm采用嵌套的依赖关系树，而bower采用变片的依赖关系管理方式，而一个普通前端的依赖树非常荣昌，同时和其它安装包不能共享依赖代码，采用npm管理会导致文件非常多，不依赖前端代码部署。
实际项目中，后端可以采用npm进行包管理，而前端可以采用bower进行包管理，让各自的工作效率大大提升