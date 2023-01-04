---
toc: content
order: 6
---

# React 高级特性

## portals 同 vue3 Teleport

通常组件会默认按照既定层次嵌套渲染。 那么，如何将组件渲染到父组件以外呢?

`Portal` 提供了一种将`子节点`渲染到存在于`父组件以外`的 `DOM` 节点的优秀的方案。

```js
ReactDOM.createPortal(child, container);
```

第一个参数（child）是任何可渲染的 React 子元素，例如一个元素或字符串。第二个参数（container）是一个 DOM 元素。

一个 `portal` 的典型用例是当`父组件`有 `overflow: hidden` 或 `z-index` 样式时，但你需要子组件能够在视觉上“跳出”其容器。例如，对话框、悬浮卡以及提示框：

## Suspense vue3 也有 Suspense

React 16.6 新增了 `<Suspense>` 异步加载组件，让你可以“等待”目标代码加载，并且可以直接指定一个加载的界面（像是个 loading），让它在用户等待的时候显示：

```js
const ProfilePage = React.lazy(() => import('./ProfilePage')); // 懒加载

// 在 ProfilePage 组件处于加载阶段时显示一个 loading
<Suspense fallback={<loading />}>
    <ProfilePage />
</Suspense>;
```

## React.Fragment vue3 也有 Fragment

React 中的一个常见模式是一个组件返回多个元素。Fragments 允许你将子列表分组，而无需向 DOM 添加额外节点。

你可以使用`短语法`来声明 Fragments。它看起来像空标签：

```js
class Columns extends React.Component {
    render() {
        return (
            <>
                <td>Hello</td>
                <td>World</td>
            </>
        );
    }
}
```

## 性能优化 SCU

`shouldComponentUpdate` 简称 `SCU`，默认返回 `true`。**React 默认：父组件有更新，子组件无条件更新**

```js
shouldComponentUpdate(newProps, nextState) {
    // 对于基本类型的比较，属于浅比较
    if (nextState.count !== this.state.count) {
        return true;  // 返回 true 可以渲染
    }
    return false;  // 不重复渲染

    // 对于引用类型的比较，可以用 lodash 的 isEqual()方法深比较
    if (lodash.isEqual(nextProps.list, this.state.list)) {
        return false;  // 相等，不需要重复渲染
    }
    return true;  // 不相等则渲染
}
```

可先不用 SCU，有性能问题时再考虑使用。

当一个组件的 props 或 state 变更，React 会将`最新`返回的元素与`之前`渲染的元素进行对比，以此决定是否有必要更新真实的 DOM。当它们不相同时，React 会更新该 DOM。

即使 React 只更新改变了的 DOM 节点，重新渲染仍然花费了一些时间。在大部分情况下它并不是问题，不过如果它已经慢到让人注意了，你可以通过覆盖生命周期方法 `shouldComponentUpdate` 来进行提速。**该方法会在重新渲染前被触发。**

在大部分情况下，你可以继承 `React.PureComponent` 以代替手写 `shouldComponentUpdate()`。它用当前与之前 `props` 和 `state` 的`浅比较`覆写了 `shouldComponentUpdate()` 的实现。

## 性能优化 PureComponent

`React.PureComponent` 与 `React.Component` 很相似。两者的区别在于 React.Component 并未实现 `shouldComponentUpdate()`，而 React.PureComponent 中以`浅层对比` `prop` 和 `state` 的方式来实现了该函数。

<Alert type="warning">
注意

`PureComponent` 中的 `shouldComponentUpdate()` 仅作对象的`浅层比较`。如果对象中包含`复杂的数据结构`，则有可能因为无法检查深层的差别，产生错误的比对结果。仅在你的 `props` 和 `state` 较为简单时，才使用 `PureComponent`，或者在深层数据结构发生变化时调用 `forceUpdate()` 来确保组件被正确地更新。你也可以考虑使用 `immutable` 对象加速嵌套数据的比较。

此外，`PureComponent` 中的 `shouldComponentUpdate()` 将跳过所有子组件树的 `prop` 更新。因此，**请确保所有子组件也都是“纯”的组件。**

</Alert>

<!-- ## immutable.js

彻底拥抱`不可变值`，`基于共享数据(不是深拷贝)`，`性能好`。但是有一定的学习和迁移成本，请按需使用。

-   `Immutable Data` 一旦创建，就`不能再被更改`。
-   对 `Immutable` 对象的任何`修改`或`添加`、`删除`操作都会返回一个`新的 Immutable 对象`。
-   `Immutable` 实现原理是：`持久化数据结构`，也就是`使用旧数据创建新数据时，要保证旧数据可用且不变`。
-   为了避免 deepCopy 把所有节点都复制一遍带来的`性能损耗`，`Immutable` 使用了`结构共享`，即如果对象树中一个节点发生变化，只修改这个节点和受它影响的父节点，其它节点则`进行共享`。

