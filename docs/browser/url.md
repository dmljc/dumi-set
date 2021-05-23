---
toc: content
order: 8
---

# 从 URL 输入到页面展现过程

总体来说分为以下几个过程：

-   DNS 解析：将域名解析成 IP 地址
-   TCP 连接：TCP 三次握手
-   发送 HTTP 请求
-   服务器处理请求并返回 HTTP 报文
-   浏览器解析渲染页面
-   断开连接：TCP 四次挥手

## DNS 域名解析

在浏览器输入网址后，首先要经过`域名解析`，因为`浏览器`并不能直接通过`域名`找到对应的`服务器`，而是要通过 `IP 地址`。

什么是域名解析

```js
DNS 协议提供通过域名查找 IP 地址，或逆向从 IP 地址反查域名的服务。
DNS 是一个网络服务器，我们的域名解析简单来说就是在 DNS 上记录一条信息记录。
```

浏览器如何通过域名去查询 URL 对应的 IP 呢？

```js
DNS 域名解析分为 递归查询 和 迭代查询 两种方式，现一般为 迭代查询。
```

DNS 预解析技术

```js
dns-prefetch 是一种 DNS 预解析技术。当你浏览网页时，浏览器会在加载网页时对网页中的域名进行解析缓存，这样在你单击当前网页中的连接时就无需进行 DNS 的解析，减少用户等待时间，提高用户体验。
```

## TCP 三次握手

-   第一次握手，由浏览器发起，告诉服务器我要发送请求了
-   第二次握手，由服务器发起，告诉浏览器我准备接受了，你赶紧发送吧
-   第三次握手，由浏览器发送，告诉服务器，我马上就发了，准备接受吧

## 发送 HTTP 请求

HTTP 请求报文由：请求行、请求头部、空行和请求数据四个部分组成。

通用字段 General

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

请求数据 Request Payload

```js
{
    aid: 100513;
}
```

## 服务器处理请求并返回 HTTP 报文

HTTP 响应也由四个部分组成，分别是：响应状态、响应头、响应体。

响应状态

```js
Status Code: 200 OK
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

响应内容 即 Response 返回的 data 数据

## 浏览器解析渲染页面

1. 解析 HTML，构建 DOM 树

2. 解析 CSS，生成 CSS 规则树

3. 合并 DOM 树和 CSS 规则，生成 render 树

4. 布局 render 树（Layout/reflow），负责各元素尺寸、位置的计算

5. 绘制 render 树（paint），绘制页面像素信息

## 断开连接

当数据传送完毕，需要断开 tcp 连接，此时发起 tcp 四次挥手。

-   第一次挥手：由浏览器发起的，发送给服务器，我请求报文发送完了，你准备关闭吧
-   第二次挥手：由服务器发起的，告诉浏览器，我请求报文接受完了，我准备关闭了，你也准备吧
-   第三次挥手：由服务器发起，告诉浏览器，我响应报文发送完了，你准备关闭吧
-   第四次挥手：由浏览器发起，告诉服务器，我响应报文接受完了，我准备关闭了，你也准备吧

<!-- https://juejin.cn/post/6844903784229896199 -->
