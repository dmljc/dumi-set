---
toc: content
order: 5
---

# React 基础知识

## 事件 bind(this)

为什么事件要 bind(this) 呢？

因为：this 在函数执行时才能确定，函数定义时无法确定，所以，如果事件不 bind(this)，会因找不到 this 而报错。

## setState 的特性

-   不可变值
-   可能是异步更新、也可能是同步更新
-   可能会被合并

<!-- ### 不可变值 -->

<!-- ```js
// 定义state
this.state = {
    count: 0,
    list: [1,2,3],
    obj: {}
}

// 不可变值：基本类型。不要直接修改 state。
this.state.count++

// 正确修改state方式
this.setState({
    count: this.state.count + 1
})

// 不可变值：数组。不能直接对数组进行push、pop、splice 操作。

// 正确方式如下
this.setState({
    list: this.state.list.concat(100)   // 往数组里添加一个元素100
    // 或者
    list: [...this.state.list, 100]     // 往数组里添加一个元素100
})

// 不可变值：对象。不能直接 this.state.obj = XXX 属性设置。
// 正确方式如下：

this.setState({
    obj: { ...this.state.obj, a: 100 }
    // 或者
    obj: Object.assign({}, this.state.obj, { a: 100 })
})
``` -->
<!--
### 同步还是异步

可能是 `同步更新` 也可能是 `异步更新`。 -->

**直接 setState 是 异步 更新的：**

```js
this.setState({
    count: this.state.count + 1,
});
console.log('count', this.state.count);
// 异步更新，拿不到最新值，
// 因为 setState 之后没有立马去渲染页面，而是异步渲染页面，所以，拿不到最新值。

// 解决方案是：在 setState 的第二个参数(回调函数)中获取最新值
this.setState(
    {
        count: this.state.count + 1,
    },
    () => {
        // 类似 vue 的 $nextTick
        console.log('count by callback', this.state.count);
    },
);
```

**在 setTimeout 中 setState 是同步更新的，可以获取到 count 的最新值**

```js
setTimeout(() => {
    this.setState({
        count: this.state.count + 1,
    });
    console.log('count in setTimeout', this.state.count);
}, 0);
```

**在自定义的 DOM 事件中，setState 也是同步更新的，可以获取到 count 的最新值**

```js
document.body.addEventListener('click', () => {
    this.setState({
        count: this.state.count + 1,
    });
    console.log('count in body event', this.state.count);
});
```

## 更新前可能会被合并

**state 异步更新的话，若传入对象 更新前会被合并；传入函数，则不会被合并**

<!-- ```js
// 传入对象，会被合并(类似 Object.assign) 执行结果只一次 +1
this.setState({
    count: this.state.count + 1,
});
this.setState({
    count: this.state.count + 1,
});
this.setState({
    count: this.state.count + 1,
});

// 传入函数，不会被合并，因为函数本身是不可以合并的。执行结果是 +3
this.setState((prevState, props) => {
    return {
        count: prevState.count + 1,
    };
});
this.setState((prevState, props) => {
    return {
        count: prevState.count + 1,
    };
});
this.setState((prevState, props) => {
    return {
        count: prevState.count + 1,
    };
});
``` -->


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


## 生命周期

### 挂载

当组件实例被创建并插入 DOM 中时，其生命周期调用顺序如下：

-   **constructor**() <== UNSAFE_componentWillMount <== componentWillMount() // 初始化 state
-   static getDerivedStateFromProps(props, state) // 新增 不常用 是否更新内容
-   **render()** // 根据 state 和 props 触发页面的更新渲染。
-   **componentDidMount()** // 插入 DOM 树中 立即调用，适合 ajax 请求

### 更新

当组件的 props 或 state 发生变化时会触发更新。组件更新的生命周期调用顺序如下：

-   static getDerivedStateFromProps(props, state) // 新增 不常用
-   shouldComponentUpdate(nextProps, nextState) // SCU 因性能优化而存在,不建议深层比较
-   **render()**
-   getSnapshotBeforeUpdate(prevProps, prevState) <== UNSAFE_componentWillUpdate // 新增 不常用
-   **componentDidUpdate()** <== UNSAFE_componentWillReceiveProps // 在更新后会被立即调用，此处对 DOM 进行操

### 卸载

当组件从 DOM 中移除时会调用如下方法：

-   **componentWillUnmount()**

会在组件`卸载及销毁之前`直接调用。在此方法中执行必要的清理操作，例如，`清除 timer`，`取消网络请求`或清除在 `componentDidMount()` 中创建的`订阅`等。

### 错误处理

当渲染过程，生命周期，或子组件的构造函数中抛出错误时，会调用如下方法：

-   static getDerivedStateFromError() // 新增 不常用
-   componentDidCatch()

官方为什么改变生命周期？？

可能原因是：UNSAFE 这里并不是示意不平安的意思，它只是不倡议持续应用，并示意应用这些生命周期的代码可能在将来的 React 版本（目前 React17 还没有齐全破除）`存在缺点`，如 React `Fiber 异步渲染`的呈现。

<!-- ### getDerivedStateFromProps

```js
static getDerivedStateFromProps(props, state)
```

会在调用 `render` 方法之前调用，并且在`初始挂载`及后续`更新`时都会被调用。它应返回一个对象来更新 `state`，如果返回 `null` 则`不更新`任何内容。

### getSnapshotBeforeUpdate

```js
getSnapshotBeforeUpdate(prevProps, prevState);
``` 

在`最近一次渲染输出（提交到 DOM 节点）之前调用`。它使得组件能在发生更改之前从 DOM 中捕获一些信息（例如，滚动位置）。此生命周期方法的任何返回值将作为参数传递给 componentDidUpdate()。
-->
[点击在线查看 组件生命周期](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)

[vue 组件生命周期](https://cn.vuejs.org/images/lifecycle.png)
