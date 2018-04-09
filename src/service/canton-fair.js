/**
 * 广交会活动
 */

import fetch from '../config/fetch'
import { API_PATH } from '../config/env'

// 核销列表
export const cantonFairList = (obj) => fetch(API_PATH + '/supervisor/cantonfairChecker/list', obj, 'POST')

// 修改核销状态
export const cantonFairChecker = (obj) => fetch(API_PATH + '/supervisor/cantonfairChecker/check', obj, 'POST')

// 兑换券列表
export const cantonfairCoupon = (obj) => fetch(API_PATH + '/supervisor/cantonfairRedemption/list', obj, 'POST')
