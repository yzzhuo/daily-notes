---
title: CSS的BFC
date: 2016-08-10 23:13:58
tags: CSS
---

昨天经历了一次百度的电话面试（一次带着淡淡忧伤的面试，有时间再写个面筋）被问到BFC这个东西问到傻了。昨晚谷歌看了好多篇关于BFC的文章。在终于理清了BFC这个东西时，突然就有想写篇博文的冲动了呢！（怒~）

------

在学习BFC这个东西前，先说说FC这两个字的含义吧。
**FC(Formatting Context):格式化上下文是W3C CSS2.1规范中的一个概念。它是页面中的一块渲染区域，并且有一套渲染规则，它决定了其子元素将如何定位，以及和其他元素的关系和相互作用。**CSS2有BFC,IFC，CSS3还增加了GFC和FFC(突然想去KFC吃个全家桶来冷静一下…)

### BFC

> 浮动元素和绝对定位元素，非块级盒子的块级容器（例如 inline-blocks, table-cells, 和 table-captions），以及overflow值不为“visiable”的块级盒子，都会为他们的内容创建新的块级格式化上下文。

#### BFC的特性

1. 内部的Box会在垂直方向，从顶部开始一个接一个的放置。
2. Box垂直方向之间的距离由margin决定，同一个BFC的两个相邻BOX的margin会发生叠加。
3. 每个元素的左边margin会与包含的box的左border相接触。
4. BFC的区域不会与float box叠加。
5. BFC是页面一个隔离的独立容器。与外面的元素互补影响。
6. 计算BFC的高度时，浮动元素也参与计算。

### 创建一个新的BFC的条件

根据定义就可以知道，当一个元素的样式符合以下条件之一时，就可以创建一个新的BFC:

- float：left|right；
- position：absolute|fixed;
- display:table-cell|table-caption|inline-block;
- overflow:hidden|scroll|auto;

### BFC的作用和应用场景

1. 清楚内部浮动
2. 外边距折叠问题
3. 多栏式布局
   （因为网络很多博文对这部分都图文并茂地讲得很清楚了，这里只是轻轻带过~，但是重点是要知道BFC这个东西延伸出来的东西原来都是我们经常用到的啊！！！（只知其然不知其所有然的我露出细思极恐状））

### 拓展延伸思考

看完了网络上各位大神对BFC详尽的介绍，总算知道了BFC这个家伙是干吗的了。这个学习的过程也伴随着几个曾经很纠结的问题。

1. **页面写了普通的几个div，这时就存在了BFC了吗？**

   实践证明是的，因为你写两个div时会发现它们垂直排列，而且垂直的边距margin发生了重叠，这符合BFC的特性。说明了根元素(html)会生成默认BFC供其子孙block-level box使用。

2. **在和舍友讨论这个问题时，舍友说到，为什么明明叫做块级格式化上下文，生成一个BFC的条件怎么好像跟块级元素不搭边呢？**
   盒子是CSS布局的基本单位，CSS有不同类型的盒子，不同的盒子会参与不同的FC。display为block，table等的元素会生成块级盒子，参与BFC（html生成的默认的BFC）。但其实BFC这个概念对我们的最大作用是如何生成一个新的BFC,来达到自己想要的布局排版方式。

3. **包含了浮动元素的父元素为什么高度会塌陷？给父元素添加了overflow：hidden|auto是生成了一个新的BFC，可为什么能让父元素高度与浮动元素一致了呢？**
   （我曾经也想过用BFC这个问题来解答，但发现论据不足。后来看到知乎有一个回答还是不能大彻大悟（就像学术领域的一些问题得到的回答往往是权威两个字），后来又看了CSS魔法堂的一篇文章，才算是真正理解。）
   第一个问题，为什么div中仅含浮动元素时，盒子高度为0?这个要归咎于block-level box对高度的计算（详见文档，其中提到out-flow box不影响block-level box高度的计算。）
   第二个问题，为什么通过overflow产生了一个新的BFC就能让父元素高度不为0了呢？对于产生新的BFC的盒子而言，会有以下几个现象：

   - 不发生外边折叠
   - out-flow box纳入block-level box高度的计算
   - 不与positioning scheme为floats的兄弟盒子重叠

#### 后话

对于IFC，等自己了解完有勇气了再写吧~！另外有了点人生感悟想拿来分享：年少无知的自己曾经觉得CSS和html是最容易学最小儿科的东西，觉得大不了用时有不会的再看看文档大概也能实现自己想要的效果。但是现在深刻体会到了CSS入门简单，精通难（前端也是这个道理）。很多时候原来我们不仅要知道怎么去实现一个效果和样式，更要去探究其实现的原理，通过探究学习这个原理，往往会发现一个我们未知的真理，而这个真理将带我们有一个质的飞跃~！

在此感谢巨人让我看的更高
参考内容：
[小科普：到底什么是BFC、IFC、GFC和FFC，次奥？](http://www.xiaomeiti.com/note/3608)
[CSS之BFC详解](http://www.html-js.com/article/1866)
[CSS魔法堂：重新认识Box Model、IFC、BFC和Collapsing margins](https://segmentfault.com/a/1190000004625635#articleHeader11)
[W3C对BFC的定义](https://www.w3.org/TR/CSS2/visuren.html#block-formatting)