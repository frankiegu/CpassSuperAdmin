// 使用 NodeJS 自带的文件路径插件
var path = require('path')

// 使用一些小工具
var utils = require('./utils')

// 使用 webpack
var webpack = require('webpack')

// 同样的使用了 config/index.js
var config = require('../config')

// 使用 webpack 配置合并插件
var merge = require('webpack-merge')

// 加载 webpack.base.conf
var baseWebpackConfig = require('./webpack.base.conf')

// 使用 html-webpack-plugin 插件，这个插件可以帮我们自动生成 html 并且注入到 .html 文件中
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

// 将内容束展示为方便交互的树状图
// var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// add hot-reload related code to entry chunks
// 将 Hol-reload 相对路径添加到 webpack.base.conf 的 对应 entry 前
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

function resolveApp (relativePath) {
  return path.resolve(relativePath)
}

// 将我们 webpack.dev.conf.js 的配置和 webpack.base.conf.js 的配置合并
module.exports = merge(baseWebpackConfig, {
  module: {
    // 使用 styleLoaders
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // cheap-module-eval-source-map is faster for development
  // 使用 #eval-source-map 模式作为开发工具，此配置可参考 DDFE 往期文章详细了解
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    // 将内容束展示为方便交互的树状图
    // new BundleAnalyzerPlugin({
    //   // Can be `server`, `static` or `disabled`.
    //   // In `server` mode analyzer will start HTTP server to show bundle report.
    //   // In `static` mode single HTML file with bundle report will be generated.
    //   // In `disabled` mode you can use this plugin to just generate Webpack Stats JSON file by setting `generateStatsFile` to `true`.
    //   analyzerMode: 'server',
    //   // Port that will be used in `server` mode to start HTTP server.
    //   analyzerPort: 8888,
    //   // Path to bundle report file that will be generated in `static` mode.
    //   // Relative to bundles output directory.
    //   reportFilename: 'report.html',
    //   // Automatically open report in default browser
    //   openAnalyzer: false,
    //   // If `true`, Webpack Stats JSON file will be generated in bundles output directory
    //   generateStatsFile: false,
    //   // Name of Webpack Stats JSON file that will be generated if `generateStatsFile` is `true`.
    //   // Relative to bundles output directory.
    //   statsFilename: 'stats.json',
    //   // Options for `stats.toJson()` method.
    //   // For example you can exclude sources of your modules from stats file with `source: false` option.
    //   // See more options here: https://github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
    //   statsOptions: null
    // }),

    // definePlugin 接收字符串插入到代码当中, 所以你需要的话可以写上 JS 的字符串
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    // HotModule 插件在页面进行变更的时候只会重回对应的页面模块，不会重绘整个 html 文件
    new webpack.HotModuleReplacementPlugin(),

    // 使用了 NoErrorsPlugin 后页面中的报错不会阻塞，但是会在编译结束后报错
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin

    // 将 index.html 作为入口，注入 html 代码后生成 index.html文件
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      favicon: resolveApp('./static/images/favicon.ico'),
      inject: true,
      path: config.dev.staticPath
    }),
    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: [`智众总后台管理作品：`],
      }
    })
  ]
})
