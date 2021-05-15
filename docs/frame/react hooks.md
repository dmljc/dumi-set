---
toc: content
order: 4
---

# React Hooks

## 组件通信方式

-   父组件向子组件通信 (props)
-   子组件向父组件通信 (props+回调函数)
-   兄弟组件通信 (找到共同的父节点, 结合父子间通信方式进行通信)
-   跨级组件通信 (Context，Redux)

## Hook 是什么？

Hook 是 React 16.8 的新增特性。它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性。

Hook 是一些可以让你在函数组件里“钩入” React state 及生命周期等特性的函数。
hooks 使用规范：

-   Hook 不能在 class 组件中使用，只能在 `函数组件` 或者 `自定义组件` 中使用
-   只能用在顶层代码，不能在 `循环` 或者 `条件判断` 中使用：
    -   `无法保证调用顺序，hooks 严重依赖于调用顺序`
-   eslint-plugin-react-hooks 的 ESLint 插件来强制执行这两条规则

## useState

声明一个 state 和修改一个 state 的 hooks。

> 若声明多个 state 变量，不能使用条件和循环，为了保证每次渲染时它们的调用顺序是不变的。

```js
import React, { useState } from 'react';

function Example() {
    // 声明一个新的叫做 “count” 的 state 变量
    const [count, setCount] = useState(0);

    return (
        <>
            <p>{count}</p>
            <button onClick={() => setCount(count + 1)}>点击加一</button>
        </>
    );
}
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

useEffect 模拟 组件生命周期：

```js
// 模拟 componentDidMount 和 componentDidUpdate
useEffect(() => {
    console.log('发送 ajax 请求');
}); // 没有第二个参数

// 模拟 componentDidMount
useEffect(() => {
    console.log('加载完了');
}, []); // 第二个参数为[]

// 模拟 componentDidUpdate
useEffect(() => {
    console.log('更新');
}, [state]); // 第二个参数为依赖的state

// 模拟 componentWillUnMount
useEffect(() => {
    let timer = window.setInterval(() => {
        console.log(+new Date());
    }, 1000);

    // 【特别注意】
    // 此处不完全等于 componentWillUnMount
    // props 发生变化，即更新，也会执行结束监听
    // 准确的说：返回的函数会在下一次 effeft 执行之前 被执行

    return () => window.clearInterval(timer);
}, []);

// useEffect 依赖为 []时，组件销毁即执行 清除定时器
// useEffect 无依赖 或者 依赖为[a,b]时，组件更新时执行 清除定时器
// 即：下一次 effeft 执行之前会执行
```

## useContext

```js
const value = useContext(MyContext);
```

useContext 提供了上下文（context）的功能。接收一个 context 对象（React.createContext 的返回值）并返回该 context 的当前值。当前的 context 值由上层组件中距离当前组件最近的 <MyContext.Provider> 的 value prop 决定。

当组件上层最近的 <MyContext.Provider> 更新时，该 Hook 会触发重渲染，并使用最新传递给 MyContext provider 的 context value 值。即使祖先使用 `React.memo` 或 `shouldComponentUpdate`，也会在组件本身使用 `useContext` 时 `重新渲染`。 如果重渲染组件的开销较大，你可以 通过使用 `memoization` 来优化。

```js
const themes = {
    light: { foreground: '#000000', background: '#eeeeee' },
    dark: { foreground: '#ffffff', background: '#222222' },
};

const ThemeContext = React.createContext(themes.light);

function Parent() {
    return (
        <ThemeContext.Provider value={themes.dark}>
            <Child />
        </ThemeContext.Provider>
    );
}

function Child(props) {
    return (
        <div>
            <ThemedButton />
        </div>
    );
}

function ThemedButton() {
    const theme = useContext(ThemeContext);
    return (
        <button
            style={{ background: theme.background, color: theme.foreground }}
        >
            I am styled by theme context!
        </button>
    );
}
```

## useReducer

useState 的替代方案，主要用来处理复杂场景下的 state。它接收一个形如 (state, action) => newState 的 reducer，并返回当前的 state 以及与其配套的 dispatch 方法。

```js
const [state, dispatch] = useReducer(reducer, initialArg, init);
```

在某些场景下，`useReducer` 会比 `useState` 更适用，例如 state 逻辑较复杂且包含多个子值，或者下一个 state 依赖于之前的 state 等。并且，使用 useReducer 还能给那些会触发深更新的组件做性能优化，因为你可以向子组件传递 dispatch 而不是回调函数。

以下是用 reducer 重写 useState 一节的计数器示例：

```js
const initialState = { count: 0 };

function reducer(state, action) {
    switch (action.type) {
        case 'increment':
            return { count: state.count + 1 };
        case 'decrement':
            return { count: state.count - 1 };
        default:
            throw new Error();
    }
}

function Counter() {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <>
            Count: {state.count}
            <button onClick={() => dispatch({ type: 'decrement' })}> - </button>
            <button onClick={() => dispatch({ type: 'increment' })}> + </button>
        </>
    );
}
```

## 模拟 redux

接下来我们用 useReducer 和 useContext 来模拟 redux

```js
import React, { createContext, useReducer } from 'react';
export const GlobalContext = createContext({});

const initalState = {
    user: null,
    menu: [],
};

export const actions = {
    SET_USER: 'setUser',
};

