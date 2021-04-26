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

## context

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

`shouldComponentUpdate` 简称 `SCU`，默认返回 `true`。

```js
shouldComponentUpdate(newProps, nextState) {
    if (nextState.count !== this.state.count) {
        return true; // 返回 true 可以渲染
    }
    return false;  // 不重复渲染
}
```

PureComponent 和 React.memo

不可变值:immutable.js
