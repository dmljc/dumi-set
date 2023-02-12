---
toc: content
order: 4
---

# Webpack5

webpack 是一个现代 JavaScript 应用程序的静态模块打包器(module bundler)。当 webpack 处理应用程序时，它会递归地构建一个依赖关系图(dependency graph)，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle。

![](https://t1.picb.cc/uploads/2019/09/09/gXSVgg.png)

## 为什么要进行构建和打包？

-   体积更小 (压缩、合并、Tree-Shaking)，加载更快
-   编译高级语言 (TS、Less) 或 语法 (ES6+、模块化)
-   兼容性和错误检查(Pollyfill、postcss、eslint)
-   统一的构建流程和产出标准

## module chunk bundle

-   module 各个源代码文件，webpack 中一切皆模块
-   chunk 多模块合成的，如 entry、import()、splitChunk
-   bundle 最终的输出文件

## loader 和 plugin 的区别

<!-- `Loader` 直译为"加载器"，本质就是一个`函数`，该函数对接收到的内容进行`转换`，返回转换后的结果。因为 `Webpack` 只能解析 `JavaScript`，如果想将其他文件也打包的话，就会用到`Loader`。所以 `Loader` 的作用是让 `Webpack` 拥有了加载和解析`非JavaScript`文件的能力。 -->

`Webpack 只能解析 JavaScript 和 JSON 文件`，这是 webpack 开箱可用的自带能力。loader 让 webpack 能够去处理其他类型的文件，并将它们转换为有效模块。

<!--
`Plugin` 直译为"插件"，基于事件流框架 `Tapable`，插件可以扩展 Webpack 的功能，在 `Webpack` 运行的`生命周期中`会广播出许多`事件`，`Plugin` 可以监听这些事件，在合适的时机通过 Webpack 提供的 API `改变输出结果`。 -->

`plugin 目的在于解决 loader 无法实现的其他事`。而插件则可以用于执行范围更广的任务。包括：打包优化，资源管理，注入环境变量。

## 浏览器兼容性

Webpack 支持所有符合 ES5 标准 的浏览器（不支持 IE8 及以下版本）。webpack 的 import() 和 require.ensure() 需要 Promise。如果你想要支持旧版本浏览器，在使用这些表达式之前，还需要 提前加载 `polyfill`。

<!-- ## 懒加载

-   import() 函数
-   结合 Vue React 异步组件
-   结合 Vue-router React-router 异步加载路由 -->

<!-- ## 自动刷新

```js
"scripts": {
    "watch": "webpack --watch",
},
```

唯一的缺点是，为了看到修改后的实际效果，你需要`刷新浏览器`。

如果能够`自动刷新`浏览器就更好了，因此接下来我们会尝试通过 `webpack-dev-server` 实现此功能。 -->

## 热更新

`webpack-dev-server` 具备热更新能力(hot module replacement)，保存之后无需刷新即可加载整个页面。

```js
devServer: {
    contentBase: './dist',
    // 此配置告知 `webpack-dev-server`，将 `dist` 目录下的`文件`，`serve` 到 localhost:8080 下
    // 如果你更改任何源文件并保存它们，web server 将在编译代码后自动重新加载。
},
```

`webpack-dev-server` 在`编译之后`不会写入到任何输出文件。而是将 `bundle` 文件保留在`内存`中，然后将它们 serve 到 server 中，就好像它们是挂载在 server 根路径上的真实文件一样。

如果希望在其他`不同路径`中找到 `bundle` 文件，则可以通过 `devServer` 配置中的 `publicPath` 选项进行修改。

## 处理 HTML

`HtmlWebpackPlugin`

该插件将为你生成一个 `HTML5 文件`， 在 `body` 中使用 `script` 标签引入你所有 webpack 生成的 `bundle`。

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    entry: 'index.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'index_bundle.js',
    },
    plugins: [new HtmlWebpackPlugin()],
};
```

这将会生成一个包含以下内容的 dist/index.html 文件：

```js
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>webpack App</title>
  </head>
  <body>
    <script src="index_bundle.js"></script>
  </body>
