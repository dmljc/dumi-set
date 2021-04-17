import { defineConfig } from 'dumi';

// const name = 'dumi-site';

export default defineConfig({
    title: 'dumi-site',
    favicon: '/images/zfc.png',
    logo: '/images/zfc.png',
    outputPath: 'dist',
    mode: 'site',
    hash: true,
    // base: `/${name}/`,   // 非域名根路径部署时：base 和 publicPath 配置项需改为 仓库名称
    base: '/',
    // publicPath: `/${name}/`,
    publicPath: '/', // 自定义域名
    locales: [['zh-CN', '中文']],
    navs: {
        'zh-CN': [
            { title: '基础', path: '/basic' },
            { title: '框架', path: '/frame' },
            { title: '前端工具', path: '/utils' },
            { title: '浏览器', path: '/browser' },
            { title: '可视化', path: '/visual' },
            { title: '每日一题', path: '/questions' },
            {
                title: 'JS Bin',
                path: 'https://jsbin.com/punigik/edit?js,console',
            },
        ],
    },
    // more config: https://d.umijs.org/config
});
