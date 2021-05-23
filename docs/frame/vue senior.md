---
toc: content
order: 3
---

# Vue 高级特性

## $nextTick

因为 vue 是异步渲染 data 改变后 Dom 不会立即渲染 $nextTick 会在 Dom 渲染之后被触发 以获取最新的 Dom 节点

```js
addItem () {
    this.list.push(+new Date())
    this.list.push(+new Date())
    this.list.push(+new Date())

    // 页面渲染时会把 data 的修改做整合,多次 data 修改只会渲染一次 (同 react 的 setState)

    this.$nextTick(() => {
        const ulElem = this.$refs.ul
        console.log(ulElem.childNodes.length)
    })
}
```

$nextTick 实现原理：主要使用了`宏任务`和`微任务`。根据执行环境分别尝试采用

> MutationObserver 监视对 DOM 树做的更改。
> setImmediate 该方法可以用来替代 `setTimeout(fn, 0)`。

-   `Promise.then`
-   `MutationObserver`
-   `setImmediate`
-   如果以上都不行则采用 `setTimeout`

定义了一个`异步方法`，多次调用 `nextTick` 会将方法存入`队列`中，通过这个异步方法`清空当前队列`。

======= > 以下是官网原文：< =======

Vue 在更新 DOM 时是异步执行的。只要侦听到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据变更。如果同一个 watcher 被多次触发，只会被推入到队列中一次。这种在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作是非常重要的。

然后，在下一个的事件循环“tick”中，Vue 刷新队列并执行实际 (已去重的) 工作。`Vue 在内部对异步队列尝试使用原生的 Promise.then、MutationObserver 和 setImmediate，如果执行环境不支持，则会采用 setTimeout(fn, 0) 代替。`

## slot

很多时候，我们封装了一个子组件之后，在父组件使用的时候，想添加一些 dom 元素，这个时候就可以使用 slot 插槽了，但是这些 dom 是否显示以及在哪里显示，则是看子组件中 slot 组件的位置了。可以简单的理解为 坑位。

-   匿名插槽 不指定 插槽 name
-   具名插槽: 指定 slot name `<template v-slot:header></template>`
-   作用域插槽: 允许在父组件中访问子组件内部的一些可用数据

## 自定义指令

指令本质上是`装饰器`，是 vue 对 HTML 元素的扩展，给 HTML 元素增加自定义功能。vue 编译 DOM 时，会找到指令对象，执行指令的相关方法。

自定义指令有五个生命周期

-   bind：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
-   inserted：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。
-   update：所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。指令的值可能发生了改变，也可能没有。但是你可以通过比较更新前后的值来忽略不必要的模板更新。
-   componentUpdated：指令所在组件的 VNode 及其子 VNode 全部更新后调用。
-   unbind：只调用一次，指令与元素解绑时调用。

原理

1.在生成 ast 语法树时，遇到指令会给当前元素添加 directives 属性

2.通过 genDirectives 生成指令代码

3.在 patch 前将指令的钩子提取到 cbs 中,在 patch 过程中调用对应的钩子

4.当执行指令对应钩子函数时，调用对应指令定义的方法

## 动态组件

有的时候，在不同组件之间进行动态切换是非常有用的，比如在一个选项卡的界面里：

可以通过 Vue 的 <component> 元素加一个特殊的 `is` 属性 来实现：

```js
// 组件会在 isShow 改变时改变
<component v-bind:is="isShow" />
```

## 异步组件

通常我们都是在文件顶部通过通过同步的方式导入组件

```js
import ComponentsA from './ComponentsA'
import ComponentsB from './ComponentsB'
import ComponentsC from './ComponentsC'
import ComponentsD from './ComponentsD'
......
```

假如,我们的业务组件比较大,通常会在顶部一次性同步导入很多组件,这样组件在编译和打包的时候体积会很大,
从性能优化的角度来说,不是最优的方案. 特别某些组件是在特定的条件下才需要加载时(比如点击事件被触发后),
此时,我们可以使用 import 函数 按需记载 异步组件方案优化

```js
import ComponentsA from './ComponentsA';
import ComponentsB from './ComponentsB';

export default {
    components: {
        ComponentsC: () => import('./ComponentsC'),
    },
};
```

## keep-alive

`keep-alive` 是 Vue 内置的一个组件，可以`实现组件缓存`，当组件`切换时`不会对当前组件进行`销毁`。
是一个抽象组件：它自身不会渲染一个 DOM 元素，也不会出现在组件的父组件链中。
当组件在 <keep-alive> 内被切换，它的 `activated` 和 `deactivated` 这两个生命周期钩子函数将会被对应执行。

