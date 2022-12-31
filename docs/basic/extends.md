---
toc: content
order: 6
---

# 类的创建和继承

## 类的创建

在 ES5 中，`类的创建`方式是创建 一个 `function`，在这个 function 的 `prototype` 里面增加`属性`和`方法`。

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

## 原型链继承

`将父类的实例作为子类的原型。`

```js
function Parent() {
    this.name = ['张三'];
}

Parent.prototype.getName = function() {
    return this.name;
}

function Child() {};

// 子类的原型指向父类的实例 
Child.prototype = new Parent();

const child = new Child();

console.log('child.name', child.name);  // ['张三']
console.log('child.name', child.getName()); // ['张三']

const child2 = new Child();

child2.name[0] = '王二';
console.log('-----》child.name', child.name); // ['王二']
console.log('-----》child2.name', child2.name); // ['王二']

```
优点：
- 父类方法可以复用。

缺点：
- 父类的所有引用属性会被所有子类共享，更改一个子类的引用属性，其他子类也会受影响；
- 子类型实例不能给父类型构造函数传参；

## 构造函数继承

`在子类构造函数中调用父类的构造函数，并使用 apply 为其绑定子类的this（改变this的指向）。`

```js
// 定义父类
function Parent(value) {
    this.value = value;
}

// 定义子类
function Children() {
    Parent.apply(this, arguments);
} 

const test = new Children(666);

test.value; // 666
```
优点：
- 父类的引用属性不会被共享；
- 可以在子类构造函数中向父类传参数；

缺点：
- 子类不能访问父类原型上定义的方法，因此所有方法属性都写在构造函数中，每次创建实例都会初始化；

## extends 实现继承

在 ES6 中，我们可以通过 `class` 和 `extends` 实现继承；

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

注意：子类必须在 `constructor` 方法中调用 `super `方法，否则新建实例时会报错，因为子类没有自己的 `this` 对象，而是继承父类的 this 对象。

<Alert type="info">
ES5 和 ES6 继承的区别: <br/><br/>
区别于 ES5 的继承，ES6 的继承实现在于使用 super 关键字调用父类。反观 ES5 是通过 call 或者 apply 回调方法调用父类。
</Alert>
