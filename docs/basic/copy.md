---
toc: content
order: 4
---

# 深浅拷贝

> 什么是深/浅拷贝，他们跟赋值有何区别？深/浅拷贝的实现方式有几种？

## 赋值和浅/深拷贝的区别 

- 当我们把一个对象赋值给一个新的变量时，`赋的其实是该对象的在栈中的地址，而不是堆中的数据`。也就是两个对象指向的是同一个存储空间，无论哪个对象发生改变，其实都是改变的存储空间的内容，因此，两个对象是联动的。
- 浅拷贝是创建一个新对象，这个对象有着原始对象属性值的一份精确拷贝。如果属性是基本类型，拷贝的就是基本类型的值，如果属性是引用类型，拷贝的就是内存地址 ，所以如果其中一个对象改变了这个地址，就会影响到另一个对象。
- 深拷贝是将一个对象从内存中完整的拷贝一份出来,从堆内存中开辟一个新的区域存放新对象,且修改新对象不会影响原对象。
















<!-- 

## 拷贝出现的背景

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

![](/images/basic/shallow.png)

> 创建一个新对象，这个对象有着原始对象属性值的一份精确拷贝。如果属性是基本类型，拷贝的就是基本类型的值，如果属性是引用类型，拷贝的就是内存地址 ，所以如果其中一个对象改变了这个地址，就会影响到另一个对象。

`数组浅拷贝 concat、slice` `Object.assign`、`展开运算符 …`

-   可以通过 js 循环遍历实现浅拷贝

```js
// 思路：遍历对象，然后把属性和属性值都放在一个新的对象即可

function shallowCopy(obj) {
    // 临界点判空处理（只拷贝对象）
    if (typeof obj !== 'object') return;

    // 根据obj的类型判断是新建一个数组还是对象
    let newObj = obj instanceof Array ? [] : {};

    // 遍历obj，并且判断是obj的属性才拷贝
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            newObj[key] = obj[key];
        }
    }
    return newObj;
}
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

## 深拷贝

![](/images/basic/deep.png)

> 将一个对象从内存中完整的拷贝一份出来，从堆内存中开辟一个新的区域存放新对象，且修改新对象不会影响原对象。

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
-   不能序列化`函数`
-   不能解决`循环引用`的对象

如果你的项目正好引入了`lodash`你可以直接使用 lodash 的`深拷贝函数 cloneDeep`。

-   也可以通过 js 循环遍历实现深拷贝

```js
// 思路：拷贝的时候判断一下属性值的类型，如果是对象，递归调用深拷贝函数即可
function deepCopy(obj) {
    if (typeof obj !== 'object') return;

    let newObj = obj instanceof Array ? [] : {};

    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            newObj[key] =
                typeof obj[key] === 'object' ? deepCopy(obj[key]) : obj[key];
        }
    }
    return newObj;
}
// 尽管使用深拷贝会完全的克隆一个新对象，不会产生副作用，但是深拷贝因为使用递归，
// 性能会不如浅拷贝，在开发中，还是要根据实际情况进行选择。
```

但是上述还是会出现`循环引用问题`

`解决循环引用问题，我们可以额外开辟一个存储空间，来存储当前对象和拷贝对象的对应关系，当需要拷贝当前对象时，先去存储空间中找，有没有拷贝过这个对象，如果有的话直接返回，如果没有的话继续拷贝，这样就巧妙化解的循环引用的问题。`

这个存储空间，需要可以存储 `key-value` 形式的数据，且 `key `可以是一个引用类型，我们可以选择 `Map` 这种数据结构：

-   检查 map 中有无克隆过的对象
-   有 就直接返回
-   没有 就将当前对象作为 key，克隆对象作为 value 进行存储
-   继续克隆

```js
function deepCopy(obj, map = new Map()) {
    if (ypeof obj ! == 'object') return;

    let newObj = Array.isArray(obj) ? [] : {};
    if (map.get(obj)) {
        return map.get(obj);
    }
    map.set(obj, newObj);
    for (const key in obj) {
        newObj[key] = deepCopy(obj[key], map);
    }

    return newObj;
};
```

上述虽然可以解决深拷贝的循环引用，但是不是最优秀的方案。因为 let newObj = {} 的形式，就默认创建了一个强引用的对象，我们只有手动将 obj = null，它才会被垃圾回收机制进行回收，如果是弱引用对象，垃圾回收机制会自动帮我们回收。


我们可以使用 `wekMap` 来优化

``` js
function deepCopy(obj, map = new WeakMap()) {
    if (typeof obj !== 'object') return;

    let newObj = Array.isArray(obj) ? [] : {};

    if (map.get(obj)) {
        return map.get(obj);
    }
    map.set(obj, newObj);

    const keys = Array.isArray(obj) ? undefined : Object.keys(obj);
    forEach(keys || obj, (value, key) => {
        if (keys) {
            key = value;
        }
        newObj[key] = deepCopy(obj[key], map);
    });

    return newObj;
}
``` -->

