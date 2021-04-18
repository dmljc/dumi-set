---
toc: content
---

# 类的创建和继承

## 类的创建

在 ES5 中，类的创建方式是创建 一个 function，在这个 function 的 prototype 里面增加属性和方法。

下面来创建一个 Animal 类：

```js
// 定义一个动物类
function Animal(name) {
    // 属性
    this.name = name || 'Animal';
    // 实例方法
    this.sleep = function () {
        console.log(this.name + '正在睡觉！');
    };
}
// 原型方法
Animal.prototype.eat = function (food) {
    console.log(this.name + '正在吃：' + food);
};
```

这样就生成了一个 Animal 类，实力化生成对象后，有方法和属性。

## 构造函数继承

在 ES5 中，我们可以使用 构造函数实现继承，使用父类的构造函数来增强子类实例，等于是复制父类的实例属性给子类（没用到原型）。

```js
// 定义父类
function Parent(value) {
    this.language = ['javascript', 'react', 'node.js'];
    this.value = value;
}

// 定义子类
function Children() {
    Parent.apply(this, arguments);
}

const test = new Children(666);

test.language; // ['javascript', 'react', 'node.js']
test.value; // 666
```

构造继承关键在于，通过在子类的内部调用父类，即通过使用 apply()或 call()方法可以在将来新创建的对象上获取父类的成员和方法。

## class、extends 实现继承

在 ES6 中，我们可以通过 class 和 extends 实现继承

```js
// 定义父类
class Parent {
    constructor(name, age) {
        this.grandmather = 'rose';
        this.grandfather = 'jack';
    }
    show() {
        console.log(`我叫:${this.name}， 今年${this.age}岁`);
    }
}

// 通过extends关键字实现继承
class Children extends Parent {
    constructor(mather, father) {
        //super 关键字，它在这里表示父类的构造函数，用来新建父类的 this 对象。
        super();
        this.mather = mather;
        this.father = father;
    }
}

const child = new Children('mama', 'baba');

console.log(child);
// father: "baba"
// grandfather: "jack"
// grandmather: "rose"
// mather: "mama"
```

注意：子类必须在 constructor 方法中调用 super 方法，否则新建实例时会报错。这是因为子类没有自己的 this 对象，而是继承父类的 this 对象，然后对其进行加工。

<Alert type="info">
ES5 和 ES6 继承的区别: <br/><br/>
区别于 ES5 的继承，ES6 的继承实现在于使用 super 关键字调用父类。反观 ES5 是通过 call 或者 apply 回调方法调用父类。
</Alert>
