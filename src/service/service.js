// 订单管理
import fetch from '../config/fetch'
import { API_PATH } from '../config/env'

/**
 * 增值服务管理
 * ------------------------------------------------------
 */

/**
 * 供应商管理
 * ------------------------------------------------------
 */
// 服务商管理列表
export const SERVICE_PROVIDER_LIST = (dataJson) => fetch(API_PATH + '/manage/valueAddServiceProvider/list', dataJson, 'GET')

// 供应商-详细查询
export const PROVIDER_DETAIL = (dataJson) => fetch(API_PATH + '/manage/valueAddServiceProvider/getProviderDetail', dataJson, 'GET')

// 根据供应商id查询增值服务
export const SERVICE_LIST = (dataJson) => fetch(API_PATH + '/manage/valueAddService/listByProvider', dataJson, 'GET')

// 更改供应商状态
export const CHANGE_STATUS = (dataJson) => fetch(API_PATH + '/manage/valueAddServiceProvider/changeStatus', dataJson, 'POST')

// 供应商-添加或更新
export const ADD_UPDATE_PROVIDER = (dataJson) => fetch(API_PATH + '/manage/valueAddServiceProvider/addOrUpdate', dataJson, 'POST')

// 供应商-名称校验
export const CHECK_PROVIDER_NAME = (dataJson) => fetch(API_PATH + '/manage/valueAddServiceProvider/isUnique', dataJson, 'POST')

// 增值服务-添加/更新
export const ADD_UPDATE_SERVICE = (dataJson) => fetch(API_PATH + '/manage/valueAddService/addOrUpdate', dataJson, 'POST')

// 服务类型
export const SERVICE_TYPE = (dataJson) => fetch(API_PATH + '/common/constant/load', dataJson, 'POST')

// 增值服务-更改状态
export const CHANGE_SERVICE_STATUS = (dataJson) => fetch(API_PATH + '/manage/valueAddService/changeStatus', dataJson, 'POST')

// 增值服务-详细查询
export const GET_SERVICE_DETAIL = (dataJson) => fetch(API_PATH + '/manage/valueAddService/getServiceDetail', dataJson, 'GET')
