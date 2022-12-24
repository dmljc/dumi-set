---
toc: content
order: 2
---

# Vue 基础知识

Vue 是一套用于构建用户界面的`渐进式框架`。与其它大型框架不同的是，Vue 被设计为可以自底向上逐层应用。Vue 的核心库只`关注视图层`，不仅`易于上手`，还便于与`第三方库`或既有项目整合。另一方面，当与现代化的工具链以及各种支持类库结合使用时，Vue 也完全能够为复杂的单页应用提供驱动。

![mvvm](/images/frame/mvvm.png)
`Vue 是一个视图层框架`，虽然没有完全遵循 MVVM 模型，但 Vue 的设计受到了它的启发。因此在文档中经常会使用 vm (ViewModel 的缩写) 这个变量名表示 Vue 实例。

> 严格的 MVVM 要求 View 不能和 Model 直接通信，而 Vue 提供了`$refs` 这个属性，让 Model 可以直接操作 View，违反了这一规定，所以说 Vue 没有完全遵循 MVVM。

`m` 代表 `model 模型`, `v` 代表 `view 视图`, `vm` 代表 `viewModel`。

ViewModel 层：做了两件事达到了数据的双向绑定 一是将【模型】转化成【视图】，即将后端传递的数据转化成所看到的页面。实现的方式是：数据绑定。二是将【视图】转化成【模型】，即将所看到的页面转化成后端的数据。实现的方式是：DOM 事件监听。

<!-- 在 MVVM 中，View 不知道 Model 的存在，Model 和 ViewModel 也观察不到 View，`这种低耦合模式提高代码的可重用性。` -->

## data 为什么是一个函数而不是一个对象

<!-- 组件中的 data 写成一个函数，数据以函数返回值形式定义，这样每复用一次组件，就会返回一份新的 data，类似于给每个组件实例创建一个私有的数据空间，让各个组件实例维护各自的数据。而单纯的写成对象形式，因为对象是引用类型，就使得所有组件实例共用了一份 data，就会造成一个变了全都会变的结果。 -->

JavaScript 中的对象是引用类型的数据，当多个实例引用同一个对象时，只要一个实例对这个对象进行操作，其他实例中的数据也会发生变化。而在 Vue 中，我们更多的是想要复用组件，那就需要每个组件都有自己的数据，这样组件之间才不会相互干扰。所以组件的数据不能写成对象的形式，而是要写成函数的形式。数据以函数返回值的形式定义，这样当我们每次复用组件的时候，就会返回一个新的 data，也就是说每个组件都有自己的私有数据空间，它们各自维护自己的数据，不会干扰其他组件的正常运行。

## 组件通讯方式有哪些

-   `props` 和 `$emit` 父组件向子组件传递数据是通过 `prop` 传递的，子组件传递数据给父组件是通过 `$emit` 触发事件来做到的
-   `$parent`，`$children` 获取当前组件的父组件和当前组件的子组件
-   `$attrs` 和 `$listeners`
-   父组件中通过 `provide` 来提供变量，然后在子组件中通过 `inject` 来注入变量。(官方不推荐在实际业务中使用，但是写组件库时很常用)
-   `$refs` 获取组件实例
-   `envetBus` 兄弟组件数据传递 这种情况下可以使用事件总线的方式
-   `vuex` 状态管理

## v-if v-show

相同点都是控制显示和隐藏 但是实现逻辑有差别

v-if

-   是 `真正的条件渲染`，因为它会确保在切换过程中`子组件`适当地被`销毁`和`重建`
-   也是`惰性的`：如果在初始渲染时条件为假，则什么也不做——直到条件第一次变为真时，才会开始渲染条件块
-   在编译过程中会被转化成三元表达式，条件不满足时不渲染此节点
-   适用在很少改变条件，不需要频繁切换条件的场景

v-show

-   不管初始条件是什么，元素总是会被渲染，并且只是简单地基于 CSS 进行切换(display: none)
-   会被编译成指令，条件不满足时控制样式将对应节点隐藏
-   适用于需要非常频繁切换条件的场景

