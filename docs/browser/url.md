---
toc: content
order: 8
---
# 从 URL 输入到页面展现过程

总体来说分为以下几个过程：

-   DNS 解析（将域名解析成 IP 地址）
-   建立 TCP 连接（TCP 三次握手）
-   发送 HTTP 请求
-   服务器处理请求并返回 HTTP 报文
-   浏览器解析渲染页面
-   断开 TCP 连接：TCP 四次挥手
## DNS 域名解析

在浏览器输入网址后，首先要经过`域名解析`，因为`浏览器`并不能直接通过`域名`找到对应的`服务器`，而是要通过 `IP 地址`。

DNS 预解析技术：浏览器在加载网页时，会对网页中的域名进行解析缓存，这样在你单击当前网页中的链接时就无需进行 DNS 的解析，减少用户等待时间，提高用户体验。

```js
dns-prefetch
```

## 建立 TCP 链接 

`Chrome 在同一个域名下要求同时最多只能有 6 个 TCP 连接`，超过 6 个的话剩下的请求就得等待。

建立TCP连接经历下面三个阶段：

- 通过「三次握手」建立客户端和服务器之间的连接。
- 进行数据传输。
- 数据传输完成，通过「四次挥手」来断开连接。

> 总是要问：为什么需要三次握手，两次不行吗？其实这是由 TCP 的自身特点`可靠传输`决定的。客户端和服务端要进行可靠传输，那么就需要`确认双方的接收和发送能力`。第一次握手可以确认客服端的`发送能力`，第二次握手，确认了服务端的`发送能力和接收能力`，所以第三次握手才可以确认客户端的`接收能力`。不然容易出现丢包的现象。

## 发送 HTTP 请求

TCP连接完成后，接下来就可以与服务器通信了，也就是我们经常说的发送HTTP请求。
发送HTTP请求需要携带三样东西：「请求行」，「请求头」，「请求体」。

```js
// 请求行
Request URL: https://time.geekbang.org/serv/v3/note/uline/list
Request Method: POST

// 状态行
Status Code: 200 OK
Remote Address: 39.106.233.176:443
Referrer Policy: no-referrer-when-downgrade
```

请求头 Request Headers

```js
Accept: application/json, text/plain,
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.9
Cache-Control: no-cache
Connection: keep-alive
Content-Length: 14
Content-Type: application/json
Cookie: gksskpitn=e841bc65-1544-4e72-8d90-fc444d4e53c7.....
Host: time.geekbang.org
Origin: https://time.geekbang.org
```

最后就是请求体，请求体的话只有在 `POST` 请求场景下存在，常见的就是表单提交。

## 网络响应

HTTP 请求到达服务器，服务器进行对应的处理。最后要把数据传给浏览器，也就是通常我们说的返回网络响应。
跟请求部分类似，网络响应具有三个部分:「响应行」、「响应头」和「响应体」。

响应行

```js
HTTP/1.1 200 OK
```

响应头

```js
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: CONTENT-TYPE,DEVICE-ID,TICKET,BASE64,ES-TYPE
Access-Control-Allow-Methods: OPTIONS,GET,POST
Access-Control-Allow-Origin: https://time.geekbang.org
Access-Control-Expose-Headers: SET-TICKET
Access-Control-Max-Age: 3600
Connection: keep-alive
Content-Length: 6449
Content-Type: application/json; charset=utf-8
Date: Sun, 23 May 2021 04:31:29 GMT
Set-Cookie: SERVERID=1fa1f330efedec1559b3abbcb6e30f50|1621744289|1621744128;Path=/
Strict-Transport-Security: max-age=15768000
```

响应体 即 Response 返回的 data 数据。

接下来，我们数据拿到了，你认为就会断开TCP连接吗？

这个的看响应头中的 `Connection` 字段。上面的字段值为`close`，那么就会`断开`，一般情况下，HTTP1.1版本的话，通常请求头会包含 `「Connection: Keep-Alive」`表示建立了`持久连接`，这样TCP连接会一直保持，之后请求统一站点的资源会复用这个连接。

## 浏览器解析渲染页面

1. 解析 HTML，构建 DOM 树，同时浏览器主进程负责下载 CSS 文件。

2. CSS 文件下载完成，解析 CSS 生成 CSS 规则树。

3. 合并 DOM 树和 CSS 规则，生成 render 树。

4. 布局 render 树 （重排），负责各元素尺寸、位置的计算。

5. 绘制 render 树（重绘），绘制页面像素信息。

6. 浏览器主进程将默认的图层和复合图层交给 GPU 进程，GPU 进程再将各个图层合成，最后显示出页面。

## 断开 TCP 连接

当数据传送完毕，需要断开 tcp 连接，此时发起 tcp 四次挥手。

<!-- https://juejin.cn/post/6844903784229896199 -->