![](/images/frame/immutable.png)

```js
const map1 = Immutable.Map({ a: 1, b: 2, c: 3 });
const map2 = map1.set('b', 50);
map1.get('b'); // 2
map2.get('b'); // 50
``` -->

## 性能优化 memo

```js
const MyComponent = React.memo(function MyComponent(props) {
    /* 使用 props 渲染 */
});
```

首先 `React.memo` 是一个高阶组件，高阶组件是参数为组件，返回值为新组件的函数。

被 React.memo 包裹的组件在渲染前，会对新旧 props 进行浅比较：

-   如果新旧 props 浅比较相等，则不进行重新渲染（使用缓存的组件）。
-   如果新旧 props 浅比较不相等，则进行重新渲染（重新渲染的组件）。

<!-- 如果你的组件在相同 `props` 的情况下`渲染相同的结果`，那么你可以通过将其包装在 `React.memo` 中调用，以此`通过记忆组件渲染结果的方式`来提高组件的性能表现。这意味着在这种情况下，React 将**跳过渲染组件的操作并直接复用最近一次渲染的结果。** -->

<!-- `React.memo` 仅检查 `props` 变更。如果`函数组件`被 `React.memo` 包裹，且其实现中拥有 `useState`，`useReducer` 或 `useContext` 的 `Hook`，当 `context` 发生变化时，它仍会`重新渲染`。 -->

默认情况下其只会对`复杂对象`做`浅层对比`，如果你想要控制对比过程，那么请将`自定义`的比较函数通过`第二个参数`传入来实现。

```js
function MyComponent(props) {
    /* 使用 props 渲染 */
}
function areEqual(prevProps, nextProps) {
    /*
    如果把 nextProps 传入 render 方法的返回结果与
    将 prevProps 传入 render 方法的返回结果一致则返回 true，
    否则返回 false
    */
}
export default React.memo(MyComponent, areEqual);
```

<Alert type="warning">
注意

<!-- 此方法仅作为`性能优化`的方式而存在。但请不要依赖它来“阻止”渲染，因为这会产生 bug。 -->

与 class 组件中 `shouldComponentUpdate()` 方法不同的是，如果 `props` 相等，`areEqual` 会返回 `true`；如果 props 不相等，则返回 false。这与 `shouldComponentUpdate` 方法的返回值相反。

</Alert>

<!-- ## 高阶组件

`高阶组件`（HOC）是 React 中用于复用组件逻辑的一种高级技巧。`HOC` 自身不是 React API 的一部分，它是一种基于 React 的组合特性而形成的`设计模式`。

具体而言，高阶组件是**参数为组件，返回值为新组件的函数。**

```js
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```

组件是将 `props` 转换为 `UI`，而高阶组件是将`组件`转换为`另一个组件`。

HOC 在 React 的第三方库中很常见，例如 `Redux` 的 `connect` 和 Relay 的 createFragmentContainer。

请注意，HOC 不会修改传入的组件，也不会使用继承来复制其行为。相反，HOC 通过将组件包装在容器组件中来组成新组件。`HOC 是纯函数，没有副作用。`

**HOC 注意事项:**

-   不要试图在 HOC 中修改组件原型（或以其他方式改变它）。这样做会产生一些不良后果。
-   不要在 render 方法中使用 HOC

React 的 `diff 算法` 使用`组件标识`来确定它是应该`更新现有子树`还是`将其丢弃并挂载新子树`。 如果从 `render 返回的组件`与`前一个渲染中的组件`相同，则 React 通过将子树与新子树进行区分来`递归更新子树`。 如果它们不相等，则`完全卸载前一个子树`。

```js
render() {
    // 每次调用 render 函数都会创建一个新的 EnhancedComponent
    // EnhancedComponent1 !== EnhancedComponent2
    const EnhancedComponent = enhance(MyComponent);
    // 这将导致子树每次渲染都会进行卸载，和重新挂载的操作！
    return <EnhancedComponent />;
}
```

这不仅仅是性能问题 - `重新挂载`组件会导致该组件及其所有子组件的`状态丢失`。

缺点：

-   组件层级嵌套过多，不易渲染，不易调试
-   HOC 会劫持 props，必须严格规范，容易出现疏漏

<Alert type="warning">

Hooks 带来的最大好处：`逻辑复用`

在之前的 `Class 组件中`，难以实现逻辑的复用，必须借助于`高阶组件`。但是`高阶组件会产生冗余的组件节点，让调试变得困难。`

</Alert> -->

<!-- ## 合成事件

它是浏览器的原生事件的`跨浏览器包装器`。除兼容所有浏览器外，它还拥有和浏览器原生事件相同的接口，包括 `stopPropagation()` 和 `preventDefault()`。

当你需要使用浏览器的`底层事件`时，只需要使用 `nativeEvent` 属性来获取即可。合成事件与浏览器的原生事件不同，也不会直接映射到原生事件。 -->

