---
toc: content
order: 4
---

# Vue3 相比 Vue2

## 性能更好

性能 比 Vue2 快 `1.2～2` 倍

-   diff 方法优化：

    -   vue2 中的 虚拟 dom 是进行`全量对比`
    -   vue3 新增了`静态标记`，在更新的时候判断是否有`标记`，有标记再去做对比，没有标记不去对比直接拿过来用

-   静态提升：

    -   Vue2 中无论元素是否参与更新，每次都会重新创建，然后再渲染
    -   Vue3 中对于不参与更新的元素，会做出`静态提升`，只会被创建一次，在渲染时直接复用即可

-   事件监听缓存：
    -   同一个函数没必要追踪变化，所以直接缓存起来复用即可

## 体积更小

更好的 `Tree shaking` 支持`按需编译`，体积 比 vue2 更小。

## 更好的 TS 支持

类型检查；如果使用自定义 Webpack 配置，需要配置 ' ts-loader ' 来解析 vue 文件里的 TS。

## 更好的代码组织，逻辑抽离

组合 API（类似 React Hooks）

## 更多的新功能

-   Fragment：`支持多根节点`的组件，也就是`片段`！(同 react Fragment)

-   Teleport：允许我们控制在 DOM 中哪个父节点下渲染了 HTML。(同 react Protal)

-   Suspense：`包裹异步组件` 可以在 异步组件渲染之前 渲染指定的内容，比如 loading。(同 react Suspense)

## 生命周期改动

```js
// Vue 3 选项式 API 生命周期；      和组合式 API 生命周期

beforeCreate                            setup
created                                 setup

beforeMount                             onBeforeMount
mounted                                 onMounted

beforeUpdate                            onBeforeUpdate
updated                                 onUpdated

beforeUnmount   <== beforeDestroy       onBeforeUnmount
unmounted       <== destroyed           onUnmounted
```
