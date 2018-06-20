/**
 * 会员管理
 */
import fetch from '../config/fetch'
import { API_PATH } from '../config/env'

// 会员列表
export const CUSTOMER_LIST = (obj) => fetch(API_PATH + '/supervisor/customer/list', obj, 'POST')

// app会员列表
export const APP_CUSTOMER_LIST = (obj) => fetch(API_PATH + '/supervisor/appCustomer/load', obj, 'POST')