</html>
```

如果你有多个 webpack 入口，他们都会在已生成 HTML 文件中的 `<script>` 标签内引入。

## 处理 CSS

### less-loader、postcss-loader、autoprefixer

-   `less-loader` 将 Less 编译为 CSS 的 loader。
-   `postcss-loader` 使用 PostCSS 处理 CSS 的 loader。
-   `autoprefixer` 为 `css3` 添加浏览器前缀。

<!-- `postcss-loader` + `autoprefixer` 为 `css3` 添加浏览器前缀。 -->

```js
rules: [
    {
        test: /\.less$/,
        use: [
            'style-loader',
            'css-loader',
            {
                loader: 'postcss-loader',
                options: {
                    plugins: [require('autoprefixer')],
                },
            },
            'less-loader',
        ], // 从右向左解析原则
    },
];
```

这时候我们发现 CSS 通过 Style 标签的方式添加到了 Html 文件中，但是如果样式文件很多，全部添加到 Html 中，难免显得混乱。这时候我们想用把 CSS 拆分出来用外链的形式引入 CSS 文件怎么做呢？这时候我们就需要借助插件来帮助我们。

### MiniCssExtractPlugin

`将 CSS 提取到单独的文件中`，为每个包含 CSS 的 JS 文件创建一个 CSS 文件，并且支持 `CSS` 和 `SourceMaps` 的 `按需加载`。

webpack.config.js

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    plugins: [new MiniCssExtractPlugin()],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
        ],
    },
};
```

<!-- ### ExtractTextWebpackPlugin

`MiniCssExtractPlugin` 会将所有的 CSS 样式合并为 `一个 CSS 文件`。如果你想拆分为一一对应的`多个 CSS 文件`，我们需要使用到 `ExtractTextWebpackPlugin`。 -->

### CssMinimizerWebpackPlugin

`优化` 和 `压缩 CSS`。这将`仅在生产环境开启` CSS 优化。 如果还想在开发环境下启用 CSS 优化，请将 optimization.minimize 设置为 true。

```js
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin({
                test: /\.foo\.css$/i, // 用来匹配文件
                include: /\/includes/, // 要包含的文件
                parallel: true, // 多进程并发执行，提升构建速度 ====> 强烈建议使用
            }),
        ],
    },

    //  开发环境下启用 CSS 优化
    optimization: {
        // [...]
        minimize: true,
    },
};
```

## 处理 JS

### babel-loader

把 ES6+ 语法转为 ES5 语法。

```js
rules: [
    {
        test: /\.m?js$/,
        include: path.resolve(__dirname, 'src')  // 明确范围,二选一
        // exclude: /node_modules/,
        use: ['babel-loader?cacheDirectory']   // 开启缓存
    }
]
```

-   babel-loader 使用 Babel 加载 ES2015+ 代码并将其转换为 ES5；
-   @babel/core Babel 编译的核心包；
-   @babel/preset-env Babel 编译的预设，可以理解为 Babel 插件的超集。

### babel-polyfill

上面 `babel-loader` 只会将 ES6/7/8 语法转换为 ES5 语法，但是对新 api 并不会转换 例如(`promise`、`Generator`、`Set`、`Maps`、`Proxy`等) 此时我们需要借助 `babel-polyfill` 来帮助我们转换。

使用 import 将其引入到我们的主 bundle 文件（src/index.js）：

```js
import 'babel-polyfill';
```

<!-- `babel-polyfill` 是 `core-js` 和 `regenerator` 两者的集合。

`Babel` 从 `7.4.0` 开始，不赞成使用此软件包，而推荐使用 `core-js` 和 `regenerator`。 -->

### babel-runtime

`Babel` 在每个文件都插入了`辅助代码`（如：\_extend），使代码`体积过大`。可以引入 `babel-runtime` 作为一个独立模块 `避免重复引入`。

```js
rules: [
    // 'transform-runtime' 插件告诉 Babel
    // 要引用 runtime 来代替注入。
    {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env'],
                plugins: ['@babel/plugin-transform-runtime'],
            },
        },
    },
];
```

### TerserWebpackPlugin

压缩 JavaScript。

webpack5 开箱即带最新版本的 terser-webpack-plugin。如果你使用的是 webpack5 或更高版本，同时希望`自定义配置`，那么仍需要安装 terser-webpack-plugin。

```js
new TerserWebpackPlugin({
    test: /\.js(\?.*)?$/i   // 用来匹配文件。
    include: /\/includes/,  // 要包含的文件。
    parallel: Boolean || Number, // 多进程并发执行，提升构建速度，并发运行可以显著提高构建速度，因此强烈建议添加此配置 。
}),
```

## 资源模块

`资源模块(asset module)`是一种模块类型，它允许使用资源文件（字体，图标等）而无需配置额外 loader。

通过添加 4 种新的模块类型，来替换所有这些 loader：

-   asset/resource `发送一个单独的文件并导出 URL`。之前通过使用 `file-loader` 实现。
-   asset/inline `导出一个资源的 data URI`。之前通过使用 `url-loader` 实现。
-   asset/source `导出资源的源代码`。之前通过使用 `raw-loader` 实现。
-   asset `在导出一个 data URI 和发送一个单独的文件之间自动选择`。之前通过使用 `url-loader`，并且配置资源体积限制实现。