常用的属性 include/exclude/max 允许组件有条件的进行缓存。
max: 最多可以缓存多少组件实例。一旦这个数字达到了，在新实例被创建之前，已缓存组件中最久没有被访问的实例会被销毁掉。

## mixin

在日常的开发中，我们经常会遇到在不同的组件中经常会需要用到一些`相同或者相似的代码`，这些代码的`功能相对独立`，可以通过 Vue 的 `mixin` 功能`抽离公共的业务逻辑`，原理类似“对象的继承”，当组件初始化时会调用 `mergeOptions` 方法进行`合并`。

mixin 并不是最完美的解决方案,会有一些问题

-   变量来源不明确,不利于阅读
-   多 mixin 可能会造成命名冲突
-   mixin 和组件可能会出现多对多的关系,复杂度较高

`vue3 的Composition API 旨在解决这些问题。`

## SSR

SSR 也就是`服务端渲染`，也就是将 Vue 在客户端把标签渲染成 HTML 的工作放在服务端完成，然后再把 html 直接返回给客户端。

优点：

-   SSR 有着更好的 SEO
-   首屏加载速度更快

缺点：

-   开发条件会受到限制，服务器端渲染只支持 beforeCreate 和 created 两个钩子，当我们需要一些外部扩展库时需要特殊处理
-   服务端渲染应用程序也需要处于 Node.js 的运行环境
-   服务器会有更大的负载需求

## Vue 的性能优化

-   对象层级不要过深，否则性能就会差
-   不需要响应式的数据不要放到 data 中（可以用 Object.freeze() 冻结数据）
-   v-if 和 v-show 区分使用场景
-   computed 和 watch 区分使用场景
-   v-for 遍历必须加 key，key 最好是 id 值，且避免同时使用 v-if
-   大数据列表和表格性能优化-虚拟列表/虚拟表格
-   防止内部泄漏，组件销毁后把全局变量和事件销毁
-   图片懒加载
-   路由懒加载
-   第三方插件的按需引入
-   适当采用 keep-alive 缓存组件
-   防抖、节流运用
-   服务端渲染 SSR or 预渲染

## Vue 模板编译原理

Vue 的编译过程就是将 template 转化为 render 函数的过程 分为以下三步

-   第一步是将 `模板字符串` 转换成 `AST`（解析器）
-   第二步是对 `AST` 进行`静态节点标记`，主要用来做虚拟 DOM 的渲染优化（优化器）
-   第三步是 使用 `AST` 生成 `render 函数`代码字符串（代码生成器）

## 虚拟 DOM 是什么

由于在浏览器中操作 `DOM` 是很昂贵的。频繁的操作 DOM，会产生一定的`性能问题`。这就是虚拟 Dom 的产生原因。

Vue2 的 Virtual DOM 借鉴了开源库 snabbdom 的实现。`Virtual DOM 本质就是用一个原生的 JS 对象去描述一个 DOM 节点，是对真实 DOM 的一层抽象`。

优点：

-   `保证性能下限`： 框架的虚拟 DOM 需要适配任何上层 API 可能产生的操作，它的一些 DOM 操作的实现必须是普适的，所以它的性能并不是最优的；但是比起粗暴的 DOM 操作性能要好很多，因此框架的虚拟 DOM 至少可以保证在你不需要手动优化的情况下，依然可以提供还不错的性能，即保证性能的下限；

-   `无需手动操作 DOM`： 我们不再需要手动去操作 DOM，只需要写好 View-Model 的代码逻辑，框架会根据虚拟 DOM 和 数据双向绑定，帮我们以可预期的方式更新视图，极大提高我们的开发效率；

-   `跨平台`： 虚拟 DOM 本质上是 JavaScript 对象,而 DOM 与平台强相关，相比之下虚拟 DOM 可以进行更方便地跨平台操作，例如服务器渲染、weex 开发等等。

缺点:

-   `无法进行极致优化`： 虽然虚拟 DOM + 合理的优化，足以应对绝大部分应用的性能需求，但在一些性能要求极高的应用中虚拟 DOM 无法进行针对性的极致优化。

-   `首次渲染大量 DOM 时`，由于多了一层虚拟 DOM 的计算，会比 innerHTML `插入慢`。

## 虚拟 DOM 实现原理

主要包括以下 3 部分：

-   用 JavaScript 对象模拟真实 DOM 树，对真实 DOM 进行抽象；
-   diff 算法 — 比较两棵虚拟 DOM 树的差异；
-   pach 算法 — 将两个虚拟 DOM 对象的差异应用到真正的 DOM 树。
