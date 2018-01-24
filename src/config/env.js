/**
 * 配置编译环境和线上环境之间的切换
 * baseUrl: 域名地址
 * routerMode: 生存哈希值http，例如 http://localhost:8888/#/test
 * imgBaseUrl: 图片所在域名地址
 * _import: 只有在正式环境下才使用懒加载，解决了困扰多事的rebuild慢问题
 * POSITIVE_INTEGER: 检验正整数
 * IP_REG: 匹配IP地址
 */

const API_PATH = '/proxy-api'
const baseUrl = ''
const imgBaseUrl = ''
const routerMode = 'hash'
const _import = require('@/router/src/_import_' + process.env.NODE_ENV)
const PHONEREG = /^(0|86|17951)?(13[0-9]|15[0-9]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/
const FIXPHONEREG = /^(0\d{2,3}-|\s)?\d{7,8}$/
const EMAILREG = /^\w+([-+.´]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
const POSITIVE_INTEGER = /^[1-9]\d*$/
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
  IP_REG,
  PWD_RRGULAR
}
