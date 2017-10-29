---
title: CSS定位那些事儿
date: 2016-08-11 23:13:58
tags: CSS
---

秋风煞爽，迎来了新学期。稍不留神，时间就把我推到了大学的尾巴，容不得我愿不愿意。所有大四老油条都在给自己的未来定位。人生的定位过程，是一个现实和理想的挣扎。CSS的定位，有时也是呢。继上一篇初略探讨了CSS的视觉格式化上下文后，谈谈CSS定位的那些事吧。

## CSS定位概述

上一篇说过CSS的盒生成完毕了，就会指定它们的位置。总的来说，CSS提供了三种定位方案：

- 常规流（normal flow）
  - normal flow的盒子一个接一个的排列，块级盒子参与BFC进行排列，行内及盒子参与IFC进行排列
  - 通常position为static或relateive或float为none的元素都会触发常规流的定位方案
- 绝对定位
  - 绝对定位的盒子会从常规流中移除，且不影响常规流的布局。它的相对定位相对于它的包含块
  - 元素属性position为absolute|fixed的元素触发绝对定位布局
- 浮动
  - 它通常漂浮在常规流的上方
  - float:left|right的元素触发浮动定位

### CSS的position属性

- static：
  - 元素的默认值，位置是常规流布局里的位置，不能使用top，bottom，left，right，z-index来定位
- relative：
  - 可以相对于自身的默认位置来进行定位偏移。但即使有偏移，仍然保留原有的位置，即其它常规流的元素不能占用它原本的位置，它偏移的位置也不影响其他常规流元素的布局
- absolute：
  - 脱离常规流，可以相对于position不为static的第一个父元素进行定位。
- fixed：
  - 可以相对于浏览器窗口进行定位。旧版IE不支持。
- inherit:
  - 从父元素继承position属性的值。

ps：static和relative都属于常规流，而fixed和absolute都属于绝对定位。

### display,position和float的影响

> 定位有类似优先级的机制。

1.”position:absolute” 和 “position:fixed” 优先级最高，有它存在的时候，浮动不起作用，’display’ 会按一定规则进行重置

```
<div id="test" style="position:absolute; float:left; display:inline;"></div>

```

上面的代码中，因为设置了绝对定位，元素根据定位规则重新计算后的值为：float为none（浮动失效）display为block。
but在IE:计算后的值’float’ 值和 ‘display’ 的特性值未发生变化，还是 “float: left; display: inline”。
2.设置了float不为none的元素，display会按照规则转换成特定的值。

```
<span style="width:100px; height:100px; border:1px solid red; float:left;">float span</span>

```

上面的代码，虽然span是行内元素，但是因为设置了浮动，在正常的浏览器中其display会被转换成block，因此可以设置其宽和高。

1. 根元素，其display也会根据规则来转换。

2. 最后，非根元素，并且非浮动元素，并且非绝对定位的元素，根据’display’ 特性值来定位。

   **以上也反映了一个问题：浮动或绝对定位的元素，只能是块元素或表格。**对于非块元素或者表格的元素，在应用绝对定位或者float时，都会按照以下规则进行转换。
   [![img](http://ww3.sinaimg.cn/large/63739cabjw1f79rsqjfmyj20it07g3zc.jpg)](http://ww3.sinaimg.cn/large/63739cabjw1f79rsqjfmyj20it07g3zc.jpg)

   ## 常规流

   常规流里的每一个盒子，都属于一个格式化的上下文中。不同的的元素会依据不同的格式化上下文来决定在当前环境中如何布局，块盒参与块级格式化上下文，行内盒子参与行内格式化上下文。

   ### 块级格式化上下文BFC

   在BFC中，盒子会一个接着一个垂直排列，且其中相邻的块级元素的垂直外边会发生折叠。

   > 块格式化上下文是一个比较抽象的概念。可以把它想象成一个大箱子，很多元素装在里面，箱子把它们和外面的元素隔开。

浮动元素，绝对定位元，display为inline-block，table-cell或table-captain的元素，以及overflow不为visible的元素，会创建新的格式化上下文。（！注意这些元素创建了块级格式化上下文，但它们本身不是块级格式化上下文）

块级格式化很重要，因为它对宽高的计算，外边距折叠，定位都有影响。
具体请看[之前的一篇文章CSS的BFC](http://blog.yzzhuo.com/2016/07/20/CSS%E7%9A%84BFC/)

### 行内格式化上下文IFC

块级格式化上下文的盒子一个接一个水平排列，起点是包含块的顶部。水平方向的margin，border，padding在盒子之间得以保留。 这些盒子在垂直方向可以以不同的方式来对齐。
行内级盒子(inline-level boxes)布局到一个由行盒(line boxes)垂直排列而成的容器里。

- IFC里面的盒子不能指定宽高。
- 超出行盒宽度限制的行内框会被分割成多行。
- IFC涉及的东西很多，包括
  - 行盒和其大小计算
  - 行内级盒子的对齐方式
  - …

在此必须知道基线是什么，以及line-height和vertical-align的原理。篇幅会比较长，为了避免本文篇幅过长，所以这部分打算之后有时间再另外抽出时间来探讨。

## 浮动

浮动的元素脱离常规流，并且内容（line box）可与沿着浮动盒子的边缘环绕，比如文字环绕效果就是利用浮动来实现的。给元素设置clear属性就能清除其环绕在周围的浮动元素。

```
<p style=" margin: 2em; border: 1px solid red;width: 200px;">
<span style="width:100px; height:100px; background-color:green; margin:20px;float: left;"></span>
The IMG box is floated to the left. The content that follows is formatted to the
right of the float, starting on the same line as the float.
</p>

```

[![img](http://w3help.org/zh-cn/kb/011/011/around_float.png)](http://w3help.org/zh-cn/kb/011/011/around_float.png)

**浮动框的位置**
一个浮动框要么向左偏移或向右偏移，偏移到直到它的外边界接触到它包含块的边界或者另外一个浮动框的外边界。
（注意，浮动框虽然脱离了常规流，但是确实是会被常规流所决定它的位置的。反正很久之前自己就错误地，单纯的以为float元素在另外一个层叠空间起作用，也不受其他非浮动元素影响）

**浮动框对其它框的影响** 因为浮动框脱离了常规流，所以常规流中的框会把浮动框当作不存在一样，即不会影响它们本来的排列布局。但是，在浮动框后创建的行盒会被缩短。

对于table元素，块级替换元素，BFC元素和浮动元素,它们不能覆盖任何浮动元素。例子如下。

```
<div style=" margin: 2em;border: 1px solid red;width: 200px;overflow: hidden;">
<div id="A" style="width:50px; height:50px; background-color:green; margin:20px; float:left;">A</div>
<div id="B" style=" width:50px; background-color:blue; overflow:hidden;">B</div>
</div>

```

[![img](http://w3help.org/zh-cn/kb/011/011/float_overflow1.png)](http://w3help.org/zh-cn/kb/011/011/float_overflow1.png)

## 绝对定位

绝对定位元素定位的参照物是其包含块，关于包含块的判定可以回顾上一篇文章。

> 常规流中的框，都在同一个层上，浮动框是处于常规流之上的一个特殊层，它可能会对常规流中的框的定位产生影响。但绝对定位的框不会， 每个绝对定位的框都可以看做一个单独的图层，不会对其他层框的定位产生影响。

- 需要注意的是，在没有给绝对定位元素设置偏移时，它们的位置还是在常规流中的默认位置。

参考文献：
[CSS规范](https://www.w3.org/TR/2011/REC-CSS2-20110607/)