## v-for

当 v-if 与 v-for 一起使用时，v-for 具有比 v-if 更高的优先级。**vue 3 则相反。**

v-for 和 v-if 不要在同一个标签中使用，因为解析时先解析 v-for 再解析 v-if。如果遇到需要同时使用时可以考虑写成计算属性的方式。

## key

key 是为 Vue 中 vnode 的唯一标记，通过这个 key，我们的 diff 操作可以更准确、更快速。

如果不使用 key，Vue 会使用一种最大限度减少动态元素，并且尽可能的尝试就地修改/复用相同类型元素的算法。

-   更准确：因为带 key 就不是就地复用了，在 sameNode 函数 a.key === b.key 对比中可以避免就地复用的情况。所以会更加准确。

-   更快速：利用 key 的唯一性生成 map 对象来获取对应节点，比遍历方式更快。

```js
// 判断两个vnode的标签和key是否相同 如果相同 就可以认为是同一节点就地复用
function isSameVnode(oldVnode, newVnode) {
    return oldVnode.tag === newVnode.tag && oldVnode.key === newVnode.key;
}

// 根据key来创建老的儿子的index映射表  类似 {'a':0,'b':1} 代表key为'a'的节点在第一个位置 key为'b'的节点在第二个位置
function makeIndexByKey(children) {
    let map = {};
    children.forEach((item, index) => {
        map[item.key] = index;
    });
    return map;
}
// 生成的映射表
let map = makeIndexByKey(oldCh);
```

## computed watch

-   computed 是计算属性，依赖其他属性计算值，并且 computed 的值有缓存，只有当计算值变化才会返回内容，它可以设置 getter 和 setter。

-   watch 监听到值的变化就会执行回调，在回调中可以进行一些逻辑操作。

计算属性一般用在模板渲染中，某个值是依赖了其它的响应式对象甚至是计算属性计算而来；而侦听属性适用于观测某个值的变化去完成一段复杂的业务逻辑。

## new Vue 做了什么

```js
Vue.prototype._init = function (options?: Object) {
    ......

    if (options && options._isComponent) {
        initInternalComponent(vm, options)
    } else {
        // 合并配置：Vue默认配置（components， directives，filters...）与用户自定义的options（data，methons，lifecycle）进行合并
        vm.$options = mergeOptions(
            resolveConstructorOptions(vm.constructor),
            options || {},
            vm
        )
    }

    initLifecycle(vm)   // 初始化生命周期
    initEvents(vm)      // 初始化事件中心
    initRender(vm)      // 初始化渲染
    callHook(vm, 'beforeCreate')
    initInjections(vm) // 初始化 provide
    initState(vm)   // 初始化 data、props、computed、watcher 
    initProvide(vm) // 初始化 inject
    callHook(vm, 'created')

    ......
}
```

## 生命周期

### 创建前/后

`beforeCreate` 在 `vue 实例初始化之后`，`数据观测` 和 `事件配置` 之前被调用。

`created` 在 `实例创建完成后` 被立即调用。在这一步，实例已完成以下的配置：数据观测 (data observer) 属性 和方法的运算，watch/event 事件回调。然而，挂载阶段还没开始，$el 属性 目前尚不可用。

### 挂载前/后

`beforeMount` 在 `挂载开始之前` 被调用：相关的 `render 函数首次被调用`。

`mounted` 在 `挂载完成后` 发生，在当前阶段，真实的 `Dom` 挂载完毕，数据 `完成双向绑定`，可以访问到 Dom 节点。

注意 mounted 不会保证 `所有的子组件` 也都一起被挂载。如果你希望等到整个视图都渲染完毕，可以在 mounted 内部使用 `vm.$nextTick`。

### 更新前/后

`beforeUpdate` 数据 `更新时` 调用，发生在`虚拟 DOM 打补丁之前`。这里适合在更新之前访问现有的 DOM，比如手动移除已添加的事件监听器。

