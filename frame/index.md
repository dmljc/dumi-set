---
toc: content
order: 1
---

# 记一次项目重构

## 什么是重构

在不影响项目功能使用前提下，使用一系列的重构方式，改变项目的内部结构。提高项目内部的可读性，可维护性。

## 为什么重构

随着业务需求的不断增加，变更，项目的代码也难免会出现瑕疵，这就会影响代码的可读性，可维护性，甚至影响项目的性能。而重构的目的，就是为了解决这些瑕疵，保证代码质量和性能。但是前提是不能影响项目的使用。

重构的原因，大概有以下几点：

-   项目体积过于庞大，第三方依赖版本过低，导致编译和打包效率极低
-   第三方依赖 版本跨度大，旧版本的功能难拓展，新版本的功能无法使用。升级 === 重构
-   通用组件和函数逻辑混乱，且拓展性较差
-   重复代码太多，没有复用性。
-   部分虽然功能正常，但性能消耗较多，或存在潜在 bug
-   消除`破窗效应`，避免破罐子破摔加速恶化

## 如何解决痛点

-   使用业界优秀的脚手架搭 create-react-app 建项目
-   第三方依赖的优化
-   技术栈迁移，全面拥抱 react rooks (更好的代码组织，逻辑抽离)
-   通用组件和函数重构 (简短，高效)
-   解决长列表性能优化和潜在的 bug

### create-react-app

使用 CRA 脚手架创建的项目，如果想要修改编译配置，通常可能会选择 `npm run eject` 弹出配置后修改。但是，eject 是`不可逆`操作，弹出配置后，你将无法跟随官方的脚步去升级项目的版本。

如果想要无 `eject` 重写 `CRA` 配置，目前成熟的是下面这几种方式：

-   使用 `react-app-rewired` + `customize-cra` 组合覆盖配置
-   使用 `craco` 覆盖配置

第一种方式相对第二种略复杂一些，`AntDesign4` 官方也开始推荐 `craco` 了，今天主要在这里详细讨论一下 `craco` 的使用。

### 第三方依赖的优化

对时间的格式化放弃 moment，使用 dayjs，原因如下：

-   `moment` 的功能强大但是体积也最大，moment.min.js 的体积为 `51K`，dayjs.min.js 体积为`7K`
-   `moment` 作者已经放弃维护 monent，dayjs 则在长期维护中
-   接口几乎完全一致，相互切换的学习成本极低

### 放弃 redux

我们放弃了 redux，实现了一个简易版的 redux 来存储数据，原因如下：

-   redux 虽然很成熟，但是 使用和维护成本有点高，相比不引入，引入是有成本的
-   对我们项目而言 简易版的 redux 足够

### 针对长列表的性能问题

-   优化交互 (把列表中公用的下拉选项抽离到独立区域，极大的减少 dom 节点的渲染)
-   引入 `react-virtualized` 虚拟滚动

### 定时器

组件卸载之前把定时器 `setTimeout` 和 `setInterval`，手动卸载掉，以免造成内存泄漏。

### 通用函数优化

比如：数组去重复，原逻辑是使用双重 for 循环方式去重，优化方案是：es6 set，简洁并且高效

### 优化搜索性能

防抖 和 节流优化 自定义 react hooks

### 前端 数据缓存

localStorage

## 公共部分抽离包

通用组件、函数、工具、自定义 hooks 等抽离公共包独立维护，并提供给兄弟部门使用，减少了开发成本，提高了复用性。

### webpack 配置优化

-   `CssMinimizerWebpackPlugin` 优化 和 压缩 CSS
-   `babel-loader` 明确范围搜索， 开启缓存

-   `terser-webpack-plugin` 多进程并发执行
-   `image-webpack-loader` 压缩图片

-   `IgnorePlugin` 避免引入无用模块
-   `noParse` 对完全不需要解析的库进行忽略
-   `DllPlugin` 抽离第三方包

## 重构后的收益

解决了现有的痛点，提升了用户体验，降低了维护成本，得到了客户和领导的认可。为后续项目的重构积累了经验。

<!-- https://juejin.cn/post/6844903597092651015 -->

<!-- ```js
const CracoLessPlugin = require('craco-less')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

...
...
webpack: {
    alias: {
        '@': pathResolve('src'),    // 配置别名
    },
    new BundleAnalyzerPlugin({
        analyzerMode: 'disabled',  // 关闭脚手架启动之后默认打开可视化分析视图，配置执行build之后显示
    })
}
rules: [
    {
        test: /\.js$/,
        use: ['babel-loader?cacheDirectory'],   // babel-loader 启用缓存
        include: path.resolve('src'),   // 指定范围
    },
],
plugins: [
    {
        plugin: CracoLessPlugin,
        ...
        ...
    },
]

style: {
    // tailwindcss 非常好用的css框架
    postcss: {
        plugins: [require('@tailwindcss/postcss7-compat'), require('autoprefixer')]
    }
}
``` -->
