---
toc: content
order: 4
---

# Vue 响应式原理

## Vue2.0 响应式原理

整体思路是 `数据劫持` + `观察者模式`

对象内部通过 `defineReactive` 方法，使用 `Object.defineProperty` 将属性进行`劫持`（只会劫持已经存在的属性），数组则是通过`重写数组`方法来实现。当页面使用对应属性时，每个属性都拥有自己的 `dep` 属性，存放他所依赖的 `watcher`（依赖收集），当属性变化后会通知自己对应的 `watcher` 去更新(派发更新)。

```js
// 重新定义属性，监听起来
function defineReactive(target, key, value) {
    // 深度监听
    observer(value);

    // 核心 API 兼容性在ie9以及以上
    Object.defineProperty(target, key, {
        get() {
            // 需要做依赖收集过程 这里代码没写出来
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
                updateView();
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

    // 污染全局的 Array 原型
    // Array.prototype.push = function () {
    //     updateView()
    //     ...
    // }

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

// 准备数据
const data = {
    name: 'zhangsan',
    age: 20,
    info: {
        address: '杭州', // 需要深度监听
    },
    nums: [10, 20, 30],
};

// 监听数据
observer(data);

// 测试
// data.name = 'lisi'
// data.age = 21
// // console.log('age', data.age)
// data.x = '100' // 新增属性，监听不到 —— 所以有 Vue.set
// delete data.name // 删除属性，监听不到 —— 所有已 Vue.delete
// data.info.address = '上海' // 深度监听
data.nums.push(4); // 监听数组
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

## Vue.set 方法原理

因为响应式数据 我们给对象和数组本身都增加了**ob**属性，代表的是 Observer 实例。当给对象新增不存在的属性 首先会把新的属性进行响应式跟踪 然后会触发对象**ob**的 dep 收集到的 watcher 去更新，当修改数组索引时我们调用数组本身的 splice 方法去更新数组

```js
export function set(target: Array | Object, key: any, val: any): any {
    // 如果是数组 调用我们重写的splice方法 (这样可以更新视图)
    if (Array.isArray(target) && isValidArrayIndex(key)) {
        target.length = Math.max(target.length, key);
        target.splice(key, 1, val);
        return val;
    }
    // 如果是对象本身的属性，则直接添加即可
    if (key in target && !(key in Object.prototype)) {
        target[key] = val;
        return val;
    }
    const ob = (target: any).__ob__;

    // 如果不是响应式的也不需要将其定义成响应式属性
    if (!ob) {
        target[key] = val;
        return val;
    }

    // 将属性定义成响应式的
    defineReactive(ob.value, key, val);
    // 通知视图更新
    ob.dep.notify();
    return val;
}
```

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

**通过 Vue 源码部分查看，我们就能知道 Vue 框架是通过递归遍历对象和重写数组的原型，从而达到利用 Object.defineProperty() 也能对对象和数组（部分方法的操作）进行监听。**

为了解决以上两个缺陷，Vue 3.0 打算 用 Proxy 改写双向绑定的实现。

## Vue3.0 响应式原理

```js
// 创建响应式
function reactive(target = {}) {
    if (typeof target !== 'object' || target == null) {
        // 不是对象或数组，则返回
        return target;
    }

    // 代理配置
    const proxyConf = {
        get(target, key, receiver) {
            // 只处理本身（非原型的）属性
            const ownKeys = Reflect.ownKeys(target);
            if (ownKeys.includes(key)) {
                console.log('get', key); // 监听
            }

            const result = Reflect.get(target, key, receiver);

            // 深度监听
            // 性能如何提升的？
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
            console.log('set', key, val);
            // console.log('result', result) // true
            return result; // 是否设置成功
        },
        deleteProperty(target, key) {
            const result = Reflect.deleteProperty(target, key);
            console.log('delete property', key);
            // console.log('result', result) // true
            return result; // 是否删除成功
        },
    };

    // 生成代理对象
    const observed = new Proxy(target, proxyConf);
    return observed;
}

// 测试数据
const data = {
    name: 'zhangsan',
    age: 20,
    info: {
        city: 'hangzhou',
        a: {
            b: {
                c: {
                    d: {
                        e: 100,
                    },
                },
            },
        },
    },
};

const proxyData = reactive(data);
```

### Proxy 优势如下:

-   Proxy 可以直接监听对象而非属性；
-   Proxy 可以直接监听数组的变化；
-   Proxy 有多达 13 种拦截方法,不限于 apply、ownKeys、deleteProperty、has 等等是 Object.defineProperty 不具备的；
-   Proxy 返回的是一个新对象,我们可以只操作新的对象达到目的,而 Object.defineProperty 只能遍历对象属性直接修改；
-   Proxy 作为新标准将受到浏览器厂商重点持续的性能优化，也就是传说中的新标准的性能红利；

### Proxy 劣势如下:

-   不兼容 ie 浏览器，看下图 proxy 的兼容性问题

![proxy](/images/proxy.png)

### Object.defineProperty 的优势如下:

兼容性好，支持 IE9，而 Proxy 的存在浏览器兼容性问题,而且无法用 polyfill 磨平

-   Class 可以用 function 模拟
-   Promise 可以用 callback 来模拟
-   但是 Proxy 的功能不能用 Object.defineProperty 来模拟
