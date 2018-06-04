import fetch from '../config/fetch'
import { API_PATH } from '../config/env'

/**
 * 优惠券管理
 */

// 获取空间/门店的树形
export const loadSpaceStoreTree = (obj) => fetch(API_PATH + '/supervisor/platformCoupon/loadSpaceStoreTree', obj, 'POST')

// 获取核销点列表(无分页)
export const loadStation = (obj) => fetch(API_PATH + '/supervisor/platformVerifyStation/loadStation', obj, 'POST')

// 检验卡券名称是否重复
export const isUniqueCoupon = (obj) => fetch(API_PATH + '/supervisor/platformCoupon/isUnique', obj, 'POST')

// 优惠券列表查询
export const couponList = (obj) => fetch(API_PATH + '/supervisor/platformCoupon/list', obj, 'POST')

// 优惠券详情查询
export const couponDetail = (obj) => fetch(API_PATH + '/supervisor/platformCoupon/detail', obj, 'POST')

// 删除优惠券
export const couponDelete = (obj) => fetch(API_PATH + '/supervisor/platformCoupon/delete', obj, 'POST')

// 生效/冻结优惠券
export const couponChangeStatus = (obj) => fetch(API_PATH + '/supervisor/platformCoupon/changeStatus', obj, 'POST')

// 批量冻结优惠券
export const couponBatchFreeze = (obj) => fetch(API_PATH + '/supervisor/platformCouponCustomer/batchFreeze', obj, 'POST')

// 批量恢复优惠券
export const couponBatchRecover = (obj) => fetch(API_PATH + '/supervisor/platformCouponCustomer/batchRecover', obj, 'POST')

// 优惠券领取列表
export const couponReceiveList = (obj) => fetch(API_PATH + '/supervisor/platformCouponCustomer/list', obj, 'POST')

// 添加优惠券
export const addCoupon = (obj) => fetch(API_PATH + '/supervisor/platformCoupon/add', obj, 'POST')

// 编辑优惠券
export const updateCoupon = (obj) => fetch(API_PATH + '/supervisor/platformCoupon/update', obj, 'POST')

// 查询手动下发卡券列表
export const findUsableCoupon = (obj) => fetch(API_PATH + '/supervisor/platformCoupon/findUsableCoupon', obj, 'POST')

// 查询渠道列表
export const channelList = (obj) => fetch(API_PATH + '/supervisor/wxappRegisterWay/list', obj, 'POST')

// 手动发券
export const manualCoupon = (obj) => fetch(API_PATH + '/supervisor/platformCoupon/manualCoupon', obj, 'POST')

/**
 * 核销管理
 */

// 新增核销点
export const addPlatformVerifyStation = (obj) => fetch(API_PATH + '/supervisor/platformVerifyStation/add', obj, 'POST')

// 编辑核销点
export const addPlatformVerifyStationUpdate = (obj) => fetch(API_PATH + '/supervisor/platformVerifyStation/update', obj, 'POST')

// 核销点详情
export const PlatformVerifyStationDetail = (obj) => fetch(API_PATH + '/supervisor/platformVerifyStation/detail', obj, 'POST')

// 更改核销点状态
export const PlatformVerifyStationChangeStatus = (obj) => fetch(API_PATH + '/supervisor/platformVerifyStation/changeStatus', obj, 'POST')

// 删除核销点
export const PlatformVerifyStationDelete = (obj) => fetch(API_PATH + '/supervisor/platformVerifyStation/delete', obj, 'POST')

// 分页查询核销点
export const PlatformVerifyStationPage = (obj) => fetch(API_PATH + '/supervisor/platformVerifyStation/page', obj, 'POST')

// 查询核销点(不分页)
export const PlatformVerifyStationLoadStation = (obj) => fetch(API_PATH + '/supervisor/platformVerifyStation/loadStation', obj, 'POST')

// 获取关联门店列表
export const stationStoreTree = (obj) => fetch(API_PATH + '/supervisor/platformVerifyStation/storeTree', obj, 'POST')

// 校验核销点名称
export const checkStationName = (obj) => fetch(API_PATH + '/supervisor/platformVerifyStation/check', obj, 'POST')

// 核销员详情
export const platformVerifierDetail = (obj) => fetch(API_PATH + '/supervisor/platformVerifier/detail', obj, 'POST')

// 审核核销员
export const platformVerifierReview = (obj) => fetch(API_PATH + '/supervisor/platformVerifier/review', obj, 'POST')

// 停用或启用核销员
export const platformVerifierChangeStatus = (obj) => fetch(API_PATH + '/supervisor/platformVerifier/changeStatus', obj, 'POST')

// 分页查询核销员
export const platformVerifierPage = (obj) => fetch(API_PATH + '/supervisor/platformVerifier/page', obj, 'POST')

// 分页查询核销记录
export const platformVerifyRecordPage = (obj) => fetch(API_PATH + '/supervisor/platformVerifyRecord/page', obj, 'POST')

/**
 * 活动管理
 */

// 分页查询活动列表
export const platformActivityList = (obj) => fetch(API_PATH + '/supervisor/platformActivity/list', obj, 'POST')

// 查询活动详情
export const platformActivityDetail = (obj) => fetch(API_PATH + '/supervisor/platformActivity/detail', obj, 'POST')

// 检验活动名称重复
export const activityIsUnique = (obj) => fetch(API_PATH + '/supervisor/platformActivity/isUnique', obj, 'POST')
