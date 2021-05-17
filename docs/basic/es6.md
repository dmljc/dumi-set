---
toc: content
order: 8
---

# ES6+

## Symbol

ES5 的对象属性名都是字符串，这容易造成 `属性名的冲突`。

比如，你使用了一个他人提供的对象，但又想为这个对象添加新的方法（mixin 模式），新方法的名字就有可能与现有方法产生冲突。如果有一种机制，保证每个属性的名字都是独一无二的就好了，这样就从根本上防止属性名的冲突，表示独一无二的值。这就是 ES6 引入 Symbol 的原因。

Symbol 函数前不能使用 new 命令，否则会报错。 **由于 Symbol 值不是对象，所以不能添加属性。**

```js
let s = Symbol();

typeof s; // "symbol"

let sym = new Symbol(); // TypeError: Symbol is not a constructor
```

Symbol 函数的参数只是表示对当前 Symbol 值的描述，因此相同参数的 Symbol 函数的返回值是不相等的:

```js
// 没有参数的情况
let s1 = Symbol();
let s2 = Symbol();

s1 === s2; // false

// 有参数的情况
let s1 = Symbol('foo');
let s2 = Symbol('foo');

s1 === s2; // false
```

Symbol 值不能与其他类型的值进行运算，会报错:

```js
let sym = Symbol('My symbol');

'your symbol is ' +
    sym // TypeError: can't convert symbol to string
    `your symbol is ${sym}`; // TypeError: can't convert symbol to string
```

## BigInt

JavaScript 所有`数字都保存成 64 位浮点数`，这给数值的表示带来了两大限制：

-   数值的`精度只能到 53 个二进制位`，大于这个范围的整数，JavaScript 是无法精确表示的，这使得 JavaScript 不适合进行科学和金融方面的精确计算。

-   大于或等于 `2 的 1024 次方`的数值，JavaScript 无法表示，会返回 `Infinity（无穷大）`。

ES2020 引入了一种新的数据类型 `BigInt（大整数）`，来解决这个问题。BigInt 只用来表示整数，没有位数的限制，任何位数的整数都可以精确表示。

创建 BigInt 的方式有两种：

-   在一个整数字面量后面加 n
-   调用 BigInt 函数，该函数从字符串、数字等中生成 BigInt

```js
const bigint1 = 12n;
const bigint2 = BigInt('12');
const bigint3 = BigInt(12);

bigint1 === bigint2; // true
bigint1 === bigint3; // true
bigint2 === bigint3; // true
```

为了与 Number 类型区别，BigInt 类型的数据必须添加后缀 n

```js
1234; // 普通整数
1234n; // BigInt

42n === 42; // false
42n == 42; // true

1n + 2n; // 3n
```

BigInt 和 Number 类型之间的转换

```js
const big = 12n;
const num = 12;

const numToBig = BigInt(num); // 12n
big === numToBig; // true

const bigToNum = Number(big); // 12
bigToNum === num; // true
```

当在 if 或其他布尔运算中时，BigInt 的行为类似于 Number

例如，在 if 中，BigInt 0n 为 false，其他值为 true：

```js
if (0n) {
    // 永远不会执行
}
```

## Set

ES6 提供了新的数据结构 `Set`。它类似于数组，但是成员的值都是`唯一`的，没有重复的值。

```js
const set = new Set([1, 2, 3, 4, 4]);
[...set]; // [1, 2, 3, 4]
```

Set 实例的属性和方法：

-   Set.size：返回 Set 实例的成员总数。
-   Set.add(value)：添加某个值，返回 Set 结构本身。
-   Set.delete(value)：删除某个值，返回一个布尔值，表示删除是否成功。
-   Set.has(value)：返回一个布尔值，表示该值是否为 Set 的成员。
-   Set.clear()：清除所有成员，没有返回值。

## WeakSet

`WeakSet` 结构与 `Set` 类似，也是不重复的值的集合。但是，它与 Set 有两个区别。