> -   `file-loader` 就是将`文件`在进行一些处理后（主要是处理文件名和路径、解析文件 url），`并将文件移动到输出的目录中`；
> -   `url-loader` 一般与 `file-loader` 搭配使用，功能与 `file-loader` 类似，如果文件`小于限制的大小`，则会返回 `base64` 编码，否则使用 `file-loader` 将文件移动到输出的目录中；

```js
rules: [
    {
        test: /\.png/,
        type: 'asset/resource',
    },
];
```

### 图片压缩

`ImageMinimizerWebpack` 优化/压缩 所有类型的图片。PNG, JPEG, GIF, SVG and WEBP....

```js
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

module.exports = {
    module: {
        rules: [
            {
                test: /\.(jpe?g|png)$/i,
                type: 'asset',
            },
        ],
    },
    plugins: [
        new ImageMinimizerPlugin({
            minify: ImageMinimizerPlugin.squooshMinify,
            minimizerOptions: {
                encodeOptions: {
                    mozjpeg: {
                        quality: 100,
                    },
                    webp: {
                        lossless: 1,
                    },
                    avif: {
                        cqLevel: 0,
                    },
                },
            },
        }),
    ],
};
```

## 优化构建速度

### 优化 resolve 配置

`1、配置别名 alias，简化模块引用；`

```js
const path = require('path');

const config = {
    resolve: {
        alias: {
            '@': path.join(__dirname, 'src'),
        },
    },
};
```

`2、extensions 引入模块时可以不带扩展名，webpack 尝试按顺序解析这些后缀名。`

```js
const config = {
    resolve: {
        extensions: ['.js', '.json', '.wasm'],
    },
};
```

`3、modules 告诉 webpack 解析模块时应该搜索的目录`，常见配置如下：

```js
const path = require('path');

const config = {
    resolve: {
        modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    },
};
```

### 缩小查找范围

### 使用缓存

```js
rules: [
    {
        test: /\.m?js$/,
        include: path.resolve(__dirname, 'src')  // 明确范围,二选一
        // exclude: /node_modules/,
        use: ['babel-loader?cacheDirectory']   // 开启缓存
    }
]
```

### 多进程并发执行

```js
new CssMinimizerPlugin({
    test: /\.foo\.css$/i, // 用来匹配文件
    include: /\/includes/, // 要包含的文件
    parallel: Boolean || Number, // 多进程并发执行，提升构建速度 ====> 强烈建议使用
}),

new TerserWebpackPlugin({
    test: /\.js(\?.*)?$/i
    include: /\/includes/,
    parallel: Boolean || Number,
}),
```

### noParse

`noParse` 对完全`不需要解析`的库进行忽略，可以`提高构建性能`。

```js
module.exports = {
    //...
    module: {
        noParse: /jquery|lodash/,
    },
};
```

### IgnorePlugin

`忽略第三方包指定目录，让这些指定目录不要被打包进去`。

比如我们要使用 `moment` 这个第三方依赖库，该库主要是对时间进行格式化，并且支持多个国家语言。虽然我设置了语言为中文，但是在打包的时候，是会将所有语言都打包进去的。这样就导致包很大，打包速度又慢。对此，我们可以用 `IgnorePlugin` 使得指定目录被忽略，从而使得打包变快，文件变小。

```js
plugins: [
    new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
    });
    // 任何与'./locale'结尾的目录匹配的require 语句'moment'都将被忽略。
]
```

按照上面的方法忽略了包含’./locale/'该字段路径的文件目录。但是，导致不能显示`中文语言`了，所以我们需要手动引入中文语言。

```js
import moment from 'moment';

// 手动引入所需要的语言包
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
```

或者 使用 `moment-locales-webpack-plugin` 插件，`剔除掉无用的语言包`。

### externals

`externals 从输出的 bundle 中排除依赖` 告诉 webpack 这些依赖是外部环境提供的，在打包时可以忽略它们，就不会再打到 chunk-vendors.js 中。此功能通常对 library 开发人员来说是最有用的。

```js
externals: [
    {
        // 字符串
        react: 'react',
        // 对象
        lodash: {
            commonjs: 'lodash',
            amd: 'lodash',
            root: '_', // indicates global variable
        },
        // 字符串数组
        subtract: ['./math', 'subtract'],
    },
];

// 在 index.html 中使用 CDN 引入依赖

<body>
    <script src="http://lib.baomitu.com/vue/2.6.14/react.min.js"></script>
    <script src="http://lib.baomitu.com/vue-router/3.5.1/lodash.min.js"></script>
</body>;
```

