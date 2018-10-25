// see http://vuejs-templates.github.io/webpack for documentation.
// 使用 NodeJS 自带的文件路径插件
var path = require('path')

module.exports = {
  // production 环境
  build: {
    // 使用 config/prod.env.js 中定义的编译环境
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),

    // 编译输出的静态资源根路径
    assetsRoot: path.resolve(__dirname, '../dist'),

    // 编译输出的二级目录
    assetsSubDirectory: 'static',

    // 编译发布上线路径的根目录，可配置为资源服务器域名或 CDN 域名
    assetsPublicPath: '/',
    // 是否开启 productionSourceMap，是否可以再npm run build 之后，在浏览器可以查看源码
    productionSourceMap: false,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin

    // 是否开启 gzip
    productionGzip: false,

    // 需要使用 gzip 压缩的文件扩展名
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  // dev 环境
  dev: {
    // 使用 config/dev.env.js 中定义的编译环境
    env: require('./dev.env'),

    // 运行测试页面的端口
    port: 8989,

    // 项目npm run dev，autoOpenBrowser：true自动打开浏览器，访问localhost:8888
    autoOpenBrowser: false,

    // 编译输出的二级目录
    assetsSubDirectory: './static',

    // 编译发布上线路径的根目录，可配置为资源服务器域名或 CDN 域名
    assetsPublicPath: '/', // assetsPublicPath: '/demo/'

    // 需要 proxyTable 代理的接口（可跨域）,解决开发环境的跨域问题
    proxyTable: {
      '/proxy-api': {
        // target: 'http://java.tt.curato.cn:9094', // 支线B
        // target: 'http://java.tt.curato.cn:9090', // 支线A
        // target: 'http://192.168.1.105:8080',
        target: 'http://192.168.0.214:8080', // 产品库（邹波）
        // target: 'http://192.168.1.1:8080', // 产品库（俊辉）
        changeOrigin: true,
        pathRewrite: {
          '/proxy-api': ''
        }
      }
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