## useMemo 缓存数据（vue computed）

`const memolized = useMemo(fn,deps);`

把“创建”函数和依赖项数组作为参数传入 useMemo，它仅会在某个依赖项改变时才重新计算 memoized 值。这种优化有助于避免在每次渲染时都进行高开销的计算。

记住，传入 useMemo 的函数会在渲染期间执行。请不要在这个函数内部执行不应该在渲染期间内执行的操作，诸如副作用这类的操作属于 useEffect 的适用范畴，而不是 useMemo。

如果没有提供依赖项数组，useMemo 在每次渲染时都会计算新的值。

## useCallback 缓存函数

`const memolizedCallback = useCallback(fn, deps);`

把内联回调函数及依赖项数组作为参数传入 useCallback，它将返回该回调函数的 memoized 版本，该回调函数仅在某个依赖项改变时才会更新。当你把回调函数传递给经过优化的并使用引用相等性去避免非必要渲染（例如 shouldComponentUpdate）的子组件时，它将非常有用。

useCallback(fn, deps) 相当于 useMemo(() => fn, deps)。

## React.lazy React.Suspense 基于路由的代码分割

`减少首屏加载文件的大小，提高首屏的渲染速度。`

```js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));

const App = () => (
    <Router>
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
            </Routes>
        </Suspense>
    </Router>
);
```

## umi 按需加载

常见使用场景：组件体积太大，不适合直接计入 bundle 中，以免影响`首屏加载速度`。例如：某组件 HugeA 包含巨大的实现 / 依赖了巨大的三方库，且该组件 HugeA 的使用不在首屏显示范围内，可被单独拆出。这时候，dynamic 就该上场了。

为了简化部署成本，`按需加载`功能默认是关闭的，你需要在使用之前先通过配置开启：

```js
export default {
    dynamicImport: {},
};
```

## splitChunks 分包减少整体尺寸

如果开了 `dynamicImport`，然后产物特别大，每个出口文件都包含了相同的依赖，比如 `antd`，可尝试通过 `splitChunks` 配置调整 `公共依赖的提取` 策略。

```js
export default {
    dynamicImport: {},
    chunks: ['vendors', 'umi'],
    chainWebpack: function (config, { webpack }) {
        config.merge({
            optimization: {
                splitChunks: {
                    chunks: 'all',
                    minSize: 30000,
                    minChunks: 3,
                    automaticNameDelimiter: '.',
                    cacheGroups: {
                        vendor: {
                            name: 'vendors',
                            test({ resource }) {
                                return /[\\/]node_modules[\\/]/.test(resource);
                            },
                            priority: 10,
                        },
                    },
                },
            },
        });
    },
};
```

## umi 快速刷新（Fast Refresh）

快速刷新（Fast Refresh）是 React 官方为 React Native 开发的`模块热替换（HMR）方案`，由于其核心实现与平台无关，同时也适用于 Web。

Fast Refresh 功能最大的特性是：`开发环境下，可以保持组件状态，同时编辑提供即时反馈`。

在配置文件加上 `fastRefresh: {}` 即可开启;

## umi mfsu（Module Federation Speed Up）

`mfsu` 是一种基于 webpack5 新特性 Module Federation (微前端) 的打包提速方案。核心原理是：`将应用的依赖构建为一个 Module Federation 的 remote 应用，以免去应用热更新时对依赖的编译`。

因此，`开启 mfsu 可以大幅减少热更新所需的时间`。在生产模式，也可以通过提前编译依赖，大幅提升部署效率。

## 编译提速

Umi 默认编译 node_modules 下的文件，带来一些收益的同时，也增加了额外的编译时间。如果不希望 node_modules 下的文件走 babel 编译，可通过以下配置减少 40% 到 60% 的编译时间。

```js
export default {
    nodeModulesTransform: {
        type: 'none',
        exclude: [],
    },
};
```

## externals

对于一些大尺寸依赖，比如图表库、antd 等，可尝试通过 `externals` 的配置引入相关 umd 文件，减少编译消耗。

比如 react 和 react-dom：

```js
export default {
    // 配置 external
    externals: {
        react: 'window.React',
        'react-dom': 'window.ReactDOM',
    },

    // 引入被 external 库的 scripts
    // 区分 development 和 production，使用不同的产物
    scripts:
        process.env.NODE_ENV === 'development'
            ? [
                  'https://gw.alipayobjects.com/os/lib/react/16.13.1/umd/react.development.js',
                  'https://gw.alipayobjects.com/os/lib/react-dom/16.13.1/umd/react-dom.development.js',
              ]
            : [
                  'https://gw.alipayobjects.com/os/lib/react/16.13.1/umd/react.production.min.js',
                  'https://gw.alipayobjects.com/os/lib/react-dom/16.13.1/umd/react-dom.production.min.js',
              ],
};
```