const reducer = (state, { type, payload = null }) => {
    switch (type) {
        case actions.SET_USER:
            return {
                ...state,
                user: payload ? { ...payload } : null,
            };
        default:
            return state;
    }
};

export const ContextProvider = (props) => {
    const [store, dispatch] = useReducer(reducer, initalState);
    return (
        <GlobalContext.Provider value={{ store, dispatch }}>
            {props.children}
        </GlobalContext.Provider>
    );
};
```

在 App.js 入口文件中使用：

```js
import { ContextProvider } from '@/context/';
<ContextProvider>
    <BrowserRouter>{renderRoutes(routes)}</BrowserRouter>
</ContextProvider>;
```

在业务组件中 使用和修改：

```js
import { GlobalContext, actions } from '@/context/'

...

const { stroe, dispatch } = useContext(GlobalContext)

// 使用 store 中的数据

<div>{store.user}</div>

// ... 从接口获取更新后的数据 data... 使用 dispatch 修改 SET_USER类型的 data

dispatch({ type: actions.SET_USER, payload: data })
```

useReducer 能代替 redux 吗？？？？？

答案是：不能。

原因如下：

-   useReducer 是 useState 的代替方案，主要用来处理复杂的 state
-   useReducer 是 单个组件的状态管理，组件的通信还是需要 props
-   redux 是全局的状态管理，多组件共享数据

## 性能优化 useMemo

`useMemo 缓存数据、useCallback 缓存函数`

`useMemo 缓存数据、useCallback 缓存函数`

`useMemo 缓存数据、useCallback 缓存函数`

```js
const memoizedValue = useMemo(() => {
    computeExpensiveValue(a, b);
}, [a, b]);
```

把`创建函数`和`依赖项数组`作为参数传入 `useMemo`，它仅会在某个`依赖项改变时`才重新计算 `memoized `值。这种优化有助于避免在每次渲染时都进行高开销的计算。`类似于 vue 中的计算属性 computed。`

记住，传入 `useMemo` 的函数会在`渲染期间执行`。请不要在这个函数内部执行与渲染无关的操作，诸如副作用这类的操作属于 `useEffect` 的适用范畴，而不是 useMemo。

如果没有提供依赖项数组，useMemo 在每次渲染时都会计算新的值。

**可以把 useMemo 作为性能优化的手段，但不要把它当成语义上的保证。** 将来，React 可能会选择“遗忘”以前的一些 memoized 值，并在下次渲染时重新计算它们。

## 性能优化 useCallback

```js
const memoizedCallback = useCallback(() => {
    doSomething(a, b);
}, [a, b]);
```

把内联`回调函数`及`依赖项数组`作为`参数`传入 `useCallback`，返回一个 `memoized 回调函数`，该回调函数仅在某个`依赖项改变时`，才会更新，`避免非必要渲染`（例如 `shouldComponentUpdate`）的子组件时，它将非常有用。

**useCallback(fn, deps) 相当于 useMemo(() => fn, deps)。**

## useRef

```js
const refContainer = useRef(initialValue);
```

`useRef` 返回一个可变的 `ref` 对象，其 `.current` 属性被初始化为传入的参数（initialValue）。返回的 ref 对象在组件的整个生命周期内保持不变。

一个常见的用例便是`命令式地访问子组件`：

```js
import React, { useRef } from 'react';

function TextInputWithFocusButton() {
    const inputEl = useRef(null);
    const onButtonClick = () => {
        // `current` 指向已挂载到 DOM 上的文本输入元素
        inputEl.current.focus();
    };
    return (
        <>
            <input ref={inputEl} type="text" />
            <button onClick={onButtonClick}>Focus the input</button>
        </>
    );
}
```

本质上，`useRef` 就像是可以在其 `.current` 属性中保存一个可变值的“盒子”。

你应该熟悉 ref 这一种访问 DOM 的主要方式。如果你将 ref 对象以 `<div ref={myRef} />` 形式传入组件，则无论该节点如何改变，React 都会将 ref 对象的 .current 属性设置为相应的 DOM 节点。

然而，`useRef()` 比 `ref` 属性更有用。它可以很方便地`保存任何可变值`，其类似于在 class 中使用实例字段的方式。

这是因为它创建的是一个普通 Javascript 对象。而 useRef() 和自建一个 {current: ...} 对象的唯一区别是，useRef 会在每次渲染时返回同一个 ref 对象。

请记住，当 ref 对象内容发生变化时，useRef 并不会通知你。变更 .current 属性不会引发组件重新渲染。如果想要在 React 绑定或解绑 DOM 节点的 ref 时运行某些代码，则需要使用回调 ref (即 useCallback())来实现。

## useImperativeHandle

```js
useImperativeHandle(ref, createHandle, [deps]);
```

`useImperativeHandle` 可以让你在使用 `ref` 时`自定义暴露给父组件的实例值`。在大多数情况下，应当避免使用 ref 这样的命令式代码。`useImperativeHandle` 应当与 `forwardRef` 一起使用：

```js
import React, { useImperativeHandle, forwardRef} from 'react'

function FancyInput(props, ref) {
    const inputRef = useRef();
    useImperativeHandle(ref, () => ({
        focus: () => {
            inputRef.current.focus();
        }
    }));
    return <input ref={inputRef} ... />;
}
FancyInput = forwardRef(FancyInput);
```

在本例中，渲染 `<FancyInput ref={inputRef} />` 的父组件可以调用 `inputRef.current.focus()`。
