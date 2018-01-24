// 财务管理
import fetch from '../config/fetch'
import { API_PATH } from '../config/env'

/**
 * 结算管理
 * ------------------------------------------------------
 */
// 账单列表
export const monthlyBillList = (dataJson) => fetch(API_PATH + '/manage/companyMonthlyBill/list', dataJson, 'POST')

// 账单详情
export const monthlyBillDetail = (dataJson) => fetch(API_PATH + '/manage/companyMonthlyBill/detail', dataJson, 'POST')

// 修改账单中的租赁费
export const updateBillRentPrice = (dataJson) => fetch(API_PATH + '/manage/companyMonthlyBill/updateBillRentPrice', dataJson, 'POST')

// 修改账单关联订单的计算状态
export const updateBillOrderCalcStatus = (dataJson) => fetch(API_PATH + '/manage/companyMonthlyBill/updateBillOrderCalcStatus', dataJson, 'POST')

// 确认结算
export const confirmBill = (dataJson) => fetch(API_PATH + '/manage/companyMonthlyBill/confirm', dataJson, 'POST')

/**
 * 退款审批
 * ------------------------------------------------------
 */
// 退款列表
export const orderRefundList = (dataJson) => fetch(API_PATH + '/manage/orderRefund/list', dataJson, 'POST')

// 退款审批详情
export const findOrderRefund = (dataJson) => fetch(API_PATH + '/manage/orderRefund/findById', dataJson, 'POST')

// 退款审批详情
export const orderRefundApprove = (dataJson) => fetch(API_PATH + '/manage/orderRefund/approve', dataJson, 'POST')
