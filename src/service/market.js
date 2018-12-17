import fetch from '../config/fetch'
import { API_PATH, API_PATH_HM } from '../config/env'

// banner
export * from './market/banner'

// c-pass
export * from './market/c-pass'

/**
 * 优惠券管理
 */

// 获取空间/空间的树形
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

// 获取关联空间列表
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

// 活动奖品选择优惠券
export const findUsableCouponByType = (obj) => fetch(API_PATH + '/supervisor/platformCoupon/findUsableCouponByType', obj, 'POST')

// 删除活动
export const platformActivityDelete = (obj) => fetch(API_PATH + '/supervisor/platformActivity/delete', obj, 'POST')

// 活动统计列表
export const platformActivityStatisticsList = (obj) => fetch(API_PATH + '/supervisor/platformActivity/statisticsList', obj, 'POST')

// 发布/暂停活动
export const platformActivityChangeStatus = (obj) => fetch(API_PATH + '/supervisor/platformActivity/changeStatus', obj, 'POST')

// 添加活动
export const platformActivityAdd = (obj) => fetch(API_PATH + '/supervisor/platformActivity/add', obj, 'POST')

// 编辑活动
export const platformActivityEdit = (obj) => fetch(API_PATH + '/supervisor/platformActivity/update', obj, 'POST')

/**
 * 邀请活动管理
 */

// 展示邀请有礼列表展示、删除、编辑、添加
export const platformActivityInviteList = (obj) => fetch(API_PATH_HM + '/platform_activities', obj, 'GET', 'all')
export const platformActivityInviteDelete = (obj) => fetch(API_PATH_HM + '/deleteActivitys', obj, 'POST')
export const platformActivityInviteEdit = (obj, id) => fetch(API_PATH_HM + '/platform_activities/' + id + '/edit', obj, 'POST')
export const platformActivityInviteAdd = (obj) => fetch(API_PATH_HM + '/platform_activities/new', obj, 'POST')

// 列表页首页弹窗新建、查询、修改
export const platformActivityInviteImgNew = (obj) => fetch(API_PATH_HM + '/home_windows/new', obj, 'POST')
export const platformActivityInviteImgList = (obj) => fetch(API_PATH_HM + '/home_windows', obj, 'GET')
export const platformActivityInviteImgEdit = (obj, id) => fetch(API_PATH_HM + '/home_windows/' + id + '/edit', obj, 'POST')

// 展示数据统计列表
export const platformActivityStatistics = (obj) => fetch(API_PATH_HM + '/statistics', obj, 'GET')

// 展示被邀请人名单
export const platformActivityActInvRecordList = (obj) => fetch(API_PATH_HM + '/act_inv_records', obj, 'GET')

// 邀请有礼卡券添加、删除、查询、批量删除、批量创建
export const platformActivityInviteCardAdd = (obj) => fetch(API_PATH_HM + '/act_inv_coupons/new', obj, 'POST')
export const platformActivityInviteCardDelete = (obj) => fetch(API_PATH_HM + '/act_inv_coupons/' + obj + '/delete', '', 'POST')
export const platformActivityInviteCardList = (obj) => fetch(API_PATH_HM + '/act_inv_coupons', obj, 'GET')
export const platformActivityInviteCardDeleteArr = (obj) => fetch(API_PATH_HM + '/act_inv_coupons/delete/batch', obj, 'POST')
export const platformActivityInviteCardAddArr = (obj) => fetch(API_PATH_HM + '/act_inv_coupons/create/batch', obj, 'POST')

// 邀请新人卡券添加、删除、查询、批量删除、批量创建
export const platformActivityInviteCardNewAdd = (obj) => fetch(API_PATH_HM + '/act_inv_newuser_coupons/new', obj, 'POST')
export const platformActivityInviteCardNewDelete = (obj) => fetch(API_PATH_HM + '/act_inv_newuser_coupons/' + obj + '/delete', '', 'POST')
export const platformActivityInviteCardNewList = (obj) => fetch(API_PATH_HM + '/act_inv_newuser_coupons', obj, 'GET')
export const platformActivityInviteCardNewDeleteArr = (obj) => fetch(API_PATH_HM + '/act_inv_newuser_coupons/delete/batch', obj, 'POST')
export const platformActivityInviteCardNewAddArr = (obj) => fetch(API_PATH_HM + '/act_inv_newuser_coupons/create/batch', obj, 'POST')

// 邀请有礼场地添加、删除、查询、批量创建、批量删除
export const platformActivityInviteFieldAdd = (obj) => fetch(API_PATH_HM + '/act_inv_rec_fields/new', obj, 'POST')
export const platformActivityInviteFieldDelete = (obj) => fetch(API_PATH_HM + '/act_inv_rec_fields/' + obj + '/delete', '', 'POST')
export const platformActivityInviteFieldList = (obj) => fetch(API_PATH_HM + '/act_inv_rec_fields', obj, 'GET')
export const platformActivityInviteFieldAddArr = (obj) => fetch(API_PATH_HM + '/act_inv_rec_fields/create/batch', obj, 'POST')
export const platformActivityInviteFieldDeleteArr = (obj) => fetch(API_PATH_HM + '/act_inv_rec_fields/delete/batch', obj, 'POST')

// 邀请新人场地添加、删除、查询、批量创建、批量删除
export const platformActivityInviteFieldNewAdd = (obj) => fetch(API_PATH_HM + '/act_inv_newuser_rec_fields/new', obj, 'POST')
export const platformActivityInviteFieldNewDelete = (obj) => fetch(API_PATH_HM + '/act_inv_newuser_rec_fields/' + obj + '/delete', '', 'POST')
export const platformActivityInviteFieldNewList = (obj) => fetch(API_PATH_HM + '/act_inv_newuser_rec_fields', obj, 'GET')
export const platformActivityInviteFieldNewAddArr = (obj) => fetch(API_PATH_HM + '/act_inv_newuser_rec_fields/create/batch', obj, 'POST')
export const platformActivityInviteFieldNewDeleteArr = (obj) => fetch(API_PATH_HM + '/act_inv_newuser_rec_fields/delete/batch', obj, 'POST')

// 查看品牌、空间、场地
export const stroeList = (obj) => fetch(API_PATH + '/app/wx/platformField/selectionSpaceList', obj, 'GET')
export const spaceList = (obj) => fetch(API_PATH_HM + '/spaceLists', obj, 'GET')
export const fieldList = (obj) => fetch(API_PATH_HM + '/fieldLists', obj, 'GET')

// 卡券过滤无门槛
export const findUsableCoupons = (obj) => fetch(API_PATH_HM + '/supervisor/platformCoupon/findUsableCoupons', obj, 'POST')
