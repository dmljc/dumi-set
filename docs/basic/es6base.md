---
toc: content
order: 7
---

## ES6 常用的 api

## 块级作用域

ES5 只有全局作用域和函数作用域，没有块级作用域，这带来很多不合理的场景：

-   第一种场景，内层变量可能会覆盖外层变量。
-   第二种场景，用来计数的循环变量泄露为全局变量。

```js
var s = 'hello';

for (var i = 0; i < s.length; i++) {
    console.log(s[i]);
}

console.log(i); // 5
```

上面代码中，变量 i 只用来控制循环，但是循环结束后，它并没有消失，泄露成了全局变量。

## let const

相同点：

-   不存在变量提升
-   暂时性死区
-   不允许重复声明

不同点：

-   const 声明一个只读的常量。一旦声明，常量的值就不能改变。
-   const 声明一个引用类型，只能保证这个指针是固定的，至于对象的属性是可以修改。

## 字符串的扩展

-   模版字符串
-   解构赋值
-   includes()、startsWith()、endsWith()
-   repeat()
-   padStart()、padEnd()
-   trimStart()、trimEnd()
-   replaceAll()
-   at()

## 数值的扩展

-   Number.isFinite()
-   Number.isNaN()
-   Number.parseInt()
-   Number.parseFloat()
-   Number.isInteger()
-   Number.isSafeInteger()
-   BigInt

## 函数的扩展

-   箭头函数
-   默认值
-   rest 剩余参数

箭头函数有几个使用注意点：

-   箭头函数没有自己的 this 对象（this 指向定义时上层作用域中的 this）。
-   因为没有 this，所以 不可以当作构造函数，也就是说，不可以对箭头函数使用 new 命令，否则会抛出一个错误。
-   不可以使用 arguments 对象，该对象在函数体内不存在。如果要用，可以用 rest 参数代替。
-   不可以使用 yield 命令，因此箭头函数不能用作 Generator 函数。

箭头函数不适用场合：

-   第一个场合是： 定义对象的方法，且该方法内部包括 this。

```js
const cat = {
    lives: 9,

    // 错误案例
    jumps: () => {
        this.lives--;
    },

    // 如果是普通函数，该方法内部的 this 指向 cat；
    // 若是上述的箭头函数 this 指向全局对象；（cat.junps() 被 window调用）
    // 这是因为对象不构成单独的作用域，导致 jumps 箭头函数定义时的作用域就是全局作用域。
};
```

-   第二个场合是：需要动态 this 的时候，也不应使用箭头函数。

```js
var button = document.getElementById('press');

button.addEventListener('click', () => {
    this.classList.toggle('on');
});
```

上面代码运行时，点击按钮会报错，因为 button 的监听函数是一个箭头函数，导致里面的 this 就是全局对象。如果改成普通函数，this 就会动态指向被点击的按钮对象。

另外，如果函数体很复杂，有许多行，或者函数内部有大量的读写操作，不单纯是为了计算值，这时也不应该使用箭头函数，而是要使用普通函数，这样可以提高代码可读性。

## 数组的扩展

-   扩展运算符…
-   解构赋值
-   Array.from() 将类数组对象 和 可遍历（iterable）的对象 转为真正的数组
-   Array.of()方法用于将一组值 转换为数组。
-   entries()，keys()和 values()用于遍历数组。
    for of(遍历数组以及有 interr 接口的 set map )

## 对象的扩展

-   扩展运算符…
-   解构赋值
-   Object.is() 比较两个值是否相等
-   Object.assign()
-   Object.keys()，Object.values()，Object.entries()
-   Object.fromEntries()
-   Object.hasOwn() Object.hasOwn()的一个好处是，对于不继承 Object.prototype 的对象不会报错，而 hasOwnProperty() 是会报错的。

## 运算符的拓展

-   链判断运算符 ?. （判断对象是否存在）。
-   Null 判断运算符?? （只有运算符左侧的值为 null 或 undefined 时，才会返回右侧的值。空字符串或 false 或 0 不生效）。

## Symbol Set Map

## Proxy Reflect

Reflect 和 Object 类似

-   将 Object 对象的一些明显属于语言内部的方法，放到 Reflect 对象上。
    <br /> 比如 Object.defineProperty。

-   修改某些 Object 方法的返回结果，让其变得更合理。
    <br /> 比如，Object.defineProperty(obj, name, desc)在无法定义属性时，会抛出一个错误，而 Reflect.defineProperty(obj, name, desc)则会返回 false。

-   让 Object 操作都变成函数行为。某些 Object 操作是命令式。
    <br />比如 name in obj 和 delete obj[name]，而 Reflect.has(obj, name)和 Reflect.deleteProperty(obj, name)让它们变成了函数行为。

-   Reflect 对象的方法与 Proxy 对象的方法一一对应，只要是 Proxy 对象的方法，就能在 Reflect 对象上找到对应的方法。

Reflect 对象一共有以下 13 个静态方法：

Reflect.apply(target, thisArg, args) <br />
Reflect.construct(target, args) <br />
Reflect.get(target, name, receiver) <br />
Reflect.set(target, name, value, receiver) <br />
Reflect.defineProperty(target, name, desc) <br />
Reflect.deleteProperty(target, name)<br />
Reflect.has(target, name)<br />
Reflect.ownKeys(target)<br />
Reflect.isExtensible(target)<br />
Reflect.preventExtensions(target)<br />
Reflect.getOwnPropertyDescriptor(target, name)<br />
Reflect.getPrototypeOf(target)<br />
Reflect.setPrototypeOf(target, prototype)<br />

上面这些方法的作用，大部分与 Object 对象的同名方法的作用都是相同的，而且它与 Proxy 对象的方法是一一对应的。

## Promise Generator async

## for of

只有 `Symbol.iterator` 属性的数据结构才能 用 for...of 循环遍历它的成员。如：`数组`、`Set`、`Map`、`字符串`、`DOM NodeList 对象`、`arguments对象`。

对于普通的 对象，for...of 结构不能直接使用，会报错，必须部署了 Iterator 接口后才能使用。

## class

## Module

...todo....
