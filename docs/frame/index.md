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

1、使用业界优秀的脚手架搭 create-react-app 建项目
2、第三方依赖使用最高的稳定版本
3、技术栈迁移，全面拥抱 react rooks
3、通用组件和函数重构
4、解决长列表性能优化和潜在的 bug

### create-react-app

使用 CRA 脚手架创建的项目，如果想要修改编译配置，通常可能会选择 `npm run eject` 弹出配置后修改。但是，eject 是`不可逆`操作，弹出配置后，你将无法跟随官方的脚步去升级项目的版本。

如果想要无 `eject` 重写 `CRA` 配置，目前成熟的是下面这几种方式：

-   使用 `react-app-rewired` + `customize-cra` 组合覆盖配置
-   使用 `craco` 覆盖配置

第一种方式相对第二种略复杂一些，`AntDesign4` 官方也开始推荐 `craco` 了，今天主要在这里详细讨论一下 `craco` 的使用。

```js
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
```

## 重构后的收益

<!-- https://juejin.cn/post/6844903597092651015 -->
