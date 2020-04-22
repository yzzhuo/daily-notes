---
title: React中的样式处理
date: 2017-6-20 23:13:58
tags: 前端框架
---

 最近有在写react应用了，以前总是图简单，直接用inline style。趁着有空，总结一下除了inline style之外更优的react样式处理方法。

1.classname库

便于给组件动态设置className。

```javascript
impoert React, { Componet } from 'react';
import classNames from 'classnames';

class Button extends Component {
  render() {
    const btnClass = classNames({
      'btn': true,
      'btn-pressed': this.state.isPressed,
      'btn-over': !this.state.isPressed && this.state.isHovered,
    });
    return <button className={btnClass}>{this.props.label}</button>
  }
}
```

1. CSS Modules

   实现组件样式的局部作用域和模块依赖问题。
   使用方法 :
   webpack的css-loader内置了CSS Modules功能，所以使用CSS Modules首先要在webpack配置中启用css Modules，如下

```javascript
css?modules&localIdentName=[name]__[local]-[hash:base64:5]
```

​	其中加上modules即为启用，localIdentName是设置样式的命名规则。
​	接着在组件文件中将css样式import进来使用即可。

```
.normal {
  color: #eee;
}
import style from './styles.css';
class Button extends Component {
  render(){
    return <button className={style.normal}></button>    
  }
}
```

其它注意

1. 全局样式：CSS Module默认采用了局部样式，即样式外用:local包裹，生成的css名字附加了一串随机数，以此来实现样式的局部化。
   自己可以用:global来实现全局样式。

   ``` css
   :global(.btn) {
   …
   }
   // more than one syle in gloabl
   :global {
   .normal{
    ...
   }
   .danger{
     ...
     }
   }
   ```

   2. 样式复用：使用compose

```
.base{
  //通用样式
}
.normal{
    composes:base;
      //normal独有样式
}
```

​	此时使用了normal样式的元素或者组件实际会生成两个class。

3. CSS Modules只会转换class名相关的样式，即只会转变类选择器。所以id选择器或者其他属性选择器的样式不会被css modules进行转化。

4. CSS Mdoules结合classNames在react中的应用：

   ```javascript
   ...
   import className from 'classnames';
   import styles from './styles.css';

   class Dialog extends Component {
       render() {
       const cx = classNames({
         confirm: !this.state.disabled,
         disabledConfirm: this.state.disabled,
       });
         return (
             <div className={styles.root}>
               <a className={styles[cx]}>Confirm</a>    
           </div>
         )
       }
   }
   ```

5. 结合react-css-modules库，避免重复输入styles.xx。

   ```
    //....
   import CSSModules from 'react-css-modules';
    //...
       return (
            <div styleName={root}>
               <a styleName={cx}>Confirm</a>    
           </div>
       )
    export default CSSModules(Dialog, styles);
   ```

其它：

ts中import css文件的时候报错。

解决方法：增加一个module definition告诉typescript可以import css文件。

```javascript
// declaration.d.ts
declare module '*.css' {
    const content: any;
    export default content;
}
```

