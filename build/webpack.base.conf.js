// 使用 NodeJS 自带的文件路径插件
var path = require('path')

// 引入一些小工具
var utils = require('./utils')

// 引入 config/index.js
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')

// 拼接我们的工作区路径为一个绝对路径
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: {
    app: ['babel-polyfill', './src/main.js']
  },
  output: {
    // 编译输出的根路径
    path: config.build.assetsRoot,
    // 编译输出的文件名
    filename: '[name].js',
    // 正式发布环境下编译输出的发布路径
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    // 自动补全的扩展名
    extensions: ['.js', '.vue', '.json'],
    // 默认路径代理，例如 import Vue from 'vue'，会自动到 'vue/dist/vue.common.js'中寻找
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}
