---
toc: content
order: 8
---

# React 自定义 Hook

## useFetch

简易版 useFetch 如下：

useFetch.js

```js
import { useEffect, useState } from 'react';

export default (url, params, depends) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});
    const [error, setError] = useState({});

    useEffect(() => {
        url && depends && onFetch();
    }, [url, depends]);

    const onFetch = async () => {
        try {
            setLoading(true);
            const res = await url(params);
            setData(res.data);
            setError(res.error);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    return {
        loading,
        data,
        error,
    };
};
```

## useForceUpdate

如果前后两次的`值相同`，useState 和 useReducer 都会`放弃更新`。原地修改 state 并调用 setState `不会引起重新渲染`。

通常，你不应该在 React 中修改本地 state。然而，作为一条出路，你可以用一个`增长的计数器`来在 state 没变的时候依然`强制`一次重新渲染：

```js
import { useReducer } from 'react';

export default () => {
    const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);

    return [ignored, forceUpdate];
};
```

可能的话尽量避免这种模式。

## useDebounce 防抖

useDebounce.js

```js
import { useEffect, useRef } from 'react';

export default (fn, delay = 50, deps = []) => {
    let timer = useRef();

    useEffect(() => {
        if (timer.current) {
            clearTimeout(timer.current);
        }

        timer.current = setTimeout(() => {
            fn();
        }, delay);
    }, deps);

    const cancel = () => {
        clearTimeout(timer.current);
        timer = null;
    };

    return [cancel]; // cancel是用来控制何时停止防抖函数用的
};
```

## useThrottle 节流

useThrottle.js

```js
import { useEffect, useRef, useState } from 'react';

export default (fn, initTime = 50, deps = []) => {
    let last = useRef(0);
    let [time, setTime] = useState(initTime);

    useEffect(() => {
        let now = Date.now();
        if (now - last.current >= time) {
            fn();
            last.current = now;
        }
    }, deps);

    const cancel = () => setTime(0);

    return [cancel];
};
```
