---
toc: content
order: 1
---

# JavaScript

## 数据类型

JavaScript 是一种弱类型脚本语言，在定义变量时不需要指定类型，在程序运行过程中会自动判断类型。

> 涉及面试题：原始类型有哪几种？null 是对象嘛？

JavaScript 内置类型分为两大类型：**基本类型** 和 **引用类型**。

基本类型有七种： `Number`，`String`，`Boolean`，`Undefined`，`Null`，[Symbol](/basic/es6#symbol)，[BigInt](/basic/es6#bigint)

引用类型包括： `Object` ， `Array` ， `Date` ， `function` ，对象在使用过程中会遇到浅拷贝和深拷贝的问题。

```js
// 下列代码会出现：对象 a 的 name 属性被误改的 bug

let a = {
    name: 'zfc',
};
let b = a;
b.name = '张芳朝';

console.log(a.name); // 张芳朝
console.log(b.name); // 张芳朝

// 解决方式：先对 a 拷贝一份数据，再赋值给 b，即可

let a = {
    name: 'zfc-zfc',
};
let b = { ...a };
b.name = '张芳朝-张芳朝';

console.log(a.name); // 'zfc-zfc'
console.log(a.name); // '张芳朝-张芳朝'
```

### typeof

> typeof 是否能正确判断类型？instanceof 能正确判断对象的原理是什么？

`typeof` 对于基本类型，除了 `null` 都可以显示正确的类型

```js
typeof 1; // 'number'
typeof '1'; // 'string'
typeof undefined; // 'undefined'
typeof true; // 'boolean'
typeof Symbol(); // 'symbol'
typeof b; //  b 没有声明，但是还会显示 'undefined'
```

对于 `null` 来说，虽然它是基本类型，但是会显示 `object` ，这是一个存在很久了的 `Bug`

```js
typeof null; // 'object'
```

**为什么会出现这种 `Bug`呢？**

因为在 JS 的最初版本中，使用的是 32 位系统，为了性能考虑使用低位存储了变量的类型信息， `000` 开头表是对象，然而 `null` 表示为全零，所以将它错误的判断为 `object` 。虽然现在的内部类型判断代码已经变了，但是对于这个 Bug 却是一直流传下来。

`typeof` 对于引用类型，除了函数都会显示 `object`

```js
typeof []; // 'object'
typeof {}; // 'object'
typeof new Date(); // 'object'
typeof console.log; // 'function'
```

`typeof NaN` ????

`NaN` Not a Number 的缩写，表示`非数字`。常见于字符串和数字运算的结果。

```js
5 - 'a'; // NaN
0 / 0; // NaN
```

需要注意的是: `NaN` 不是独立的 `数据类型`，而是一个`特殊数值`，它的数据类型依然属于 `Number`。

```js
typeof NaN; // "number"
```

NaN 不等于任何值，包括它本身。所以 NaN 也是唯一一个和自身不严格相等的值。

```js
NaN === NaN; // false
```

数组的 indexOf 方法内部使用的是`严格相等`运算符，所以该方法对 NaN 不成立。

```js
[NaN].indexOf(NaN); // -1
```

NaN 在布尔运算时被当作 false。

```js
Boolean(NaN); // false
```

NaN 与任何数（包括它自己）的运算，得到的都是 NaN。

```js
NaN + 32; // NaN
NaN - 32; // NaN
NaN * 32; // NaN
NaN / 32; // NaN
```

### instanceof

`instanceof` 可以正确的判断引用类型的类型，因为内部机制是 **通过判断对象的原型链中能否找到 构造函数的 prototype 属性**。

```js
// object instanceof constructor    左边是要测试的对象，右边是构造函数

{} instanceof Object                // true
[] instanceof Array                 // true
[] instanceof Object                // true
function() {} instanceof Function   // true
function() {} instanceof Object     // true
```

**instanceof 实现原理：**

```js
function instanceof(left, right) {
    // left 表示 instanceof 左边的 object，right 表示右边 constructor
    left = left.__proto__; // 获得对象的原型

    let prototype = right.prototype; // 获得类型的原型

    // 判断对象的类型是否等于类型的原型
    while (true) {
        // while(true)作为无限循环，经常在不知道循环次数的时候使用
        if (left === null) {
            return false; //已经找到顶层
        }
        if (left === prototype) {
            return true; //当 left 严格等于 prototype 时，返回 true
        }
        left = left.__proto__; //继续向上一层原型链查找
    }
}
```

### Object.prototype.toString.call(xx)

使用 `Object.prototype.toString.call(xx)` 可以获得变量的正确类型。

```js
Object.prototype.toString.call(12); // "[object Number]"
Object.prototype.toString.call('12'); // "[object String]"
Object.prototype.toString.call(true); // "[object Boolean]"
Object.prototype.toString.call(undefined); // "[object Undefined]"
Object.prototype.toString.call(Null); // "[object Null]"
Object.prototype.toString.call(12n); // "[object BigInt]"
Object.prototype.toString.call(Symbol()); // "[object Symbol]"

Object.prototype.toString.call({}); // "[object Object]"
Object.prototype.toString.call([]); // "[object Array]"
Object.prototype.toString.call(new Date()); // "[object Date]"
Object.prototype.toString.call(console.log); // "[object Function]"
```

> 涉及面试题：基本类型和引用类型的不同之处？函数参数是对象会发生什么问题？

基本类型和引用类型不同的是: 基本类型存储的是值，引用类型存储的是地址（指针）。当你创建了一个对象类型的时候，计算机会在内存中帮我们开辟一个空间来存放值，但是我们需要找到这个空间，这个空间会拥有一个地址（指针）。

## var let const

var

-   ES5 命令
-   没有块级作用域的概念
-   会变量提升
-   未声明之前可以调用，值为 undefined
-   能重复声明
-    声明的全局变量不会挂在顶层对象(global)下面

let / const

-   ES6 命令
-   有块级作用域概念
-   会变量提升，但是，因为暂时性死区而报错 (在声明之前调用就处于暂时性死区)
-   不能重复声明

const

-   声明之后必须马上赋值，否则会报错
-   基本类型一旦声明不允许修改
-   引用类型 指针指向的地址不能修改，内部数据可以修改

## get 和 post

-   get 用来获取数据，post 用来提交数据。
-   get 请求在 url 中传送的参数是有长度限制的(最长 2048 字节)，而 post 么有。
-   get 参数通过 url 传递，所以不能用来传递敏感信息，post 放在 Request body 中。

get 和 post 还有一个重大区别，简单的说：

`get 产生一个 TCP 数据包；post 产生两个 TCP 数据包。`

因为 post 需要两步，时间上消耗的要多一点，看起来 get 比 post 更有效。

1、get 与 post 都有自己的语义，不能随便混用。

2、在网络环境好的情况下，发一次包的时间和发两次包的时间差别基本可以无视。
而在网络环境差的情况下，两次包的 TCP 在验证数据包完整性上，有非常大的优点。

3、并不是所有浏览器都会在 post 中发送两次包，Firefox 就只发送一次。

## for in 和 for of

> for in 循环是用于遍历对象的，它可以用来遍历数组吗？

答案是 可以的，因为数组在某种意义上也是对象，但是如果用其遍历数组会存在一些隐患：`其会遍历数组原型链上的属性`。

-   for in 遍历对象场景：

```js
let obj = {
    name: 'zfc',
    age: 18,
};

for (let key in obj) {
    console.log(key); // name age
    console.log(obj[key]); // zfc 18
}

// 但是如果在 Object 原型链上添加一个方法，会遍历到原型链上的方法
Object.prototype.test = function () {};

for (let key in obj) {
    console.log(key); // name age test
    console.log(obj[key]); // zfc 18 ƒ () {}
}

// hasOwnProperty 方法可以判断某属性是否是该对象的实例属性
for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
        console.log(key); // name age
        console.log(obj[key]); // zfc 18
    }
}
```

-   for in 遍历数组场景：

```js
let arr = [1, 2];

for (let key in arr) {
    console.log(key); // 会打印数组的 下标 0, 1
    console.log(arr[key]); // 会打印数组的 元素 1, 2
}

// 但是如果在 Array 原型链上添加一个方法，
Array.prototype.test = function () {};

for (let key in arr) {
    console.log(arr[key]); // 此时会打印 1, 2, ƒ () {}
}
```

因为我们不能保证项目代码中不会对`数组原型链`进行操作，也不能保证引入的第三方库不对其进行操作，所以不要使用 for in 循环来遍历数组。

-   for of 只能遍历数组（不包括数组原型链上的属性和方法）

```js
let arr = [1, 2];

for (let value of arr) {
    console.log(value); // 会打印数组的 元素 1, 2
}
```

因为能够被 for...of 正常遍历的，都需要实现一个遍历器 `Iterator`。而数组、字符串、Set、Map 结构，早就内置好了 Iterator（迭代器），它们的原型中都有一个 Symbol.iterator 方法，而 Object 对象并没有实现这个接口，使得它无法被 for...of 遍历。

如何让对象可以被 for of 遍历，当然是给它添加遍历器，代码如下：

```js
Object.prototype[Symbol.iterator] = function () {
    let _this = this;
    let index = 0;
    let length = Object.keys(_this).length;
    return {
        next: () => {
            let value = _this[index];
            let done = index >= length;
            index++;
            return { value, done };
        },
    };
};
```

<Alert type="warning">
整体来说直接用来遍历对象的目前只有 for in，其他的都是遍历数组用的。
</Alert>

## 数组去重

**1、双重 for 循环 (如果前一个值与后一个值相等，那么就去掉后一个值)**

```js
const arr = [1, 'a', 'a', 'b', 'd', 'e', 'e', 1, 0];

let test = (arr) => {
    for (let i = 0, len = arr.length; i < len; i++) {
        for (let j = i + 1, len = arr.length; j < len; j++) {
            if (arr[i] === arr[j]) {
                arr.splice(j, 1);
            }
        }
    }
    return arr;
};
test(arr); // [1, "a", "b", "d", "e", 0]
```

2、for...of + includes()

双重 for 循环的升级版，外层用 for...of 语句替换 for 循环，把内层循环改为 includes()

先创建一个空数组，当 includes() 返回 false 的时候，就将该元素 push 到空数组中

类似的，还可以用 indexOf() 来替代 includes()

```js
let arr = [1, 'a', 'a', 'b', 'd', 'e', 'e', 1, 0];

let test = (arr) => {
    let result = [];
    for (let i of arr) {
        !result.includes(i) && result.push(i);
    }
    return result;
};

test(arr); // [1, "a", "b", "d", "e", 0]
```

3、Array.filter() + indexOf

```js
let arr = [1, 1, 2, 2, 2, 6];

let test = () => {
    return arr.filter((item, index, array) => array.indexOf(item) === index);
};

test(arr); // [1, 2, 6]
```

4、for...of + Object

首先创建一个空对象，然后用 for 循环遍历。利用对象的属性不会重复这一特性，校验数组元素是否重复。

```js
let arr = [1, 'a', 'a', 'b', 'd', 'e', 'e', 1, 0];

let test = () => {
    let result = [];
    let obj = {};
    for (let i of arr) {
        if (!obj[i]) {
            result.push(i);
            obj[i] = 1;
        }
    }
    return result;
};

test(); // [1, "a", "b", "d", "e", 0]
```

5、ES6 Set

```js
let arr = [1, 'a', 'a', 'b', 'd', 'e', 'e', 1, 0];

let test = (arr) => Array.from(new Set(arr));

test(arr); // [1, "a", "b", "d", "e", 0]
```

## 数组排序

数组排序比较常用的：`冒泡排序`、`快速排序`

-   冒泡排序：

从数组中随便拿一个数与后一位比较，如果前者比后者大，那么两者交换位置，从而遍历数组可以得到排序的效果。

```js
let arr = [1, 9, 4, 50, 49, 6, 3, 2];
let test = (arr) => {
    for (let i = 0, len = arr.length; i < len - 1; i++) {
        for (let j = i + 1, len = arr.length; j < len; j++) {
            let tempi = arr[i]; // 获取第一个值，并与后一个值比较
            let tempj = arr[j];
            if (tempi > tempj) {
                arr[i] = tempj;
                arr[j] = tempi; // 如果前一个值比后一个值大，那么相互交换
            }
        }
    }
    console.log(arr); // [1, 2, 3, 4, 6, 9, 49, 50]
};
test(arr);
```

-   快速排序：

找出数组中间那一个值，然后用这个值跟数组里面的值相比较，大于此值的放在一边，小于的也放在一边， 然后用 concat()合并，再进行比较，如此反复。

```js
let arr = [1, 9, 4, 50, 49, 6, 3, 2];
let test = (arr) => {
    if (arr.length <= 1) return arr; // 如果数组只有一位，就没有必要比较了
    let index = Math.floor(arr.length / 2); // 获取中间值的索引
    let cur = arr.splice(index, 1); // 截取中间值，如果此处使用 cur=arr[index]; 那么将会出现无限递归的错误
    let left = [];
    let right = []; // 小于中间值的放在left数组里，大于的放在right数组
    for (let i = 0, len = arr.length; i < len; i++) {
        if (cur > arr[i]) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }
    return test(left).concat(cur, test(right)); // 通过递归，上一轮比较好的数组合并，并且再次进行比较
};
test(arr);
```

## 函数式编程

简单说，"函数式编程" 是一种 "编程范式"，也就是如何编写程序的方法论。

属于 "结构化编程" 的一种，主要思想是`把运算过程`尽量写成一系列`嵌套的函数调用`。举例来说，现在有这样一个数学表达式：

```js
(1 + 2) * 3 - 4;

// 传统的过程式编程，可能这样写：
var a = 1 + 2;
var b = a * 3;
var c = b - 4;

// 函数式编程要求使用函数，我们可以把运算过程定义为不同的函数，然后写成下面这样：
var result = subtract(multiply(add(1, 2), 3), 4);
```

这就是函数式编程。

函数式编程优点

-   代码简洁，开发快速

```js
函数式编程大量使用函数，减少了代码的重复，因此程序比较短，开发速度较快。
```

-   接近自然语言，易于理解

```js
函数式编程的自由度很高，可以写出很接近自然语言的代码。

上文 subtract(multiply(add(1,2), 3), 4)

// 可以变形为

add(1,2).multiply(3).subtract(4)

// 这基本就是自然语言的表达了。
```

-   更方便的代码管理

```js
函数式编程不依赖、也不会改变外界的状态，只要给定输入参数，返回的结果必定相同。
因此，每一个函数都可以被看做独立单元，很有利于进行单元测试和除错，以及模块化组合。
```

## 函数柯里化

所谓 "柯里化"，就是把一个`多参数的函数`，`转化为单参数函数`。

```js
// 柯里化之前
function add(x, y) {
    return x + y;
}

add(1, 2); // 3

// 柯里化之后
function addX(y) {
    return function (x) {
        return x + y;
    };
}

addX(2)(1); // 3
```

被`柯里化`的函数 addX 每次的返回值都为一个函数，并使用下一个参数作为形参，直到 2 个参数都被传入后，在返回的最后一个函数内部`执行`求和操作，其实是充分的利用了`闭包`的特性来实现的。

柯里化的一个很大的好处是可以帮助我们基于一个被转换函数，通过对参数的拆分实现不同功能的函数，

## 原型和原型链

> 涉及面试题：如何理解原型？如何理解原型链？

当我们创建一个对象时 let obj = { age: 25 }，我们可以发现能使用很多种函数，但是我们明明没有定义过它们，对于这种情况你是否有过疑惑？

![](https://user-gold-cdn.xitu.io/2018/11/16/1671d15f45fcedea?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

**其实每个 JS 对象都有 **proto** 属性，这个属性指向了原型。** 这个属性在现在来说已经不推荐直接去使用它了，这只是浏览器在早期为了让我们访问到内部属性 [[prototype]] 来实现的一个东西。

讲到这里好像还是没有弄明白什么是原型，接下来让我们再看看 **proto** 里面有什么吧。

![](https://user-gold-cdn.xitu.io/2018/11/16/1671d2c5a6bcccc4?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

看到这里你应该明白了，**原型也是一个对象，并且这个对象中包含了很多函数**，所以我们可以得出一个结论：对于 obj 来说，可以通过 **proto** 找到一个原型对象，在该对象中定义了很多函数让我们来使用。

在上面的图中我们还可以发现一个 constructor 属性，也就是构造函数

![](https://user-gold-cdn.xitu.io/2018/11/16/1671d329ec98ec0b?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

打开 constructor 属性我们又可以发现其中还有一个 prototype 属性，并且这个属性对应的值和先前我们在 **proto** 中看到的一模一样。所以我们又可以得出一个结论：**原型的 constructor 属性指向构造函数，构造函数又通过 prototype 属性指回原型**，但是并不是所有函数都具有这个属性，Function.prototype.bind() 就没有这个属性。

**总结如下：**

-   Object 是所有对象的爸爸，所有对象都可以通过 **proto** 找到它
-   Function 是所有函数的爸爸，所有函数都可以通过 **proto** 找到它
-   对象的 **proto** 属性指向原型， **proto** 将对象和原型连接起来组成了原型链

## 执行上下文

当执行 JS 代码时，会产生三种执行上下文

-   全局执行上下文 (浏览器中，全局上下文是 window 对象，node 环境中 是 global)
-   函数执行上下文
-   eval 执行上下文（耗性能）

每个执行上下文中都有三个重要的属性

-   变量对象（VO），包含变量、函数声明和函数的形参，该属性只能在全局上下文中访问
-   作用域链（JS 采用词法作用域，也就是说变量的作用域是在定义时就决定了）
-   this 指向

```js
console.log(a) // undefined
var a = 100

fn('zhangsan') // 'zhangsan' 20
function fn(name) {
    age = 20;
    console.log(name, age);
    var age;
}

console.log(b); // 这里报错
// Uncaught ReferenceError: b is not defined
b = 100...
```

对于上述代码，执行栈中有两个上下文：全局上下文和函数 `fn` 上下文。

我们来看下上面的面试小题目，为什么 a 是 undefined，而 b 却报错了，实际 JS 在代码执行之前，要「全文解析」，发现 var a，知道有个 a 的变量，存入了执行上下文，而 b 没有找到 var 关键字，这时候没有在执行上下文提前「占位」，所以代码执行的时候，提前报到的 a 是有记录的，只不过值暂时还没有赋值，即为 undefined，而 b 在执行上下文没有找到，自然会报错（没有找到 b 的引用）。

另外，一个函数在执行之前，也会创建一个 函数执行上下文 环境，跟 全局上下文 差不多，不过 函数执行上下文 中会多出 this arguments 和函数的参数。

## 防抖

你是否在日常开发中遇到一个问题，在滚动事件中需要做个复杂计算或者实现一个按钮的防二次点击操作。

这些需求都可以通过函数防抖动来实现。尤其是第一个需求，如果在频繁的事件回调中做复杂计算，很有可能导致页面卡顿，不如将多次计算合并为一次计算，只在一个精确点做操作。

PS：防抖和节流的作用都是防止函数多次调用。区别在于，假设一个用户一直触发这个函数，且每次触发函数的间隔小于 delay 情况会每隔一定时间（参数 delay）调用函数。

```js
// fn是我们需要包装的事件回调, delay是每次推迟执行的等待时间

function debounce(fn, delay) {
    let timer = null; // 定时器

    // 将debounce处理结果当作函数返回
    return () => {
        let self = this; // 保留调用时的this上下文
        let args = arguments; // 保留调用时传入的参数

        if (timer) clearTimeout(timer); // 每次事件被触发时，都去清除之前的旧定时器

        // 设立新定时器
        timer = setTimeout(() => {
            fn.apply(self, args);
        }, delay);
    };
}

// 用debounce来包装scroll的回调
document.addEventListener(
    'scroll',
    debounce(() => console.log('触发了滚动事件'), 1000),
);
```

## 节流

节流和防抖动本质是不一样的。防抖动是将多次执行变为最后一次执行，节流是将多次执行变成每隔一段时间执行。

```js
// fn是我们需要包装的事件回调, time是时间间隔的阈值

function throttle(fn, time) {
    let last = 0; // last为上一次触发回调的时间

    // 将throttle处理结果当作函数返回
    return () => {
        let self = this; // 保留调用时的this上下文
        let args = arguments; // 保留调用时传入的参数
        let now = +new Date(); // 记录本次触发回调的时间

        // 判断本次触发的时间和上次触发的时间差是否大于时间间隔的阈值
        // 如果时间间隔大于我们设定的时间间隔阈值，则执行回调
        if (now - last > time) {
            fn.apply(self, args);
            last = now;
        }
    };
}

// 用throttle来包装scroll的回调
document.addEventListener(
    'scroll',
    throttle(() => console.log('触发了滚动事件'), 1000),
);
```

<!-- ## 设计模式 -->
