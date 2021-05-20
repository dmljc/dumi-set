---
toc: content
order: 2
---

# this、calll、new

## this 关键字

非箭头函数中 `this` 指向调用函数的对象

```js
function foo() {
    console.log(this.a);
}
var a = 1;
foo();

var obj = {
    a: 2,
    foo: foo,
};
obj.foo();

// 以上两者情况 `this` 只依赖于调用函数前的对象，优先级是第二个情况大于第一个情况

// 以下情况是优先级最高的， `this` 只会绑定在 `c` 上，不会被任何方式修改 `this` 指向
var c = new foo();
c.a = 3;
console.log(c.a);

// 还有种就是利用 call，apply，bind 改变 this，这个优先级仅次于 new
```

以上几种情况明白了，很多代码中的 `this` 应该就没什么问题了，下面让我们看看箭头函数中的 `this`

```js
function a() {
    return () => {
        return () => {
            console.log(this);
        };
    };
}
console.log(a()()());
```

箭头函数其实是没有 `this` 的，这个函数中的 `this` 只取决于他外面的第一个不是箭头函数的函数的 `this` （定义时所在的对像）。在这个例子中，因为调用 `a` 符合前面代码中的第一个情况，所以 `this` 是 `window` 。并且 `this` 一旦绑定了上下文，就不会被任何代码改变。

箭头函数存在的意义：第一写起来更加简洁，第二可以解决 ES6 之前函数执行中 this 是全局变量的问题，看如下代码：

```js
function fn() {
    console.log('real', this); // {a: 100} ，该作用域下的 this 的真实的值
    var arr = [1, 2, 3];
    // 普通 JS
    arr.map(function(item) {
        console.log('js', this); // window 。普通函数，这里打印出来的是全局变量，令人费解
        return item + 1;
    })
    // 箭头函数
    arr.map(item => {
        console.log('es6', this); // {a: 100} 。箭头函数，这里打印的就是父作用域的 this
        return item + 1;
    })
}
fn.call({a: 100})...
```

接下来让我们看一个老生常谈的例子， `var`

```js
b(); // call b
console.log(a); // undefined

var a = 'Hello world';

function b() {
    console.log('call b'); // undefined
}
```

想必以上的输出大家肯定都已经明白了，这是因为函数和变量提升的原因。通常提升的解释是说将声明的代码移动到了顶部，这其实没有什么错误，便于大家理解。但是更准确的解释应该是：在生成执行上下文时，会有两个阶段。第一个阶段是创建的阶段（具体步骤是创建 VO），JS 解释器会找出需要提升的变量和函数，并且给他们提前在内存中开辟好空间，函数的话会将整个函数存入内存中，变量只声明并且赋值为 undefined，所以在第二个阶段，也就是代码执行阶段，我们可以直接提前使用。

在提升的过程中，相同的函数会覆盖上一个函数，并且函数优先于变量提升

```js
b(); // call b second

function b() {
    console.log('call b fist');
}

function b() {
    console.log('call b second');
}
var b = 'Hello world';
```

`var` 会产生很多错误，所以在 ES6 中引入了 `let` 。 `let` 不能在声明前使用，但是这并不是常说的 `let` 不会提升， `let` 提升了声明但没有赋值，因为临时死区导致了并不能在声明前使用。

## 改变 this

首先说下前两者的区别：

`call` 和 `apply` 都是为了解决改变 `this` 的指向。作用都是相同的，只是传参的方式不同。

第一个参数都是 要绑定的 this 对象， `call` 可以接收一个参数列表， `apply` 只接受一个参数数组， `bind` 是创建一个新的函数，我们必须要手动去调用。

```js
// call 实例
var a = {
    name: 'Cherry',
    fn: function (a, b) {
        console.log(a + b);
    },
};

var b = a.fn;
b.call(a, 1, 2); // 3

// apply 实例
var a = {
    name: 'Cherry',
    fn: function (a, b) {
        console.log(a + b);
    },
};

var b = a.fn;
b.apply(a, [1, 2]); // 3复制代码

// bind 实例
var a = {
    name: 'Cherry',
    fn: function (a, b) {
        console.log(a + b);
    },
};

var b = a.fn;
b.bind(a, 1, 2)(); // 3

// 所以我们可以看出，bind 是创建一个新的函数，我们必须要手动去调用。
```

> bind 之后还能修改 this 指向吗？为什么？

`不能，因为作用域已经确定。。`

## 实现 this

> 涉及面试题：call、apply 及 bind 函数内部实现是怎么样的？

首先从以下几点来考虑如何实现这几个函数

-   不传入第一个参数，那么上下文默认为 window
-   改变了 this 指向，让新的对象可以执行该函数，并能接受参数

那么我们先来实现 call

```js
Function.prototype.myCall = function (context) {
    if (typeof this !== 'function') {
        // this 要调用的函数
        throw new Error('Error');
    }
    context = context || window;
    context.fn = this;
    const args = [...arguments].slice(1);
    const result = context.fn(...args);
    delete context.fn;
    return result;
};
```

以下是对实现的分析：

-   首先 context 为可选参数，如果不传的话默认上下文为 window
-   接下来给 context 创建一个 fn 属性，并将值设置为**需要调用的函数**
-   因为 call 可以传入多个参数作为调用函数的参数，所以需要将参数剥离出来
-   然后调用函数并将对象上的函数删除 (fn 只是个临时属性，调用完毕后删除它)

apply 的实现也类似

```js
Function.prototype.myApply = function (context) {
    if (typeof this !== 'function') {
        throw new TypeError('Error');
    }
    context = context || window;
    context.fn = this;
    let result;
    // 处理参数和 call 有区别
    if (arguments[1]) {
        result = context.fn(...arguments[1]);
    } else {
        result = context.fn();
    }
    delete context.fn;
    return result;
};
```

bind 的实现对比其他两个函数略微地复杂了一点，因为 bind 需要返回一个函数，需要判断一些边界问题，以下是 bind 的实现

```js
Function.prototype.myBind = function (context) {
    if (typeof this !== 'function') {
        throw new TypeError('Error');
    }
    const _this = this;
    const args = [...arguments].slice(1);
    // 返回一个函数
    return function F() {
        // 因为返回了一个函数，我们可以 new F()，所以需要判断
        if (this instanceof F) {
            return new _this(...args, ...arguments);
        }
        return _this.apply(context, args.concat(...arguments));
    };
};
```

## 实现 new 关键字

> 涉及面试题：new 的原理是什么？通过 new 的方式创建对象和通过字面量创建有什么区别？

-   新生成了一个对象
-   链接到原型
-   绑定 this
-   返回新对象

在调用 `new` 的过程中会发生以上四件事情，我们也可以试着来自己实现一个 `new`

```js
function create() {
    // 创建一个空的对象
    let obj = {};
    // 获得构造函数
    let Con = [].shift.call(arguments);
    // 链接到原型
    obj.__proto__ = Con.prototype;
    // 绑定 this，执行构造函数
    let result = Con.apply(obj, arguments);
    // 确保 new 出来的是个对象
    return typeof result === 'object' ? result : obj;
}
```

对于实例对象来说，都是通过 `new` 产生的，无论是 `function Foo()` 还是 `let a = { b : 1 }` 。

对于创建一个对象来说，更`推荐使用字面量`的方式创建对象（无论性能上还是可读性）。因为你使用 `new Object()` 的方式创建对象需要通过`作用域链`一层层找到 `Object` ，但是你使用字面量的方式就没这个问题。
