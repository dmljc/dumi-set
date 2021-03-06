---
toc: menu
---

# JavaScript

## 数据类型

JavaScript 是一种弱类型脚本语言，所谓弱类型指的是定义变量时，不需要指定类型，在程序运行过程中会自动判断类型。

JavaScript 中分为八种内置类型，七种内置类型又分为两大类型：基本类型和引用类型。

基本类型有七种： `Number`，`String`，`Boolean`，`Undefined`，`Null`，`BigInt`，`Symbol`

### BigInt

JavaScript 所有数字都保存成 64 位浮点数，这给数值的表示带来了两大限制：

-   数值的精度只能到 53 个二进制位，大于这个范围的整数，JavaScript 是无法精确表示的，这使得 JavaScript 不适合进行科学和金融方面的精确计算。

-   大于或等于 2 的 1024 次方的数值，JavaScript 无法表示，会返回 Infinity（无穷大）。

ES2020 引入了一种新的数据类型 BigInt（大整数），来解决这个问题。BigInt 只用来表示整数，没有位数的限制，任何位数的整数都可以精确表示。

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

### Symbol

ES5 的对象属性名都是字符串，这容易造成 `属性名的冲突`。

比如，你使用了一个他人提供的对象，但又想为这个对象添加新的方法（mixin 模式），新方法的名字就有可能与现有方法产生冲突。如果有一种机制，保证每个属性的名字都是独一无二的就好了，这样就从根本上防止属性名的冲突，表示独一无二的值。这就是 ES6 引入 Symbol 的原因。

Symbol 函数前不能使用 new 命令，否则会报错。 由于 Symbol 值不是对象，所以不能添加属性:

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

引用类型包括： `Object` ， `Array` ， `Date` ， `function` ，对象在使用过程中会遇到浅拷贝和深拷贝的问题。

```js
// 下列代码会出现：对象a的name属性被误改的bug。

let a = {
    name: 'zfc',
};
let b = a;
b.name = '张芳朝';

console.log(a.name); // 张芳朝
console.log(b.name); // 张芳朝

// 解决方式：先对a拷贝一份数据，再赋值给b，即可。

let a = {
    name: 'zfc-zfc',
};
let b = { ...a };
b.name = '张芳朝-张芳朝';

console.log(a.name); // 'zfc-zfc'
console.log(a.name); // '张芳朝-张芳朝'
```

### typeof

`typeof` 对于基本类型，除了 `null` 都可以显示正确的类型

```js
typeof 1; // 'number'
typeof '1'; // 'string'
typeof undefined; // 'undefined'
typeof true; // 'boolean'
typeof Symbol(); // 'symbol'
typeof b; // b 没有声明，但是还会显示 undefined
```

对于 `null` 来说，虽然它是基本类型，但是会显示 `object` ，这是一个存在很久了的 `Bug`

```js
typeof null; // 'object'
```

为什么会出现这种 `Bug`呢？

因为在 JS 的最初版本中，使用的是 32 位系统，为了性能考虑使用低位存储了变量的类型信息， `000` 开头表是对象，然而 `null` 表示为全零，所以将它错误的判断为 `object` 。虽然现在的内部类型判断代码已经变了，但是对于这个 Bug 却是一直流传下来。

`typeof` 对于对象，除了函数都会显示 `object`

```js
typeof []; // 'object'
typeof {}; // 'object'
typeof new Date(); // 'object'
typeof console.log; // 'function'
```

### instanceof

`instanceof` 可以正确的判断引用类型的类型，因为内部机制是通过判断对象的原型链中是不是能找到 构造函数的 prototype 属性。

```js
// object instanceof constructor    左边是要测试的对象，右边是构造函数

{} instanceof Object                // true
[] instanceof Array                 // true
[] instanceof Object                // true
function() {} instanceof Function   // true
function() {} instanceof Object     // true
```

instanceof 实现原理：

```js
function instanceof(left, right) {
    // left 表示左边的object，right 表示右边的constructor
    // 获得对象的原型
    left = left.__proto__;
    // 获得类型的原型
    let prototype = right.prototype;
    // 判断对象的类型是否等于类型的原型
    while (true) {
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

那么，如何获得一个变量的正确类型呢？

`使用 Object.prototype.toString.call(xx)，可以获得变量的正确类型。`

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

## 前端模块化

模块化的开发方式可以提高代码复用率，方便进行代码的管理。通常一个文件就是一个模块，有自己的作用域，
只向外暴露特定的变量和函数。目前流行的 js 模块化规范有 CommonJS、AMD、CMD 以及 ES6 的模块系统。

### CommonJS

Node.js 是 CommonJS 规范的主要实践者，它有四个重要的环境变量为模块化的实现提供支持：module、exports、require、global。实际使用时，用 module.exports 定义当前模块对外输出的接口（不推荐直接用 exports），用 require 加载模块。

```js
// 定义模块 math.js
let count = 0;
const add = (a, b) => a + b;

module.exports = {
    // 对外暴露的函数、变量
    add,
    count,
};

// 引用自定义的模块
let math = require('./math');
math.add(1, 2);
```

CommonJS 用 `同步`的方式加载模块。在服务端，模块文件都存在本地磁盘，读取非常快，所以这样做不会有问题。但是在浏览器端，限于网络原因，更合理的方案是使用异步加载。

### AMD

AMD 规范采用`异步`方式加载模块，模块的加载不影响它后面语句的运行。所有依赖这个模块的语句，都定义在一个回调函数中，等到加载完成之后，这个回调函数才会运行。这里介绍用 require.js 实现 AMD 规范的模块化：用 require.config() 指定引用路径等，用 define() 定义模块，用 require() 加载模块。

```js
// 网页中引入require.js及main.js
<script src="js/require.js" data-main="js/main"></script>;

// main.js 入口文件/主模块，首先用config()指定各模块路径和引用名
require.config({
    baseUrl: 'js/lib',
    paths: {
        jquery: 'jquery.min',
        underscore: 'underscore.min',
    },
});

// 执行基本操作
require(['jquery', 'underscore'], function ($, _) {
    // some code here
});
```

<!-- https://juejin.cn/post/6844903576309858318 -->
