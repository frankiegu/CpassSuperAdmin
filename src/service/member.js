/**
 * 会员管理
 */
import fetch from '../config/fetch'
import { API_PATH } from '../config/env'

// 会员列表
export const CUSTOMER_LIST = (obj) => fetch(API_PATH + '/supervisor/customer/list', obj, 'POST')

// app会员
export const appMemberList = (obj) => fetch(API_PATH + '/supervisor/appCustomer/list', obj, 'POST')

// app会员变化
export const memberStatistics = (obj) => fetch(API_PATH + '/supervisor/appCustomer/statistics', obj, 'POST')

// app会员列表
export const APP_CUSTOMER_LIST = (obj) => fetch(API_PATH + '/supervisor/appCustomer/load', obj, 'POST')

// 停用或启用app会员
export const appChangeStatus = (obj) => fetch(API_PATH + '/supervisor/appCustomer/changeStatus', obj, 'POST')

// app会员详情
export const appMemberDetail = (obj) => fetch(API_PATH + '/supervisor/appCustomer/detail', obj, 'POST')

// app会员订单统计
export const appOrderStatistics = (obj) => fetch(API_PATH + '/supervisor/appCustomer/orderStatistics', obj, 'POST')

// app会员订单列表
export const appOrderList = (obj) => fetch(API_PATH + '/supervisor/appCustomer/orderList', obj, 'POST')

// app会员优惠券统计
export const couponStatistics = (obj) => fetch(API_PATH + '/supervisor/appCustomer/couponStatistics', obj, 'POST')

// app会员优惠券列表
export const appCouponList = (obj) => fetch(API_PATH + '/supervisor/appCustomer/couponList', obj, 'POST')