### DllPlugin 动态链接库

`DllPlugin` 与 `externals` 的作用相似，都是将依赖抽离出去，节约打包时间。区别是 DllPlugin 是将依赖单独打包，这样以后每次只构建业务代码，而 externals 是将依赖转化为 CDN 的方式引入。
当公司没有很好的 CDN 资源或不支持 CDN 时，就可以考虑使用 DllPlugin ，替换掉 externals。

<!-- ### DllPlugin

对于开发项目中不经常会变更的`静态依赖文件`。类似于我们的 `elementUi`、`vue` 全家桶等等。因为很少会变更，所以我们不希望这些依赖要被集成到每一次的`构建`逻辑中去。

这样做的好处是每次更改我本地代码时，`webpack` 只需要`打包`我项目本身的文件代码，而`不会再去编译第三方库`。以后只要我们不升级第三方包，那么 webpack 就不会对这些库去打包，这样可以快速的提高`打包`的速度。

webpack.dll.config.js

```js
const path = require('path');
const webpack = require('webpack');
module.exports = {
    entry: {
        vendor: ['vue', 'element-ui'], // 你想要打包的模块的数组
    },
    output: {
        path: path.resolve(__dirname, 'static/js'), // 打包后文件输出的位置
        filename: '[name].dll.js',
        library: '[name]_library',
        // 这里需要和webpack.DllPlugin中的`name: '[name]_library',`保持一致。
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.resolve(__dirname, '[name]-manifest.json'),
            name: '[name]_library',
            context: __dirname,
        }),
    ],
};
```

在 `package.json` 中配置如下命令

```js
"dll": "webpack --config build/webpack.dll.config.js"
```

接下来在我们的 `webpack.config.js` 中增加以下代码

```js
module.exports = {
    plugins: [
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('./vendor-manifest.json'),
        }),
        new CopyWebpackPlugin([
            // 拷贝生成的文件到dist目录 这样每次不必手动去cv
            {
                from: 'static',
                to: 'static',
            },
        ]),
    ],
};
```

执行

```js
npm run dll
```

会发现生成了我们需要的集合第三地方 代码的 `vendor.dll.js` 我们需要在 `html`文件中`手动引入`这个 js 文件。

```js
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title></title>
    <script src="static/js/vendor.dll.js"></script>
</head>
<body>
    <div id="app"></div>
</body>
</html>
```

如果我们没有`更新第三方`依赖包，就不必 `npm run dll`。直接执行 `npm run dev` 和 `npm run build` 的时候会发现我们的`打包速度`明显有所提升。因为我们已经通过`dllPlugin`将第三方依赖包`抽离`出来了。 -->

## splitChunks 分包

optimization.splitChunks 是基于 SplitChunksPlugin 插件实现的

默认情况下，它只会影响到按需加载的 chunks，因为修改 initial chunks 会影响到项目的 HTML 文件中的脚本标签。

webpack 将根据以下条件自动拆分 chunks：

-   新的 chunk 可以被共享，或者模块来自于 node_modules 文件夹；
-   新的 chunk 体积大于 20kb（在进行 min+gz 之前的体积）；
-   当按需加载 chunks 时，并行请求的最大数量小于或等于 30；
-   当加载初始化页面时，并发请求的最大数量小于或等于 30；

当尝试满足最后两个条件时，最好使用较大的 chunks。

```js
module.exports = {
    //...
    optimization: {
        splitChunks: {
            chunks: 'async', // 有效值为 `all`，`async` 和 `initial`；
            // 设置为 all 可能特别强大，因为这意味着 chunk 可以在异步和非异步 chunk 之间共享
            minSize: 20000, // 生成 chunk 的最小体积（≈ 20kb)
            minRemainingSize: 0, // 确保拆分后剩余的最小 chunk 体积超过限制来避免大小为零的模块
            minChunks: 1, // 拆分前必须共享模块的最小 chunks 数
            maxAsyncRequests: 30, // 按需加载时的最大并行请求数
            maxInitialRequests: 30, // 入口点的最大并行请求数
            enforceSizeThreshold: 50000, // 强制执行拆分的体积阈值，其他限制（minRemainingSize，maxAsyncRequests，maxInitialRequests）将被忽略。
            cacheGroups: {
                // 按模块层将模块分配给缓存组。
                // 配置提取模块的方案
                defaultVendors: {
                    test: /[\/]node_modules[\/]/,
                    priority: -10, // 一个模块可以属于多个缓存组。优化将优先考虑具有更高 priority（优先级）的 缓存组，
                    // 默认组的优先级为负，以允许自定义组获得更高的优先级（自定义组的默认值为 0）
                    reuseExistingChunk: true, // 如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被
                    // 重用，而不是生成新的模块。这可能会影响 chunk 的结果文件名。
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
            },
        },
    },
};
```

