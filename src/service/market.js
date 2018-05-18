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

/**
 * 核销管理
 */

// 新增核销点
export const addPlatformVerifyStation = (obj) => fetch(API_PATH + '/supervisor/platformVerifyStation/add', obj, 'POST')

// 核销点详情
export const PlatformVerifyStationDetail = (obj) => fetch(API_PATH + '/supervisor/platformVerifyStation/detail', obj, 'POST')

// 更改核销点状态
export const PlatformVerifyStationChangeStatus = (obj) => fetch(API_PATH + '/supervisor/platformVerifyStation/changeStatus', obj, 'POST')

// 删除核销点
export const PlatformVerifyStationDelete = (obj) => fetch(API_PATH + '/supervisor/platformVerifyStation/delete', obj, 'POST')

// 分页查询核销点
export const PlatformVerifyStationPage = (obj) => fetch(API_PATH + '/supervisor/platformVerifyStation/page', obj, 'POST')

// 获取关联门店列表
export const stationStoreTree = (obj) => fetch(API_PATH + '/supervisor/platformVerifyStation/storeTree', obj, 'POST')

// 校验核销点名称
export const checkStationName = (obj) => fetch(API_PATH + '/supervisor/platformVerifyStation/check', obj, 'POST')
