/**
 * CPASS 订单统计
 */

import fetch from '../../config/fetch'
import { API_PATH } from '../../config/env'

// 订单统计-顶端统计
export const orderSummary = (obj) => fetch(API_PATH + '/supervisor/platformOrderStatisticsController/getSummary', obj, 'POST')