`updated` 发生在 `更新完成之后`，当前阶段组件 Dom 已完成更新。要注意的是避免在此期间更改数据，因为这可能会导致无限循环的更新，如果要相应状态改变，通常最好使用`计算属性`或 `监听` 取而代之。

### 缓存组件激活前/后

`activated` 被 `keep-alive` 缓存的组件`激活时`调用。

`deactivated` 被 `keep-alive` 缓存的组件`停用时`调用。

### 销毁前/后

`beforeDestroy` Vue `实例销毁之前`调用。在这一步，实例仍然完全可用。我们可以在这时进行善后收尾工作，比如`清除计时器`。

`destroyed` Vue `实例销毁后`调用。该钩子被调用后，对应 Vue 实例的所有`指令都被解绑`，所有的`事件监听器被移除`，所有的`子实例也都被销毁`。

### 捕获错误

`errorCaptured` 当捕获一个来自`子孙组件的错误时`被调用。

异步请求在哪一步发起？

可以在钩子函数 `created`、`beforeMount`、`mounted` 中进行异步请求，因为在这三个钩子函数中，`data 已经创建，可以将服务端端返回的数据进行赋值。`

如果异步请求不需要依赖 Dom 推荐在 created 钩子函数中调用异步请求，因为在 created 钩子函数中调用异步请求有以下优点：

-   能更快获取到服务端数据，减少页面 loading 时间；
-   ssr 不支持 beforeMount 、mounted 钩子函数，所以放在 created 中有助于一致性；

## 父子组件生命周期

### 加载渲染过程

父 beforeCreate -> 父 created -> 父 beforeMount -> `子 beforeCreate -> 子 created -> 子 beforeMount -> 子 mounted` -> 父 mounted

### 子组件更新过程

父 beforeUpdate -> `子 beforeUpdate -> 子 updated` -> 父 updated

### 父组件更新过程

父 beforeUpdate -> 父 updated

### 销毁过程

父 beforeDestroy -> `子 beforeDestroy -> 子 destroyed` -> 父 destroyed

## vue 单项数据流

数据总是从父组件传到子组件，子组件没有权利修改父组件传过来的数据，只能请求父组件对原始数据进行修改。这样会防止从子组件意外改变父级组件的状态，从而导致你的应用的数据流向难以理解。

如果实在要改变父组件的 prop 值 可以在 data 里面定义一个变量 并用 prop 的值初始化它 之后用 $emit 通知父组件去修改。

## Vue 事件绑定原理

`原生事件绑定`是通过 `addEventListener` 绑定给真实元素的，`组件事件`绑定是通过 Vue `自定义的$on` 实现的。如果要在组件上使用`原生事件`，需要加`.native 修饰符`，这样就相当于在父组件中把子组件当做普通 html 标签，然后加上原生事件。

## v-model 原理

`v-model` 只是语法糖而已。在内部为不同的输入元素使用不同的 属性 并抛出不同的事件：

text 和 textarea 元素使用 value 属性 和 input 事件；
checkbox 和 radio 使用 checked 属性 和 change 事件；
select 字段将 value 作为 prop 并将 change 作为事件。

在普通标签上

```js
<input v-model="sth" />
//这一行等于下一行
<input :value="sth" @input="sth = $event.target.value" />
```

在组件上

```js
<currency-input v-model="price" />
// 上行代码是下行的语法糖
<currency-input :value="price" @input="price = arguments[0]" />

// 子组件定义
Vue.component('currency-input', {
    template: `
        <span>
            <input
                ref="input"
                :value="value"
                @input="$emit('input', $event.target.value)"
            >
        </span>
    `,
    props: ['value'],
})
```

## 常用的事件修饰符

-   .stop: 阻止冒泡
-   .prevent: 阻止默认行为
-   .self: 仅绑定元素自身触发
-   .once: 只触发一次
-   .sync: 对 prop 进行“双向绑定”

.sync 修饰符

在有些情况下，我们可能需要对一个 `prop 进行“双向绑定”`。不幸的是，真正的双向绑定会带来维护上的问题，因为`子组件可以变更父组件`，且在`父组件`和`子组件`都没有明显的`变更来源`。为了方便起见，我们为这种模式提供一个缩写，即 `.sync` 修饰符。

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

