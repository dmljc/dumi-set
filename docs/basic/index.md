---
toc: menu
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

## 原型和原型链

每个函数都有 `prototype` 属性，除了 `Function.prototype.bind()` ，该属性指向原型。

每个对象都有 `__proto__` 属性，指向了创建该对象的构造函数的原型。其实这个属性指向了 `[[prototype]]` ，但是 `[[prototype]]` 是内部属性，我们并不能访问到，所以使用 `_proto_` 来访问。

对象可以通过 `__proto__` 来寻找不属于该对象的属性， `__proto__` 将对象连接起来组成了原型链。

如果你想更进一步的了解原型，可以仔细阅读 [深度解析原型中的各个难点](https://github.com/KieSun/Blog/issues/2) 。

## 执行上下文

当执行 JS 代码时，会产生三种执行上下文

-   全局执行上下文
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

另外，一个函数在执行之前，也会创建一个 函数执行上下文 环境，跟 全局上下文 差不多，不过 函数执行上下文 中会多出 this arguments 和函数的参数。参数和 arguments 好理解，这里的 this 咱们需要专门讲解。

总结一下：

-   范围：一段 `<script>` 、js 文件或者一个函数
-   全局上下文：变量定义，函数声明
-   函数上下文：变量定义，函数声明，this，arguments
