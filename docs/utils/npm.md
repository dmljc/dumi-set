---
toc: content
order: 4
---

# npm link 软链

平时我们开发 npm 包的时候，每次测试都要使用 npm 发布成功之后再安装新的版本号，是不是很繁琐且低效？

为了解决这个问题，我们可以使用 npm link 软连接。

## 什么是软链？

简单说就是为开发的模块(待发布的 npm 包)创造一个全局链接，在主项目里链接这个依赖的模块，进行测试。

## 创建、使用软链

比如我们想在项目 B 里边用项目 A 的本地 npm 包。

### 先在对应 npm 包的文件创建一个全局的链接

```js
cd ~/projects/projectA
npm link
```

### 然后在使用该包的项目里使用这个软链

注意这里的 packageName 一定要对应你的 npm 包 package.json 里的 name 字段值。

```js
cd ~/projects/projectB
npm link packageName
```

## 用完了如何去除软链呢？

### 先在使用 npm 包的项目的文件目录下解除特定的链接

```js
npm unlink packageName
```

### 再在 npm 包所在的文件目录下去除全局链接

```js
npm unlink
```

## 查看所有创建的全局链接名称

```js
npm ls --global --depth 0
```

## 强制解除创建的某个特定全局链接

```js
npm rm --global packageName
```
