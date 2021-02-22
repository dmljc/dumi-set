import { defineConfig } from 'dumi';

const name = 'dumi-site';

export default defineConfig({
    title: 'dumi-site',
    favicon: '/images/logo.jpeg',
    logo: '/images/logo.jpeg',
    outputPath: 'dist',
    mode: 'site',
    hash: true,
    base: `/${name}/`,
    publicPath: `/${name}/`,
    locales: [['zh-CN', '中文']],
    navs: {
        'zh-CN': [
            { title: '基础', path: '/basic' },
            { title: '框架', path: '/frame' },
            { title: '浏览器', path: '/browser' },
            { title: '可视化', path: '/visual' },
            { title: '每日一题', path: '/questions' },
            { title: 'GitHub', path: 'https://github.com/umijs/dumi' },
            { title: '更新日志', path: '/logs' },
        ],
    },
    // more config: https://d.umijs.org/config
});
