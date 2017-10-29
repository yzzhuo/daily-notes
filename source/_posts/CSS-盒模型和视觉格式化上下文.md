---
title: CSS-盒模型和视觉格式化上下文
date: 2016-08-11 23:13:58
tags: CSS
---

我知道好多人，包括以前的自己，都对CSS侧目以待。不就是选择器和一些样式嘛，给我半天的时间就能学会啦。对于css的使用，的确看看W3Cschool可能一下子就会了。但是当实际做项目的时候，你不知道为什么有时候给一些元素设置了宽，高值却不生效；不知道为什么两个inline-block的元素在并排在一起，它们却不是从同一高度开始渲染；不知道给一些设置了vertical-align：middle却不能实现垂直居中…此时此刻，才发现要精通CSS，并没有想象中的那么容易。所以，回到原点，一切从头开始吧!

## CSS基础概念一：CSS盒模型

> 浏览器展示一个元素时，这个元素会占据一定的空间。这个空间就是CSS的盒模型，它由四部分组成：呈现内容的content，内边距，边框和外边距。

[![img](http://w3help.org/zh-cn/kb/006/006/boxdim.png)](http://w3help.org/zh-cn/kb/006/006/boxdim.png)

上图所示的就是一个盒子模型（也称框模型）的庐山真面目。其中padding，border和margin都有top、right、left和bottom四部分。

#### 与之相关的CSS特性：

##### margin

1. margin可以应用到的元素有非table类型的元素，以及table类型中的table-caption，table和inline-table这三类的元素。对于td，tr，th，margin是不适用的，并且，对于行内非替换元素（如span），垂直的margin不起作用。
2. 垂直方向上的不同元素的相邻的margin在某些情况下，会发生折叠现象。（外边距折叠也是一个可以说来话长的故事）
3. margin可以为负。（这个特性的作用不小呢）

##### padding

1. 可以应用到的元素：除display的值是‘table-row-group’,’table-header-group’,’table-footer-group’, ‘table-row’， ‘table-column-group’ 和 ’table-column’ 的所有元素。

##### border

border可以设置其border-width，border-color和border-style。它适用于任何元素。

##### 容易被忽略的坑

在CSS中，设置的wdith和height指的是内容区域（即content）的宽度和高度。增加内边距、边框和外边距不影响内容区域的尺寸，但是会增加元素框的尺寸。在进行页面布局的时候，我们考虑的应该是元素框的尺寸。

盒子模型有两种标准。第一种是我们正常渲染模式下采用的W3C标准盒子模型。第二种是怪异模式下采用的IE盒子模型。它们的区别如下：
[![img](https://segmentfault.com/img/bVtyKC)](https://segmentfault.com/img/bVtyKC)
[![img](https://segmentfault.com/img/bVtyKz)](https://segmentfault.com/img/bVtyKz)
IE盒子模型会把padding和border算入元素的width和height。于是会导致元素框的大小看起来比实际的要小。（在使用IE盒子模型下试试给固定宽高的元素增加padding值，你就知道是怎么一回事了）

CSS3的box-sizing属性，让我们可以自行决定采用哪种盒子。

> box-sizing:content-box|border-box|inherit
> content-box——默认值，采用Standard box model
> border-box——采用IE box model
> inherit——继承父元素属性值

## CSS基本概念二：视觉格式化模型（visual formatiing modal）

上面所说的盒子模型是CSS的基础，之所以这么说是因为html里面的标签被浏览器解析后会生成元素，各元素被添加到docuemnt dom tree，但是CSS作用的不是元素，而是盒子，在页面渲染的过程，css在document dom tree的基础上会生成render tree，盒子模型就是render tree的节点。

> CSS 视觉格式化模型(visual formatting model)是用来处理文档并将它显示在视觉媒体上的机制。这是 CSS 的一个基础概念。 视觉格式化模型根据 CSS 盒模型为文档的每个元素生成 0，1 或多个盒。它也是 CSS 布局的核心，通过它，框( box )可以获得应有的尺寸，放到需要的位置。

咦？！还存在一个元素生成多个盒的情况？
有的，**li** 除了生成主要块级盒外还会生成一个额外的盒来放置它的项目符号。但是其实大多数元素都只生成一个盒子。

#### 影响布局的因素

- **盒子的类型和尺寸**：元素的display属性决定了盒子的类型，下面会详讲。
- **定位体系**：盒子在布局时，会根据三种定位体系（定位方案）定位（常规流/浮动/绝对定位）
- **文档树中元素之间的关系**：比如，一个块元素包含两个互为兄弟节点的浮动元素，后面那个浮动元素的布局，会受前面元素以及它包含块3的影响。
- **外部信息**：可视窗口的大小对布局有影响、图片的固有尺寸会影响行内替换元素的尺寸进而影响布局

### 包含块（Containing block）

> 在 CSS2.1 中，很多框的定位和尺寸的计算，都取决于一个矩形的边界，这个矩形，被称作是包含块( containing block )。

一个盒子相对于它的包含块的边界来渲染。但是盒子并不受它的包含块的限制，当它的布局跑到包含块的外面称为溢出（overflow）.

通常盒为它的后代元素建立包含块。但父元素就是子元素的包含块吗？答案是否地的。包含块有一个判断标准，因为说来话长，只能上一张包含块判定的总流程图了（希望伙伴们不要被吓到）：
[![img](http://w3help.org/zh-cn/kb/008/008/CB4.png)](http://w3help.org/zh-cn/kb/008/008/CB4.png)

- 根元素存在的包含块，被叫做初始包含块 (initial containing block)。具体，跟用户端有关。
- 如果元素的定位（position）为 “relative” （相对定位）或者 “static”（静态定位），它的包含块由它最近的块级、单元格（table cell）或者行内块（inline-block）祖先元素的 内容框1创建。
  *如果元素是固定定位 (“position:fixed”) 元素，那么它的包含块是当前可视窗口
- 绝对定位（”position: absolute”）元素的包含块由离它最近的 ‘position’ 属性为 ‘absolute’、’relative’ 或者 ‘fixed’ 的祖先元素创建。如果其祖先元素是行内元素，则包含块取决于其祖先元素的 ‘direction’ 特性：
  - 如果 ‘direction’ 是 ‘ltr’，包含块的顶、左边是祖先元素生成的第一个框的顶、左内边距边界(padding edges) ，右、下边是祖先元素生成的最后一个框的右、下内边距边界(padding edges)
  - 如果 ‘direction’ 是 ‘rtl’，包含块的顶、右边是祖先元素生成的第一个框的顶、右内边距边界 (padding edges) ，左、下边是祖先元素生成的最后一个框的左、下内边距边界 (padding edges)

详细的说明可以看[W3help关于包含块的这篇文章](http://w3help.org/zh-cn/kb/008/)

### 盒子的生成

从文档元素生成盒子是CSS视觉格式化模型的一部分工作。display属性决定了生成盒的类型，不同类型的盒子，视觉格式化模型对它的处理也不同。

#### 块级元素与块盒

- display为block，list-item或table的元素是块级元素，它们在视觉呈现为独占一行的块，竖直排列。每个块级元素至少生成一个主要块级盒，且这个盒子可以参与任一一种定位方案。
- 块级盒会参与BFC(块级格式化上下文)。
- 除了table盒子和替换元素，一个块级盒子一般也是一个块容器盒。
- 块容器盒要么只包含块级盒，要么只包含创建了IFC（行内格式化上下文）的行内级盒。
- 块级盒不一定是块容器盒（如table），块容器盒也不一定是块级盒（如非替换的inline blocks和非替换的table cells）。既是块级盒又是块容器盒的称为块盒。
- （块级盒侧重描述了元素和它的父元素及兄弟元素之间的表现，块容器盒侧重描述元素跟它的后代元素之间的影响）
  [![img](http://yangyong-test.qiniudn.com/wp-content/uploads/2014/11/block-box.png)](http://yangyong-test.qiniudn.com/wp-content/uploads/2014/11/block-box.png)

**匿名块盒**

```
<div>Some inline text 
<p>followed by a paragraph</p> 
    followed by more inline text.
</div>

```

其中`Some inline text`和`followed by more inline text.`会各自被匿名块盒所包含。匿名块盒不能被CSS 选择符选中（即所有可继承的 CSS 属性值为 inherit ，所有非继承的 CSS 属性值为 initial）。

创建匿名块盒的情况有两种：

1. 块容器盒同时包含行内级盒和块级盒时，将创建匿名块盒来包含毗邻的行内级盒。即上面的例子。

2. 一个行内盒包含了一个或者几个块盒，包含块盒的盒将拆分为两个行内盒放置于块盒前后，然后分别由两个匿名块盒包含。

   ```
   <p style="display:inline;border=1px solid gray">
   This is anonymous text before the SPAN。
   <span style="display:block">This is the content of SPAN.</span>
   This is anonymous text after the SPAN。
   </p>

   ```

效果：
[![img](https://github.com/dolymood/blog/raw/master/pics/001.png)](https://github.com/dolymood/blog/raw/master/pics/001.png)

### 行内级元素和行内盒

- display为inline，inline-block和inline-table的元素为行内级元素。视觉上它与其它行内级元素水平排列，比如input，img等。
- 行内级元素生成行内级盒，参与IFC（行内格式化上下文）。
- 参与生成IFC的行内级盒为行内盒。而不参与生成IFC的行内级盒为原子行内级盒。
- 所有display为inline的非替换元素生成的盒都是行内盒。
- 可替换行内元素或display为inline-block或inline-table的元素生成的是原子行内级盒。原子行内级盒在行内格式化上下文里不能分成多行。
  [![img](http://yangyong-test.qiniudn.com/wp-content/uploads/2014/11/inline-box.png)](http://yangyong-test.qiniudn.com/wp-content/uploads/2014/11/inline-box.png)

**匿名行盒**
类似于块盒，CSS 引擎有时自动生成行内盒。
产生匿名行内盒的情况是块盒直接包含文本，文本将包含在匿名行内盒中。空白如果使用white-space 去掉，则不会生成匿名行内盒。

**行盒**
行盒由行内格式化上下文(inline formatting context)产生的盒，用于表示一行。

最后附上一个display属性：不妨结合上面的知识思考一下不同值的display可以生成什么盒子？

> display
> 值： inline | block | list-item | inline-block | table | inline-table | table-row-group | table-header-group | table-footer-group | table-row | table-column-group | table-column | table-cell | table-caption | none | inherit

一旦盒生成了， CSS 引擎要指定它们的位置，这时会用到不同的定位方案。
定位方案就留到下一篇文章再谈吧。因为我..好饿..咕..感谢能够耐心看到最后的人。

参考文献：
[MDN-视觉格式化上下文](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Visual_formatting_model)
[css可视化模型-dolymood的博客](http://blog.aijc.net/css/2014/08/06/CSS%20%E5%8F%AF%E8%A7%86%E5%8C%96%E6%A0%BC%E5%BC%8F%E6%A8%A1%E5%9E%8B%EF%BC%88Visual%20formatting%20model%EF%BC%89/)
[CSS魔法堂-重新认识Box Model..](https://segmentfault.com/a/1190000004625635#articleHeader11)
[KB007：可视化格式化模型](http://w3help.org/zh-cn/kb/007/)
[KB006: CSS 框模型( Box module )](http://w3help.org/zh-cn/kb/006/)
[KB008: 包含块( Containing block )](http://w3help.org/zh-cn/kb/008/)
[CSS2 BFC模型和IFC模型](http://www.yangyong.me/css2-bfc%E6%A8%A1%E5%9E%8B%E5%92%8Cifc%E6%A8%A1%E5%9E%8B/)