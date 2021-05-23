---
toc: content
order: 4
---

# 跨域

> 涉及面试题：什么是跨域？为什么浏览器要使用同源策略？你有几种方式可以解决跨域问题？了解预检请求嘛？

因为浏览器出于安全考虑，有 `同源策略` 的限制。也就是说，如果 `协议`、`域名` 或者 `端口` 有一个不同就是跨域，Ajax 请求会失败。

![](https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.jqhtml.com%2Fwp-content%2Fuploads%2F2020%2F6%2FBfYJNz.jpg&refer=http%3A%2F%2Fwww.jqhtml.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620959483&t=37ef5a15b35fa5754579d4fc3d1c3355)

**那么是出于什么安全考虑才会引入这种机制呢？** 其实主要是用来 **防止 CSRF 攻击**的。简单点说，CSRF 攻击是利用用户的登录态发起恶意请求。

也就是说，没有同源策略的情况下，A 网站可以被任意其他来源的 Ajax 访问到内容。如果你当前 A 网站还存在登录态，那么对方就可以通过 Ajax 获得你的任何信息。当然跨域并不能完全阻止 CSRF。

**然后我们来考虑一个问题，请求跨域了，那么请求到底发出去没有？** 请求必然是发出去了，但是浏览器拦截了响应。你可能会疑问明明通过表单的方式可以发起跨域请求，为什么 Ajax 就不会。因为归根结底，跨域是为了阻止用户读取到另一个域名下的内容，Ajax 可以获取响应，浏览器认为这不安全，所以拦截了响应。但是表单并不会获取新的内容，所以可以发起跨域请求。同时也说明了跨域并不能完全阻止 CSRF，因为请求毕竟是发出去了。

接下来我们将来学习几种常见的方式来解决跨域的问题。

## JSONP

JSONP 的原理很简单，就是 **利用 `<script>` 标签没有跨域限制的漏洞**。通过 `<script>` 标签指向一个需要访问的地址并提供一个回调函数来接收数据当需要通讯时。

```js
<script src="http://domain/api?param1=a&param2=b&callback=jsonp"></script>
<script>
    function jsonp(data) {
    	console.log(data)
	}
</script>
```

**JSONP 使用简单且兼容性不错，但是只限于 get 请求。**

以下是简单实现封装一个 JSONP

```js
function jsonp(url, jsonpCallback, success) {
    let script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.type = 'text/javascript';
    window[jsonpCallback] = function (data) {
        success && success(data);
    };
    document.body.appendChild(script);
}
jsonp('http://xxx', 'callback', function (value) {
    console.log(value);
});
```

## CORS

`CORS` 需要 `浏览器` 和 `后端`同时支持。IE 8 和 9 需要通过 `XDomainRequest` 来实现。

浏览器会自动进行 CORS 通信，实现 CORS 通信的关键是后端。只要后端实现了 CORS，就实现了跨域。

服务端设置 `Access-Control-Allow-Origin` 就可以开启 CORS。 **该属性表示哪些域名可以访问资源，** 如果设置通配符则表示所有网站都可以访问资源。

虽然设置 CORS 和前端没什么关系，但是通过这种方式解决跨域问题的话，会在发送请求时出现两种情况，分别为 `简单请求` 和 `复杂请求`。

### 简单请求

以 Ajax 为例，当满足以下条件时，会触发简单请求

1、使用下列方法之一：

-   `GET`
-   `HEAD`
-   `POST`

2、`Content-Type` 的值仅限于下列三者之一：

-   `text/plain`
-   `multipart/form-data`
-   `application/x-www-form-urlencoded`

请求中的任意 `XMLHttpRequestUpload` 对象均没有注册任何事件监听器； XMLHttpRequestUpload 对象可以使用 XMLHttpRequest.upload 属性访问。

### 复杂请求

那么很显然，不符合以上条件的请求就肯定是复杂请求了。

对于`复杂请求`来说，首先会发起一个`预检请求`，该请求是 `option 方法`的，通过该请求来知道服务端`是否允许跨域`请求。

对于预检请求来说，如果你使用过 Node 来设置 CORS 的话，可能会遇到过这么一个坑。

以下以 express 框架举例：

```js
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials'
    )
    next()
}
```

该请求会验证你的 `Authorization` 字段，没有的话就会报错。

当前端发起了复杂请求后，你会发现就算你代码是正确的，返回结果也永远是报错的。因为预检请求也会进入回调中，也会触发 next 方法，因为预检请求并不包含 `Authorization` 字段，所以服务端会报错。

想解决这个问题很简单，只需要在回调中`过滤 option 方法`即可

```js
res.statusCode = 204;
res.setHeader('Content-Length', '0');
res.end();
```

## Nginx

## 反向代理

![](https://user-gold-cdn.xitu.io/2018/9/27/1661ac31c192d22f?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

使用 nginx 反向代理实现跨域，是最简单的跨域方式。只需要修改 nginx 的配置即可解决跨域问题，支持所有浏览器，支持 session，不需要修改任何代码，并且不会影响服务器性能。

实现思路：通过 nginx 配置一个代理服务器（域名与 domain1 相同，端口不同）做跳板机，反向代理访问 domain2 接口，并且可以顺便修改 cookie 中 domain 信息，方便当前域 cookie 写入，实现跨域登录。至于真正访问哪台服务器内容，由这个 proxy 去控制。

先下载 nginx，然后将 nginx 目录下的 nginx.conf 修改如下:

```js
// proxy服务器
server {
    listen       81;
    server_name  www.domain1.com;
    location / {
        proxy_pass   http://www.domain2.com:8080;  #反向代理
        proxy_cookie_domain www.domain2.com www.domain1.com; #修改cookie里域名
        index  index.html index.htm;

        # 当用webpack-dev-server等中间件代理接口访问nignx时，此时无浏览器参与，故没有同源限制，下面的跨域配置可不启用
        add_header Access-Control-Allow-Origin http://www.domain1.com;  #当前端只跨域不带cookie时，可为*
        add_header Access-Control-Allow-Credentials true;
    }
}
```

最后通过命令行 nginx -s reload 启动 nginx

```js
// index.html
var xhr = new XMLHttpRequest();
// 前端开关：浏览器是否读写cookie
xhr.withCredentials = true;
// 访问nginx中的代理服务器
xhr.open('get', 'http://www.domain1.com:81/?user=admin', true);
xhr.send();
```

nginx 常用命令

```js
nginx -s reload   // 重新载入配置文件
nginx -s reopen   // 重启nginx
nginx -s quit     // 停止 ngixn
```
