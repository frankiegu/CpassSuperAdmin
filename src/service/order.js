// 订单管理
import fetch from '../config/fetch'
import { API_PATH } from '../config/env'

/**
 * 订单管理
 * ------------------------------------------------------
 */
// 场地相关订单
export const findFieldOrder = (dataJson) => fetch(API_PATH + '/manage/order/findFieldOrder', dataJson, 'POST')

// 订单列表查询
export const orderLists = (dataJson) => fetch(API_PATH + '/manage/order/orderList', dataJson, 'POST')

// 订单详情
export const orderDetail = (dataJson) => fetch(API_PATH + '/manage/order/orderDetail', dataJson, 'POST')

// 订单列表导出Excel
export const exportOrderInfo = (dataJson) => fetch(API_PATH + '/manage/order/exportOrderInfo', dataJson, 'POST')

// 确认收款
export const confirmPay = (dataJson) => fetch(API_PATH + '/manage/order/confirmPay', dataJson, 'POST')

/**
 * 入驻申请
 * ------------------------------------------------------
 */
// 入驻申请列表
export const enterList = (dataJson) => fetch(API_PATH + '/manage/enter/list', dataJson, 'POST')

// 入驻申请明细
export const enterDetail = (dataJson) => fetch(API_PATH + '/manage/enter/detail', dataJson, 'POST')

// 入驻申请通过
export const enterPass = (dataJson) => fetch(API_PATH + '/manage/enter/pass', dataJson, 'POST')

// 入驻申请驳回
export const enterReject = (dataJson) => fetch(API_PATH + '/manage/enter/reject', dataJson, 'POST')

/**
 * 参观预约
 * ------------------------------------------------------
 */
// 预约列表分页查询
export const listVisitReservation = (dataJson) => fetch(API_PATH + '/manage/visitReservation/listVisitReservation', dataJson, 'GET')

// 导出预约记录
export const exportVisitReservation = (dataJson) => fetch(API_PATH + '/manage/visitReservation/exportVisitReservation', dataJson, 'GET')

// 详细查询
export const getVisitReservationDetail = (dataJson) => fetch(API_PATH + '/manage/visitReservation/getVisitReservationDetail', dataJson, 'GET')

// 确认预约
export const confirmVisitReservation = (dataJson) => fetch(API_PATH + '/manage/visitReservation/confirmVisitReservation', dataJson, 'GET')

/**
 * 故障报修
 * ------------------------------------------------------
 */
// 故障报修列表
export const REPAIR_LIST = (dataJson) => fetch(API_PATH + '/manage/repair/list', dataJson, 'GET')

// 报修详情
export const REPAIR_DETAIL = (dataJson) => fetch(API_PATH + '/manage/repair/detail', dataJson, 'GET')

// 故障完成登记
export const REPAIR_REGISTER = (dataJson) => fetch(API_PATH + '/manage/repair/register', dataJson, 'POST')

/**
 * 增值服务
 * ------------------------------------------------------
 */
// 服务订单查询
export const SERVICE_ORDER_LIST = (dataJson) => fetch(API_PATH + '/manage/valueAddServiceOrder/listOrder', dataJson, 'GET')

// 获取订单状态
export const SERVICE_ORDER_STATUS = (dataJson) => fetch(API_PATH + '/common/constant/load', dataJson, 'POST')

// 接单
export const RECIEVE_ORDER = (dataJson) => fetch(API_PATH + '/manage/valueAddServiceOrder/acceptOrder', dataJson, 'POST')

// 订单详情
export const SERVICE_DETAIL = (dataJson) => fetch(API_PATH + '/manage/valueAddServiceOrder/detail', dataJson, 'POST')
