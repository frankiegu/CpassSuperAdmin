/**
 * 转发漏斗
 */

import fetch from '@/config/fetch'
import { API_PATH } from '@/config/env'

// 转发漏斗-已发布的优惠券
export const issuePlatformCoupon = (obj) => fetch(API_PATH + '/supervisor/platformCouponStatistics/issuePlatformCoupon', obj, 'POST')

// 转发漏斗-详情数据
export const listPlatformCoupon = (obj) => fetch(API_PATH + '/supervisor/platformCouponStatistics/list', obj, 'POST')

// 转发漏斗-导出
export const exportPlatformCoupon = (obj) => fetch(API_PATH + '/supervisor/platformCouponStatistics/export', obj, 'POST')
