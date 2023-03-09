---
toc: content
order: 10
---

# 每日一题

## padding 和 margin 有什么不同？

内边距和外边距，`作用对象`不同。padding 是作用于自身，margin 作用于外部对象。

## 百分比 和 vw 区别？

百分比和父级有继承关系，vw 只和设备的宽度有关。

## 行内元素与块级元素的区别？

行内元素不换行、不可以设置宽高、宽和高由内容决定；
块级元素独占一行，宽度有继承关系，若不设置宽度，则继承父级宽度。

## 如何让 chrome 浏览器 支持小字体？

Chrome 支持的最小字体是 12px，可以通过 transform: scale(0.6) 设置更小的字体;

## var 和 let

var 存在的问题：

1、var 变量提升 => 先上车后买票

```js
console.log(name); // zfc
var name = 'zfc';
```

2、var 没有局部作用域 => 变脸 i 红杏出墙

```js
function fun() {
    for (var i = 0; i < 5; i++) {
        console.log(i); // 0,1,2,3,4
    }
    console.log(i); // 5
}
```

3、声明覆盖 => 套牌车

```js
var name2 = 'zfc';
var name2 = '张芳朝';
console.log(name2); // 张芳朝
```

用 let 会正常报错。


## 深浅拷贝

## 在浏览器输入url 回车后发生了什么？

##


