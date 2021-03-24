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

什么是前端模块化？

模块化的开发方式可以提高代码复用率，方便进行代码的管理。通常一个文件就是一个模块，有自己的作用域，
只向外暴露特定的变量和函数。目前流行的 js 模块化规范有 CommonJS、 ES6 的模块系统。

为什么会有 CommonJs 和 Es Module 呢?

在早期 JavaScript 模块这一概念，都是通过 script 标签引入 js 文件代码。当然这写基本简单需求没有什么问题，但当我们的项目越来越庞大时，我们引入的 js 文件就会越多，这时就会出现以下问题：

-   js 文件作用域都是顶层，这会造成变量污染
-   js 文件多，变得不好维护
-   js 文件依赖问题，稍微不注意顺序引入错，代码全报错

为了解决以上问题 JavaScript 社区出现了 CommonJs，CommonJs 是一种模块化的规范，包括现在的 NodeJs 里面也采用了部分 CommonJs 语法在里面。那么在后来 Es6 版本正式加入了 Es Module 模块，这两种都是解决上面问题，那么都是解决什么问题呢。

-   解决变量污染问题，每个文件都是独立的作用域，所以不存在变量污染
-   解决代码维护问题，一个文件里代码非常清晰
-   解决文件依赖问题，一个文件里可以清楚的看到依赖了那些其它文件

### CommonJS 导出

CommonJs 中使用 module.exports 导出变量及函数，也可以导出任意类型的值，看如下案例。

```js
// 导出一个对象
module.exports = {
    name: '蛙人',
    age: 24,
    sex: 'male',
};

// 导出任意值
module.exports.name = '蛙人';
module.exports.sex = null;
module.exports.age = undefined;
```

导出也可以省略 module 关键字，直接写 exports 导出也可以，看如下案例。

```js
exports.name = '蛙人';
exports.sex = 'male';
```

注意：如果使用 exports 导出单个值之后，就不能在导出一个对象值，这只会修改 exports 的对象改变，然而修改无效，最终导出还是 name，和 sex，因为最终的导出是由 module.exports 决定的。

```js
exports.name = '蛙人';
exports.sex = 'male';
exports = {
    name: '蛙人',
};
```

上面 example 中，这种情况会改变对象的引用值则导出无效，所以最后导出的还是 name，sex。

混合导出，exports 和 module.exports 可以同时使用，不会存在问题。

```js
exports.name = '蛙人';
module.exports.age = 24;
```

CommonJs 中使用 require 语法可以导入，如果想要单个的值，可以通过解构对象来获取。

```js
// index.js
module.exports.name = '蛙人';
module.exports.age = 24;

let data = require('./index.js');
console.log(data); // { name: "蛙人", age: 24 }
```

不管是 CommonJs 还是 Es Module 都不会重复导入，就是只要该文件内加载过一次这个文件了，我再次导入一次是不会生效的。

```js
let data = require('./index.js');
let data = require('./index.js'); // 不会在执行了
```

CommonJs 支持动态导入，什么意思呢，就是可以在语句中，使用 require 语法，来看如下案例。

```js
let lists = ['./index.js', './config.js'];
lists.forEach((url) => require(url)); // 动态导入

if (lists.length) {
    require(lists[0]); // 动态导入
}
```

CommonJs 导入的值是拷贝的，所以可以修改拷贝值，但这会引起变量污染，一不小心就重名。

```js
// index.js
let num = 0;
module.exports = {
    num,
    add() {
        ++num;
    },
};

let { num, add } = require('./index.js');
console.log(num); // 0
add();
console.log(num); // 0
num = 10;
```

上面 example 中，可以看到 exports 导出的值是值的拷贝，更改完++ num 值没有发生变化，并且导入的 num 的值我们也可以进行修改

### ES6 Module

在 Es Module 中导出分为两种，单个导出(export)、默认导出(export default)，单个导出在导入时不像 CommonJs 一样直接把值全部导入进来了，Es Module 中可以导入我想要的值。那么默认导出就是全部直接导入进来，当然 Es Module 中也可以导出任意类型的值

```js
// 导出变量
export const name = "蛙人"
export const age = 24

// 导出函数也可以
export function fn() {}
export const test = () => {}

// 另一种形式导出
const sex = "male"
export sex

// 如果有多个的话
const name = "蛙人"
const sex = "male"
export { name, sex }
```

可以使用 export 和 export default 同时使用并且互不影响，只需要在导入时地方注意，如果文件里有混合导入，则必须先导入默认导出的，在导入单个导入的值。

```js
export const name = "蛙人"
export const age = 24

export default {
    fn() {}，
    msg: "hello 蛙人"
}
```

Es Module 使用的是 import 语法进行导入。如果要单个导入则必须使用花括号{} ，注意：这里的花括号跟解构不一样。

```js
// index,js
export const name = '蛙人';
export const age = 24;

import { name, age } from './index.js';
console.log(name, age); // "蛙人" 24

// 如果里面全是单个导出，我们就想全部直接导入则可以这样写
import * as all from './index.js';
console.log(all); // {name: "蛙人", age: 24}
```

混合导入，则该文件内用到混合导入，import 语句必须先是默认导出，后面再是单个导出，顺序一定要正确否则报错

```js
// index,js
export const name = '蛙人';
export const age = 24;
export default {
    msg: '蛙人',
};

import msg, { name, age } from './index.js';
console.log(msg); // { msg: "蛙人" }
```

上面 example 中，如果导入的名称不想跟原本地名称一样，则可以起别名。

```js
// index,js
export const name = '蛙人';
export const age = 24;
export default {
    msg: '蛙人',
};

import { default as all, name, age } from './index.js';
console.log(all); // { msg: "蛙人" }
```

export 导出的值是值的引用，并且内部有映射关系，这是 export 关键字的作用。而且导入的值，不能进行修改也就是只读状态。

```js
// index.js
export let num = 0;
export function add() {
    ++num;
}

import { num, add } from './index.js';
console.log(num); // 0
add();
console.log(num); // 1
num = 10; // 抛出错误
```

就是 Es Module 语句``import只能声明在该文件的最顶部，不能动态加载语句，Es Module`语句运行在代码编译时。

```js
if (true) {
    import xxx from 'XXX'; // 报错
}
```

### CommonJs 和 Es Module 的区别

CommonJs

-   CommonJs 可以动态加载语句，代码发生在运行时
-   CommonJs 混合导出，还是一种语法，只不过不用声明前面对象而已，当我导出引用对象时之前的导出就被覆盖了
-   CommonJs 导出值是拷贝，可以修改导出的值，这在代码出错时，不好排查引起变量污染

Es Module

-   Es Module 是静态的，不可以动态加载语句，只能声明在该文件的最顶部，代码发生在编译时
-   Es Module 混合导出，单个导出，默认导出，完全互不影响
-   Es Module 导出是引用值之前都存在映射关系，并且值都是可读的，不能修改

<!-- https://juejin.cn/post/6844903576309858318 -->

<!--  升级参考下文-->
<!-- https://juejin.cn/post/6938581764432461854 -->
