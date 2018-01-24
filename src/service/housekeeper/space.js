// 空间管家
import fetch from '@/config/fetch'
import {API_PATH} from '@/config/env'

// 添加服务类型
export const serviceTypeAdd = (ajaxParams) => fetch(API_PATH + '/manage/spaceServiceType/add', ajaxParams, 'GET')

// 编辑服务类型
export const serviceTypeUpdate = (ajaxParams) => fetch(API_PATH + '/manage/spaceServiceType/update', ajaxParams, 'GET')

// 删除服务类型
export const serviceTypeDelete = (ajaxParams) => fetch(API_PATH + '/manage/spaceServiceType/delete', ajaxParams, 'GET')

// 添加管家
export const keeperAdd = (ajaxParams) => fetch(API_PATH + '/manage/spaceKeeper/add', ajaxParams, 'GET')

// 可选管家列表
export const keeperListOption = (ajaxParams) => fetch(API_PATH + '/manage/spaceKeeper/listOptionalKeeper', ajaxParams, 'GET')

// 管家列表
export const keeperList = (ajaxParams) => fetch(API_PATH + '/manage/spaceKeeper/list', ajaxParams, 'GET')

// 企业列表
export const listCompany = (ajaxParams) => fetch(API_PATH + '/manage/spaceKeeper/listCompany', ajaxParams, 'GET')

// 设置管家状态
export const changeStatus = (ajaxParams) => fetch(API_PATH + '/manage/spaceKeeper/changeStatus', ajaxParams, 'GET')

// 删除管家
export const keeperDelete = (ajaxParams) => fetch(API_PATH + '/manage/spaceKeeper/delete', ajaxParams, 'GET')

// 添加关联企业
export const addCompany = (ajaxParams) => fetch(API_PATH + '/manage/spaceKeeper/addCompany', ajaxParams, 'GET')

// 删除关联企业
export const deleteCompany = (ajaxParams) => fetch(API_PATH + '/manage/spaceKeeper/deleteCompany', ajaxParams, 'GET')

// 关联企业列表
export const byKeeper = (ajaxParams) => fetch(API_PATH + '/manage/spaceKeeper/listCompanyByKeeper', ajaxParams, 'GET')

// 订单统计信息
export const getOrderStat = (ajaxParams) => fetch(API_PATH + '/manage/spaceKeeperOrder/getOrderStat', ajaxParams, 'GET')

// 管家订单统计列表
export const listOrderStat = (ajaxParams) => fetch(API_PATH + '/manage/spaceKeeperOrder/listOrderStat', ajaxParams, 'GET')
