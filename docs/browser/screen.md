---
toc: content
order: 10
---

## 大屏可视化

```js
import React from 'react';
import { useEffect } from 'react';
import { connect } from 'umi';
import ss from './index.less';

const ScreenPage = () => {

    useEffect(() => {
        handleScreenAuto();
        window.onresize = () => handleScreenAuto();
        return () => window.onresize = null;
    }, []);

    // 数据大屏自适应函数
    const handleScreenAuto = () => {
        const designDraftWidth = 1920; //设计稿的宽度
        const designDraftHeight = 960; //设计稿的高度

        // 根据屏幕的变化适配的比例
        // clientWidth = content + padding
        // offsetWidth = content + padding + border
        // scrollWidth = content + 不可见部分的 width

        const ele = document.documentElement;
        const clientWidth = ele.clientWidth;
        const clientHeight = ele.clientHeight;

        const clientScale = clientWidth / clientHeight;
        const designScale = designDraftWidth / designDraftHeight;

        const scale = clientScale < designScale ? clientWidth / designDraftWidth : clientHeight / designDraftHeight;

        // 缩放比例 
        document.querySelector('#screen').style.transform = `scale(${scale}) translate(-50%)`;
    };

    return (
        <div className={ss.root}>
            <div className={ss.screen} id="screen">
                <div className={ss.wrap}>
                    <header>头部</header>
                    <main>
                        <div className={ss.left}></div>
                        <div className={ss.center}></div>
                        <div className={ss.right}></div>
                    </main>
                    <footer>底部</footer>
                </div>
            </div>
        </div>
    )
}

export default connect((analysis) => ({
    analysis
}))(ScreenPage);

```

```css
.root {
    height: 100%;
    width: 100%;

    .screen {
        display: inline-block;
        width: 1920px;
        height: 960px;
        transform-origin: 0 0;
        position: absolute;
        left: 50%;

        .wrap {
            header {
                width: 1920px;
                height: 200px;
                line-height: 200px;
                font-size: 40px;
                text-align: center;
                background: rgba(53, 150, 206, 0.3);
            }
            main {
                display: flex;
                height: 660px;
                div {
                    width: 640px;
                    height: 100%;
                }
                .left {
                    background: rgba(206, 52, 154, 0.3);
                }
                .center {
                    background: rgba(13, 30, 179, 0.3);
                }
                .right {
                    background: rgba(64, 163, 6, 0.849);
                }
            }
            footer {
                width: 100%;
                height: 100px;
                line-height: 100px;
                font-size: 40px;
                text-align: center;
                background: rgba(19, 211, 115, 0.3);
            }
        }
    }
}
```