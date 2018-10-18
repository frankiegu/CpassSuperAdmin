import store from '@/store'
import router from '@/router'
import { PHONEREG } from './env'

/**
 * 模仿JQuery $
 * @param {String} selector id、选择器
 * @param {DOM} context 父节点
 * @return {DOM} return 返回获取的DOM节点
 */
export const $ = function (selector, context) {
  context = context || document
  var element = context.querySelectorAll(selector)
  return Array.prototype.slice.call(element)
}

/**
 * 对象深拷贝
 *
 * @param {Object} obj - 传递一个待拷贝的对象
 * @return {Object} 返回一个深拷贝的对象
 */
export function deepCopyObj(obj) {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * 返回开始时间-结束时间之间的时长
 *
 * @param {string} startTime - 开始时间HH:mm
 * @param {string} endTime - 结束时间HH:mm
 * @return {string|number} 返回时长
 */
export function calcLongTime(startTime, endTime) {
  let handleStartTime = startTime.split(/:/)
  let handleEndTime = endTime.split(/:/)
  let hour = handleEndTime[0] - handleStartTime[0]
  let point = handleEndTime[1] - handleStartTime[1]

  return ((point === 30) ? hour + '.5' : hour)
}

/**
 * 选择起始结束时间组合，返回结束时间的开始时间点
 *
 * @param {string} time - 开始时间HH:mm
 * @return {string} 返回下一个时间的起始点
 */
export function getEndStartTime(time) {
  let handle
  handle = time.split(/:/)

  let a = handle[0]
  let b = handle[1]
  let c = '00'
  let d

  if (b === '00') {
    c = '30'
    d = a
  } else {
    c = '00'
    if (a <= 8) {
      a++
      d = '0' + a
    } else {
      a++
      d = a
      // 超过23:30的，就显示为空
    }
  }

  return (d + ':' + c)
}

/**
 * logout no token
 * 退出登录并跳转至登录页
 */
export function logoutNoToken() {
  store.commit('SET_TOKEN', '')
  store.commit('SET_RESOURCES', 'no')
  sessionStorage.removeItem('token')
  store.commit('SET_PERMISSION', '')

  router.replace({
    path: '/login',
    query: { redirect: router.currentRoute.fullPath }
  })
}

/**
 * 是否有权限
 *
 * @param {string|string[]} params - 接口或者接口列表
 * @return {Boolean} 返回权限判断结果
 */
export const hasPermissions = (params) => {
  // TODO: 需要接口生效时候放开此方法
  // let totalPermissions = store.getters.getPermissions || []
  // let paramsData = params
  //
  // if ((typeof paramsData) === 'object') {
  //   for (var item of paramsData) {
  //     if (totalPermissions.includes(item)) {
  //       return true
  //     }
  //   }
  // } else {
  //   // includes方法返回一个布尔值，表示某个数组是否包含给定的值
  //   return totalPermissions.includes(paramsData)
  // }
  // console.log(params)
  if ((typeof params) === 'object') {
    // if (params.includes('/supervisor/storeStar/editStoreStar')) {
    //   return false
    // }
  } else {
    // console.log(params)
    // ['/supervisor/platformService/list', '/supervisor/platformServiceOrder/list']
    if (params === '/supervisor/appCustomer/changeStatus') return false
  }
  return true
}

/**
 * js获取当前时间前后N天前后日期的方法
 *
 * @param {number} AddDayCount - 前后的天数
 * @return {string} 返回当前时间前后的日期
 */
export const getDateStr = (AddDayCount) => {
  let dd = new Date()
  dd.setDate(dd.getDate() + AddDayCount) // 获取AddDayCount天后的日期

  let y = dd.getFullYear()
  let m = (dd.getMonth() + 1) < 10 ? '0' + (dd.getMonth() + 1) : (dd.getMonth() + 1) // 获取当前月份的日期，不足10补0
  let d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate() // 获取当前几号，不足10补0
  return y + '-' + m + '-' + d
}

/**
 * 校验是否合法手机号
 *
 * @param {number|string} phone - 用户输入的号码
 * @return {Boolean} 返回号码是否合法的判断结果
 */
export const checkPhone = (phone) => {
  if (PHONEREG.test(phone)) {
    return true
  } else {
    return false
  }
}

/**
 * 获取 url 参数
 *
 * @param {string} name - 参数名
 * @param {string} link - url
 * @return {string} 返回url中指定参数名的值
 */
export const getUrlKey = (name, link = location.href) => {
  const reg = new RegExp(`(?:^|&)${name}=([^&]*)(?:&|$)`)
  const r = link.substring(link.indexOf('?') + 1).match(reg)
  if (r) {
    return decodeURIComponent(r[1])
  }
  return ''
}

/**
 * 时间格式化
 *
 * @param {string} time - 日期时间字符串
 * @param {string} format - 格式化形式
 * @return {string} 返回给定格式化形式的日期时间
 */
export const formatTimeString = (time, format) => {
  var format1 = format || 'yyyy-MM-dd'
  var t = new Date(time)
  var tf = function (i) {
    return (i < 10 ? '0' : '') + i
  }
  return format1.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
    switch (a) {
      case 'yyyy':
        return tf(t.getFullYear())
      case 'MM':
        return tf(t.getMonth() + 1)
      case 'mm':
        return tf(t.getMinutes())
      case 'dd':
        return tf(t.getDate())
      case 'HH':
        return tf(t.getHours())
      case 'ss':
        return tf(t.getSeconds())
    }
  })
}

/**
 * url拼接参数，已经携带了token,用于使用get请求下载文件
 *
 * @param {string} url - url 是一个绝对的请求地址，不是相对地址
 * @param {Object} params - 所需要拼接的查询参数组成的对象，{key: value}
 */
export const downloadFile = (url, params) => {
  // 生成键值对数组 ['key1=value1', 'key2=value2']
  let queryArr = params
    ? Object.keys(params).map((key) => {
      return (key + '=' + (params[key] || ''))
    }) : []
  // 拼接token以及其他参数
  // console.log(sessionStorage.getItem('token'))
  url = url + '?' + 'token=' + sessionStorage.token + '&' + queryArr.join('&')
  // console.log(url)
  // 打开下载地址执行下载
  window.location.href = url
}
