---
toc: content
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

[点击在线查看 组件生命周期](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)

[vue 组件生命周期](https://cn.vuejs.org/images/lifecycle.png)
