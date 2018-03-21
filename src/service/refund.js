/**
 * 服务管理
 */

import fetch from '../config/fetch'
import { API_PATH } from '../config/env'

// 退款列表
export const refundList = (obj) => fetch(API_PATH + '/supervisor/platformOrderRefund/list', obj, 'POST')

// 退款详情
export const refundDetail = (obj) => fetch(API_PATH + '/supervisor/platformOrderRefund/findById', obj, 'POST')

// 退款审批
export const refundApprove = (obj) => fetch(API_PATH + '/supervisor/platformOrderRefund/approve', obj, 'POST')
