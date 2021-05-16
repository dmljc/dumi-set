---
toc: content
order: 11
---

# Vue 高级

<!-- ## 自定义 v-model -->

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

1.在生成 ast 语法树时，遇到指令会给当前元素添加 directives 属性 2.通过 genDirectives 生成指令代码 3.在 patch 前将指令的钩子提取到 cbs 中,在 patch 过程中调用对应的钩子 4.当执行指令对应钩子函数时，调用对应指令定义的方法

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

keep-alive 是 Vue 内置的一个组件，可以实现组件缓存，当组件切换时不会对当前组件进行销毁。
是一个抽象组件：它自身不会渲染一个 DOM 元素，也不会出现在组件的父组件链中。
当组件在 <keep-alive> 内被切换，它的 activated 和 deactivated 这两个生命周期钩子函数将会被对应执行。

常用的属性 include/exclude/max 允许组件有条件的进行缓存。
max: 最多可以缓存多少组件实例。一旦这个数字达到了，在新实例被创建之前，已缓存组件中最久没有被访问的实例会被销毁掉。

## mixin

在日常的开发中，我们经常会遇到在不同的组件中经常会需要用到一些`相同或者相似的代码`，这些代码的`功能相对独立`，可以通过 Vue 的 `mixin` 功能`抽离公共的业务逻辑`，原理类似“对象的继承”，当组件初始化时会调用 `mergeOptions` 方法进行`合并`。

mixin 并不是最完美的解决方案,会有一些问题

-   变量来源不明确,不利于阅读
-   多 mixin 可能会造成命名冲突
-   mixin 和组件可能会出现多对多的关系,复杂度较高

`vue3 的Composition API 旨在解决这些问题。`

## vue-router

### 动态路由

我们经常需要把某种模式匹配到的所有路由，全都映射到同个组件(例如详情页面)

```js
const router = new VueRouter({
    routes: [
        // 动态路径参数 以冒号开头
        { path: '/detail/:id', component: DetailInfo },
    ],
});
```

一个“路径参数”使用冒号 : 标记。当匹配到一个路由时，参数值会被设置到 `this.$route.param`s。

### 懒加载

当打包构建应用时，JavaScript 包会变得非常大，影响页面加载。如果我们能把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应组件，这样就更加高效了。

结合 Vue 的异步组件 (opens new window)和 Webpack 的代码分割功能 (opens new window)，轻松实现路由组件的懒加载。

```js
const router = new VueRouter({
    routes: [
        {
            path: '/home',
            component: () =>
                import(/* webpackChunkName: "home" */ './home.vue'),
        },
    ],
});
```

若想把某个路由下的所有组件都打包在同个异步块 (chunk) 中。只需要使用 命名 webpackChunkName 即可。

### 路由模式

vue-router 默认 `hash` 模式 —— 使用 URL 的 hash 来模拟一个完整的 URL，于是当 URL 改变时，页面不会重新加载。

如果不想要很丑的 hash，我们可以用路由的 `history` 模式，这种模式充分利用 `history.pushState` API 来完成 URL 跳转而`无须重新加载页面`。

```js
const router = new VueRouter({
    mode: 'history',
    routes: [...]
})
```

当你使用 `history` 模式时，URL 就像正常的 url，例如 http://yoursite.com/user/id，也好看！

不过这种模式要玩好，还需要`后台配置支持`。因为我们的应用是个单页客户端应用，如果后台没有正确的配置，当用户在浏览器直接访问 http://oursite.com/user/id 就会返回 `404`，这就不好看了。

所以呢，你要在服务端增加一个`覆盖所有情况的候选资源`：如果 URL 匹配不到任何静态资源，则应该返回同一个 `index.html` 页面，这个页面就是你 app 依赖的页面。

## Vuex

### 基础使用

vuex 是专门为 vue 提供的`全局状态管理系统`，用于多个组件中`数据共享`、`数据缓存`等。（`无法持久化`、内部核心原理是`通过创造一个全局实例 new Vue`）。

![vuex](/images/frame/vuex.png)

-   State：`定义数据结构`，可以在这里设置默认的`初始状态`。
-   Getter：允许组件从 `Store` 中获取数据，`mapGetters` 辅助函数仅仅是将 store 中的 getter 映射到局部`计算属性`。
-   Mutation：是唯一更改 store 中状态的方法，且必须是`同步函数` (commit) 如: store.commit('increment')。
-   Action：用于提交 mutation，而`不是直接变更状态`，可以包含任意`异步`操作 (dispatch) 如: this.store.dispatch('increment')。
-   Module：允许将单一的 Store 拆分为多个 store 且同时保存在单一的状态树中。

### 数据丢失

Vuex 页面刷新会造成数据丢失: 需要做 vuex `数据持久化` 一般使用`本地存储`的方案来保存数据 可以自己设计存储方案 也可以使用第三方插件。

推荐使用 `vuex-persist` 插件，是为 Vuex 持久化存储而生的插件。不需要手动存取 storage ，而是直接将状态保存至 `cookie` 或者 `localStorage` 中。

## SSR

SSR 也就是`服务端渲染`，也就是将 Vue 在客户端把标签渲染成 HTML 的工作放在服务端完成，然后再把 html 直接返回给客户端。

优点：

-   SSR 有着更好的 SEO
-   首屏加载速度更快

缺点：

-   开发条件会受到限制，服务器端渲染只支持 beforeCreate 和 created 两个钩子，当我们需要一些外部扩展库时需要特殊处理
-   服务端渲染应用程序也需要处于 Node.js 的运行环境
-   服务器会有更大的负载需求