## Tree Shaking

`Tree-shaking` 的主要作用是`移除 JavaScript 上下文中的未引用代码`。

`Tree-shaking` 只对 `ES Module` 起作用，对于 `Commonjs` 无效。

-   ESM: export + import；
-   Common JS: module.exports + require；

```js
// 全量引入，不会 tree-shaking
import _ from 'lodash';

// 按名称部分引入，可以 tree-shaking
import { debounce } from 'lodash';
import debounce from 'lodash/lib/debounce';
```

`tree-shaking` 是针对 `静态结构` 进行分析，只有 `import` 和 `export` 是静态的导入和导出。而 `Commonjs` 有`动态`导入和导出的功能，无法进行`静态分析`。

<!-- 如果使用 `Babel` 的话，这里有一个小问题，因为 `Babel的预案（preset）`默认会将任何模块类型都转译成 `CommonJS` 类型，这样会导致 `tree-shaking` 失效。修正这个问题也很简单，在 `.babelrc` 文件或在`webpack.config.js`文件中设置 `modules：false` 即可。 -->

<!-- ```js
// .babelrc
{
    "presets": [
        ["@babel/preset-env",
            {
                "modules": false
            }
        ]
    ]
}
``` -->

<!-- 或者

```js
// webpack.config.js

module: {
    rules: [
        {
            test: /\.js$/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                        '@babel/preset-env',
                        {
                            modules: false
                        }
                    ]
                }
            }，
            exclude: /(node_modules)/
        }
    ]
}
``` -->

## path publicPath

> output.path 和 output.publicPath

`path` 是 `output` 目录对应一个`绝对路径`。

`publicPath` 此选项指定`在浏览器中所引用的「此输出目录对应的公开 URL」`。对于按需加载(on-demand-load)或加载外部资源(external resources)（如图片、文件等）来说，`output.publicPath` 是很重要的选项。如果指定了一个错误的值，则在加载这些资源时会收到 404 错误。

该选项的值是以 runtime(运行时) 或 loader(载入时) 所创建的每个 URL 的`前缀`。因此，在多数情况下，`此选项的值都会以 / 结束`。

```js
const path = require('path');

module.exports = {
    //...
    output: {
        path: path.resolve(__dirname, 'dist/assets'),

        publicPath: 'https://cdn.example.com/assets/',
    },
};
```

## bundle 分析

`webpack-bundle-analyzer` 一个 plugin 和 CLI 工具，它将 `bundle` 内容展示为一个便捷的、交互式、可缩放的树状图形式。

![analyzer](/images/webpack/analyzer.png)

## 核心工具

`Tapable` 是 webpack 的一个`核心工具`。在 webpack 中的许多对象都扩展自 Tapable 类。 它对外暴露了 `tap`，`tapAsync` 和 `tapPromise` 等方法，插件可以使用这些方法向 webpack 中注入`自定义构建的步骤`，这些步骤将在`构建过程中触发`。

根据使用不同的`钩子`(hooks)和 `tap` 方法， 插件可以以多种不同的方式`运行`。

### 编译阶段

`compiler hooks` 钩子 在 `编译阶段` 时(compile)，只有 `同步的 tap 方法`可以使用。

```js
compiler.hooks.compile.tap('MyPlugin', (params) => {
    console.log('以同步方式触及 compile 钩子。');
});
```

### 运行阶段

在 `run 阶段` 则需使用 `tapAsync` 或 `tapPromise`（以及 `tap`）方法。

```js
compiler.hooks.run.tapAsync(
    'MyPlugin',
    (source, target, routesList, callback) => {
        console.log('以异步方式触及运行钩子。');
        callback();
    },
);

compiler.hooks.run.tapPromise('MyPlugin', (source, target, routesList) => {
    return new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
        console.log('以异步的方式触发具有延迟操作的钩子。');
    });
});

compiler.hooks.run.tapPromise(
    'MyPlugin',
    async (source, target, routesList) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log('以异步的方式触发具有延迟操作的钩子。');
    },
);
```

各种插件都能以合适的方式去运行。

## webpack 5 的改动

-   主要是内部效率的优化
-   对比 webpack 4，没有太多使用上的改动
-   webpack 5.0 旨在减少配置的复杂度，使其更容易上手
