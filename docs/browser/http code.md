---
toc: content
order: 6
---

# Http 状态码

## Http 和 Https 的区别

-   Http 协议是超文本传输协议，信息是明文传输；Https 则是具有安全性的 SSL 加密传输协议；
-   Https 协议需要 CA 证书，费用较高；而 Http 协议不需要；
-   端口不同：Http 协议是 80 端口；Https 协议是 443 端口；
-   连接方式不同：Http 协议连接很简单，是无状态连接；Https 协议是具有 SSL 和 Http 协议构建的可进行加密传输、身份认证的网络协议，比 Http 更加安全；

## 1XX：指示消息

`指示消息,表示请求已接收`，继续处理。
## 2XX (成功)

`成功，表示请求已被成功接收`，处理。

### 200 OK

![](/images/browser/http/200.png)

表示从客户端发来的请求在服务器端被正常处理了。

### 204 No Content

![](/images/browser/http/204.png)

请求已成功处理，但在返回的`响应报文中不含实体的主体部分`。一般用在只是客户端向服务器发送信息，而服务器不用向客户端返回什么信息的情况。`不会刷新页面`。

### 206 Partial Content

![](/images/browser/http/206.png)

表示客户端进行了`范围请求`，而服务器成功执行了这部分的 GET 请求
响应报文中包含由 Content-Range 指定范围的实体内容。

## 3XX(重定向)

3XX 响应结果表明浏览器需要执行某些特殊的处理以正确处理请求。

### 301 Moved Permanently

![](/images/browser/http/301.png)

`永久性重定向`。

### 302 Found

![](/images/browser/http/302.png)

`临时性重定向`。

### 304 Not Modified

![](/images/browser/http/304.png)

`未修改，会使用缓存`。

### 307 Temporary Redirect

`临时重定向`。该状态码与 302 Found 有着相同的含义。尽管 `302 标准禁止 POST 变换成 GET`，但实际使用时大家并不遵守。

307 会遵照浏览器标准，不会从 POST 变成 GET。但是，对于处理响应时的行为，每种浏览器有可能出现不同的情况。

## 4XX(客户端错误)

### 400 Bad Request

![](/images/browser/http/400.png)

`请求报文中存在语法错误 (请求参数错误)`。

### 401 Unauthorized

![](/images/browser/http/401.png)

`请求要求身份验证`。

### 403 Forbidden

![](/images/browser/http/403.png)

`禁止访问`。

### 404 Not Found

![](/images/browser/http/404.png)

`服务器上无法找到请求的资源`。

## 5XX(服务器错误)

![](/images/browser/http/500.png)

5XX 的响应结果表明服务器本身发生错误。
