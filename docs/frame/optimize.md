---
toc: content
order: 11
---

# 性能优化

## 网络层面

### 减少 HTTP 请求

-   合并文件：将多个 CSS 和 JavaScript 文件合并为一个文件，可以减少 HTTP 请求的数量。
-   压缩文件：将 CSS、JavaScript 和 HTML 文件压缩，可以减少文件的大小，从而减少 HTTP 请求的数量。
<!-- -   图片精灵：将多张图片合并为一张图片，通过 CSS 的 background-position 属性来显示不同的部分，可以减少 HTTP 请求的数量，当然如果是图标建议使用 iconfont。 -->

### DNS 预解析

link 标签的 rel 属性设置 dns-prefetch，提前获取域名对应的 IP 地址。

```JS
<link rel="dns-prefetch" href="https://fonts.googleapis.com/">
```

### 预加载和懒加载

预加载可以在页面加载时提前加载一些资源，以便后续使用。懒加载可以在需要时动态加载资源，从而减少页面的初始加载时间。

预加载示例代码：

```html
<!-- 预加载图片 -->
<link rel="preload" href="image.jpg" as="image" />

<!-- 预加载CSS文件 -->
<link rel="preload" href="styles.CSS" as="style" />
```

懒加载示例代码：

```JS
// 使用Intersection Observer API实现图片懒加载
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.getAttribute('data-src');
            img.setAttribute('src', src);
            observer.unobserve(img);
        }
    });
});

const imgs = document.querySelectorAll('img[data-src]');
imgs.forEach((img) => observer.observe(img));
```

### 使用 CDN（内容分发网络）

CDN (内容分发网络) 指的是一组分布在各个地区的服务器。这些服务器存储着数据的副本，因此服务器可以根据哪些服务器与用户距离最近，来满足数据的请求。

CND 优点：

-   降低我们自身服务器的请求压力
-   选择就近服务器获取数据
-   CDNs 已经配置了恰当的缓存设置

### http 缓存

分别为`强缓存`和`协商缓存`。

强缓存不需要客户端向服务端发送请求，有两种响应头实现方案：

-   `Expires`：值是一个绝时间，在这个时间前缓存有效，但是如果本地时间被修改，会导致缓存失效。
-   `Cache-control`：值是一个相对时间，单位为秒，资源在这个时间内有效。

强缓存过期之后会使用协商缓存，协商缓存需要客户端向服务端发送请求，资源未过期则服务端返回 `304 ` 否则返回新的资源。 协商缓存也有两种实现方案：

-   `Last-Modified` 和 If-Modified-Since：Last-Modified 表示本地文件最后修改日期，`If-Modified-Since` 会将 Last-Modified 的值发送给服务器，询问服务器在该日期后资源是否有更新，有更新的话就会将新的资源发送回来。但是如果本地文件被打开，会导致 Last-Modified 被修改。
-   `ETag` 和 If-None-Match：ETag 类似于文件指纹，`If-None-Match` 会将当前 ETag 发送给服务器，询问该资源 ETag 是否变动，有变动的话就将新的资源发送回来。并且 ETag 优先级比 Last-Modified 高。

### http 压缩 Content-Encoding

压缩组件通过减少 HTTP 请求产生的响应包的大小，从而降低传输时间的方式来提高性能。

客户端会使用 Accept-Encoding 在请求头 事先声明一系列可以支持的压缩模式，与请求一齐发送。
服务端会选择一个客户端提议的方式，使用并在响应头 Content-Encoding 中通知客户端该选择。

请求头：

```JS
Accept-Encoding: gzip, compress, deflate, br  // 四种不同的压缩方式
```

响应头：

```JS
Content-Encoding: gzip, compress, deflate, br
```

## 页面渲染层面

```text
处理 HTML 并构建 DOM 树
处理 CSS 构建 CSS 规则树(CSSOM)
DOM Tree 和 CSSOM Tree 合成一棵渲染树 Render Tree。
根据渲染树来布局，计算每个节点的位置
调用 GPU 绘制，合成图层，显示在屏幕上
```

### 避免 CSS 阻塞

CSS 影响 renderTree 的构建，会阻塞页面的渲染，因此应该尽早（将 CSS 放在 head 标签里）和尽快（启用 CDN 实现静态资源加载速度的优化)的将 CSS 资源加载。

### 降低 CSS 选择器的复杂度

浏览器读取选择器，遵循的原则是从选择器的右边到左边读取。

减少嵌套：最多不要超过三层，并且后代选择器的开销较高，慎重使用
利用继承，避免重复匹配和定义。

### 避免 JS 阻塞

JS 可以修改 CSSOM 和 DOM，因此 JS 会阻塞页面的解析和渲染，
并且会等待 CSS 资源的加载。也就是说 JS 会抢走渲染引擎的控制权。所以我们需要给 JS 资源添加 defer 或者 async，并行下载 JS。

### 使用字体图标 iconfont 代替图片图标

图片图标会增加网络请求次数，从而拖慢页面加载时间，iconfont 可以很好的缩放并且不会添加额外的请求。

### 减少重绘和回流

