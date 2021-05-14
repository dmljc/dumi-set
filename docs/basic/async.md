---
toc: content
order: 7
---

# 异步发展史

## 回调函数

```js
ajax(url, () => {
    // 处理逻辑
    ajax(url1, () => {
        // 处理逻辑
        ajax(url2, () => {
            // 处理逻辑
        });
    });
});
```

优点：解决了同步的问题。

缺点：

-   回调地狱: 嵌套函数存在耦合性，一旦有所改动，就会牵一发而动全身
-   不能用 try catch 捕获错误
-   不能 return

## Generator

可以控制函数的执行，但是一般见到的不多，一般会配合 co 函数库使用。(co 函数库是一个小工具，用于 Generator 函数的自动执行)。

Generator 函数解决回调地狱的问题，可以把之前的回调地狱例子改写为如下代码：

```js
function* fetch() {
    yield ajax(url, () => {});
    yield ajax(url1, () => {});
    yield ajax(url2, () => {});
}
let it = fetch();
let result1 = it.next();
let result2 = it.next();
let result3 = it.next();
```

**Generator 虽然可以控制函数的执行但是不够优雅和简洁。**

## Promise

> 涉及面试题：Promise 的特点是什么，分别有什么优缺点？什么是 Promise 链？
> Promise 构造函数执行和 then 函数执行有什么区别？

Promise 翻译过来就是承诺的意思，这个承诺会在未来有一个确切的答复，并且该承诺有三种状态，分别是：

-   等待中（pending）
-   完成了 （resolved）
-   拒绝了（rejected）

这个承诺一旦从等待状态变成为其他状态就永远不能更改状态了，也就是说一旦状态变为 resolved 后，就不能再次改变

```js
new Promise((resolve, reject) => {
    resolve('success');
    // 无效
    reject('reject');
});
```

当我们在构造 Promise 的时候，构造函数内部的代码是立即执行的

```js
new Promise((resolve, reject) => {
    console.log('new Promise');
    resolve('success');
});
console.log('finifsh');
// new Promise -> finifsh
```

Promise 实现了链式调用，也就是说每次调用 then 之后返回的都是一个 Promise，并且是一个全新的 Promise，原因也是因为状态不可变。如果你在 then 中 使用了 return，那么 return 的值会被 Promise.resolve() 包装

```js
Promise.resolve(1)
    .then((res) => {
        console.log(res); // => 1
        return 2; // 包装成 Promise.resolve(2)
    })
    .then((res) => {
        console.log(res); // => 2
    });
```

当然了，Promise 也很好地解决了回调地狱的问题，可以把之前的回调地狱例子改写为如下代码：

```js
ajax(url)
    .then((res) => {
        console.log(res);
        return ajax(url1);
    })
    .then((res) => {
        console.log(res);
        return ajax(url2);
    })
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log(err);
    });
```

Promise 缺点如下:

-   无法取消 Promise
-   错误需要通过回调函数捕获

## async await

一个函数如果加上 async ，那么该函数就会返回一个 Promise， 就是将返回值使用 Promise.resolve() 包裹了下，和 then 中处理返回值一样，并且 await 只能配套 async 使用。

```js
async function test() {
    return '1';
}
console.log(test()); // -> Promise {<resolved>: "1"}
```

```js
async function test() {
    // 以下代码没有依赖性的话，完全可以使用 Promise.all 的方式
    // 如果有依赖性的话，其实就是解决回调地狱的例子了
    await fetch(url);
    await fetch(url1);
    await fetch(url2);
}
```

优点：异步的终极解决方案 代码清晰，不用像 Promise 写一大堆 then 链，处理了回调地狱的问题。

缺点：await 将异步代码改造成同步代码，如果多个异步操作没有依赖性使用 await 会导致性能的降低。

PS：其实 await 就是 generator 加上 Promise 的语法糖，且内部实现了自动执行 generator。

## 实现一个 promise

实现一个简易版 Promise，首先我们先来搭建构建函数的大体框架

```js
const PENDING = 'pending';
const RESOLVED = 'resolved';
const REJECTED = 'rejected';

function MyPromise(fn) {
    const that = this;
    that.state = PENDING;
    that.value = null;
    that.resolvedCallbacks = [];
    that.rejectedCallbacks = [];
    // 待完善 resolve 和 reject 函数
    // 待完善执行 fn 函数
}
```

-   首先我们创建了三个常量用于表示状态，对于经常使用的一些值都应该通过常量来管理，便于开发及后期维护
-   在函数体内部首先创建了常量 that，因为代码可能会异步执行，用于获取正确的 this 对象
-   一开始 Promise 的状态应该是 pending
-   value 变量用于保存 resolve 或者 reject 中传入的值
-   resolvedCallbacks 和 rejectedCallbacks 用于保存 then 中的回调，因为当执行完 Promise 时状态可能还是等待中，这时候应该把 then 中的回调保存起来用于状态改变时使用

接下来我们来完善 resolve 和 reject 函数，添加在 MyPromise 函数体内部

```js
function resolve(value) {
    if (that.state === PENDING) {
        that.state = RESOLVED;
        that.value = value;
        that.resolvedCallbacks.map((cb) => cb(that.value));
    }
}

function reject(value) {
    if (that.state === PENDING) {
        that.state = REJECTED;
        that.value = value;
        that.rejectedCallbacks.map((cb) => cb(that.value));
    }
}
```

这两个函数代码类似，就一起解析了

-   首先两个函数都得判断当前状态是否为等待中，因为规范规定只有等待态才可以改变状态
-   将当前状态更改为对应状态，并且将传入的值赋值给 value
-   遍历回调数组并执行

完成以上两个函数以后，我们就该实现如何执行 Promise 中传入的函数了

```js
try {
    fn(resolve, reject);
} catch (e) {
    reject(e);
}
```

-   实现很简单，执行传入的参数并且将之前两个函数当做参数传进去
-   要注意的是，可能执行函数过程中会遇到错误，需要捕获错误并且执行 reject 函数

最后我们来实现较为复杂的 then 函数

```js
MyPromise.prototype.then = function (onFulfilled, onRejected) {
    const that = this;
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (v) => v;
    onRejected = typeof onRejected === 'function' ? onRejected : (r) => throw r;
    if (that.state === PENDING) {
        that.resolvedCallbacks.push(onFulfilled);
        that.rejectedCallbacks.push(onRejected);
    }
    if (that.state === RESOLVED) {
        onFulfilled(that.value);
    }
    if (that.state === REJECTED) {
        onRejected(that.value);
    }
};
```

首先判断两个参数是否为函数类型，因为这两个参数是可选参数

当参数不是函数类型时，需要创建一个函数赋值给对应的参数，同时也实现了透传，比如如下代码

```js
// 该代码目前在简单版中会报错
// 只是作为一个透传的例子
Promise.resolve(4)
    .then()
    .then((value) => console.log(value));
```

接下来就是一系列判断状态的逻辑，当状态不是等待态时，就去执行相对应的函数。如果状态是等待态的话，就往回调函数中 push 函数，比如如下代码就会进入等待态的逻辑

```js
new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve(1);
    }, 0);
}).then((value) => {
    console.log(value);
});
```

以上就是简单版 Promise 实现逻辑
