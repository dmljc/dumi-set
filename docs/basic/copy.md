---
toc: content
---

# 深浅拷贝

```js
let a = {
    age: 1;
}
let b = a;
a.age = 2;
console.log(b.age); // 2
```

从上述例子中我们可以发现，如果给一个变量赋值一个对象，那么两者的值会是同一个引用，其中一方改变，另一方也会相应改变。

通常在开发中我们不希望出现这样的问题，我们可以使用浅拷贝来解决这个问题。

## 浅拷贝

-   首先可以通过 js 循环遍历实现浅拷贝

```js
// 思路：遍历对象，然后把属性和属性值都放在一个新的对象即可
var shallowCopy = function (obj) {
    // 临界点判空处理（只拷贝对象）
    if (typeof obj !== 'object') return;
    // 根据obj的类型判断是新建一个数组还是对象
    var newObj = obj instanceof Array ? [] : {};
    // 遍历obj，并且判断是obj的属性才拷贝
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            newObj[key] = obj[key];
        }
    }
    return newObj;
};
```

-   然后，可以通过 `Object.assign` 来解决这个问题

```js
let a = {
    age: 1;
}
let b = Object.assign({}, a);
a.age = 2;
console.log(b.age); // 1
```

-   当然我们也可以通过展开运算符（…）来解决

```js
let a = {
    age: 1;
}
let b = { ...a }
a.age = 2;
console.log(b.age); // 1
```

通常浅拷贝就能解决大部分问题了，但是当我们遇到如下情况就需要使用到深拷贝了

```js
let a = {
    age: 1,
    jobs: {
        first: 'FE',
    },
};
let b = { ...a };
a.jobs.first = 'native';
console.log(b.jobs.first); // native
```

浅拷贝只解决了第一层的问题，如果接下去的值中还有对象的话，那么就又回到刚开始的话题了，两者享有相同的引用。要解决这个问题，我们需要引入深拷贝。

[MDN 关于 Object.assign 的详细解释](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)

## 深拷贝

-   首先也可以通过 js 循环遍历实现深拷贝

```js
// 思路：拷贝的时候判断一下属性值的类型，如果是对象，递归调用深拷贝函数即可
var deepCopy = function (obj) {
    if (typeof obj !== 'object') return;
    var newObj = obj instanceof Array ? [] : {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            newObj[key] =
                typeof obj[key] === 'object' ? deepCopy(obj[key]) : obj[key];
        }
    }
    return newObj;
};
// 尽管使用深拷贝会完全的克隆一个新对象，不会产生副作用，但是深拷贝因为使用递归，
// 性能会不如浅拷贝，在开发中，还是要根据实际情况进行选择。
```

通常可以通过 `JSON.parse(JSON.stringify(object))` 来解决

```js
let a = {
    age: 1,
    jobs: {
        first: 'FE',
    },
};
let b = JSON.parse(JSON.stringify(a));
a.jobs.first = 'native';
console.log(b.jobs.first); // FE
```

但是该方法也是有局限性的：

-   会忽略 `undefined`
-   会忽略 `symbol`
-   不能序列化函数
-   不能解决循环引用的对象

```js
let obj = {
    a: 1,
    b: {
        c: 2,
        d: 3,
    },
};
obj.c = obj.b;
obj.e = obj.a;
obj.b.c = obj.c;
obj.b.d = obj.b;
obj.b.e = obj.b.c;
let newObj = JSON.parse(JSON.stringify(obj));
console.log(newObj);
```

如果你有这么一个循环引用对象，你会发现你不能通过该方法深拷贝

在遇到函数、 `undefined` 或者 `symbol` 的时候，该对象也不能正常的序列化

```js
let a = {
    age: undefined,
    sex: Symbol('male'),
    jobs: function () {},
    name: 'yck',
};
let b = JSON.parse(JSON.stringify(a));
console.log(b); // {name: "yck"}
```

你会发现在上述情况中，该方法会忽略掉函数和 `undefined` 。

但是在通常情况下，复杂数据都是可以序列化的，所以这个函数可以解决大部分问题，并且该函数是内置函数中处理深拷贝性能最快的。当然如果你的数据中含有以上三种情况下，可以使用 [lodash 的深拷贝函数](https://lodash.com/docs#cloneDeep) 。