一个“路径参数”使用冒号 : 标记。当匹配到一个路由时，参数值会被设置到 `this.$route.params`。

### 懒加载

当打包构建应用时，JavaScript 包会变得非常大，影响页面加载。如果我们能把不同路由对应的组件分割成不同的代码块，然后`当路由被访问的时候才加载对应组件`，这样就更加高效了。

结合 Vue 的异步组件 和 Webpack 的代码分割功能，轻松实现路由组件的懒加载。

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

当你使用 `history` 模式时，URL 就像正常的 url，例如 http://yoursite.com/user/id 也好看！

不过这种模式要玩好，还需要`后台配置支持`。因为我们的应用是个单页客户端应用，如果后台没有正确的配置，当用户在浏览器直接访问 http://oursite.com/user/id 就会返回 `404`，这就不好看了。

所以，要在服务端增加一个`覆盖所有情况的候选资源`：如果 URL 匹配不到任何静态资源，则应该返回同一个 `index.html` 页面，这个页面就是你 app 依赖的页面。

### 全局前置守卫

全局前置守卫

`beforeEach`，通常做用户`鉴权逻辑`，若身份验证失败则重定向到 `login` 页面

```js
// BAD
router.beforeEach((to, from, next) => {
    if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' });
    // 如果用户未能验证身份，则 `next` 会被调用两次
    next();
});
```

### 全局解析守卫

`beforeResolve` 这和 `beforeEach` 类似，区别是: 在`导航被确认之前`，同时在`所有组件内守卫`和`异步路由组件被解析之后`，解析守卫就被调用。

### 全局后置守卫

`afterEach` 然而和守卫不同的是，这些钩子`不会接受 next 函数`也`不会改变导航本身`

```js
router.afterEach((to, from) => {
    // ...
});
```

### 组件内的守卫

-   beforeRouteEnter
-   beforeRouteUpdate (2.2 新增)
-   beforeRouteLeave

## Vuex

### 基础使用

vuex 是专门为 vue 提供的`全局状态管理系统`，用于多个组件中`数据共享`、`数据缓存`等。但是 `无法持久化`。

<!-- 我们知道了vuex是利用vue的mixin混入机制，在beforeCreate钩子前混入vuexInit方法，vuexInit方法实现了store注入vue组件实例，并注册了vuex store的引用属性$store。 -->

![vuex](/images/frame/vuex.png)

-   State：`定义数据结构`，可以在这里设置默认的`初始状态`。
-   Getter：允许组件从 `Store` 中获取数据，`mapGetters` 辅助函数仅仅是将 store 中的 getter 映射到局部`计算属性`。
-   Mutation：是唯一更改 store 中状态的方法，且必须是`同步函数` (commit) 如: store.commit('increment')。
-   Action：用于提交 mutation，而`不是直接变更状态`，可以包含任意`异步`操作 (dispatch) 如: this.store.dispatch('increment')。
-   Module：允许将单一的 Store 拆分为多个 store 且同时保存在单一的状态树中。

**vuex 的 store 是如何挂载注入到组件中呢？**

Vuex 的双向绑定通过调用 `new Vue` 实现，然后通过 `Vue.mixin` 注入到 Vue 组件的`生命周期`中，再通过劫持 state.get 将数据放入组件 data 中。

**vuex 如何响应式更新状态呢？**

借助 vue 的 data 是响应式，将 state 存入 vue 实例组件的 data 中；Vuex 的 getters 则是借助 vue 的计算属性 computed 实现数据实时监听。

### 数据丢失

Vuex 页面刷新会造成数据丢失: 需要做 vuex `数据持久化` 一般使用`本地存储`的方案来保存数据 可以自己设计存储方案 也可以使用第三方插件。

推荐使用 `vuex-persist` 插件，是为 Vuex 持久化存储而生的插件。不需要手动存取 storage ，而是直接将状态保存至 `cookie` 或者 `localStorage` 中。
