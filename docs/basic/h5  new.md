---
toc: content
order: 14
hide: true
---

# H5 新增标签及属性

## 语义化标签

![proxy](/images/basic/h5NewTag.png)

```html
<header>头部</header>
<footer>尾部</footer>
<nav>导航栏</nav>
<section>具体的内容</section>
<article>文章</article>
<aside>内容的侧边栏</aside>
<mark>部分文本高亮显示</mark>
```

## 媒体

```html
<video>视频</video>
<audio>音频</audio>
<canvas>绘制图形</canvas>
<svg>可缩放矢量图形</svg>
```

## input 新增 type 属性

-   `email`：必须输入邮件；
-   `url`：必须输入 url 地址；
-   `search`：搜索框(显示删除按钮)
-   `color`：颜色
-   `number`：必须输入数值；

-   `time`：选取时间（小时和分钟）
-   `date`：选取日、月、年
-   `week`：选取周和年
-   `month`：选取月、年
-   `range`：设置最大以及最小值

## 数据存储

-   `localStorage`
-   `sessionStorage`
-   `IndexedDB`
<!-- - `Web Worker` -->

## 地理定位

-   `navigator`
-   `geolocation`
-   `getCurrentPosition`
