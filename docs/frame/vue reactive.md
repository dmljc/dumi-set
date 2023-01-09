---
toc: content
order: 4
---

# Vue 响应式原理

## Vue2.0 响应式原理

整体思路是 `数据劫持` + `观察者模式`

对象内部通过 `defineReactive` 方法，使用 `Object.defineProperty` 将属性进行`劫持`（只会劫持已经存在的属性），数组则是通过`重写数组`方法来实现。当页面使用对应属性时，每个属性都拥有自己的 `属性订阅器` dep 属性，存放他所依赖的 `订阅者` watcher，当属性变化后会通知自己对应的 `订阅者` 去`更新`(派发更新)。

> **数据监听器 Observer** ，能够对数据对象的所有属性进行监听，如有变动可拿到最新值并通知订阅者
>
> **指令解析器 Compile** ，对每个元素节点的指令进行扫描和解析，根据指令模板替换数据，以及绑定相应的更新函数
>
> **订阅者 Watcher** ，作为连接 Observer 和 Compile 的桥梁，能够订阅并收到每个属性变动的通知，执行指令绑定的相应回调函数，从而更新视图

<!-- 上述流程如图所示：

![gFwsRj.png](https://t1.picb.cc/uploads/2019/09/16/gFwsRj.png) -->

```js
// 重新定义属性，监听起来
function defineReactive(target, key, value) {
    var dep = new Dep();   // 属性订阅器(dep) Dep 做依赖收集
    // 深度监听
    observer(value);

    // 核心 API 兼容性在ie9以及以上
    Object.defineProperty(target, key, {
        get() {
            dep.depend()    // 需要做依赖收集
            return value;
        },
        set(newValue) {
            if (newValue !== value) {
                // 深度监听
                observer(newValue);

                // 设置新值
                // 注意，value 一直在闭包中，此处设置完之后，再 get 时也是会获取最新的值
                value = newValue;

                // 触发更新视图
                updateView();  ==> // dep.notify(); 通知所有订阅者
            }
        },
    });
}

// 监听对象属性
function observer(target) {
    if (typeof target !== 'object' || target === null) {
        // 不是对象或数组
        return target;
    }

    if (Array.isArray(target)) {
        target.__proto__ = arrProto;
    }

    // 重新定义各个属性（for in 也可以遍历数组）
    for (let key in target) {
        defineReactive(target, key, target[key]);
    }
}

// 重新定义数组原型
const oldArrayProperty = Array.prototype;
// 创建新对象，原型指向 oldArrayProperty ，再扩展新的方法不会影响原型
const arrProto = Object.create(oldArrayProperty);
['push', 'pop', 'shift', 'unshift', 'splice'].forEach((methodName) => {
    arrProto[methodName] = function () {
        updateView(); // 触发视图更新
        oldArrayProperty[methodName].call(this, ...arguments);
        // Array.prototype.push.call(this, ...arguments)
    };
});

// 触发更新视图
function updateView() {
    console.log('视图更新');
}

```

## defineProperty 缺陷

### 无法监听对象属性的添加和移除

Vue 无法检测 `对象属性的添加或移除`。由于 Vue 会在初始化实例时对属性执行 getter/setter 转化，所以 属性 必须在 data 对象上存在才能让 Vue 将它转换为响应式的。例如：

```js
var vm = new Vue({
    data: {
        a: 1,
    },
});

// `vm.a` 是响应式的

vm.b = 2;
// `vm.b` 是非响应式的
```

可以使用 vm.$set 实例方法，这也是全局 Vue.set 方法的别名：

```js
this.$set(this.someObject, 'b', 2);
```

### Vue.set 方法原理

- Vue 给对象和数组本身都增加了 dep 属性；
- 当给对象新增不存在的属性时，就会触发对象依赖的 watcher 去更新；
- 当修改数组索引的时候，就调用数组本身的 splice 方法去更新数组；

### 无法监听数组变化

由于 JavaScript 的限制，Vue 不能检测以下数组的变动：

1、当你利用`索引直接设置一个数组项`时，例如：vm.items[indexOfItem] = newValue  
2、当你`修改数组的长度`时，例如：vm.items.length = newLength

举个官网的例子：

```js
var vm = new Vue({
    data: {
        items: ['a', 'b', 'c'],
    },
});
vm.items[1] = 'x'; // 不是响应性的
vm.items.length = 2; // 不是响应性的
```

为了解决第一类问题，以下两种方式都可以实现和 vm.items[indexOfItem] = newValue 相同的效果，同时也将在响应式系统内触发状态更新：

```js
// Vue.set
Vue.set(vm.items, indexOfItem, newValue);

// Array.prototype.splice
vm.items.splice(indexOfItem, 1, newValue);
```

你也可以使用 vm.$set 实例方法，该方法是全局方法 Vue.set 的一个别名：

```js
vm.$set(vm.items, indexOfItem, newValue);
// 个人比较喜欢这种处理方式 简单粗暴，一步到位
```

为了解决第二类问题 vm.items.length = newLength，你可以使用 splice：

```js
vm.items.splice(newLength);
```

然而[Vue 的文档](https://cn.vuejs.org/v2/guide/list.html#%E6%95%B0%E7%BB%84%E6%9B%B4%E6%96%B0%E6%A3%80%E6%B5%8B)提到了 Vue 是可以检测到部分数组的变化，但是只有以下八种方法：

```js
push();
pop();
shift();
unshift();
splice();
sort();
reverse();
```

内部通过 `重新定义数组原型` 实现的：

```js
// 重新定义数组原型
const oldArrayProperty = Array.prototype;

// 创建新对象，原型指向 oldArrayProperty ，再扩展新的方法不会影响原型
const arrProto = Object.create(oldArrayProperty)[
    ('push', 'pop', 'shift', 'unshift', 'splice')
].forEach((methodName) => {
    arrProto[methodName] = function () {
        updateView(); // 触发视图更新
        oldArrayProperty[methodName].call(this, ...arguments);
        // Array.prototype.push.call(this, ...arguments)
    };
});
```

为了解决以上两个缺陷，Vue 3.0 打算 用 `Proxy` 改写双向绑定的实现。

## Vue3.0 响应式原理

```js
// 生成代理对象
const observed = new Proxy(target, {
    get(target, key, receiver) {
        const ownKeys = Reflect.ownKeys(target);
        if (ownKeys.includes(key)) {
            console.log('get', key); // 监听
        }
        const result = Reflect.get(target, key, receiver);
        // 深度监听
        return reactive(result);
    },
    set(target, key, val, receiver) {
        // 重复的数据，不处理
        if (val === target[key]) {
            return true;
        }

        const ownKeys = Reflect.ownKeys(target);
        if (ownKeys.includes(key)) {
            console.log('已有的 key', key);
        } else {
            console.log('新增的 key', key);
        }

        const result = Reflect.set(target, key, val, receiver);
        return result; // 是否设置成功
    },
    deleteProperty(target, key) {
        const result = Reflect.deleteProperty(target, key);
        return result; // 是否删除成功
    },
});
```

`Reflect` 对象与 `Proxy` 对象一样，也是 ES6 为了`操作对象`而提供的新 API。
主要是将 `Object` 对象的一些明显`属于语言内部的方法`（比如 Object.defineProperty），放到 `Reflect 对象上`。

### Proxy 优势如下:

-   Proxy 可以直接监听对象而非属性；
-   Proxy 可以直接监听数组的变化；
-   Proxy 有多达 13 种拦截方法,不限于 apply、ownKeys、deleteProperty、has 等等是 Object.defineProperty 不具备的；
-   Proxy 返回的是一个新对象,我们可以只操作新的对象达到目的,而 Object.defineProperty 只能遍历对象属性直接修改；
-   Proxy 作为新标准将受到浏览器厂商重点持续的性能优化，也就是传说中的新标准的性能红利；

### Proxy 劣势如下:

-   不兼容 ie 浏览器，看下图 proxy 的兼容性问题

![proxy](/images/frame/proxy.png)

### Object.defineProperty 的优势如下:

兼容性好，支持 IE9，而 Proxy 的存在浏览器兼容性问题,而且无法用 polyfill 磨平

-   Class 可以用 function 模拟
-   Promise 可以用 callback 来模拟
-   但是 Proxy 的功能不能用 Object.defineProperty 来模拟
