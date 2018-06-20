/**
 * 会员管理
 */
import fetch from '../config/fetch'
import { API_PATH } from '../config/env'

// 会员列表
export const CUSTOMER_LIST = (obj) => fetch(API_PATH + '/supervisor/appCustomer/list', obj, 'POST')

// app会员变化
export const memberStatistics = (obj) => fetch(API_PATH + '/supervisor/appCustomer/statistics', obj, 'POST')
