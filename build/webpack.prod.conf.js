// 使用 NodeJS 自带的文件路径插件
var path = require('path')

// 使用一些小工具
var utils = require('./utils')

// 加载 webpack
var webpack = require('webpack')

// 加载 confi.index.js
var config = require('../config')
var merge = require('webpack-merge')

// 加载 webpack.base.conf.js
var baseWebpackConfig = require('./webpack.base.conf')
var CopyWebpackPlugin = require('copy-webpack-plugin')

// 一个可以插入 html 并且创建新的 .html 文件的插件
var HtmlWebpackPlugin = require('html-webpack-plugin')

// 一个 webpack 扩展，可以提取一些代码并且将它们和文件分离开
// 如果我们想将 webpack 打包成一个文件 css js 分离开，那我们需要这个插件
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

var env = config.build.env

function resolveApp (relativePath) {
  return path.resolve(relativePath);
}

// 合并 webpack.base.conf.js
var webpackConfig = merge(baseWebpackConfig, {
  module: {
    // 使用的 styleLoaders
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true
    })
  },
  // 是否使用 #source-map 开发工具，更多信息可以查看 DDFE 往期文章
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  output: {
    // 编译输出目录
    path: config.build.assetsRoot,
    // 编译输出文件名
    // 我们可以在 hash 后加 :6 决定使用几位 hash 值
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    // 没有指定输出名的文件输出的文件名
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  plugins: [
    // 使用的插件
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    // definePlugin 接收字符串插入到代码当中, 所以你需要的话可以写上 JS 的字符串
    new webpack.DefinePlugin({
      'process.env': env
    }),
    // 压缩 js (同样可以压缩 css)
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true
    }),
    // extract css into its own file
    // 将 css 文件分离出来
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css')
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    // 输入输出的 .html 文件
    new HtmlWebpackPlugin({
      filename: config.build.index,
      template: 'index.html',
      // 是否注入 html
      inject: true,
      favicon: resolveApp('./static/images/favicon.ico'),
      // 压缩的方式
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),
    // split vendor js into its own file
    // 没有指定输出文件名的文件输出的静态文件名
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    // 没有指定输出文件名的文件输出的静态文件名
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

// 开启 gzip 的情况下使用下方的配置
if (config.build.productionGzip) {
  // 加载 compression-webpack-plugin 插件
  var CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