- 使用 visibility 替换 display: none，因为前者只会引起重绘，后者会引发重排；opacity 代替 visiability，visiability 会触发重绘，但 opacity 不会。
- 尽量少用 table 布局，table 布局的话，每次有单元格布局改变，都会进行整个 tabel 回流重绘；
- 不要把 DOM 结点的属性值放在一个循环里当成循环里的变量。

```JS
for (let i = 0; i < 1000; i++) {
    // 获取 offsetTop 会导致回流，因为需要去获取正确的值
    console.log(document.querySelector('.test').style.offsetTop);
}
```

- 动画实现的速度的选择，动画速度越快，回流次数越多，也可以选择使用 requestAnimationFrame。

### 动画尽量使用 CSS3 避免 JS 实现动画

JS 动画优点：

-   JS 动画控制能力强，可以在动画博凡过程中对动画进行精细控制，开始、暂停、终止、取消都是可以做到的
-   动画效果比 CSS3 动画丰富，比如曲线运动，冲击闪烁，视差滚动效果，只有 JS 动画才能完成
-   JS 动画大多数情况下没有兼容性问题，而 CSS3 动画有兼容性问题

JS 动画缺点：

-   JS 动画的复杂度高于 CSS3
-   JS 在动画浏览器的主线程中执行，而主线程还有其他 javaScript 脚本，样式计算、布局、绘制任务等，对其干扰可能出现阻塞从而出现丢帧的情况
-   JS 动画往往需要频繁操作 DOM 的 CSS 属性来实现视觉上的动画效果，这个时候浏览器要不停地执行重绘和重排，这对于性能的消耗是很大的，尤其是在分配给浏览器的内存没那么宽裕的移动端。

CSS3 动画优点：

-   CSS3 动画可以使用 GPU 加速，从而减少重排和重绘的次数。

CSS3 缺点：

-   动画控制能力较弱
-   代码冗长。想用 CSS 实现稍微复杂一点动画,最后 CSS 代码都会变得非常笨重。

### 使用事件委托

### 使用防抖和节流

防抖和节流可以避免重复执行代码，从而减少不必要的资源消耗。可以通过以下方式来使用防抖和节流：

### 使用 LocalStorage

可使用 LocalStorage 将数据缓存在客户端，从而减少服务器的压力和减少 HTTP 请求的数量。

### 使用 Web Workers

Web Workers 可以将 JavaScript 代码在后台线程中运行，从而减少主线程的负载，提高页面响应速度。可以通过以下方式来使用 Web Workers：

```JS
// 创建一个Web Worker
// worker.JS
self.onmessage = function (event) {
    const data = event.data;
    const result = data.map((item) => item * 2);
    self.postMessage(result);
};

// 在主线程中调用Web Worker
const worker = new Worker('worker.JS');
worker.postMessage([1, 2, 3]);
worker.onmessage = function (event) {
    const result = event.data;
    console.log('Result from worker:', result);
};
```

## Webpack 构建

### 缩小 loader 匹配范围

```JS
include: path.resolve(__dirname, "./src"),
```

### resolve.modules

resolve.modules 用于配置 webpack 去哪些目录下寻找第三方模块，默认是 node_modules。

```JS
module.exports = {
    resolve: {
        modules: [path.resolve(__dirname, './node_modules')],
    },
};
```

### noParse

noParse 对完全不需要解析的库进行忽略，可以提高构建性能。

### externals

externals 告诉 webpack 这些依赖是 CND 提供的，在打包时可以忽略它们。

### IgnorePlugin

忽略第三方包指定目录，让这些指定目录不要被打包进去。

### 抽离 CSS

借助 mini-CSS-extract-plugin:本插件会将 CSS 提取到单独的文件中，为每个包含 CSS 的 JS 文件创建一个 CSS 文件，并且支持 CSS 和 SourceMaps 的按需加载。

### 压缩 CSS

CSS-minimizer-webpack-plugin 优化 和 压缩 CSS。

### JS 代码压缩

webpack5 开箱即带最新版本的 terser-webpack-plugin。如果你使用的是 webpack5 或更高版本，同时希望自定义配置，那么仍需要安装 terser-webpack-plugin。

babel-plugin-transform-runtime 减少 ES6 转化 ES5 的冗余。

### 图片压缩

image-webpack-loader。

### 代码分离-分包

将代码分离到不同的 bundle 中，之后我们可以按需加载，或者并行加载这些文件。

默认情况下，所有的 JavaScript 代码（业务代码、第三方依赖、暂时没有用到的模块）在首页全部都加载，就会影响首页的加载速度。

## Vue

-   对象层级不要过深，否则性能就会差
-   不需要响应式的数据不要放到 data 中（可以用 Object.freeze() 冻结数据）
-   v-if 和 v-show 区分使用场景
-   computed 和 watch 区分使用场景
-   v-for 遍历必须加 key，key 最好是 id 值，且避免同时使用 v-if
-   大数据列表和表格性能优化-虚拟列表/虚拟表格
-   防止内部泄漏，组件销毁后把全局变量和事件销毁
-   图片懒加载
-   路由懒加载
-   异步组件
-   第三方插件的按需引入
-   适当采用 keep-alive 缓存组件
-   防抖、节流运用
-   服务端渲染 SSR or 预渲染

## React

-   React.memo 缓存组件
-   useMemo 缓存数据
-   useCallback 缓存函数
-   React.lazy Suspense 异步组件
