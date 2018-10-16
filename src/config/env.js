/**
 * 公共配置变量
 */

// proxyTable代理的pathRewrite配置值（解决跨域问题）
const API_PATH = '/proxy-api'
// 域名地址
const baseUrl = ''
// 图片所在域名地址
const imgBaseUrl = ''
// 生存哈希值http，例如 http://localhost:8888/#/test
const routerMode = 'hash'
// 只有在正式环境下才使用懒加载，解决了困扰多事的rebuild慢问题
const _import = require('@/router/src/_import_' + process.env.NODE_ENV)
// 手机号码正则
const PHONEREG = /^(0|86|17951)?1[3-9][0-9]{9}$/
// 固定电话正则
const FIXPHONEREG = /^\d{3}-\d{7,8}|\d{4}-\d{7,8}$/
// email正则
const EMAILREG = /^\w+([-+.´]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
// 检验正整数
const POSITIVE_INTEGER = /^[1-9]\d*$/
// 自然数
const NATURAL_NUM = /^[0-9]\d*$/
// 匹配IP地址
const IP_REG = /^(25[0-5]|2[0-4]\d|(1\d{2})|([1-9]?[1-9]))\.((25[0-5]|2[0-4]\d|(1\d{2})|([1-9]?\d))\.){2}(25[0-5]|2[0-4]\d|(1\d{2})|([1-9]?\d))$/
const PWD_RRGULAR = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,10}$/

export {
  API_PATH,
  baseUrl,
  imgBaseUrl,
  routerMode,
  _import,
  PHONEREG,
  FIXPHONEREG,
  EMAILREG,
  POSITIVE_INTEGER,
  NATURAL_NUM,
  IP_REG,
  PWD_RRGULAR
}
