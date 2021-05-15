---
toc: content
order: 3
---

# React 高级特性

## portals

通常组件会默认按照既定层次嵌套渲染。 那么，如何将组件渲染到父组件以外呢?

`Portal` 提供了一种将`子节点`渲染到存在于`父组件以外`的 `DOM` 节点的优秀的方案。

```js
ReactDOM.createPortal(child, container);
```

第一个参数（child）是任何可渲染的 React 子元素，例如一个元素或字符串。第二个参数（container）是一个 DOM 元素。

一个 `portal` 的典型用例是当`父组件`有 `overflow: hidden` 或 `z-index` 样式时，但你需要子组件能够在视觉上“跳出”其容器。例如，对话框、悬浮卡以及提示框：

## 异步加载组件

React 16.6 新增了 `<Suspense>`组件，让你可以“等待”目标代码加载，并且可以直接指定一个加载的界面（像是个 loading），让它在用户等待的时候显示：

```js
const ProfilePage = React.lazy(() => import('./ProfilePage')); // 懒加载

// 在 ProfilePage 组件处于加载阶段时显示一个 loading
<Suspense fallback={<loading />}>
    <ProfilePage />
</Suspense>;
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

## immutable.js

彻底拥抱`不可变值`，`基于共享数据(不是深拷贝)`，`性能好`。但是有一定的学习和迁移成本，请按需使用。

```js
const map1 = Immutable.Map({ a: 1, b: 2, c: 3 });
const map2 = map1.set('b', 50);
map1.get('b'); // 2
map2.get('b'); // 50
```

## 性能优化 memo

```js
const MyComponent = React.memo(function MyComponent(props) {
    /* 使用 props 渲染 */
});
```

`React.memo` 为高阶组件。

如果你的组件在相同 `props` 的情况下`渲染相同的结果`，那么你可以通过将其包装在 `React.memo` 中调用，以此`通过记忆组件渲染结果的方式`来提高组件的性能表现。这意味着在这种情况下，React 将**跳过渲染组件的操作并直接复用最近一次渲染的结果。**

`React.memo` 仅检查 `props` 变更。如果`函数组件`被 `React.memo` 包裹，且其实现中拥有 `useState`，`useReducer` 或 `useContext` 的 `Hook`，当 `context` 发生变化时，它仍会`重新渲染`。

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

此方法仅作为`性能优化`的方式而存在。但请不要依赖它来“阻止”渲染，因为这会产生 bug。

与 class 组件中 `shouldComponentUpdate()` 方法不同的是，如果 `props` 相等，`areEqual` 会返回 `true`；如果 props 不相等，则返回 false。这与 `shouldComponentUpdate` 方法的返回值相反。

</Alert>

## JSX

`JSX` 的本质是 `createElement()`

```js
React.createElement(
    type, // 标签类型
    [props], // 标签属性
    [...children], // 标签子元素
);
```

创建并返回指定类型的新 `React 元素`。其中的类型参数既可以是标签名字符串（如 `'div'` 或 `'span'`），也可以是 `React 组件` 类型 （class 组件或函数组件），或是 `React fragment` 类型。

使用 `JSX `编写的代码将会`被转换成`使用 `React.createElement()` 的形式。

[在线的 Babel 编译器](https://www.babeljs.cn/repl#?browsers=defaults%2C%20not%20ie%2011%2C%20not%20ie_mob%2011&build=&builtIns=false&spec=false&loose=false&code_lz=GYVwdgxgLglg9mABAdQKYBsJwLaoBQAOATnAQM4CUiA3gFCKJGpQhFIA8AFgIwB8AEhnRwANDWKkyAOjABDXAF92Aeh68A3LQW1a7ACYwAbohh6AvACIARnAAeF3vUTs0mHKkRzclgF7AIFogIAMLoMBAA1mbUCPyyYHroqArKjioGho5AA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=env%2Creact%2Cstage-2&prettier=true&targets=&version=7.13.17&externalPlugins=)

## React.Fragment

## 高阶组件

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

## 合成事件

它是浏览器的原生事件的`跨浏览器包装器`。除兼容所有浏览器外，它还拥有和浏览器原生事件相同的接口，包括 `stopPropagation()` 和 `preventDefault()`。

当你需要使用浏览器的`底层事件`时，只需要使用 `nativeEvent` 属性来获取即可。合成事件与浏览器的原生事件不同，也不会直接映射到原生事件。