-   首先，WeakSet 的成员`只能是对象`，而不能是其他类型的值
-   其次，WeakSet 中的对象都是`弱引用`，即垃圾回收机制不考虑 WeakSet 对该对象的引用，也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于 WeakSet 之中。

## Map

JavaScript 的对象（Object），本质上是`键值对的集合`（Hash 结构），但是传统上只能用`字符串当作键`。这给它的使用带来了很大的限制。

```js
const data = {};
const element = document.getElementById('myDiv');

data[element] = 'metadata';
data['[object HTMLDivElement]']; // "metadata"
```

上面代码原意是将一个 DOM 节点作为对象 data 的键，但是由于对象只接受字符串作为键名，所以 element 被自动转为字符串[object HTMLDivElement]。

为了解决这个问题，ES6 提供了 `Map` 数据结构。它类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。

实例的属性和操作方法

-   map.size 属性返回 Map 结构的成员总数。
-   map.set(key, value) 设置键名 key 对应的键值为 value
-   map.get(key) 读取 key 对应的键值
-   map.has(key) 返回一个布尔值，表示某个键是否在当前 Map 对象之中
-   map.delete(key) 删除某个键，返回 true
-   map.clear() 清除所有成员，没有返回值

## WeakMap

WeakMap 结构与 Map 结构类似，也是用于生成键值对的集合。WeakMap 与 Map 的区别有两点。

-   首先，WeakMap `只接受对象作为键名`（null 除外），不接受其他类型的值作为键名。
-   它的键名所引用的对象都是弱引用，即垃圾回收机制不将该引用考虑在内。因此，只要所引用的对象的其他引用都被清除，垃圾回收机制就会释放该对象所占用的内存。也就是说，一旦不再需要，WeakMap 里面的键名对象和所对应的键值对会自动消失，不用手动删除引用。

## Proxy

> 涉及面试题：Proxy 可以实现什么功能？

如果你平时有关注 Vue 的进展的话，可能已经知道了在 Vue3.0 中将会通过 Proxy 来替换原本的 Object.defineProperty 来实现数据响应式。 Proxy 是 ES6 中新增的功能，它可以用来自定义对象中的操作。

```js
let p = new Proxy(target, handler);
```

target 代表需要添加代理的对象，handler 用来自定义对象中的操作，比如可以用来自定义 set 或者 get 函数。

接下来我们通过 Proxy 来实现一个数据响应式

```js
let onWatch = (obj, setBind, getLogger) => {
    let handler = {
        get(target, property, receiver) {
            getLogger(target, property);
            return Reflect.get(target, property, receiver);
        },
        set(target, property, value, receiver) {
            setBind(value, property);
            return Reflect.set(target, property, value);
        },
    };
    return new Proxy(obj, handler);
};

let obj = { a: 1 };
let p = onWatch(
    obj,
    (v, property) => {
        console.log(`监听到属性${property}改变为${v}`);
    },
    (target, property) => {
        console.log(`'${property}' = ${target[property]}`);
    },
);
p.a = 2; // 监听到属性a改变
p.a; // 'a' = 2
```

在上述代码中，我们通过自定义 set 和 get 函数的方式，在原本的逻辑中插入了我们的函数逻辑，实现了在对对象任何属性进行读写时发出通知。

当然这是简单版的响应式实现，如果需要实现一个 Vue 中的响应式，需要我们在 get 中收集依赖，在 set 派发更新，之所以 Vue3.0 要使用 Proxy 替换原本的 API。

优点:

-   Proxy 无需一层层递归为每个属性添加代理，一次即可完成以上操作，性能上更好
-   并且原本的实现有一些数据更新不能监听到，但是 Proxy 可以完美监听到任何方式的数据改变

缺点:

-   唯一缺陷可能就是浏览器的兼容性不好了。

## class

[点击查看 class 具体介绍](extends#class、extends-实现继承)
