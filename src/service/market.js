// 营销模块
import fetch from '../config/fetch'
import { API_PATH } from '../config/env'

/**
 * 积分
 * ------------------------------------------------------
 */
// 发放规则列表
export const pointRuleList = (obj) => fetch(API_PATH + '/manage/grantPointRule/list', obj, 'GET')

// 充值积分
export const adminRecharge = (obj) => fetch(API_PATH + '/manage/userPoint/adminRecharge', obj, 'POST')

// 下一次积分生效时间
export const getNextTakeEffectTime = (obj) => fetch(API_PATH + '/manage/grantPointRule/getNextTakeEffectTime', obj, 'POST')

// 积分发放规则明细
export const pointRuleGetDetail = (obj) => fetch(API_PATH + '/manage/grantPointRule/getDetail', obj, 'GET')

// 新增积分发放规则
export const addPointRule = (obj) => fetch(API_PATH + '/manage/grantPointRule/add', obj, 'POST')

// 删除积分规则
export const deletePointRule = (obj) => fetch(API_PATH + '/manage/grantPointRule/delete', obj, 'POST')

// 更新积分规则
export const updatePointRule = (obj) => fetch(API_PATH + '/manage/grantPointRule/update', obj, 'POST')

// 新增发放用户
export const addPublishUser = (obj) => fetch(API_PATH + '/manage/grantPointRule/addPublishUser', obj, 'POST')

// 移除积分发放用户
export const removePublishUser = (obj) => fetch(API_PATH + '/manage/grantPointRule/removePublishUser', obj, 'POST')

// 修改发放规则状态
export const updateStatus = (obj) => fetch(API_PATH + '/manage/grantPointRule/updateStatus', obj, 'POST')

// 积分规则与用户的树状统计
export const loadPointRuleStatistics = (obj) => fetch(API_PATH + '/manage/store/loadPointRuleStatistics', obj, 'GET')

/**
 * 优惠劵
 * ------------------------------------------------------
 */
// 优惠卷获取情况
export const loadCouponStatistics = (dataJson) => fetch(API_PATH + '/manage/store/loadCouponStatistics', dataJson, 'GET')

// 新增优惠券
export const couponAdd = (dataJson) => fetch(API_PATH + '/manage/coupon/add', dataJson, 'POST')

// 查询优惠券
export const couponFindById = (dataJson) => fetch(API_PATH + '/manage/coupon/findById', dataJson, 'GET')

// 获取优惠券信息
export const couponList = (dataJson) => fetch(API_PATH + '/manage/coupon/list', dataJson, 'GET')

// 删除优惠券
export const couponDelete = (dataJson) => fetch(API_PATH + '/manage/coupon/delete', dataJson, 'POST')

// 查询用户优惠券，发放列表
export const couponUserFindByCouponId = (dataJson) => fetch(API_PATH + '/manage/couponUser/findByCouponId', dataJson, 'GET')

// 发放优惠券
export const couponPublish = (dataJson) => fetch(API_PATH + '/manage/coupon/publish', dataJson, 'POST')

// 冻结优惠券
export const couponUserFreeze = (dataJson) => fetch(API_PATH + '/manage/couponUser/freeze', dataJson, 'POST')

// 解冻优惠券
export const couponUserUnfreeze = (dataJson) => fetch(API_PATH + '/manage/couponUser/unfreeze', dataJson, 'POST')

// 用户领取优惠券情况
export const couponUserListUserCoupon = (dataJson) => fetch(API_PATH + '/manage/couponUser/listUserCoupon', dataJson, 'GET')

// 批量冻结用户优惠券
export const freezeAll = (dataJson) => fetch(API_PATH + '/manage/couponUser/freezeAll', dataJson, 'GET')

// 批量解冻用户优惠券
export const unfreezeAll = (dataJson) => fetch(API_PATH + '/manage/couponUser/unfreezeAll', dataJson, 'GET')
