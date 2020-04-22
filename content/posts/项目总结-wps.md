---
title: 项目总结-wps
date: 2017-4-1 23:13:58
tags: 实战总结
---

在某群实习的最后一个项目，暂且叫它wps吧，是一个用于针对H5页面的性能分析平台，主要技术栈是react+redux+webpack+antd。其中前端用的是dva框架，后端用的是egg.js框架。虽然做这个项目的过程遇到不少困难，但是还是很感激当时能有机会接触这个项目，让我可以学到了一些性能分析的技巧和内核的知识。另外在老大的手下做事虽然不轻松，但是也感谢实习期间能遇到了一位愿意耐心指导的导师，告诉我怎么学习怎么成长。最后的最后，在离开之际整理了一下最后一个月重构工作的一些收获吧。

### React应用性能分析与优化

虽然react解决了在state变化时自动刷新界面，且虚拟DOM（diff算法）也在一定程度减少了重绘的成本。但react也不是无敌的，首先，虚拟DOM的对比也是需要成本的，其次，react发生render的情况不一定符合你的预期。
[![img](http://ww1.sinaimg.cn/large/63739cabgy1fe5t7hfayzj20je06twgv.jpg)](http://ww1.sinaimg.cn/large/63739cabgy1fe5t7hfayzj20je06twgv.jpg)

react的每个组件在生命周期里会调用shouldComponentUpdate(object nextProps, object nextState)函数，该函数返回true表示需要更新，需要更新的会调用render生成新的虚拟DOM，false表示不需要。react对此函数默认返回true，（即使没有显示地定义shouldCompnentUpdate函数），即React默认总是进行虚拟DOM的比较，无论真实DOM是否需要被重新渲染。

In conclusion,对react应用进行性能优化的入口点有两个：

- 减少不必要的render调用
- 减少虚拟DOM对比的成本

### 性能检测手段

react官方提供了React.addons.Perf来帮助分析组件的性能。

- 执行操作前，调用React.addons.Perf.start()
- 执行操作后，调用React.addons.Perf.stop()
- printWasted()：查看浪费（即组件render前后保持不变，但是却花费了时间进行虚拟DOM的比较），性能分析中最有用的一个方法。
- printInclusive()：查看组件花费的总时间，可以帮我们找出哪个组件是性能瓶颈。
- 查看React对DOM的操作情况，调用React.addons.Rerf.printDOM()查看React对DOM的操作情况

更多API见 [React官方文档](https://facebook.github.io/react/docs/perf.html)

### 性能优化

**场景实践-减少不必要的react render**
一开始重构WPS时，发现创建分析模块的表单操作起来异常卡顿。虽然当时子杰对AnalyseRule这个组件的SCU进行重写，改善了表单的卡顿现象，但是现在回过头来屡下思路是必要的。
下图是没有进行任何优化处理的表单进行的检测情况，在分析模块规则的一个输入框输入内容的组件渲染情况。
[![bad](http://git.cn-hangzhou.oss-cdn.aliyun-inc.com/uploads/wps/wpsd-demo/2f49f8a02e8928ce7dcf3ca1d38e66a2/bad.png)](http://git.cn-hangzhou.oss-cdn.aliyun-inc.com/uploads/wps/wpsd-demo/2f49f8a02e8928ce7dcf3ca1d38e66a2/bad.png)bad
输入规则的时候，每次输入，事件监听到内容发生变化，redux那边会dispatch一个setRuleData的action来改变analyse这个state的createData（更具体地说是createData的rules下的某个对象的某个域的值得改变），更新后的state从容器组件（analyse/modules/detail）传进去后，其子组件的props实际发生了改变。
通过代码或者printDOM()方法，知道其数据流向大致如下：

[![img](http://ww1.sinaimg.cn/large/63739cabgy1fe607m1ezyj205x0a5jrc.jpg)](http://ww1.sinaimg.cn/large/63739cabgy1fe607m1ezyj205x0a5jrc.jpg)

如果现在编辑的分析模块有X个分析规则，X个分析规则又有S个规则条件，当我改变了某个分析规则的某个规则条件的时候，所有其它无辜的分析规则和他们的规则条件也一起被重新render了。
如果我编辑了某条规则，我不想让其它无辜分析规则也render呢？

```javascript
shouldComponentUpdate(nextProps) {
return !is(fromJS(nextProps.data), fromJS(this.props.data)) || this.props.disabled !== nextProps.disabled;
}
```



因为当父组件的状态state发生变化时，传入state的子组件都会进行重新渲染的前提下。
这段代码，就实现了只在这个规则的数据发生变化，不影响其它实际一动也不动的分析规则进行生成虚拟DOM并且对比balabla。

所以在AnalyseRule和ConditionItem重载组件的shouldComponentUpdate后，再用性能分析工具检测一下成果：
**同样的操作（一个分析模块，两个分析规则，改变其中一个分析规则的规则条件的字段输入框），时间从143ms减少到69ms，影响的DOM操作从15个减少到6个，即只会让自身所在的分析规则发生虚拟DOMrender。**
[![2017-03-31_144443](http://git.cn-hangzhou.oss-cdn.aliyun-inc.com/uploads/wps/wpsd-demo/d5d0376b3f838f21c77939d6d64fdbec/2017-03-31_144443.png)](http://git.cn-hangzhou.oss-cdn.aliyun-inc.com/uploads/wps/wpsd-demo/d5d0376b3f838f21c77939d6d64fdbec/2017-03-31_144443.png)2017-03-31_144443

**关于immutable**

在上面的shouldComponentUpdate可以看到数据的对比是用了immutable，如果不用immutable会怎样？
js数据类型分为基本类型和引用类型。如果直接比较两个对象，实际比较的是他们的指向，即使我们改变了它们的内容，指向不发生改变，那么比较的结果就是没变，导致优化失效。所以这里的比较必须是深比较，但是deepCompare是非常消耗性能的。而immutable可以很好地解决这些问题。
immutable的实现原理是持久化数据结构（具体看[immutable详解以及React中的事件](https://github.com/camsong/blog/issues/3)），减低了深比较的成本。另外immutable提高了简洁高效判断数据是否变化的方法`is`.

以前除去SCU这里的场景，immutable在数据流的应用也起到了很大的作用。
虽然immutable是一个重型库，但是在大型应用中引入是有价值的，它可以除去了复杂应用中可变数据带来的隐患。

总结-react比较好的实践：

- 即使组件之后被复用的机会很小，也不要将复杂的组件在一个组件写完。
- props和state的数据尽可能简单扁平化。
- {…this.props}不滥用，只传组件需要的数据，减少shouldComponentUpdate进行数据比较的负担。
- map的组件要用key，刚刚才发现用可变的index对性能优化是没有半点作用的（WPS有几处是用index做key的，这个要改@-@），具体原因可以看下面两篇比较好的文章
- [key属性的原理和用法](http://taobaofed.org/blog/2016/08/24/react-key/)
- [使用Perf工具研究React Key对渲染的影响](http://levy.work/2016-08-31-debug-react-key-with-performance-tool/)

### 产品设计和用户体验

因为WPS是没有专门的产品的，研发就是产品经理。但开发过程习惯了从研发的角度去思考。

#### 表单

因为该项目类似与管理后台系统，多处都需要用户填写表单（创建分析模块，创建评估报告等等）。表单这一块是与用户交互最频繁的组件之一了。而表单的优化有几点：

- 良好的用户提示和反馈，可以减少用户提交表单的成功率（placeholder,以及antd附带的hasFeedback功能）
- 给输入项设置默认值，自动填充，自动补全，自动聚焦，可以减少用户输入的时间。

其它与业务相关的：

- 编辑分析模块的时候，有分析规则包含了关联规则，有些没有，区分两者的区别可以加快用户的编辑操作，从而提高用户体验。

#### 任务等待

除了创建和编辑表单，另外一个重要的使用场景就是查看评估报告。刚创建完评估报告后，需要用户等待分析服务分析完才能看到结果。最初的版本是需要用户手动刷新才能看到任务的最新状态，于是后来就提供了一个按钮，用户点击后发起异步请求，到后来按钮也不要，直接自动在一定时间间隔内发生请求，获取最新的状态信息。
优化的过程得到的教训：

> 减少用户的非必要的主动操作。像F5重刷页面和提供刷新按钮进行局部刷新，也许技术上有点差异，但是从用户体验角度，其实毫无差异。

另外，对于等待这件事，如果可以不断给予用户当前状态的反馈，会大大提升用户的体验。比如任务结果等待还可以进行的优化是，提供任务大概还要运行的时间..（即使技术上不能百分百确定还需等待的时间，但“欺骗”用户的交互设计窍门也是值得借鉴的）[用户体验设计中有哪些针对「等待」的设计的好例子？](https://www.zhihu.com/question/20064203)

总结：
优化用户体验的核心尽量使得产品变得易用（易于上手，减少使用遇到的挫折），实用和使用过程保证用户的满意度（保证操作和使用的效率）。总而言之，学会从使用者的角度去考虑产品（这点说起来很简单，但因为是很主观性的东西，其实实际很难考虑全面，但是尽量做到“don’t make me think , don’t make me unconfortable”吧）。

### 测试

项目开发中，多次因为测试不到位引发的事故。然而，测试真的并不是一件易事，但它也是有章法可循的。
而测试前应该要先明确测试用例。从慧贤那里学到了书写测试用例最常用的方法是将模块从上到下进行拆分，每个模块有自己单独的用例，模块与模块之间有连接的用例，页面和页面之间交互的用例等…

**测试用例设计方法**

- 黑盒测试用例设计（常用的是等价类划分和边界值分析）<http://www.cnblogs.com/Carolinee/p/5531971.html>
- 白盒测试用例设计（适用于开发人员，包括语句覆盖，判断覆盖，条件覆盖等..）<http://www.cnblogs.com/Carolinee/p/5404675.html>

总结：
测试最主要还是要细心细致。而这个过程中还是觉得自己有点粗心大意。另外，手工测试依旧会有缺漏，学习下自动化测试还是很有必要的。