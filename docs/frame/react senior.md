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

## 性能优化

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

## PureComponent

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

## React.memo

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

## createElement()

```js
React.createElement(
    type, // 标签类型
    [props], // 标签属性
    [...children], // 标签子元素
);
```

创建并返回指定类型的新 `React 元素`。其中的类型参数既可以是标签名字符串（如 `'div'` 或 `'span'`），也可以是 `React 组件` 类型 （class 组件或函数组件），或是 `React fragment` 类型。

使用 `JSX `编写的代码将会`被转换成`使用 `React.createElement()` 的形式。

[Babel 在线把 JSX 转为 React.createElement() 的形式](https://www.babeljs.cn/repl#?browsers=defaults%2C%20not%20ie%2011%2C%20not%20ie_mob%2011&build=&builtIns=false&spec=false&loose=false&code_lz=GYVwdgxgLglg9mABAdQKYBsJwLaoBQAOATnAQM4CUiA3gFCKJGpQhFIA8AFgIwB8AEhnRwANDWKkyAOjABDXAF92Aeh68A3LQW1a7ACYwAbohh6AvACIARnAAeF3vUTs0mHKkRzclgF7AIFogIAMLoMBAA1mbUCPyyYHroqArKjioGho5AA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=env%2Creact%2Cstage-2&prettier=true&targets=&version=7.13.17&externalPlugins=)

## React.Fragment
