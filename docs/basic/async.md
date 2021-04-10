---
toc: menu
---

# 异步发展史

## 回调函数

```js
ajax('XXX1', () => {
    // callback 函数体
    ajax('XXX2', () => {
        // callback 函数体
        ajax('XXX3', () => {
            // callback 函数体
        });
    });
});
```

优点：解决了同步的问题。

缺点：回调地狱，不能用 try catch 捕获错误，不能 return;

## Promise

Promise 就是为了解决 callback 的问题而产生的。

Promise 实现了链式调用，也就是说每次 then 后返回的都是一个全新 Promise，如果我们在 then 中 return ，return 的结果会被 Promise.resolve() 包装。

```js
ajax('XXX1')
    .then((res) => {
        // 操作逻辑
        return ajax('XXX2');
    })
    .then((res) => {
        // 操作逻辑
        return ajax('XXX3');
    })
    .then((res) => {
        // 操作逻辑
    })
    .catch((err) => {
        // 捕获异常信息
    });
```

优点：解决了回调地狱的问题。

缺点：无法取消 Promise ，错误需要通过回调函数来捕获。

## Generator

特点：可以控制函数的执行，可以配合 co 函数库使用。

```js
function* fetch() {
    yield ajax('XXX1', () => {});
    yield ajax('XXX2', () => {});
    yield ajax('XXX3', () => {});
}
let it = fetch();
let result1 = it.next();
let result2 = it.next();
let result3 = it.next();
```

PS:虽然可以控制函数的执行但是不够优雅和简洁。

## Async/await

```js
async function test() {
    // 以下代码没有依赖性的话，完全可以使用 Promise.all 的方式
    // 如果有依赖性的话，其实就是解决回调地狱的例子了
    await fetch('XXX1');
    await fetch('XXX2');
    await fetch('XXX3');
}
```

优点：异步的终极解决方案 代码清晰，不用像 Promise 写一大堆 then 链，处理了回调地狱的问题。

缺点：await 将异步代码改造成同步代码，如果多个异步操作没有依赖性使用 await 会导致性能的降低。

PS：其实 await 就是 generator 加上 Promise 的语法糖，且内部实现了自动执行 generator。
