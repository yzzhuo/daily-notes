---
title: 原来除了box-shadow,还有drop-shadow
date: 2017-6-01 23:13:58
tags: CSS
---

 上周写样式，UI小哥给我了一张png图，但是要实现阴影。然后，第一想到的就是用box-shadow，然而写好之后才发现图片虽然是一个类圆形的图案，但是在css中它是个盒子，也就是在css中它是个矩形，所以出现的效果的阴影是与图形分离开来的长方形（尴尬）。后来在网上发现了一个drop-shadow的东西可以用来解决这个问题。

drop-shadow并不是css的一个属性，它属于CSS滤镜中的一种。

##### 使用

`filter: drop-shadow(<offset-x> <offset-y> <?blur-radius> <?spread-radiue> <?color>)`

参数如下：

offset-x ：水平方向的偏移量，负值向左。

offset-y：垂直方向的偏移量，负值向上。

blur-radius：值越大越模糊。

spread-radius：阴影扩张大小。

color：阴影颜色。

##### 缺点

CSS标准里虽然已经包含了一些已实现预定义效果的函数，但是如果你需要兼容多个浏览器，包括旧版本IE，那就要慎重啦。因为旧版本（4-9）的IE支持它们自己的，非标准的filter。

##### 资料

[MDN-CSS:filter](https://developer.mozilla.org/en-US/docs/Web/CSS/filter?v=control)

[CSS3 filter:drop-shadow滤镜与box-shadow区别应用](http://www.zhangxinxu.com/wordpress/2016/05/css3-filter-drop-shadow-vs-box-shadow/)