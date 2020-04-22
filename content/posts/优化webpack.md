---
title: 优化webpack
date: 2017-5-20 23:13:58
tags: 前端工具
---

最近的工作不大忙，大致是看看现有的代码，熟悉业务，修复一些小问题。而最近对某个项目代码进行webpack优化，得出了关于webpack优化的几个方法。

1. webpack内置优化工具

   - webpack.optimize.UglifyJsPlugin 代码压缩：配置选项可以参考[uglify-webpack-plugin](https://doc.webpack-china.org/plugins/uglifyjs-webpack-plugin/)

     ```javascript
     new UglifyJsPlugin({
         // 最紧凑的输出
         beautify: false,
         // 删除所有的注释
         comments: false,
         compress: {
           // 在UglifyJs删除没有用到的代码时不输出警告  
           warnings: false,
           // 删除所有的 `console` 语句
           // 还可以兼容ie浏览器
           drop_console: true,
           // 内嵌定义了但是只用到一次的变量
           collapse_vars: true,
           // 提取出出现多次但是没有定义成变量去引用的静态值
           reduce_vars: true,
         }
     })
     ```


1. - ​

   - - [DefinePlugin](https://doc.webpack-china.org/plugins/define-plugin/) 替换某些包为生产环境版本，比如react。
     - [CommonsChunkPlugin](https://doc.webpack-china.org/plugins/commons-chunk-plugin/) 公共模块的拆分，使用于多页面引用了公共模块的情景。
     - [ExtractTextWebpackPlugin](https://doc.webpack-china.org/plugins/extract-text-webpack-plugin/) 把内嵌在JS bundle的样式放到独立的CSS文件。适用于样式文件较大的情况。

   - 根据打包信息来分析可优化点

     生成stats.json: `webpack --profile --json > stas.json`

     - 可视化分析工具:

       线上web：

       - [webpack chart](https://alexkuz.github.io/webpack-chart/)：适合来总体查看打包的情况（各部分的占用空间）
       - [webpack analyse](http://webpack.github.io/analyse/):适合用来追踪问题的来源

       插件：

       - [webpack-bundle-analyzer](http://www.opendigg.com/p/webpack-bundle-analyzer): 在webpack.config.json里面配置好，可以在每次build的时候自动在8080端口启动一个服务器显示webpack打包情况

     - 参数

       - stat size: 原始打包的大小
       - parse size: uglify压缩后的大小
       - gizp size：启动gizp后的大小
       - lodash按需加载

   - lodash是个好东西，但是也是个大家伙（500+k），如果可以按需加载，可以大大减少打包的lodash的体积。

     优化方法：

     - 利用webpack2的treeshaking可以一定程度削减没有用到的lodash模块。启动treeshaking的方法
     - 更彻底的方法是使用[lodash-webpack-plugin](https://github.com/lodash/lodash-webpack-plugin)插件。（ps：如果是使用了typescript的项目，需要用awesome-typescript-loader或者ts-loader+babel-loader来处理ts/tsx文件，因为使用这个插件要用到bebel-plugin-lodash，还要注意它支持module为es2015或者es6的模块机制，设置成commonjs的话是不生效的！！

   - 对于应用目标环境是node的libray,可以采用[[webpack-node-externals](https://www.npmjs.com/package/webpack-node-externals)剔除不必要的包。

     #### 参考资料

     - [Webpack官方文档](https://webpack.js.org/guides/production-build/)
     - [webpack打包bundle.js体积大小优化](https://github.com/youngwind/blog/issues/65)
     - [lodash按需加载的几种方式](https://imys.net/20161217/webpack-use-lodash.html)
     - [webpack2 终极优化- 腾讯Web前端IMWeb 团队社区| blog | 团队博客](http://imweb.io/topic/5868e1abb3ce6d8e3f9f99bb)