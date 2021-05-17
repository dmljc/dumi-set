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

### 不可变值

```js
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
```

### 同步还是异步

可能是 `同步更新` 也可能是 `异步更新`。

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

### 更新前可能会被合并

**state 异步更新的话，若传入对象 更新前会被合并；传入函数，则不会被合并**

```js
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
```

## 生命周期

### constructor

在 React `组件挂载之前`，会调用它的构造函数，初始化 state。

在为 React.Component `子类实现构造函数时`，应在其他语句之前前调用 `super(props)`。
否则，this.props 在构造函数中可能会出现 this 未定义。

**如果不初始化 state 或不进行方法绑定，则不需要为 React 组件实现构造函数。**

### componentWillMount

`UNSAFE_componentWillMount` 在`挂载之前`被调用。
它在 render() 之前调用。因此在此方法中同步调用 `setState()` 不会触发额外渲染。

### componentDidMount

会在组件`挂载后`（插入 DOM 树中）立即调用。依赖于 DOM 节点的初始化应该放在这里。
如需通过`网络请求`获取数据，此处是实例化请求的好地方。

这个方法是比较适合`添加订阅`的地方。如果添加了订阅，请不要忘记在 `componentWillUnmount()` 里`取消订阅`。

直接调用 `setState()`。它将`触发额外渲染`，但此渲染会发生在`浏览器更新屏幕之前`。
**如此保证了即使在 render() 两次调用的情况下，用户也不会看到中间状态。**

### componentWillReceiveProps

只会在组件的 `props 更新时调用`。调用 this.setState() 通常不会触发 `UNSAFE_componentWillReceiveProps()`。

### shouldComponentUpdate

当 `props 或 state 发生变化时`，会在`渲染执行之前`被调用。返回值默认为 true。**首次渲染或使用 forceUpdate() 时不会调用该方法。**

此方法`仅作为性能优化`的方式而存在。不建议在进行深层比较或使用 `JSON.stringify()`。这样非常影响效率，且会损害性能。

### componentWillUpdate

### componentDidUpdate

### componentWillUnmount

```js
class Parent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: 0 };
        this.setNewNumber = this.setNewNumber.bind(this);
        console.log('111===constructor');
    }

    setNewNumber() {
        this.setState({ data: this.state.data + 1 });
    }
    render() {
        return (
            <div>
                <button onClick={this.setNewNumber}>INCREMENT</button>
                <Child myNumber={this.state.data}></Child>
            </div>
        );
    }
}

class Child extends React.Component {
    // UNSAFE_componentWillMount
    componentWillMount() {
        console.log('222===Component WILL MOUNT!');
    }
    componentDidMount() {
        console.log('333===Component DID MOUNT!');
    }
    // UNSAFE_componentWillReceiveProps
    componentWillReceiveProps(newProps) {
        console.log('444===Component WILL RECEIVE PROPS!');
    }
    shouldComponentUpdate(newProps, newState) {
        console.log('555===shouldComponentUpdate');
        return true;
    }
    // UNSAFE_componentWillUpdate
    componentWillUpdate(nextProps, nextState) {
        console.log('666===Component WILL UPDATE!');
    }
    componentDidUpdate(prevProps, prevState) {
        console.log('777===Component DID UPDATE!');
    }
    componentWillUnmount() {
        console.log('888===Component WILL UNMOUNT!');
    }

    render() {
        return (
            <div>
                <h3>{this.props.myNumber}</h3>
            </div>
        );
    }
}
```

### 过时的生命周期方法

以下生命周期方法标记为`过时`。这些方法仍然有效，但不建议在新代码中使用它们。该名称将继续使用至 `React 17`。可以使用 `rename-unsafe-lifecycles codemod` 自动更新你的组件。

```js
UNSAFE_componentWillMount;
UNSAFE_componentWillReceiveProps;
UNSAFE_componentWillUpdate;
```

[点击在线查看 组件生命周期](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)

[vue 组件生命周期](https://cn.vuejs.org/images/lifecycle.png)
