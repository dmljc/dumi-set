---
toc: content
order: 10
---

# Vue 基础

Vue 是一套用于构建用户界面的`渐进式框架`。与其它大型框架不同的是，Vue 被设计为可以自底向上逐层应用。Vue 的核心库只`关注视图层`，不仅`易于上手`，还便于与`第三方库`或既有项目整合。另一方面，当与现代化的工具链以及各种支持类库结合使用时，Vue 也完全能够为复杂的单页应用提供驱动。

![mvvm](/images/frame/mvvm.png)
虽然没有完全遵循 MVVM 模型，但是 Vue 的设计也受到了它的启发。因此在文档中经常会使用 vm (ViewModel 的缩写) 这个变量名表示 Vue 实例。

> 严格的 MVVM 要求 View 不能和 Model 直接通信，而 Vue 提供了`$refs` 这个属性，让 Model 可以直接操作 View，违反了这一规定，所以说 Vue 没有完全遵循 MVVM。

m 代表 model 模型, v 代表 view 视图, vm 代表 viewModel

ViewModel 层：做了两件事达到了数据的双向绑定 一是将【模型】转化成【视图】，即将后端传递的数据转化成所看到的页面。实现的方式是：数据绑定。二是将【视图】转化成【模型】，即将所看到的页面转化成后端的数据。实现的方式是：DOM 事件监听。

在 MVVM 中，View 不知道 Model 的存在，Model 和 ViewModel 也观察不到 View，`这种低耦合模式提高代码的可重用性。`

## data 是一个函数

组件中的 data 写成一个函数，数据以函数返回值形式定义，这样每复用一次组件，就会返回一份新的 data，类似于给每个组件实例创建一个私有的数据空间，让各个组件实例维护各自的数据。而单纯的写成对象形式，因为对象是引用类型，就使得所有组件实例共用了一份 data，就会造成一个变了全都会变的结果。

## 组件通讯方式有哪些

-   props 和$emit 父组件向子组件传递数据是通过 prop 传递的，子组件传递数据给父组件是通过$emit 触发事件来做到的
-   $parent,$children 获取当前组件的父组件和当前组件的子组件
-   $attrs 和$listeners A->B->C。Vue 2.4 开始提供了$attrs 和$listeners 来解决这个问题
-   父组件中通过 provide 来提供变量，然后在子组件中通过 inject 来注入变量。(官方不推荐在实际业务中使用，但是写组件库时很常用)
-   $refs 获取组件实例
-   envetBus 兄弟组件数据传递 这种情况下可以使用事件总线的方式
-   vuex 状态管理

## v-if v-show

相同点都是控制显示和隐藏 但是实现逻辑有差别

v-if

-   是 `真正的条件渲染`，因为它会确保在切换过程中条件块内的`事件监听器`和`子组件`适当地被`销毁`和`重建`
-   也是`惰性的`：如果在初始渲染时条件为假，则什么也不做——直到条件第一次变为真时，才会开始渲染条件块
-   在编译过程中会被转化成三元表达式,条件不满足时不渲染此节点。
-   适用在很少改变条件，不需要频繁切换条件的场景

v-show

-   不管初始条件是什么，元素总是会被渲染，并且只是简单地基于 CSS 进行切换(display: none)
-   会被编译成指令，条件不满足时控制样式将对应节点隐藏
-   适用于需要非常频繁切换条件的场景

## v-for

当 v-if 与 v-for 一起使用时，v-for 具有比 v-if 更高的优先级。**vue 3 则相反。**

v-for 和 v-if 不要在同一个标签中使用,因为解析时先解析 v-for 再解析 v-if。如果遇到需要同时使用时可以考虑写成计算属性的方式。

## key

如果不使用 key，Vue 会使用一种最大限度减少动态元素并且尽可能的尝试就地修改/复用相同类型元素的算法。 key 是为 Vue 中 vnode 的唯一标记，通过这个 key，我们的 diff 操作可以更准确、更快速。

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

