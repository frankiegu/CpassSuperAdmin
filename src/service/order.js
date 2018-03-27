/**
 * 订单管理
 */
import fetch from '../config/fetch'
import { API_PATH } from '../config/env'
// 获取服务订单列表
export const serviceOrderList = (obj) => fetch(API_PATH + '/supervisor/platformServiceOrder/list', obj, 'POST')

// 获取服务订单详情
export const serviceOrderDetail = (obj) => fetch(API_PATH + '/supervisor/platformServiceOrder/detail', obj, 'POST')

// 获取场地订单列表
export const fieldOrderList = (obj) => fetch(API_PATH + '/supervisor/platformOrder/list', obj, 'POST')

// 获取场地订单详情
export const fieldOrderDetail = (obj) => fetch(API_PATH + '/supervisor/platformOrder/detail', obj, 'POST')

// 服务订单接单
export const serviceAcceptOrder = (obj) => fetch(API_PATH + '/supervisor/platformServiceOrder/acceptOrder', obj, 'POST')
