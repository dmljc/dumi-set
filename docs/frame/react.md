---
toc: content
---

# React

## 组件通信方式

-   父组件向子组件通信 (props)
-   子组件向父组件通信 (props+回调函数)
-   兄弟组件通信 (找到共同的父节点, 结合父子间通信方式进行通信)
-   跨级组件通信 (Context，Redux)

## Hook 是什么？

Hook 是 React 16.8 的新增特性。它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性。

Hook 是一些可以让你在函数组件里“钩入” React state 及生命周期等特性的函数。Hook 不能在 class 组件中使用 —— 这使得你不使用 class 也能使用 React。

## useState

声明一个 state 和修改一个 state 的 hooks。

> 若声明多个 state 变量，不能使用条件和循环，为了保证每次渲染时它们的调用顺序是不变的。

```js
// 声明一个叫 “count” 的 state 变量。
const [count, setCount] = useState(0);
```

**调用 useState 方法的时候做了什么?**

它定义一个 “state 变量”。我们的变量叫 count，但是我们可以叫他任何名字。这是一种在函数调用时 `保存变量的方式`，它与 class 里面的 this.state 提供的功能完全相同。一般来说，在函数退出后变量就会”消失”，而 state 中的变量会被 React 保留。

**useState 需要哪些参数？**

useState() 方法里面唯一的参数就是初始 state。不同于 class 的是，我们可以按照需要使用数字或字符串对其进行赋值，而不一定是对象。

**useState 方法的返回值是什么？**

useState 会返回 `当前 state` 以及 `更新 state 的函数`。这与 class 里面 this.state.count 和 this.setState 类似，唯一区别就是你需要 `成对的获取它们`。

## useEffect

跟 class 组件中的 `componentDidMount`、`componentDidUpdate` 和 `componentWillUnmount` 具有相同的用途，只不过被合并成了一个 API。

```js
useEffect(() => {
    const subscription = props.source.subscribe();
    return () => {
        subscription.unsubscribe();
    };
}, [props.source]);
```

通常，组件卸载时需要清除 effect 创建的诸如订阅或计时器 ID 等资源。要实现这一点，useEffect 函数需返回一个清除函数。

为防止`内存泄漏`，清除函数会在组件`卸载前`执行。如果组件多次渲染，则**在执行下一个 effect 之前，上一个 effect 就已被清除。**

如果想执行`只运行一次`的 effect（仅在组件`挂载`和`卸载`时执行），可以传递一个`空数组` 作为第二个参数(effect 内部的 props 和 state 就会一直`持有其初始值`)。这就告诉 React 你的 effect 不依赖于 props 或 state 中的任何值，所以它永远都`不需要重复执行`。

## useContext

## useReducer

## useCallback

## useMemo

## useRef

## useImperativeHandle

## useLayoutEffect

## useDebugValue