computed 是计算属性，依赖其他属性计算值，并且 computed 的值有缓存，只有当计算值变化才会返回内容，它可以设置 getter 和 setter。

watch 监听到值的变化就会执行回调，在回调中可以进行一些逻辑操作。

计算属性一般用在模板渲染中，某个值是依赖了其它的响应式对象甚至是计算属性计算而来；而侦听属性适用于观测某个值的变化去完成一段复杂的业务逻辑。

## 自定义事件

## 生命周期

`beforeCreate` 在实例初始化之后，数据观测(data observer) 和 event/watcher 事件配置之前被调用。在当前阶段 data、methods、computed 以及 watch 上的数据和方法都不能被访问。

`created` 实例已经创建完成之后被调用。在这一步，实例已完成以下的配置：数据观测(data observer)，属性和方法的运算， watch/event 事件回调。这里没有$el,如果非要想与 Dom 进行交互，可以通过 vm.$nextTick 来访问 Dom。

`beforeMount` 在挂载开始之前被调用：相关的 render 函数首次被调用。

`mounted` 在挂载完成后发生，在当前阶段，真实的 Dom 挂载完毕，数据完成双向绑定，可以访问到 Dom 节点。

`beforeUpdate` 数据更新时调用，发生在虚拟 DOM 重新渲染和打补丁（patch）之前。可以在这个钩子中进一步地更改状态，这不会触发附加的重渲染过程。

`updated` 发生在更新完成之后，当前阶段组件 Dom 已完成更新。要注意的是避免在此期间更改数据，因为这可能会导致无限循环的更新，该钩子在服务器端渲染期间不被调用。

`beforeDestroy` 实例销毁之前调用。在这一步，实例仍然完全可用。我们可以在这时进行善后收尾工作，比如清除计时器。

`destroyed` Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁。 该钩子在服务器端渲染期间不被调用。

`activated` keep-alive 专属，组件被激活时调用。

`deactivated` keep-alive 专属，组件被销毁时调用。

异步请求在哪一步发起？

可以在钩子函数 `created`、`beforeMount`、`mounted` 中进行异步请求，因为在这三个钩子函数中，data 已经创建，可以将服务端端返回的数据进行赋值。

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

> 注意：在子组件直接用 v-model 绑定父组件传过来的 prop 这样是不规范的写法 开发环境会报警告

如果实在要改变父组件的 prop 值 可以再 data 里面定义一个变量 并用 prop 的值初始化它 之后用$emit 通知父组件去修改。

## Vue 事件绑定原理

`原生事件绑定`是通过 `addEventListener` 绑定给`真实元素`的，`组件事件`绑定是通过 Vue `自定义的$on` 实现的。如果要在组件上使用原生事件，需要加`.native 修饰符`，这样就相当于在父组件中把子组件当做普通 html 标签，然后加上原生事件。

## v-model 原理

v-model 只是语法糖而已。在内部为不同的输入元素使用不同的 property 并抛出不同的事件：

text 和 textarea 元素使用 value property 和 input 事件；
checkbox 和 radio 使用 checked property 和 change 事件；
select 字段将 value 作为 prop 并将 change 作为事件。

在普通标签上

```js
<input v-model="sth" />
//这一行等于下一行
<input v-bind:value="sth" v-on:input="sth = $event.target.value" />
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

-   .stop:阻止冒泡
-   .prevent:阻止默认行为
-   .self:仅绑定元素自身触发
-   .once: 只触发一次
-   .sync: 对 prop 进行“双向绑定”

.sync 修饰符

在有些情况下，我们可能需要对一个 prop 进行“双向绑定”。不幸的是，真正的双向绑定会带来维护上的问题，因为子组件可以变更父组件，且在父组件和子组件都没有明显的变更来源。为了方便起见，我们为这种模式提供一个缩写，即 .sync 修饰符。
