/**
 * 场地管理
 */
import fetch from '../config/fetch'
import { API_PATH } from '../config/env'

// 获取场地列表
export const fieldList = (obj) => fetch(API_PATH + '/supervisor/field/list', obj, 'GET')

// 开放场地
export const setFieldStatus = (obj) => fetch(API_PATH + '/supervisor/field/open', obj, 'POST')

// 场地详情
export const fieldDetail = (obj) => fetch(API_PATH + '/supervisor/field/findFieldDetail', obj, 'GET')

// 参观预约列表
export const reservationList = (obj) => fetch(API_PATH + '/supervisor/visitReservation/list', obj, 'POST')

// 参观预约详情
export const reservationDetail = (obj) => fetch(API_PATH + '/supervisor/visitReservation/detail', obj, 'POST')
